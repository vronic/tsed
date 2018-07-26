import {isClass} from "@tsed/core";
import * as Express from "express";
import * as Http from "http";
import * as Https from "https";
import {$log} from "ts-log-debug";
import {IServerSettings} from "../../config/interfaces/IServerSettings";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";
import {Bootstrap} from "../../di/class/Bootstrap";
import {IProvider} from "../../di/interfaces";
import {IResolveProviderOptions} from "../../di/interfaces/IBootstrapSettings";
import {SettingsService} from "../../di/services/SettingsService";

import {GlobalErrorHandlerMiddleware} from "../../mvc";
import {LogIncomingRequestMiddleware} from "../../mvc/components/LogIncomingRequestMiddleware";
import {ExpressApplication} from "../../mvc/decorators/class/expressApplication";
import {HttpServer} from "../decorators/httpServer";
import {HttpsServer} from "../decorators/httpsServer";
import {IServerLifecycle} from "../interfaces";

$log.name = "TSED";
$log.level = "info";

/**
 * ServerLoader provider all method to instantiate an ExpressServer.
 *
 * It provide some features :
 *
 * * [Lifecycle hooks](/docs/server-loader.md#lifecycle-hooks),
 * * Middleware importation,
 * * Scan directory. You can specify controllers and services directory in your project,
 *
 * ```typescript
 * // In server.ts
 * import {ServerLoader, ServerSettings} from "@tsed/common";
 * import Path = require("path");
 * @ServerSettings({
 *    rootDir: Path.resolve(__dirname),
 *    port: 8000,
 *    httpsPort: 8080,
 *    mount: {
 *      "/rest": "${rootDir}/controllers/**\/*.js"
 *    }
 * })
 * export class Server extends ServerLoader {
 *
 *     $onReady(){
 *         console.log('Server started...');
 *     }
 *
 *     $onServerInitError(err){
 *         console.error(err);
 *     }
 * }
 *
 * // In app.ts
 * import Server from "./server";
 * new Server()
 *     .start()
 *     .then(() => console.log('started'))
 *     .catch(er => console.error(er));
 *
 * ```
 *
 */
export abstract class ServerLoader extends Bootstrap implements IServerLifecycle {
  public version: string = "0.0.0-PLACEHOLDER";
  /**
   *
   */
  private _components: IProvider<any>[] = [];

  /**
   *
   */
  constructor() {
    super();

    this.injector.createAlias(SettingsService, ServerSettingsService);
    this.readSettingsMetadata();
  }

