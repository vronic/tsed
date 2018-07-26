import {Bootstrap, InjectorService, SettingsService} from "@tsed/common";
import {Env} from "@tsed/core";

export async function loadInjector(): Promise<InjectorService | undefined> {
  const bootstrap = new Bootstrap();
  const injector = bootstrap.injector;

  injector.get<SettingsService>(SettingsService)!.env = Env.TEST;

  /* istanbul ignore next */
  try {
    await bootstrap.loadInjector();

    return injector;
  } catch (er) {
    console.error(er);
    process.exit(-1);
  }
}
