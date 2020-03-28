import {decorateMethodsOf, DecoratorTypes, getDecoratorType, UnsupportedDecoratorType} from "@tsed/core";
import {StoredJson} from "../../domain/StoredJson";

/**
 *
 * @decorator
 * @param produces
 */
export function Produces(...produces: string[]) {
  return (...args: any[]) => {
    const type = getDecoratorType(args, true);

    switch (type) {
      case DecoratorTypes.METHOD:
        const storedJson = StoredJson.from(...args);
        storedJson.operation!.produces(produces);
        break;
      case DecoratorTypes.CLASS:
        decorateMethodsOf(args[0], Produces(...produces));
        break;

      default:
        throw new UnsupportedDecoratorType(Produces, args);
    }
  };
}
