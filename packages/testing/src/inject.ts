import {LocalsContainer, TokenProvider} from "@tsed/common";
import {Done} from "./done";
import {loadInjector} from "./loadInjector";

/**
 * The inject function is one of the TsExpressDecorator testing utilities.
 * It injects services into the test function where you can alter, spy on, and manipulate them.
 *
 * The inject function has two parameters
 *
 * * an array of Service dependency injection tokens,
 * * a test function whose parameters correspond exactly to each item in the injection token array.
 *
 * @param deps
 * @param func
 * @param locals
 * @returns {any}
 */
export function inject(deps: TokenProvider[], func: Function, locals: LocalsContainer = new Map()) {
  return function before(done: Function) {
    (async () => {
      let injector = this.$$injector;

      if (!this.$$injector) {
        injector = await loadInjector();
      }

      locals.set(Done, done);

      await injector.invoke(func, locals, {
        deps
      });

      if (deps.indexOf(Done) === -1) {
        done();
      }
    })();
  };
}
