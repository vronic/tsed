import {Deprecated, ProxyMap, Type} from "@tsed/core";
import {Injectable, InjectorService, IProvider, ProviderScope, ProviderType} from "@tsed/di";
import * as Express from "express";
import {$log} from "ts-log-debug";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";
import {ControllerBuilder} from "../class/ControllerBuilder";
import {ControllerProvider} from "../class/ControllerProvider";
import {ExpressApplication} from "../decorators";
import {ControllerRegistry} from "../registries/ControllerRegistry";
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
   */
  constructor(
    private injectorService: InjectorService,
    @ExpressApplication private expressApplication: Express.Application,
    private settings: ServerSettingsService,
    private routeService: RouteService
  ) {
    super(injectorService as any, {filter: {type: ProviderType.CONTROLLER}});

    this.buildRouters();
  }

  get routes(): {route: string; provider: any}[] {
    return this.routeService.routes || [];
  }

  /**
   *
   * @param target
   * @returns {ControllerProvider}
   * @deprecated
   */
  @Deprecated("static ControllerService.get(). Removed feature.")
  static get(target: Type<any>): ControllerProvider | undefined {
    return ControllerRegistry.get(target) as ControllerProvider;
  }

  /**
   *
   * @param target
   * @deprecated
   */
  @Deprecated("static ControllerService.has(). Removed feature.")
  static has(target: Type<any>) {
    return ControllerRegistry.has(target);
  }

  /**
   *
   * @param target
   * @param provider
   * @deprecated
   */
  @Deprecated("static ControllerService.set(). Removed feature.")
  static set(target: Type<any>, provider: ControllerProvider) {
    ControllerRegistry.set(target, provider);

    return this;
  }

  /**
   *
   * @param
   */
  public $onRoutesInit() {
    $log.info("Map controllers");
    this.addComponents(this.settings.get("components"));
  }

  /**
   * Invoke a controller from his Class.
   * @param target
   * @param locals
   * @param designParamTypes
   * @returns {T}
   * @deprecated
   */
  @Deprecated("ControllerService.invoke(). Removed feature. Use injectorService.invoke instead of.")
  public invoke<T>(target: any, locals: Map<Type<any> | any, any> = new Map<Type<any>, any>(), designParamTypes?: any[]): T {
    return this.injectorService.invoke<T>(target.provide || target, locals, designParamTypes);
  }

  /**
   * Take a list of partials providers and load theses components as Controller if the provider is found the injectorService.
   * @param {Partial<IProvider<any>>[]} components
   */
  private addComponents(components: Partial<IProvider<any>>[]) {
    components
      .filter(partialProvider => partialProvider.endpoint && this.has(partialProvider.provide))
      .forEach(partialProvider => {
        const provider: ControllerProvider = this.get(partialProvider.provide)!;

        if (!provider.hasParent()) {
          this.mountRouter(partialProvider.endpoint!, provider);
        }

        return;
      });
  }

  /**
   * Build routers and con
   */
  private buildRouters() {
    const defaultRoutersOptions = this.settings.routers;

    this.forEach((provider: ControllerProvider) => {
      if (!provider.router && !provider.hasParent()) {
        new ControllerBuilder(provider, defaultRoutersOptions).build(this.injectorService);
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
}
