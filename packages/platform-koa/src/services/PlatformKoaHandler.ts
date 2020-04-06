import {HandlerContext, HandlerMetadata, PlatformHandler} from "@tsed/common";
import {OverrideProvider} from "@tsed/di";
import {Context, Next} from "koa";

@OverrideProvider(PlatformHandler)
export class PlatformKoaHandler extends PlatformHandler {
  createHandlerContext(metadata: HandlerMetadata) {
    if (metadata.hasErrorParam) {
      console.error("Middleware error can be used with Koa");
      process.exit(-1);
    }

    return (context: Context, next: Next) =>
      this.onRequest(
        new HandlerContext({
          injector: this.injector,
          request: context.request as any,
          response: context.response as any,
          next,
          metadata,
          args: []
        })
      );
  }
}
