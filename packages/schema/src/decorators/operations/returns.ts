import {DecoratorTypes, getDecoratorType, isCollection, isPrimitiveOrPrimitiveClass, Type, UnsupportedDecoratorType} from "@tsed/core";
import {JsonResponse} from "../../domain/JsonResponse";
import {StoredJson} from "../../domain/StoredJson";

export interface IReturnsChainedDecorators extends MethodDecorator {
  /**
   * Set a Content-Type for the current response
   * @param value
   * @constructor
   */
  ContentType(value: string): this;

  /**
   * Add a description
   * @param description
   */
  Description(description: string): this;

  /**
   * Add the nested types
   * @param generics
   */
  Of(...generics: (Type<any> | any)[]): this;

  /**
   *
   * @param generics
   * @constructor
   */
  Nested(...generics: (Type<any> | any)[]): this;

  [key: string]: any;
}

interface IReturnsActionContext {
  storedJson: StoredJson;
  status: number;
  contentType: string;
  response: JsonResponse;
  model: Type<any> | any;
}

interface IReturnsActionHandler {
  (ctx: IReturnsActionContext): void;
}

function initSchemaAction({status, model, response, storedJson}: IReturnsActionContext) {
  storedJson.type = model;

  const operation = storedJson.operation!;
  operation.defaultStatus(status);
  operation.addResponse(status, response);

  response.schema(storedJson.schema);
}

function setContentTypeAction({contentType, model, response, storedJson}: IReturnsActionContext) {
  const operation = storedJson.operation!;

  if (!isPrimitiveOrPrimitiveClass(model)) {
    contentType = "text/json";
  }

  contentType && operation.addProduce(contentType);
  response.addContent(contentType || "*/*", storedJson.schema);
}

function checkPrimitive(model: any) {
  if (isPrimitiveOrPrimitiveClass(model)) {
    throw new Error("Returns.Of cannot be used with the following primitive classes: String, Number, Boolean");
  }
}

function checkCollection(model: any) {
  if (isCollection(model)) {
    throw new Error("Returns.Nested cannot be used with the following classes: Map, Set, Array, String, Number, Boolean");
  }
}

/**
 *
 * @decorator
 * @param status
 * @param model
 */
export function Returns(status: number, model: Type<any> | any): IReturnsChainedDecorators {
  const response = new JsonResponse();
  let contentType: string;

  const actions: IReturnsActionHandler[] = [initSchemaAction, setContentTypeAction];

  const decorator = (...args: any[]) => {
    const type = getDecoratorType(args, true);

    if (type === DecoratorTypes.METHOD) {
      const storedJson = StoredJson.from(...args);

      if (storedJson.operation) {
        const ctx: IReturnsActionContext = {status, contentType, response, model, storedJson};

        actions.forEach((action: any) => {
          action(ctx);
        });
      }
    } else {
      throw new UnsupportedDecoratorType(Returns, args);
    }
  };

  decorator.ContentType = (value: string) => {
    contentType = value;

    return decorator;
  };

  decorator.Description = (description: string) => {
    response.description(description);

    return decorator;
  };

  decorator.Of = (...types: (Type<any> | any)[]) => {
    checkPrimitive(model);

    actions.push(ctx => {
      const {storedJson} = ctx;
      if (isCollection(model)) {
        // @ts-ignore
        storedJson._type = types[0];
        storedJson.itemSchema.assign({type: types[0]});
        // storedJson.schema.itemSchema(types[0]);
      } else {
        storedJson.schema.nestedGenerics.push(types);
      }
    });

    return decorator;
  };

  decorator.Nested = (...generics: (Type<any> | any)[]) => {
    checkPrimitive(model);
    checkCollection(model);

    actions.push(ctx => {
      const {storedJson} = ctx;
      storedJson.schema.nestedGenerics.push(generics);
    });

    return decorator;
  };

  // decorator.actions = actions;
  return decorator;
}
