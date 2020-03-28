import {DecoratorTypes, getDecoratorType, isPrimitiveOrPrimitiveClass, Type, UnsupportedDecoratorType} from "@tsed/core";
import {JsonOperation} from "../domain/JsonOperation";
import {JsonResponse} from "../domain/JsonResponse";
import {StoredJson} from "../domain/StoredJson";

/**
 *
 * @decorator
 * @param status
 * @param model
 * @param contentType
 */
export function Returns(status: number, model: Type<any> | any, contentType?: string) {
  let operation: JsonOperation;

  if (!contentType) {
    if (!isPrimitiveOrPrimitiveClass(model)) {
      contentType = "text/json";
    }
  }

  const response = new JsonResponse();

  const decorator = (...args: any[]) => {
    const type = getDecoratorType(args, true);

    if (type === DecoratorTypes.METHOD) {
      const storedJson = StoredJson.from(...args);

      if (storedJson.operation) {
        operation = storedJson.operation;
        storedJson.schema.type(model);

        operation.defaultStatus(status);
        operation.addResponse(status, response);
        contentType && operation.addProduce(contentType);

        response.schema(storedJson.schema);
        response.addContent(contentType || "*/*", storedJson.schema);
      }
    } else {
      throw new UnsupportedDecoratorType(Returns, args);
    }
  };

  decorator.Description = (description: string) => {
    response.description(description);

    return decorator;
  };

  return decorator;
}
