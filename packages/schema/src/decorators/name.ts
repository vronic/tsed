import {DecoratorTypes, getDecoratorType} from "@tsed/core";
import {StoredJson} from "../domain/StoredJson";

/**
 * Add a name metadata on the decorated element.
 *
 * ## Examples
 * ### On parameters
 *
 * ```typescript
 * async myMethod(@Name("nameOf") @PathParams("id") id: string): Promise<Model>  {
 *
 * }
 * ```
 *
 * ### On parameters
 *
 * ```typescript
 * @Name("AliasName")
 * @Controller("/")
 * class ModelCtrl {
 *
 * }
 * ```
 *
 * @param name
 * @decorator
 * @schema
 * @class
 * @method
 * @property
 * @parameter
 */
export function Name(name: any) {
  return (...args: any[]) => {
    switch (getDecoratorType(args, true)) {
      case DecoratorTypes.CLASS:
        StoredJson.from(...args).schema.name(name);
        break;
      case DecoratorTypes.PARAM:
        StoredJson.from(...args).parameter!.name(name);
        break;
      default:
        StoredJson.from(...args).parent.schema.addAlias(args[1], name);
    }
  };
}
