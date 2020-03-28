import {JsonSchema} from "../domain";

export interface IJsonHeader extends IJsonParameterBase {}

export interface IJsonExternalDocumentationObject {
  description?: string;
  url: string;
}

export interface IJsonParameterBase {
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
  schema?: JsonSchema;
  example?: any;
  examples?: {
    [name: string]: IJsonExample;
  };
  content?: {
    [media: string]: IJsonMediaType;
  };
}

export interface IJsonExample {
  summary?: string;
  description?: string;
  value?: any;
  externalValue?: string;
}

export interface IJsonEncoding {
  contentType?: string;
  headers?: {
    [header: string]: IJsonHeader;
  };
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

export interface IJsonMediaType {
  schema?: JsonSchema;
  example?: any;
  examples?: {
    [media: string]: IJsonExample;
  };
  encoding?: {[media: string]: IJsonEncoding};
}
