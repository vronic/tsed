import {applyDecorators, DecoratorTypes} from "@tsed/core";
import {StoredJson} from "../domain/StoredJson";
import {Property} from "./property";

function applyStringRule(storedJson: StoredJson, values: any[]) {
  if (storedJson.type === String) {
    if (!values.includes("")) {
      // Disallow empty string
      (!storedJson.schema.has("minLength") || storedJson.schema.get("minLength") === 0) && storedJson.schema.minLength(1);
    } else {
      storedJson.schema.delete("minLength");
    }
  }
}

function applyNullRule(storedJson: StoredJson, values: any[]) {
  if (values.includes(null)) {
    if (storedJson.schema.isClass) {
      const properties = storedJson.parent.schema.get("properties");

      if (properties && properties[storedJson.propertyKey as any]) {
        const propSchema = properties[storedJson.propertyKey as any];

        properties[storedJson.propertyKey as any] = {
          oneOf: [
            {
              type: "null"
            },
            propSchema
          ]
        };
      }
    } else {
      storedJson.schema.addTypes("null");
    }
  }
}

/**
 * Add allowed values when the property or parameters is required.
 *
 * #### Example on parameter:
 *
 * ```typescript
 * @Post("/")
 * async method(@Allow("") @BodyParams("field") field: string) {}
 * ```
 * > Required will throw a BadRequest when the given value is `null` or `undefined` but not for an empty string.
 *
 * #### Example on model:
 *
 * ```typescript
 * class Model {
 *   @Allow("")
 *   field: string;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 */
export function Allow(...values: any[]) {
  return applyDecorators(Property(), (...args: any[]) => {
    const storedJson = StoredJson.from(...args);

    switch (storedJson.decoratorType) {
      case DecoratorTypes.PARAM:
        storedJson.parameter!.required(true);
        break;
      default:
      case DecoratorTypes.PROP:
        storedJson.parentSchema.addRequired(storedJson.propertyName);

        applyStringRule(storedJson, values);
        applyNullRule(storedJson, values);
        break;
    }
  });
}
