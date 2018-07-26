import {Bootstrap, InjectorService, ServerSettingsService, SettingsService} from "@tsed/common";
import {Env} from "@tsed/core";

export async function loadInjector(): Promise<InjectorService | undefined> {
  const bootstrap = new Bootstrap();
  const injector = bootstrap.injector;

  injector.createAlias(SettingsService, ServerSettingsService);
  injector.get<ServerSettingsService>(ServerSettingsService)!.env = Env.TEST;

  /* istanbul ignore next */
  try {
    await bootstrap.loadInjector();

    return injector;
  } catch (er) {
    console.error(er);
    process.exit(-1);
  }
}
