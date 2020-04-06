import {IDIConfigurationOptions, IRoute, PlatformBuilder} from "@tsed/common";
import {Type} from "@tsed/core";
import {PlatformKoaStatics} from "../services";
import {createExpressApplication, createHttpServer, createHttpsServer} from "../utils";

export class PlatformKoa extends PlatformBuilder {
  static async bootstrap(module: Type<any>, settings: Partial<IDIConfigurationOptions> = {}): Promise<PlatformKoa> {
    return this.build<PlatformKoa>(PlatformKoa).bootstrap(module, settings);
  }

  async loadStatics() {
    const {injector} = this;
    const staticsService = injector.get<PlatformKoaStatics>(PlatformKoaStatics)!;
    staticsService.statics(injector.settings.statics);
  }

  protected async loadRoutes(routes: IRoute[]): Promise<void> {
    // this.app.use(LogIncomingRequestMiddleware);
    // this.app.use(GlobalAcceptMimesMiddleware);

    await super.loadRoutes(routes);

    // this.app.use(GlobalErrorHandlerMiddleware);
  }

  protected createInjector(module: Type<any>, settings: any) {
    super.createInjector(module, settings);
    createExpressApplication(this.injector);
    createHttpsServer(this.injector);
    createHttpServer(this.injector);
  }
}
