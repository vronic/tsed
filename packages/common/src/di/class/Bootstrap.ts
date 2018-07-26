import {IProvider, SettingsService} from "@tsed/common";
import {isClass} from "@tsed/core";
import * as globby from "globby";
import * as Path from "path";
import {$log} from "ts-log-debug";
import {IBootstrapSettings, IResolveProviderOptions} from "../interfaces/IBootstrapSettings";
import {GlobalProviders} from "../registries/ProviderRegistry";
import {InjectorService} from "../services/InjectorService";

/**
 * Bootstrap a
 */
export class Bootstrap {
  private _injector: InjectorService;
  private _imports: Promise<any>[] = [];

  /**
   *
   */
  constructor(bootstrapSettings: IBootstrapSettings = {}) {
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
    await Promise.all(this._imports);

    // TODO OLD IMPLEMENTATION
    GlobalProviders.toArray().forEach(({token, provider}) => {
      if (!this.injector.has(token)) {
        this.injector.addProvider(provider);
      }
    });

    await this.injector.load();
  }

  async resolveModules(modules: any[]) {}

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
   * !> On windows on can have an issue with the Glob pattern and the /. To solve it, build your path pattern with the module Path.
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
    const onScan = async (file: string) => {
      try {
        $log.debug(`Import file:`, file);

        return await import(file);
      } catch (er) {
        /* istanbul ignore next */
        $log.error(er);
        /* istanbul ignore next */
        process.exit(-1);
      }
    };

    const cleanedPatterns = Bootstrap.cleanGlobPatterns(patterns, this.settings.exclude);
    const promises = globby.sync(cleanedPatterns).map(onScan);

    this._imports = this._imports.concat(promises);

    const listExports: any[] = await promises;

    return listExports.reduce((acc: any[], exports: any) => {
      return acc
        .concat(
          Object.keys(exports)
            .map(key => exports[key])
            .filter(token => isClass(token) && GlobalProviders.has(token))
        )
        .map(symbol => ({provide: symbol, options}));
    }, []);
  }

  /**
   * Take a configuration and try to resolve all providers from Patterns, Class or IProvider.
   * @param providers
   */
  async resolveProviders(providers: IResolveProviderOptions[]) {
    const resolve = async (acc: any[], obj: IResolveProviderOptions) => {
      if (typeof obj === "string") {
        const classes = await this.importProviders(obj);

        return acc.concat(classes);
      }

      if (typeof obj === "object") {
        if ("pattern" in obj) {
          const classes = await this.importProviders(obj.pattern, obj.options);

          return acc.concat(classes);
        }

        if (isClass(obj)) {
          return acc.concat({provide: obj, useClass: obj});
        }

        return acc.concat(obj);
      }

      return await acc;
    };

    const resolvedProviders: IProvider<any>[] = await Promise.all(providers.reduce(resolve as any, []));

    this.addProviders(resolvedProviders);

    return resolvedProviders;
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
