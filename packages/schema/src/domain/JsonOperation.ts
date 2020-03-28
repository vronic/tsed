import {IJsonSerializerOptions} from "../interfaces";
import {JsonMap} from "./JsonMap";
import {JsonParameter} from "./JsonParameter";
import {JsonParameterTypes} from "./JsonParameterTypes";
import {JsonRequestBody} from "./JsonRequestBody";
import {JsonResponse} from "./JsonResponse";
import {JsonSchema} from "./JsonSchema";
import {SpecTypes} from "./SpecTypes";

function uniq(required: any | string[]) {
  return Array.from(new Set(required).values());
}

export interface IJsonMethodPath {
  path: string | RegExp;
  method: string;
}

export interface IJsonOperationOptions {
  tags: string[];
  summary: string;
  description: string;
  consumes: string[];
  produces: string[];
  // externalDocs: IJsonExternalDocumentationObject;
  // operationId: string;
  parameters: JsonParameter[];
  // requestBody?: ReferenceObject | RequestBodyObject;
  responses: any;
  // callbacks?: {[callback: string]: ReferenceObject | CallbackObject};
  deprecated: boolean;
  // security?: SecurityRequirementObject[];
  // servers?: ServerObject[];
}

export class JsonOperation extends JsonMap<IJsonOperationOptions> {
  private _status: Number;
  private _methodPaths: Map<string, IJsonMethodPath> = new Map();

  constructor(obj: Partial<IJsonOperationOptions> = {}) {
    super({parameters: [], responses: new JsonMap(), ...obj});
  }

  get methodsPaths() {
    return this._methodPaths;
  }

  tags(tags: string[]): this {
    super.set("tags", tags);

    return this;
  }

  summary(summary: string): this {
    super.set("summary", summary);

    return this;
  }

  name(name: string): this {
    super.set("name", name);

    return this;
  }

  responses(responses: JsonMap<any>): this {
    super.set("responses", responses);

    return this;
  }

  defaultStatus(status: number) {
    this._status = this._status || status;
  }

  addResponse(statusCode: number, response: JsonResponse) {
    this.get("responses").set(statusCode, response);
  }

  security(security: any[]): this {
    super.set("security", security);

    return this;
  }

  description(description: string): this {
    super.set("description", description);

    return this;
  }

  parameters(parameters: JsonParameter[]): this {
    super.set("parameters", parameters);

    return this;
  }

  addParameter(index: number, parameter: JsonParameter) {
    this.get("parameters")[index] = parameter;
  }

  consumes(consumes: string[]): this {
    super.set("consumes", consumes);

    return this;
  }

  produces(produces: string[]): this {
    super.set("produces", produces);

    return this;
  }

  addProduce(produce: string) {
    const produces = uniq([].concat(this.get("produces"), produce as never)).filter(Boolean);

    this.set("produces", produces);
  }

  addMethodPath(method: string, path: string | RegExp) {
    this._methodPaths.set(String(method) + String(path), {
      method,
      path
    });

    return this;
  }

  toJSON(options: IJsonSerializerOptions = {}): any {
    const operation = super.toJSON(options);
    const bodyParameters: JsonParameter[] = [];
    const parameters: any[] = [];

    this.get("parameters").forEach((parameter: JsonParameter) => {
      if (parameter.get("in")) {
        if (parameter.get("in") === JsonParameterTypes.BODY) {
          bodyParameters.push(parameter);
        } else {
          parameters.push(parameter.toJSON(options));
        }
      }
    });

    operation.parameters = parameters;

    if (this.get("responses").size === 0) {
      operation.responses = {
        "200": {
          description: ""
        }
      };
    }

    const {schema, required} = buildSchemaFromBodyParameters(bodyParameters);

    if (bodyParameters.length) {
      if (options.spec === SpecTypes.OPENAPI) {
        const requestBody = new JsonRequestBody({
          required
        });

        const consumes = this.get("consumes").length ? this.get("consumes") : ["application/json"];

        consumes.forEach((consume: string) => {
          requestBody.addContent(consume, schema);
        });

        operation.requestBody = requestBody.toJSON(options);
      } else {
        const bodyParam = new JsonParameter({
          in: JsonParameterTypes.BODY,
          name: JsonParameterTypes.BODY,
          schema,
          required
        });

        operation.parameters.push(bodyParam.toJSON(options));
      }
    }

    if (options.spec === SpecTypes.OPENAPI) {
      delete operation.consumes;
      delete operation.produces;
    }

    return operation;
  }
}

function buildSchemaFromBodyParameters(parameters: JsonParameter[]) {
  let schema = new JsonSchema();
  const refs: JsonSchema[] = [];
  let propsLength = 0;
  let required = false;

  parameters.forEach(parameter => {
    const name = parameter.get("name");

    if (name) {
      schema.addProperties(name, parameter.get("schema") as JsonSchema);
      if (parameter.get("required")) {
        schema.addRequired(name);
        required = true;
      }
      propsLength++;
    } else {
      refs.push(parameter.get("schema"));

      if (parameter.get("required")) {
        required = true;
      }
    }
  });

  if (propsLength) {
    schema.type("object");
  } else if (refs.length === 1) {
    schema = refs[0];
  }

  if (refs.length >= 2) {
    schema.allOf(refs);
  }

  return {schema, required};
}
