import {Env, getValue, setValue} from "@tsed/core";
import {ProviderScope, ProviderType} from "../interfaces";
import {IBootstrapSettings} from "../interfaces/IBootstrapSettings";
import {registerFactory} from "../registries/ProviderRegistry";

export class SettingsService extends Map<string, any> {
  [key: string]: any;

  constructor() {
    super();
    this.rootDir = process.cwd();
    this.env = (process.env.NODE_ENV as Env) || Env.DEV;
    this.exclude = ["**/*.spec.ts", "**/*.spec.js"];
    this.componentsScan = ["${rootDir}/mvc/**/*.ts", "${rootDir}/services/**/*.ts", "${rootDir}/converters/**/*.ts"];
  }

  /**
   *
   * @returns {any}
   */
  get rootDir() {
    return this.get("rootDir");
  }

  /**
   *
   * @param value
   */
  set rootDir(value: string) {
    this.set("rootDir", value);
  }

  /**
   *
   * @returns {Map<string, any>}
   */
  get env(): Env {
    return this.get("env");
  }

  /**
   *
   * @param value
   */
  set env(value: Env) {
    this.set("env", value);
  }

  /**
   *
   * @returns {undefined|any}
   */
  get componentsScan(): string[] {
    return this.get("componentsScan") || [];
  }

  /**
   *
   * @param value
   */
  set componentsScan(value: string[]) {
    this.set("componentsScan", value);
  }

  set exclude(exclude: string[]) {
    this.set("exclude", exclude);
  }

  get exclude() {
    return this.get("exclude") || [];
  }

  get scopes(): {[key: string]: ProviderScope} {
    return this.get("scopes") || {};
  }

  set scopes(scopes: {[key: string]: ProviderScope}) {
    this.set("scopes", scopes);
  }

  scopeOf(providerType: ProviderType) {
    return this.scopes[providerType] || ProviderScope.SINGLETON;
  }

  /**
   *
   * @param propertyKey
   * @param value
   */
  set(propertyKey: string | IBootstrapSettings, value?: any): this {
    if (typeof propertyKey === "string") {
      setValue(propertyKey, value, this);
    } else {
      const self: any = this;

      Object.keys(propertyKey).forEach(key => {
        const descriptor = Object.getOwnPropertyDescriptor(SettingsService.prototype, key);

        if (descriptor && ["set", "get", "providers"].indexOf(key) === -1) {
          self[key] = propertyKey[key];
        } else {
          this.set(key, propertyKey[key]);
        }
      });

      this.forEach((value, key) => {
        this.set(key, this.resolve(value));
      });
    }

    return this;
  }

  /**
   *
   * @param propertyKey
   * @returns {undefined|any}
   */
  get<T>(propertyKey: string): T {
    return this.resolve(getValue(propertyKey, this));
  }

  /**
   *
   * @param value
   * @returns {any}
   */
  resolve(value: any) {
    if (typeof value === "object") {
      Object.keys(value).forEach((k: string, i: number, m: any) => {
        value[k] = this.resolve(value[k]);
      });

      return value;
    }

    if (typeof value === "string") {
      return value.replace(/\${rootDir}/, this.rootDir);
    }

    return value;
  }
}

/**
 * Create the first service InjectorService
 */
registerFactory(SettingsService);
