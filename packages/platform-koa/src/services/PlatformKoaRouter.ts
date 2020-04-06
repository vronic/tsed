import {PLATFORM_ROUTER_OPTIONS, PlatformHandler, PlatformRouter} from "@tsed/common";
import {Configuration, Inject, OverrideProvider} from "@tsed/di";
import * as KoaRouter from "koa-router";
import {PlatformKoaDriver} from "./PlatformKoaDriver";

declare global {
  namespace TsED {
    // export interface Router extends KoaRouter {
    // }
  }
}

@OverrideProvider(PlatformRouter)
export class PlatformKoaRouter extends PlatformKoaDriver<KoaRouter> {
  constructor(
    platform: PlatformHandler,
    @Configuration() configuration: Configuration,
    @Inject(PLATFORM_ROUTER_OPTIONS) routerOptions: any
  ) {
    super(platform);

    this.raw = new KoaRouter() as any;
  }

  callback() {
    // @ts-ignore
    return this.raw.routes();
  }
}
