import {PlatformDriver} from "@tsed/common";
import * as compose from "koa-compose";
import * as KoaRouter from "koa-router";

export class PlatformKoaDriver<T> extends PlatformDriver<T> {
  mapHandlers(handlers: any[]): any[] {
    handlers = super.mapHandlers(handlers);

    const {path, middlewares} = handlers.reduce(
      (data, item) => {
        if (typeof item === "string") {
          data.path = item;
        } else {
          data.middlewares.push(item);
        }

        return data;
      },
      {middlewares: []}
    );

    const composedMiddlewares = compose(middlewares);

    if (path) {
      const router = new KoaRouter();
      router.use(path, composedMiddlewares);

      return [router.routes()];
    }

    return [composedMiddlewares];
  }
}
