import {DecoratorTypes, getDecoratorType, UnsupportedDecoratorType} from "@tsed/core";
import {StoredJson} from "../../domain/StoredJson";

/**
 *
 * @decorator
 * @param produces
 */
export function ReturnsArray(...produces: string[]) {
  return (...args: any[]) => {
    const type = getDecoratorType(args, true);

    if (type === DecoratorTypes.METHOD) {
      const storedJson = StoredJson.from(...args);

      if (storedJson.operation) {
        storedJson.operation.produces(produces);
      }
    }
    throw new UnsupportedDecoratorType(ReturnsArray, args);
  };
}
