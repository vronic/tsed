import {IJsonSerializerOptions} from "../interfaces";
import {serializeItem} from "../utils/serialize";
import {JsonMap} from "./JsonMap";
import {JsonParameterTypes} from "./JsonParameterTypes";
import {JsonSchema} from "./JsonSchema";

export class IJsonParameterOptions {
  title: string;
  name: string;
  description: string;
  in: JsonParameterTypes | string;
  required: boolean;
  schema: JsonSchema;
}

export class JsonParameter extends JsonMap<IJsonParameterOptions> {
  title(title: string): this {
    this.set("title", title);

    return this;
  }

  name(name: string): this {
    this.set("name", name);

    return this;
  }

  description(description: string): this {
    this.set("description", description);

    return this;
  }

  in(inType: string): this {
    this.set("in", inType);

    return this;
  }

  required(required: boolean): this {
    this.set("required", required);

    return this;
  }

  schema(schema: JsonSchema): this {
    this.set("schema", schema);

    return this;
  }

  toJSON(options: IJsonSerializerOptions = {}) {
    const {type, schema: _, ...parameter} = super.toJSON(options);
    const schema: JsonSchema = this.get("schema");

    const jsonSchema = serializeItem(schema, options);

    if (!jsonSchema.$ref && (this.get("in") === "path" || Object.keys(jsonSchema).length === 1)) {
      parameter.type = jsonSchema.type;
    } else {
      parameter.schema = jsonSchema;
    }

    parameter.required = parameter.required || this.get("in") === "path";

    return parameter;
  }
}
