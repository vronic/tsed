import {Type} from "@tsed/core";
import {loadInjector} from "./loadInjector";

export async function invoke(target: Type<any>, providers: {provide: any | symbol; use: any}[]) {
  const injector = await loadInjector();
  const locals = new Map();

  providers.forEach(p => {
    locals.set(p.provide, p.use);
  });

  return injector!.invoke(target, locals);
}
