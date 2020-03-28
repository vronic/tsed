import {DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonParameterTypes} from "../../domain/JsonParameterTypes";
import {StoredJson} from "../../domain/StoredJson";

/**
 *
 * @param inType
 * @decorator
 */
export function In(inType: JsonParameterTypes | string) {
  return (...args: any[]) => {
    const storedJson = StoredJson.from(...args);

    if (storedJson.decoratorType === DecoratorTypes.PARAM) {
      const parameter = storedJson.parameter!;

      parameter.in(inType);
    } else {
      throw new UnsupportedDecoratorType(In, args);
    }
  };
}
