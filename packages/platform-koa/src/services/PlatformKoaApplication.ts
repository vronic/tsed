import {PlatformApplication, PlatformHandler} from "@tsed/common";
import {OverrideProvider} from "@tsed/di";
import * as Koa from "koa";
import {PlatformKoaDriver} from "./PlatformKoaDriver";

declare global {
  namespace TsED {
    export interface Application {
      // FIXME add KoaApplication
      [key: string]: any;
    }
  }
}

@OverrideProvider(PlatformApplication)
export class PlatformKoaApplication extends PlatformKoaDriver<Koa> {
  constructor(platformHandler: PlatformHandler) {
    super(platformHandler);
    this.raw = new Koa() as any;
  }

  callback(): any {
    return this.raw.callback();
  }
}
