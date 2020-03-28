import {DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {StoredJson} from "../../domain/StoredJson";

export function MethodPath(method: string, path: string | RegExp = "/") {
  return (...args: any[]) => {
    const storedJson = StoredJson.from(...args);

    if (storedJson.decoratorType === DecoratorTypes.METHOD) {
      const operation = storedJson.operation!;

      operation.addMethodPath(method, path);
    } else {
      throw new UnsupportedDecoratorType(MethodPath, args);
    }
  };
}