  /**
   * Return Express Application instance.
   * @returns {core.Express}
   */
  get expressApp(): Express.Application {
    return this.injector.get<ExpressApplication>(ExpressApplication)!;
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

  get components(): IProvider<any>[] {
    return this._components;
  }

  /**
   * This method let you to add a express middleware or a Ts.ED middleware like GlobalAcceptMimes.
   *
   * ```typescript
   * @ServerSettings({
   *    rootDir,
   *    acceptMimes: ['application/json'] // optional
   * })
   * export class Server extends ServerLoader {
   *     $onMountingMiddlewares(): void|Promise<any> {
   *         const methodOverride = require('method-override');
   *
   *         this.use(GlobalAcceptMimesMiddleware)
   *             .use(methodOverride());
   *
   *         // similar to
   *         this.expressApp.use(methodOverride());
   *
   *         // but not similar to
   *         this.expressApp.use(GlobalAcceptMimesMiddleware); // in this case, this middleware will not be added correctly to express.
   *
   *         return null;
   *     }
   * }
   * ```
   * @param args
   * @returns {ServerLoader}
   */
  public use(...args: any[]): ServerLoader {
    this.expressApp.use(...args);

    return this;
  }

  /**
   * Proxy to express set
   * @param setting
   * @param val
   * @returns {ServerLoader}
   */
  public set(setting: string, val: any): ServerLoader {
    this.expressApp.set(setting, val);

    return this;
  }

  /**
   * Proxy to express engine
   * @param ext
   * @param fn
   * @returns {ServerLoader}
   */
  public engine(ext: string, fn: Function): ServerLoader {
    this.expressApp.engine(ext, fn);

    return this;
  }

  /**
   * Scan and imports all files matching the pattern. See the document on the [Glob](https://www.npmjs.com/package/glob)
   * pattern for more information.
   *
   * #### Example
   *
   * ```typescript
   * import {ServerLoader} from "@tsed/common";
   * import Path = require("path");
   *
   * export class Server extends ServerLoader {
   *
   *    constructor() {
   *        super();
   *
   *        let appPath = Path.resolve(__dirname);
   *
   *        this.scan(appPath + "/controllers/**\/**.js")
   *   }
   * }
   * ```
   *
   * Theses pattern scan all files in the directories controllers, services recursively.
   *
   * !> On windows on can have an issue with the Glob pattern and the /. To solve it, build your path pattern with the module Path.
   *
   * ```typescript
   * const controllerPattern = Path.join(rootDir, 'controllers','**','*.js');
   * ```
   *
   * @param patterns
   * @param endpoint
   * @returns {ServerLoader}
   */
  public scan(patterns: string | string[], endpoint?: string): ServerLoader {
    this.addWaiters(
      this.importProviders(patterns, {endpoint}).then((providers: IProvider<any>[]) => {
        this.addProviders(providers);
        this._components = this._components.concat(providers);
      })
    );

    return this;
  }

  /**
   * Add classes decorated by `@Controller()` to components container.
   *
   * ### Example
   *
   * ```typescript
   * @Controller('/ctrl')
   * class MyController{
   * }
   *
   * new ServerLoader().addControllers('/rest', [MyController])
   * ```
   *
   * ::: tip
   * If the MyController class isn't decorated, the class will be ignored.
   * :::
   *
   * @param {string} endpoint
   * @param {any[]} controllers
   * @returns {ServerLoader}
   */
  public addControllers(endpoint: string, controllers: IResolveProviderOptions[]): this {
    this.addWaiters(
      this.resolveProviders(controllers).then((providers: IProvider<any>[]) => {
        providers = providers.map(provider => {
          return {
            ...provider,
            options: {endpoint}
          };
        });

        this._components = this._components.concat(providers);
      })
    );

    return this;
  }

  /**
   * Add classes to the components list.
   * @param classes
   * @param options
   * @deprecated
   */
  public addComponents(classes: any | any[], options: any = {}): this {
    this.addWaiters(
      this.resolveProviders(classes).then((providers: IProvider<any>[]) => {
        providers = providers.map(provider => {
          return {
            ...provider,
            options
          };
        });

        this._components = this._components.concat(providers);
      })
    );

    return this;
  }

  /**
   * Mount all controllers files that match with `globPattern` ([Glob Pattern](https://www.npmjs.com/package/glob))
   * under the endpoint. See [Versioning Rest API](/docs/server-loader.md#versioning) for more information.
   * @param endpoint
   * @param list
   * @returns {ServerLoader}
   */
  public mount(endpoint: string, list: any | string | (any | string)[]): ServerLoader {
    const patterns = [].concat(list).filter((item: string) => {
      if (isClass(item)) {
        this.addControllers(endpoint, [item]);

        return false;
      }

      return true;
    });

    if (patterns.length) {
      this.addWaiters(
        this.importProviders(patterns, {endpoint}).then((providers: IProvider<any>[]) => {
          this.addProviders(providers);
          this._components = this._components.concat(providers);
        })
      );
    }

    return this;
  }

  /**
   * Start the express server.
   * @returns {Promise<any>|Promise}
   */
  public async start(): Promise<any> {
    const start = new Date();
    try {
      await this.loadSettingsAndInjector();

      $log.debug("Settings and injector loaded");

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

  /**
   *
   */
  protected readSettingsMetadata() {
    const settings = ServerSettingsService.getMetadata(this);

    if ((this as any).$onAuth) {
      $log.warn("The $onAuth hooks is removed. Use OverrideMiddleware method instead of. See https://goo.gl/fufBTE.");
    }

    if (settings) {
      this.setSettings(settings);
    }
  }

  /**
   *
   * @returns {Promise<void>}
   */
  protected async loadSettingsAndInjector() {
    const debug = this.settings.debug;

    /* istanbul ignore next */
    if (debug && this.settings.env !== "test") {
      $log.level = "debug";
    }

    await this.callHook("$onInit");
    $log.debug("Initialize settings");

    this.settings.forEach((value, key) => {
      $log.info(`settings.${key} =>`, value);
    });

    $log.info("Build services");
    await this.loadInjector();
  }

  protected callHook = (key: string, elseFn = new Function(), ...args: any[]) => {
    const self: any = this;

    if (key in this) {
      $log.debug(`\x1B[1mCall hook ${key}\x1B[22m`);

      return self[key](...args);
    }

    return elseFn();
  };

  /**
   *
   */
  // @Deprecated("Removed feature. Use ServerLoader.settings")
  // protected getSettingsService(): SettingsService {
  //   return this.settings;
  // }

  /**
   * Create a new server from settings parameters.
   * @param http
   * @param settings
   * @returns {Promise<TResult2|TResult1>}
   */
  protected startServer(
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

  /**
   * Initiliaze all servers.
   * @returns {Bluebird<U>}
   */
  protected async startServers(): Promise<any> {
    const promises: Promise<any>[] = [];

    /* istanbul ignore else */
    if ((this.settings.httpPort as any) !== false) {
      const settings = this.settings.getHttpPort();
      promises.push(
        this.startServer(this.httpServer, {https: false, ...settings}).then(settings => {
          this.settings.setHttpPort(settings);
        })
      );
    }

    /* istanbul ignore else */
    if ((this.settings.httpsPort as any) !== false) {
      const settings = this.settings.getHttpsPort();
      promises.push(
        this.startServer(this.httpsServer, {https: true, ...settings}).then(settings => {
          this.settings.setHttpsPort(settings);
        })
      );
    }

    return Promise.all<any>(promises);
  }

  /**
   * Initialize configuration of the express app.
   */
  protected async loadMiddlewares(): Promise<any> {
    $log.debug("Mount middlewares");

    this.use(LogIncomingRequestMiddleware);
    await this.callHook("$onMountingMiddlewares", undefined, this.expressApp);
    await this.injector.emit("$beforeRoutesInit");
    await this.injector.emit("$onRoutesInit", this.components);
    await this.injector.emit("$afterRoutesInit");
    await this.callHook("$afterRoutesInit", undefined, this.expressApp);

    // Import the globalErrorHandler
    this.use(GlobalErrorHandlerMiddleware);
  }

  /**
   *
   */
  protected setSettings(settings: IServerSettings) {
    super.setSettings(settings);

    if (this.settings.env === "test") {
      $log.stop();
    }

    const bind = (property: string, value: any, map: Map<string, any>) => {
      switch (property) {
        case "mount":
          Object.keys(this.settings.mount).forEach(key => this.mount(key, value[key]));
          break;

        case "componentsScan":
          $log.warn("The componentsScan options is deprecated. Use providers instead of.", this.settings.componentsScan);
          this.settings.componentsScan.forEach(componentDir => this.scan(componentDir));
          break;
      }
    };

    this.settings.forEach((value, key, map) => {
      /* istanbul ignore else */
      if (value !== undefined) {
        bind(key, value, map);
      }
    });
  }
}
