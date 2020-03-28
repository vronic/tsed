import {IJsonSerializerOptions} from "../interfaces";
import {JsonMap} from "./JsonMap";

export interface IJsonBuilder {
  assign(obj?: any): this;

  toObject(options?: IJsonSerializerOptions): any;

  toJson(options?: IJsonSerializerOptions): any;
}

export type JsonGenericBuilder<T, K extends keyof T> = {
  [P in K]: (value: T[P]) => JsonGenericBuilder<T, keyof T>;
} &
  Map<string, any> &
  IJsonBuilder;

export interface IJsonBuilderHooks {
  [key: string]: Function;
}

export function JsonBuilder<T extends object>(
  hooks: IJsonBuilderHooks = {}
): new (obj?: Partial<T & any>) => JsonGenericBuilder<T, keyof T> {
  class Base extends JsonMap<T> {
    constructor(obj: Partial<T & any> = {}) {
      super(obj);

      return new Proxy<Base>(this, {
        getOwnPropertyDescriptor(target: any, p: PropertyKey): PropertyDescriptor | undefined {
          return Reflect.getOwnPropertyDescriptor(target, p);
        },

        has(target: any, p: PropertyKey): boolean {
          if (Reflect.has(target, p) || typeof p === "symbol") {
            return Reflect.has(target, p);
          }

          return target.has(p as any) !== undefined;
        },

        get(target: any, p: PropertyKey, receiver: any): any {
          if (Reflect.has(target, p) || typeof p === "symbol") {
            if (typeof target[p] === "function") {
              return (...args: any[]) => target[p](...args);
            }

            return target[p];
          }

          const hook = hooks[p] || ((v: any) => v);

          return (v: any) => {
            target.set(p as any, hook(v));

            return receiver;
          };
        },

        ownKeys(target: any): PropertyKey[] {
          return Array.from(target.keys());
        }
      });
    }
  }

  return Base as any;
}
