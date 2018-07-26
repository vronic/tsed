import {Type} from "@tsed/core";
import * as Https from "https";
import {Inject, ProviderScope, registerProvider, SettingsService} from "../../di";
import {ExpressApplication} from "../../mvc/decorators/class/expressApplication";

export interface IHttpsFactory {
  (target: Type<any>, targetKey: string, descriptor: TypedPropertyDescriptor<Function> | number): any;

  /**
   * @deprecated
   * @returns {"https".Server}
   */
  get(): Https.Server;
}

export type HttpsServer = Https.Server & IHttpsFactory;

/**
 * Inject the Https.Server instance.
 *
 * ### Example
 *
 * ```typescript
 * import {HttpsServer, Service} from "@tsed/common";
 *
 * @Service()
 * export default class OtherService {
 *    constructor(@HttpsServer httpServer: HttpServer) {}
 * }
 * ```
 *
 * > Note: TypeScript transform and store `HttpsServer` as `Function` type in the metadata. So to inject a factory, you must use the `@Inject(type)` decorator.
 *
 * @param {Type<any>} target
 * @param {string} targetKey
 * @param {TypedPropertyDescriptor<Function> | number} descriptor
 * @returns {any}
 * @decorator
 */
export function HttpsServer(target: Type<any>, targetKey: string, descriptor: TypedPropertyDescriptor<Function> | number) {
  return Inject(HttpsServer)(target, targetKey, descriptor);
}

registerProvider({
  provide: HttpsServer,
  scope: ProviderScope.SINGLETON,
  global: true,
  deps: [SettingsService, ExpressApplication],
  useFactory(settings: SettingsService, expressApp: ExpressApplication) {
    const options = settings.httpsOptions;

    return Https.createServer(options, expressApp);
  }
});
