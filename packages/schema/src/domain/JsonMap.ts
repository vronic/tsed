import {IJsonSerializerOptions} from "../interfaces";
import {serializeItem} from "../utils/serialize";

export class JsonMap<T> extends Map<string, any> {
  constructor(obj: Partial<T> = {}) {
    super();

    this.assign(obj);
  }

  assign(obj: Partial<T> & any = {}) {
    if ("toObject" in obj) {
      obj = (obj as any).toObject();
    }

    Object.entries(obj).forEach(([key, value]) => {
      this.set(key, value);
    });

    return this;
  }

  toObject(options: IJsonSerializerOptions = {}) {
    return this.toJSON(options);
  }

  toJSON(options: IJsonSerializerOptions = {}) {
    return Array.from(this.entries()).reduce((obj: any, [key, value]) => {
      obj[key] = serializeItem(value, options);

      return obj;
    }, {});
  }
}
