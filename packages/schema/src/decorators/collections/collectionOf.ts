import {StoredJson} from "../../domain/StoredJson";

/**
 * Set the type of the item collection. The possible value is String, Boolean, Number, Date, Object, Class, etc...
 *
 * ```typescript
 * class Model {
 *    @CollectionOf(String).MinLength(0).MaxLength(0)
 *    property: string[];
 * }
 * ```
 * ::: warning
 * You musn't use the `type Type = string | number` as parameters Type.
 *
 * This example doesn't work:
 *
 * ```typescript
 * type Type = "string" | "number"
 * class Model {
 *    @PropertyType(Type)
 *    property: Type[];
 * }
 * ```
 * :::
 *
 * @param {Type<any>} type
 * @returns {Function}
 * @decorator
 * @schema
 */
export function CollectionOf(type: any) {
  const schema: any = {};
  let contains: boolean = false;

  const decorator = (...args: any) => {
    const storedJson = StoredJson.from(...args);
    storedJson.itemSchema.assign({type});
    storedJson.schema.assign(schema);

    if (storedJson.isArray && contains) {
      storedJson.schema.set("contains", storedJson.schema.get("items"));
      storedJson.schema.delete("items");
    }
  };

  decorator.MinItems = (minItems: number) => {
    schema.minItems = minItems;

    return decorator;
  };

  decorator.MaxItems = (maxItems: number) => {
    schema.maxItems = maxItems;

    return decorator;
  };
  decorator.MinProperties = (minProperties: number) => {
    schema.minProperties = minProperties;

    return decorator;
  };

  decorator.MaxProperties = (maxProperties: number) => {
    schema.maxProperties = maxProperties;

    return decorator;
  };

  decorator.Contains = () => {
    contains = true;

    return decorator;
  };

  return decorator;
}
