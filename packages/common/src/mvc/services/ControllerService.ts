import {ProviderScope} from "@tsed/common";
import {ProxyMap, Type} from "@tsed/core";
import * as Express from "express";
import {$log} from "ts-log-debug";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";
import {ConverterService} from "../../converters/services/ConverterService";
import {Injectable} from "../../di/decorators/injectable";
import {ProviderType} from "../../di/interfaces/ProviderType";
import {InjectorService} from "../../di/services/InjectorService";
import {ValidationService} from "../../filters/services/ValidationService";
import {IComponentScanned} from "../../server/interfaces";
import {ControllerBuilder} from "../class/ControllerBuilder";
import {ControllerProvider} from "../class/ControllerProvider";
import {ExpressApplication} from "../decorators";
import {RouteService} from "./RouteService";

/**
 * @private
 */
@Injectable({
  scope: ProviderScope.SINGLETON,
  global: true
})
export class ControllerService extends ProxyMap<Type<any> | any, ControllerProvider> {
  /**
   *
   * @param expressApplication
   * @param injectorService
   * @param settings
   * @param routeService
   * @param converterService
   * @param validationService
   */
  constructor(
    private injectorService: InjectorService,
    @ExpressApplication private expressApplication: Express.Application,
    private settings: ServerSettingsService,
    private routeService: RouteService,
    private converterService: ConverterService,
    private validationService: ValidationService
  ) {
    super(injectorService as any, {filter: {type: ProviderType.CONTROLLER}});
    console.log("===> ControllerService");
    this.buildRouters();
  }

  /**
   *
   * @param components
   */
  public $onRoutesInit(components: IComponentScanned[]) {
    $log.info("Map controllers");
    this.mapComponents(components);
  }

  /**
   * Build routers and con
   */
  private buildRouters() {
    const defaultRoutersOptions = this.settings.routers;
    console.log("Build Router: ");

    this.forEach((provider: ControllerProvider) => {
      console.log("Controller ==>", provider.className);

      if (!provider.router && !provider.hasParent()) {
        new ControllerBuilder(provider, defaultRoutersOptions).build(this.injectorService);
      }
    });

    console.log("Build Router: end");
  }

  /**
   *
   * @param components
   */
  private mapComponents(components: IComponentScanned[]) {
    components.filter(component => component.endpoint && this.has(component.token)).forEach(({token, endpoint}) => {
      const provider = this.get(token)!;

      if (!provider.hasParent()) {
        this.mountRouter(endpoint, provider);
      }
    });
  }

  /**
   *
   * @param {string} endpoint
   * @param {ControllerProvider} provider
   */
  private mountRouter(endpoint: string, provider: ControllerProvider) {
    const route = provider.getEndpointUrl(endpoint!);
    this.routeService.addRoute({provider, route});
    this.expressApplication.use(route, provider.router);
  }

  get routes(): {route: string; provider: any}[] {
    return this.routeService.routes || [];
  }
}
