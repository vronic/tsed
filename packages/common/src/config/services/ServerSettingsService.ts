import {Deprecated, Env, Metadata} from "@tsed/core";
import * as Https from "https";
import {$log} from "ts-log-debug";
import {OverrideService} from "../../di/decorators/overrideService";
import {ProviderScope} from "../../di/interfaces/ProviderScope";
import {SettingsService} from "../../di/services/SettingsService";
import {SERVER_SETTINGS} from "../constants/index";
import {IErrorsSettings, ILoggerSettings, IRouterSettings, IServerMountDirectories, IServerSettings} from "../interfaces/IServerSettings";

/**
 * @deprecated
 */
export let globalServerSettings: ServerSettingsService;
/**
 * @deprecated
 */
// tslint:disable-next-line: variable-name
export let GlobalServerSettings: ServerSettingsService;

/**
 * `ServerSettingsService` contains all information about [ServerLoader](/api/common/server/components/ServerLoader.md) configuration.
 */

@OverrideService(SettingsService)
export class ServerSettingsService extends SettingsService implements IServerSettings {
  constructor() {
    super();

    this.port = 8080;
    this.httpsPort = 8000;
    this.version = "1.0.0";
    this.uploadDir = "${rootDir}/uploads";
    this.debug = false;
    this.controllerScope = ProviderScope.SINGLETON;
    this.logger = {
      debug: false,
      logRequest: true,
      jsonIndentation: this.env === Env.PROD ? 0 : 2
    };
    this.errors = {
      headerName: "errors"
    };

    this.mount = {
      "/rest": "${rootDir}/controllers/**/*.ts"
    };

    GlobalServerSettings = globalServerSettings = this;
  }

  /**
   *
   * @returns {any}
   */
  get version() {
    return this.get("version");
  }

  set version(v: string) {
    this.set("version", v);
  }

  /**
   *
   * @param value
   */
  set port(value: string | number) {
    this.httpPort = value;
  }

  /**
   *
   * @param value
   */
  get httpsOptions(): Https.ServerOptions {
    return this.get("httpsOptions");
  }

  /**
   *
   * @param value
   */
  set httpsOptions(value: Https.ServerOptions) {
    this.set("httpsOptions", value);
  }

  /**
   *
   * @returns {undefined|any}
   */
  get httpPort(): string | number {
    return this.get("httpPort");
  }

  /**
   *
   * @param value
   */
  set httpPort(value: string | number) {
    this.set("httpPort", value);
  }

  /**
   *
   * @returns {undefined|any}
   */
  get httpsPort(): string | number {
    return this.get("httpsPort");
  }

  /**
   *
   * @param value
   */
  set httpsPort(value: string | number) {
    this.set("httpsPort", value);
  }

  /**
   *
   * @returns {string}
   */
  get uploadDir(): string {
    return this.get("uploadDir");
  }

  /**
   *
   * @param value
   */
  set uploadDir(value: string) {
    this.set("uploadDir", value);
  }

  /**
   *
   * @returns {undefined|any}
   */
  get mount(): IServerMountDirectories {
    return this.get("mount") || {};
  }

  /**
   *
   * @param value
   */
  set mount(value: IServerMountDirectories) {
    this.set("mount", value);
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

  /**
   *
   * @returns {undefined|any}
   */
  get serveStatic(): IServerMountDirectories {
    return this.get("serveStatic") || {};
  }

  /**
   *
   * @param value
   */
  set serveStatic(value: IServerMountDirectories) {
    this.set("serveStatic", value);
  }

  /**
   *
   * @returns {undefined|any}
   */
  get acceptMimes(): string[] {
    return this.get("acceptMimes") || ["application/json"];
  }

  /**
   *
   * @param value
   */
  set acceptMimes(value: string[]) {
    this.set("acceptMimes", value || []);
  }

  /**
   *
   * @returns {boolean}
   */
  get debug(): boolean {
    return !!this.logger.debug;
  }

  /**
   *
   * @param {boolean} debug
   */
  set debug(debug: boolean) {
    this.logger = {...this.logger, debug};
  }

  /**
   *
   * @returns {IRouterSettings}
   */
  get routers(): IRouterSettings {
    return this.get("routers") || {};
  }

  /**
   *
   * @param {IRouterSettings} options
   */
  set routers(options: IRouterSettings) {
    this.set("routers", options);
  }

  /**
   *
   * @returns {boolean}
   */
  get validationModelStrict(): boolean {
    const value: boolean = this.get("validationModelStrict");

    return value === undefined ? true : value;
  }

  /**
   *
   * @param {boolean} value
   */
  set validationModelStrict(value: boolean) {
    this.set("validationModelStrict", value);
  }

  get logger(): Partial<ILoggerSettings> {
    const requestFields = this.get("logRequestFields");

    return Object.assign(
      {
        requestFields
      },
      this.get("logger")
    ) as ILoggerSettings;
  }

  set logger(value: Partial<ILoggerSettings>) {
    this.set("logger", value);

    if (value.format) {
      $log.appenders.set("stdout", {
        type: "stdout",
        levels: ["info", "debug"],
        layout: {
          type: "pattern",
          pattern: value.format
        }
      });

      $log.appenders.set("stderr", {
        levels: ["trace", "fatal", "error", "warn"],
        type: "stderr",
        layout: {
          type: "pattern",
          pattern: value.format
        }
      });
    }
  }

  set exclude(exclude: string[]) {
    this.set("exclude", exclude);
  }

  get exclude() {
    return this.get("exclude") || [];
  }

  set controllerScope(scope: ProviderScope) {
    this.set("scope", scope);
  }

  get controllerScope(): ProviderScope {
    return this.get("scope");
  }

  /**
   *
   * @returns {IRouterSettings}
   */
  get errors(): IErrorsSettings {
    return this.get("errors") || {};
  }

  /**
   *
   * @param {IRouterSettings} options
   */
  set errors(options: IErrorsSettings) {
    this.set("errors", options);
  }

  /**
   *
   * @param target
   * @returns {any}
   */
  static getMetadata(target: any) {
    return Metadata.getOwn(SERVER_SETTINGS, target);
  }

  /**
   *
   * @param addressPort
   * @returns {{address: string, port: number}}
   */
  private static buildAddressAndPort(addressPort: string | number): {address: string; port: number} {
    let address = "0.0.0.0";
    let port = addressPort;

    if (typeof addressPort === "string" && addressPort.indexOf(":") > -1) {
      [address, port] = addressPort.split(":");
      port = +port;
    }

    return {address, port: port as number};
  }

  /**
   * @deprecated
   * @returns {ServerSettingsService}
   */
  @Deprecated("Removed feature")
  public $get(): ServerSettingsService {
    this.forEach((value, key) => {
      this.set(key, this.resolve(value));
    });

    return this;
  }

  /**
   *
   * @returns {string|number}
   */
  getHttpPort(): {address: string; port: number} {
    return ServerSettingsService.buildAddressAndPort(this.get("httpPort"));
  }

  /**
   *
   * @param settings
   */
  setHttpPort(settings: {address: string; port: number}) {
    this.set("httpPort", `${settings.address}:${settings.port}`);
  }

  /**
   *
   * @returns {string|number}
   */
  getHttpsPort(): {address: string; port: number} {
    return ServerSettingsService.buildAddressAndPort(this.get("httpsPort"));
  }

  /**
   *
   * @param settings
   */
  setHttpsPort(settings: {address: string; port: number}) {
    this.set("httpsPort", `${settings.address}:${settings.port}`);
  }
}

/**
 * @deprecated
 */
export class ServerSettingsProvider extends ServerSettingsService {}
