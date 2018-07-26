import {Type} from "@tsed/core";
import {GlobalProviders} from "../registries/ProviderRegistry";

/**
 * The decorators `@Service()` declare a new service can be injected in other service or controller on there `constructor`.
 * All services annotated with `@Service()` are constructed one time.
 *
 * > `@Service()` use the `reflect-metadata` to collect and inject service on controllers or other services.
 *
 * @returns {Function}
 * @decorator
 */
export function Alias(token1: Type<any>): Function {
  return (token2: any) => {
    const provider = GlobalProviders.get(token1)!;
    provider.alias = true;
    GlobalProviders.set(token2, provider);
  };
}
