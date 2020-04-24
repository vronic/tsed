import {DecoratorParameters} from "@tsed/core";
import {StoredJson} from "../../domain";

/**
 *
 * @param fn
 * @constructor
 */
export function StoredJsonFn(fn: (storedJson: StoredJson, parameters: DecoratorParameters) => void): any {
  return (...parameters: DecoratorParameters) => {
    const result: any = fn(StoredJson.from(...parameters), parameters);
    if (typeof result === "function") {
      result(...parameters);
    }
  };
}
