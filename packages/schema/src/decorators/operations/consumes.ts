import {decorateMethodsOf, DecoratorTypes, getDecoratorType, UnsupportedDecoratorType} from "@tsed/core";
import {StoredJson} from "../../domain/StoredJson";

/**
 *
 * @decorator
 * @param consumes
 */
export function Consumes(...consumes: string[]) {
  return (...args: any[]) => {
    const type = getDecoratorType(args, true);

    switch (type) {
      case DecoratorTypes.METHOD:
        const storedJson = StoredJson.from(...args);
        storedJson.operation!.consumes(consumes);
        break;
      case DecoratorTypes.CLASS:
        decorateMethodsOf(args[0], Consumes(...consumes));
        break;

      default:
        throw new UnsupportedDecoratorType(Consumes, args);
    }
  };
}
