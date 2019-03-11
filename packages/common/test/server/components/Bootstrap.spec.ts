import {Metadata} from "@tsed/core";
import {expect} from "chai";
import * as Http from "http";
import * as Https from "https";
import * as Sinon from "sinon";
import {InjectorService} from "../../../../di/src";
import {ServerSettingsService} from "../../../src/config";
import {ExpressApplication} from "../../../src/mvc/decorators";
import {HttpServer, HttpsServer, ServerSettings} from "../../../src/server";
import {Bootstrap} from "../../../src/server/components/Bootstrap";

describe("Bootstrap", () => {
  it("should Bootstrap a module", async () => {
    // GIVEN
    @ServerSettings({debug: true, port: 8000, httpsPort: 8080})
    class AppModule {
      constructor(public injector: InjectorService,
                  @ExpressApplication public driver: ExpressApplication,
                  public settings: ServerSettingsService) {
      }

      $onInit() {

      }

      $beforeRoutesInit() {
      }

      $afterRoutesInit() {

      }

      $onServerReady() {

      }

      $onDestroy() {
      }
    }

    // WHEN
    const bootstrap = new Bootstrap(AppModule);
    bootstrap.settings.httpPort = 8080;
    bootstrap.settings.httpsPort = 8000;

    await bootstrap.listen();
    await bootstrap.destroy();

    // THEN
    bootstrap.injector.should.be.instanceof(InjectorService);
    bootstrap.settings.should.be.instanceof(ServerSettingsService);
    bootstrap.module.injector.should.be.instanceof(InjectorService);
    bootstrap.module.settings.should.be.instanceof(ServerSettingsService);
  });
});
