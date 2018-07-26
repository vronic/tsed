import {Type} from "@tsed/core";
import {LocalsContainer} from "./LocalsContainer";
import {ProviderScope} from "./ProviderScope";
import {TokenProvider} from "./TokenProvider";

export interface IInvokeOptions<T> {
  target?: Type<T>;
  methodName?: string;
  deps: any[];
  scope: ProviderScope;
  useScope: boolean;
}

export interface IInvokeSettings {
  construct(deps: TokenProvider[]): any;

  token: TokenProvider;
  scope: ProviderScope;
  useScope: boolean;
  deps: any[];
}

export interface IInvokeMapService {
  dependency: TokenProvider;
  token: TokenProvider;
  locals: LocalsContainer;
  useScope: boolean;
  parentScope?: ProviderScope;
}
