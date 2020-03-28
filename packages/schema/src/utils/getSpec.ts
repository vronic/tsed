import {Type} from "@tsed/core";
import {SpecTypes, StoredJson} from "@tsed/schema";
import {IJsonSerializerOptions} from "../interfaces";

export interface ISpecSerializerOptions extends IJsonSerializerOptions {
  paths?: any;
  rootPath?: string;
}

/**
 * Return the swagger or open spec for the given class
 * @param model
 * @param options
 */
export function getSpec(model: Type<any>, options: ISpecSerializerOptions = {}) {
  if (!options.spec || options.spec === SpecTypes.JSON) {
    options.spec = SpecTypes.SWAGGER;
  }

  return StoredJson.from(model).toJSONSpec({...options, root: false, spec: options.spec});
}
