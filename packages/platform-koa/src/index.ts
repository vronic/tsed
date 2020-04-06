import {createExpressApplication, createHttpServer, createHttpsServer, ExpressApplication, PlatformTest} from "@tsed/common";

import {PlatformKoa} from "./components/PlatformKoa";

PlatformTest.platformBuilder = PlatformKoa;

export * from "./middlewares";
export * from "./services";
export * from "./utils";
export * from "./components/PlatformKoa";

export {createExpressApplication, createHttpServer, createHttpsServer, ExpressApplication};
