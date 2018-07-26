import {isClass, Type} from "@tsed/core";
import * as globby from "globby";
import * as Path from "path";
import {$log} from "ts-log-debug";
import {IBootstrapSettings, IResolveProviderOptions} from "../interfaces/IBootstrapSettings";
import {IProvider} from "../interfaces/IProvider";
import {GlobalProviders} from "../registries/ProviderRegistry";
import {InjectorService} from "../services/InjectorService";
import {SettingsService} from "../services/SettingsService";

/**
 * Bootstrap a
 */
export class Bootstrap {
  protected loaded = false;
  private _injector: InjectorService;
  private _waiters: Promise<any>[] = [];

  /**
   *
   */
  constructor(bootstrapSettings?: IBootstrapSettings) {
    this._injector = new InjectorService();

    if (bootstrapSettings) {
      this.setSettings(bootstrapSettings);
    }
  }

  /**
   * Return the settings
   */
  get settings(): SettingsService {
    return this.injector.settings;
  }

  /**
   * Return the injectorService initialized by the server.
   * @returns {InjectorService}
   */
  get injector(): InjectorService {
    return this._injector;
  }

  /**
   * Return the InjectorService initialized by the server.
   * @returns {InjectorService}
   * @deprecated
   */
  get injectorService(): InjectorService {
    return this._injector;
  }

  /**
   * Start the express server.
   * @returns {Promise<any>|Promise}
   */
  public async loadInjector(): Promise<any> {
    await this.wait();

    if (this.loaded) {
      return;
    }

    this.loadFromGlobalRegistry();
    console.log("LoadInjector=================");
    this.injector.forEach(p => console.log(p.className));

    await this.injector.load();
    console.log("LoadInjector=================END");

    this.loaded = true;
  }

  loadFromGlobalRegistry() {
    // TODO OLD IMPLEMENTATION
    GlobalProviders.toArray().forEach(({token, provider}) => {
      if (provider.alias && provider.provide !== token) {
        this.injector.createAlias(provider.provide, token);
      } else {
        if (!this.injector.has(token)) {
          this.injector.addProvider(provider);
        }
      }
    });
  }

  async resolveModules(modules: any[]) {}

  /**
   *
   * @param file
   */
  async importSymbols(file: string): Promise<Type<any>[]> {
    try {
      const exports = await import(file);

      return Object.keys(exports)
        .map(key => exports[key])
        .filter(token => isClass(token) && GlobalProviders.has(token))!;
    } catch (er) {
      /* istanbul ignore next */
      $log.error(er);
      /* istanbul ignore next */
      process.exit(-1);
    }

    /* istanbul ignore next */
    return Promise.resolve([]);
  }

  /**
   * Scan and imports all files matching the pattern. See the document on the [Glob](https://www.npmjs.com/package/glob)
   * pattern for more information.
   *
   * #### Example
   *
   * ```typescript
   * import {Bootstrap} from "@tsed/di";
   *
   * new Bootstrap().importProviders([
   *   './path/services/**\/*.js'
   * ])
   * ```
   *
   * Theses pattern scan all files in the directories controllers, services recursively.
   *
   * ::: warning
   * On windows on can have an issue with the Glob pattern and the /. To solve it, build your path pattern with the module Path.
   * :::
   *
   * ```typescript
   * import path = require("path");
   * const pattern = Path.join(rootDir, 'services','**','*.js');
   *
   * new Bootstrap().importProviders([pattern]);
   * ```
   *
   * @param patterns
   * @param options
   * @returns {ServerLoader}
   */
  async importProviders(patterns: string | string[], options?: {[key: string]: any}): Promise<IProvider<any>[]> {
    const cleanedPatterns = Bootstrap.cleanGlobPatterns(patterns, this.settings.exclude);
    const promises = globby.sync(cleanedPatterns).map(async file => {
      const symbols = await this.importSymbols(file);

      return symbols.map((symbol: any) => ({provide: symbol, options}));
    });

    const list: any[][] = await Promise.all(promises);

    return list.reduce((acc: IProvider<any>[], value: IProvider<any>[]) => {
      acc = acc.concat(value);

      return acc;
    }, []) as IProvider<any>[];
  }

  /**
   * Take a configuration and try to resolve all providers from Patterns, Class or IProvider.
   * @param providers
   */
  async resolveProviders(providers: IResolveProviderOptions[]): Promise<IProvider<any>[]> {
    const promise: Promise<any> = Promise.all(await providers.reduce(this.whenResolveProvider as any, [])).then(resolvedProviders => {
      this.addProviders(resolvedProviders);

      return resolvedProviders;
    });

    this.addWaiters(promise);

    return promise;
  }

  /**
   *
   * @param providers
   */
  addProviders(providers: IProvider<any>[]) {
    providers.forEach((provider: IProvider<any>) => {
      this.injector.addProvider(provider);
    });
  }

  protected async wait(): Promise<void> {
    await Promise.all(this._waiters);
  }

  protected addWaiters(...promises: Promise<any>[]) {
    this._waiters = this._waiters.concat(promises);
  }

  /**
   *
   * @param settings
   */
  protected setSettings(settings: IBootstrapSettings) {
    this.settings.set(settings);

    if (settings.imports) {
      // modules
      this.resolveModules(settings.imports);
    }

    if (settings.providers) {
      this.resolveProviders(settings.providers);
    }
  }

  private whenResolveProvider = async (acc: any[], obj: IResolveProviderOptions) => {
    if (typeof obj === "string") {
      const providers = await this.importProviders(obj);

      return acc.concat(providers);
    }

    if (isClass(obj)) {
      return acc.concat({provide: obj, useClass: obj});
    }

    if ("pattern" in obj) {
      const providers = await this.importProviders(obj.pattern, obj.options);

      return acc.concat(providers);
    }

    return acc.concat(obj);
  };

  /**
   *
   * @returns {any}
   * @param files
   * @param excludes
   */
  static cleanGlobPatterns(files: string | string[], excludes: string[]): string[] {
    excludes = excludes.map((s: string) => "!" + s.replace(/!/gi, ""));

    return []
      .concat(files as any)
      .map((file: string) => {
        if (!require.extensions[".ts"]) {
          file = file.replace(/\.ts$/i, ".js");
        }

        return Path.resolve(file);
      })
      .concat(excludes as any);
  }
}
