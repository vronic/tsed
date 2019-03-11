import {InjectorService} from "@tsed/di";
import * as Express from "express";
import {$log} from "ts-log-debug";
import {IComponentScanned, IServerLifecycle} from "../interfaces";
import {Bootstrap} from "./Bootstrap";

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
$log.name = "TSED";
$log.level = "info";

export class ServerLoader extends Bootstrap implements IServerLifecycle {
  public version: string = "0.0.0-PLACEHOLDER";

  /**
   *
   */
  constructor() {
    super(ServerLoader);
    this.runSettings();
  }

  /**
   * Return Express Application instance.
   * @returns {core.Express}
   */
  get expressApp(): Express.Application {
    return this.driver();
  }

  /**
   * Return the InjectorService initialized by the server.
   * @returns {InjectorService}
   */
  get injectorService(): InjectorService {
    return this.injector;
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
    this.driver().use(...args);

    return this;
  }

  /**
   * Proxy to express set
   * @param setting
   * @param val
   * @returns {ServerLoader}
   */
  public set(setting: string, val: any): ServerLoader {
    this.driver().set(setting, val);

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
   * Start the express server.
   * @returns {Promise<any>|Promise}
   */
  public async start(): Promise<any> {
    return this.listen();
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
   * @deprecated
   */
  public scan(patterns: string | string[], endpoint?: string): ServerLoader {
    if (endpoint) {
      this.addControllers(endpoint, [].concat(patterns as any));
    } else {
      this.addComponents([].concat(patterns as any));
    }

    return this;
  }

  /**
   * Add classes to the components list
   * @param classes
   * @param options
   */
  public addComponents(classes: any | any[], options: Partial<IComponentScanned> = {}): ServerLoader {
    this.settings.componentsScan = this.settings.componentsScan.concat(classes);

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
  public addControllers(endpoint: string, controllers: any[]) {
    this.settings.mount[endpoint] = (this.settings.mount[endpoint] || []).concat(controllers);
  }

  /**
   * Mount all controllers files that match with `globPattern` ([Glob Pattern](https://www.npmjs.com/package/glob))
   * under the endpoint. See [Versioning Rest API](/docs/server-loader.md#versioning) for more information.
   * @param endpoint
   * @param list
   * @returns {ServerLoader}
   * @deprecated
   */

  /* istanbul ignore next */
  public mount(endpoint: string, list: any | string | (any | string)[]): ServerLoader {
    this.addControllers(endpoint, list);

    return this;
  }

  /**
   *
   */
  protected runSettings() {
    /* istanbul ignore next */
    if (this.settings.env === "test") {
      $log.stop();
    }

    const bind = (property: string, value: any, map: Map<string, any>) => {
      switch (property) {
        case "httpPort":
          /* istanbul ignore else */
          if (value !== false && this.httpServer === undefined) {
            this.createHttpServer(value);
          }

          break;

        case "httpsPort":
          /* istanbul ignore else */
          if (value !== false && this.httpsServer === undefined) {
            this.createHttpsServer(Object.assign(map.get("httpsOptions") || {}, {port: value}));
          }

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
