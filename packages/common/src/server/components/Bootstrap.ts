import {ancestorsOf, Metadata, promisify, Type} from "@tsed/core";
import {InjectorService, Provider, ProviderType} from "@tsed/di";
import * as Http from "http";
import * as Https from "https";
import {$log} from "ts-log-debug";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";
import {GlobalErrorHandlerMiddleware} from "../../mvc/components/GlobalErrorHandlerMiddleware";
import {LogIncomingRequestMiddleware} from "../../mvc/components/LogIncomingRequestMiddleware";
import {ExpressApplication} from "../../mvc/decorators/class/expressApplication";
import {HttpServer} from "../decorators/httpServer";
import {HttpsServer} from "../decorators/httpsServer";
import {IHTTPSServerOptions} from "../interfaces/IHTTPSServerOptions";
import {createExpressApplication} from "../utils/createExpressApplication";
import {createHttpServer} from "../utils/createHttpServer";
import {createHttpsServer} from "../utils/createHttpsServer";
import {createInjector} from "../utils/createInjector";
import {importComponents} from "../utils/importComponents";
import {logSettings} from "../utils/logSettings";

export class Bootstrap {
  private _injector: InjectorService;
  private _module: any;
  // For legacy ServerLoader
  private _isInstanceOfBootstrap: boolean = false;

  constructor(private moduleKlass: Type<any>) {
    this.initModule(moduleKlass);
  }

  get module(): any {
    return this._module;
  }

  /**
   * Return the injectorService initialized by the server.
   * @returns {InjectorService}
   */
  get injector(): InjectorService {
    return this._injector;
  }

  /**
   * Return the settings configured by the decorator [@ServerSettings](/api/common/server/decorators/ServerSettings.md).
   *
   * ```typescript
   * @ServerSettings({
   *    rootDir: Path.resolve(__dirname),
   *    port: 8000,
   *    httpsPort: 8080,
   *    mount: {
   *      "/rest": "${rootDir}/controllers/**\/*.js"
   *    }
   * })
   * export class Server extends ServerLoader {
   *     $onInit(){
   *         console.log(this.settings); // {rootDir, port, httpsPort,...}
   *     }
   * }
   * ```
   *
   * @returns {ServerSettingsService}
   */
  get settings(): ServerSettingsService {
    return this.injector.settings as ServerSettingsService;
  }

  /**
   * Return Http.Server instance.
   * @returns {Http.Server}
   */
  get httpServer(): Http.Server {
    return this.injector.get<HttpServer>(HttpServer)!;
  }

  /**
   * Return Https.Server instance.
   * @returns {Https.Server}
   */
  get httpsServer(): Https.Server {
    return this.injector.get<HttpsServer>(HttpsServer)!;
  }

  /**
   * Create a new HTTP server with the provided `port`.
   * @returns {ServerLoader}
   * @deprecated
   */
  public createHttpServer(port: string | number): this {
    createHttpServer(this.injector);
    this.settings.httpPort = port;

    return this;
  }

  /**
   * Create a new HTTPs server.
   *
   * `options` {IHTTPSServerOptions}:
   *
   * - `port` &lt;number&gt;: Port number,
   * - `key` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | &lt;Object[]&gt;: The private key of the server in PEM format. To support multiple keys using different algorithms an array can be provided either as a plain array of key strings or an array of objects in the format `{pem: key, passphrase: passphrase}`. This option is required for ciphers that make use of private keys.
   * - `passphrase` &lt;string&gt; A string containing the passphrase for the private key or pfx.
   * - `cert` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings, or array of Buffers containing the certificate key of the server in PEM format. (Required)
   * - `ca` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings, or array of Buffers of trusted certificates in PEM format. If this is omitted several well known "root" CAs (like VeriSign) will be used. These are used to authorize connections.
   *
   * See more info on [httpsOptions](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).
   *
   * @param options Options to create new HTTPS server.
   * @returns {ServerLoader}
   * @deprecated
   */
  public createHttpsServer(options: IHTTPSServerOptions): this {
    createHttpsServer(this.injector, options);
    this.settings.httpsPort = options.port;

    return this;
  }

  /**
   * Return Express Application instance.
   * @returns {core.Express}
   */
  public driver<T>(): any {
    return this.injector.get<ExpressApplication>(ExpressApplication)!;
  }

