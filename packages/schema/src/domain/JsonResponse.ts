import {IJsonHeader, IJsonMediaType, IJsonSerializerOptions} from "../interfaces";
import {JsonMap} from "./JsonMap";
import {JsonSchema} from "./JsonSchema";
import {SpecTypes} from "./SpecTypes";

export interface IJsonResponseOptions {
  description: string;
  headers: {[header: string]: IJsonHeader};
  content: {
    [media: string]: JsonSchema;
  };
  links: {[link: string]: any};
}

export class JsonResponse extends JsonMap<IJsonResponseOptions> {
  private _schema: JsonSchema;

  constructor(obj: Partial<IJsonResponseOptions> = {}) {
    super(obj);

    this.content(obj.content || ({} as any));
  }

  schema(schema: JsonSchema) {
    this._schema = schema;

    return this;
  }

  description(description: string): this {
    this.set("description", description);

    return this;
  }

  content(content: {[media: string]: IJsonMediaType}) {
    const newContent = Object.entries(content).reduce((content, [key, value]) => {
      content.set(key, new JsonMap(value));

      return content;
    }, new JsonMap<any>());

    this.set("content", newContent);

    return this;
  }

  addContent(mediaType: string, schema?: JsonSchema) {
    const content = this.get("content");
    const mediaContent = new JsonMap();

    mediaContent.set("schema", schema);

    content.set(mediaType, mediaContent);

    return this;
  }

  removeContent(mediaType: string) {
    this.get("content").delete(mediaType);

    return this;
  }

  toJSON(options: IJsonSerializerOptions = {}): any {
    const response = super.toJSON(options);

    if (options.spec !== SpecTypes.OPENAPI) {
      delete response.content;
      response.schema = this._schema.toJSON(options);
    }

    return response;
  }
}
