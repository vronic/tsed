import {Env, getValue, setValue} from "@tsed/core";
import {Injectable} from "../decorators/injectable";
import {ProviderScope, ProviderType} from "../interfaces";
import {IBootstrapSettings} from "../interfaces/IBootstrapSettings";

@Injectable({
  scope: ProviderScope.SINGLETON,
  global: true
})
export class SettingsService {
  [key: string]: any;

  protected _map = new Map<string, any>();

  constructor() {
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
    return this._map.get("rootDir");
  }

  /**
   *
   * @param value
   */
  set rootDir(value: string) {
    this._map.set("rootDir", value);
  }

  /**
   *
   * @returns {Map<string, any>}
   */
  get env(): Env {
    return this._map.get("env");
  }

  /**
   *
   * @param value
   */
  set env(value: Env) {
    this._map.set("env", value);
  }

  /**
   *
   * @returns {undefined|any}
   */
  get componentsScan(): string[] {
    return this._map.get("componentsScan") || [];
  }

  /**
   *
   * @param value
   */
  set componentsScan(value: string[]) {
    this._map.set("componentsScan", value);
  }

  set exclude(exclude: string[]) {
    this._map.set("exclude", exclude);
  }

  get exclude() {
    return this._map.get("exclude") || [];
  }

  get scopes(): {[key: string]: ProviderScope} {
    return this._map.get("scopes") || {};
  }

  set scopes(scopes: {[key: string]: ProviderScope}) {
    this._map.set("scopes", scopes);
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
      setValue(propertyKey, value, this._map);
    } else {
      const self: any = this;

      Object.keys(propertyKey).forEach(key => {
        const descriptor = Object.getOwnPropertyDescriptor(SettingsService.prototype, key);

        if (descriptor && ["set", "get", "providers"].indexOf(key) === -1) {
          self[key] = propertyKey[key];
        } else {
          this._map.set(key, propertyKey[key]);
        }
      });

      this._map.forEach((value, key) => {
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
    return this.resolve(
      getValue(propertyKey, {
        get: (key: any) => this._map.get(key)
      })
    );
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

  /**
   *
   * @param callbackfn
   * @param thisArg
   */
  forEach(callbackfn: (value: any, key: string, map: Map<string, any>) => void, thisArg?: any) {
    this._map.forEach(callbackfn, thisArg);
  }
}
