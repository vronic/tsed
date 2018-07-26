import {Env, Type} from "@tsed/core";
import {IProvider, ProviderScope} from "./index";

export interface IScanPattern {
  pattern: string | RegExp;
  options?: any;
}

export type IResolveProviderOptions = string | Type<any> | IProvider<any> | IScanPattern;

export interface IBootstrapSettings {
  /**
   * The root directory where you build run project. By default, it's equal to `process.cwd().
   */
  rootDir?: string;
  /**
   * The environment profile. By default the environment profile is equals to `NODE_ENV`.
   */
  env?: Env;
  /**
   * List of glob patterns. Exclude all files which matching with this list when ServerLoader scan all components with the `mount` or `scanComponents` options.
   */
  exclude?: string[];
  /**
   *
   */
  providers?: IResolveProviderOptions[];
  /**
   * Configure the default scope for all ProviderTypes
   *
   * - Default: `singleton`. See [Scope](/docs/scope.md).
   * - Values: `singleton`, `request`.
   */
  scopes?: {[key: string]: ProviderScope};

  [key: string]: any;
}
