import {IJsonMediaType, IJsonExample} from "../interfaces";
import {JsonMap} from "./JsonMap";
import {JsonSchema} from "./JsonSchema";

export interface IJsonRequestBodyOptions {
  description?: string;
  content: {
    [media: string]: JsonSchema;
  };
  required?: boolean;
}

export class JsonRequestBody extends JsonMap<IJsonRequestBodyOptions> {
  constructor(obj: Partial<IJsonRequestBodyOptions> = {}) {
    super(obj);

    this.content(obj.content || ({} as any));
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

  addContent(mediaType: string, schema: JsonSchema) {
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

  required(required: boolean): this {
    this.set("required", required);

    return this;
  }

  example(example: any): this {
    this.set("example", example);

    return this;
  }

  examples(examples: {[name: string]: IJsonExample}): this {
    this.set("examples", examples);

    return this;
  }
}
