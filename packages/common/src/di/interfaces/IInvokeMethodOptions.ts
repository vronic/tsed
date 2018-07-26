import {Type} from "@tsed/core";

/**
 *
 */
export interface IInvokeMethodOptions<T> {
  target?: Type<T>;
  methodName?: string;
  deps?: any[];
}
