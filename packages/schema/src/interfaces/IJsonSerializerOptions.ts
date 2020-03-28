import {SpecTypes} from "../domain/SpecTypes";

export interface IJsonSerializerOptions {
  useAlias?: boolean;
  schemas?: any;
  root?: any;
  spec?: SpecTypes;

  [key: string]: any;
}