  public async listen() {
    try {
      const start = new Date();
      await this.loadSettingsAndInjector();
      await this.loadMiddlewares();
      await this.startServers();

      await this.callHook("$onReady");
      await this.injector.emit("$onServerReady");

      $log.info(`Started in ${new Date().getTime() - start.getTime()} ms`);
    } catch (err) {
      this.callHook("$onServerInitError", undefined, err);

      return Promise.reject(err);
    }
  }

  public async destroy() {
    await this.injector.emit("$onDestroy");

    /* istanbul ignore else */
    if ((this.settings.httpPort as any) !== false) {
      await promisify(this.httpServer.close.bind(this.httpServer));
    }

    /* istanbul ignore else */
    if ((this.settings.httpsPort as any) !== false) {
      await promisify(this.httpsServer.close.bind(this.httpsServer));
    }
  }

  protected initModule(moduleKlass: Type<any>) {
    const settings = Metadata.getOwn("module:settings", moduleKlass);
    this._injector = createInjector(settings);
    createExpressApplication(this._injector);
    this.settings.set(settings);

    if (!ancestorsOf(moduleKlass).includes(Bootstrap)) {
      this._module = this.injector.invoke(moduleKlass);
    } else {
      this._module = this;
      this._isInstanceOfBootstrap = true;
    }

    const provider = new Provider<any>(Bootstrap);
    provider.type = ProviderType.FACTORY;
    provider.instance = this._module;
    this.injector.set(Bootstrap, provider);
  }

  /**
   * Initiliaze all servers.
   * @returns {Bluebird<U>}
   */
  protected async startServers(): Promise<any> {
    /* istanbul ignore else */
    if ((this.settings.httpPort as any) !== false) {
      const settings = this.settings.getHttpPort();
      const portListened = await this.startServer(this.httpServer, {https: false, ...settings});
      this.settings.setHttpPort(portListened);
    }

    /* istanbul ignore else */
    if ((this.settings.httpsPort as any) !== false) {
      const settings = this.settings.getHttpsPort();
      const portListened = await this.startServer(this.httpsServer, {https: true, ...settings});
      this.settings.setHttpsPort(portListened);
    }
  }

  /**
   * Create a new server from settings parameters.
   * @param http
   * @param settings
   * @returns {Promise<TResult2|TResult1>}
   */
  protected async startServer(
    http: Http.Server | Https.Server,
    settings: {https: boolean; address: string | number; port: number}
  ): Promise<{address: string; port: number}> {
    const {address, port, https} = settings;

    $log.debug(`Start server on ${https ? "https" : "http"}://${settings.address}:${settings.port}`);
    const promise = new Promise((resolve, reject) => {
      http.on("listening", resolve).on("error", reject);
    }).then(() => {
      const port = (http.address() as any).port;
      $log.info(`HTTP Server listen on ${https ? "https" : "http"}://${settings.address}:${port}`);

      return {address: settings.address as string, port};
    });

    http.listen(port, address as any);

    return promise;
  }

  protected async loadSettingsAndInjector() {
    const debug = this.settings.debug;

    /* istanbul ignore next */
    if (debug && this.settings.env !== "test") {
      $log.level = "debug";
    }

    await this.resolve();
    await this.callHook("$onInit");

    $log.debug("Initialize settings");
    logSettings(this.settings);

    $log.info("Build services");

    await this.injector.load();
    $log.debug("Settings and injector loaded");
  }

  /**
   * Initialize configuration of the express app.
   */
  protected async loadMiddlewares(): Promise<any> {
    $log.debug("Mount middlewares");

    this.driver().use(LogIncomingRequestMiddleware);
    await this.callHook("$onMountingMiddlewares");
    await this.injector.emit("$beforeRoutesInit");
    await this.injector.emit("$onRoutesInit", this.settings.components);
    await this.injector.emit("$afterRoutesInit");

    // await this.callHook("$afterRoutesInit", undefined, this.driver());

    // Import the globalErrorHandler
    this.driver().use(GlobalErrorHandlerMiddleware);
  }

  protected async resolve() {
    const components = await Promise.all([
      importComponents(this.settings.mount, this.settings.exclude),
      importComponents(this.settings.componentsScan, this.settings.exclude)
    ]);

    this.settings.addComponents(components.reduce((flat, value) => flat.concat(value), []));
  }

  protected callHook = (key: string, elseFn = new Function(), ...args: any[]) => {
    const self: any = this._module;

    if (key in this) {
      $log.debug(`\x1B[1mCall hook ${key}\x1B[22m`);

      return self[key](...args);
    }

    return elseFn();
  };
}
