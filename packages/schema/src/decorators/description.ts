import {DecoratorTypes, getDecoratorType, UnsupportedDecoratorType} from "@tsed/core";
import {StoredJson} from "../domain/StoredJson";
/**
 * Add a description to the class, method or property
 *
 * ## Examples
 * ### On class
 *
 * ```typescript
 * @Description("description")
 * class Model {
 *
 * }
 * ```
 *
 * ### On method
 *
 * ```typescript
 * @Controller("/")
 * class ModelCtrl {
 *    @Description("description")
 *    async method() {}
 * }
 * ```
 *
 * ### On parameter
 *
 * ```typescript
 * @Controller("/")
 * class ModelCtrl {
 *    async method(@Description("description") @PathParam("id") id: string) {}
 * }
 * ```
 *
 * ### On property
 *
 * ```typescript
 * class Model {
 *    @Description("description")
 *    id: string;
 * }
 * ```
 *
 * @param {string} description
 * @decorator
 * @swagger
 * @schema
 * @property
 * @class
 * @method
 * @parameter
 */
export function Description(description: any) {
  return (...args: any[]) => {
    switch (getDecoratorType(args, true)) {
      case DecoratorTypes.PROP:
      case DecoratorTypes.CLASS:
        StoredJson.from(...args).schema.description(description);
        break;

      case DecoratorTypes.PARAM:
        StoredJson.from(...args).parameter?.description(description);
        break;

      case DecoratorTypes.METHOD:
        StoredJson.from(...args).operation?.description(description);
        break;

      default:
        throw new UnsupportedDecoratorType(Description, args);
    }
  };
}
