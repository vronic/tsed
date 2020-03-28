import {DecoratorTypes, getDecoratorType, UnsupportedDecoratorType} from "@tsed/core";
import {StoredJson} from "../../domain/StoredJson";

/**
 * Set controller path
 * @param path
 * @constructor
 */
export function Path(path: string) {
  return (...args: any[]) => {
    if (getDecoratorType(args, true) === DecoratorTypes.CLASS) {
      StoredJson.from(...args).path = path;
    } else {
      throw new UnsupportedDecoratorType(Path, args);
    }
  };
}
