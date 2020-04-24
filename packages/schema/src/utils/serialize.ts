import {isArray, Store} from "@tsed/core";
import {IJsonSerializerOptions} from "../interfaces";

function getStoredJson(value: any) {
  return Store.from(value.class).get("StoredJson");
}

export function createRef(value: any, options: IJsonSerializerOptions = {}) {
  const storedJson = getStoredJson(value);
  const name = storedJson.schema.getName() || value.getName();

  if (value.nestedGenerics && value.nestedGenerics.length) {
    const [genericTypes, ...nestedGenerics] = value.nestedGenerics;

    return serialize(storedJson.schema, {
      ...options,
      root: false,
      nestedGenerics,
      genericTypes
    });
  }

  if (options.schemas && !options.schemas[name]) {
    options.schemas[name] = {}; // avoid infinite calls
    options.schemas[name] = serialize(
      storedJson.schema,
      mapGenerics({
        ...options,
        // genericLabels: storedJson.schema.genericLabels,
        root: false
      })
    );
  }

  return {
    $ref: `#/${options.spec === "openapi3" ? "components/schemas" : "definitions"}/${name}`
  };
}

export function serializeItem(value: any, options: IJsonSerializerOptions) {
  if (value && value.isClass) {
    return createRef(value, {...options, root: false});
  }

  return serialize(value, {...options, root: false});
}

function getGenericsMap(genericLabels: any, genericTypes: any) {
  return genericLabels.reduce((map: Map<string, any>, item: string, index: number) => map.set(item, genericTypes[index]), new Map());
}

function mapGenerics(options: IJsonSerializerOptions) {
  const {genericLabels, genericTypes, ...ops} = options;

  if (genericLabels && genericTypes) {
    const generics = getGenericsMap(genericLabels, genericTypes);

    return {
      ...ops,
      generics
    };
  }

  return options;
}

export function serialize(input: any, options: IJsonSerializerOptions = {}) {
  options.schemas = options.schemas || {};

  if (typeof input !== "object" || input === null) {
    return input;
  }

  if ("toJSON" in input) {
    return input.toJSON(mapGenerics(options));
  }

  return Object.entries(input).reduce<any>(
    (obj, [key, value]: any[]) => {
      if (isProp(key, value) && !shouldIgnore(value)) {
        obj[key] = serializeItem(value, options);
      }

      return obj;
    },
    isArray(input) ? [] : {}
  );
}

export function serializeGenerics(obj: any, options: any) {
  const {generics} = options;

  if (generics && obj.$ref) {
    if (generics.has(obj.$ref)) {
      const model = {
        class: generics.get(obj.$ref)
      };
      if (options.nestedGenerics.length === 0) {
        return createRef(model, {
          ...options,
          generics: undefined
        });
      }

      const storedJson = getStoredJson(model);
      const [genericTypes, ...nestedGenerics] = options.nestedGenerics;

      return storedJson.schema.toJSON({
        ...options,
        nestedGenerics,
        genericTypes,
        root: false
      });
    }
  }

  return obj;
}

function shouldIgnore(value: any) {
  return !!(value && value._ignore);
}

function isProp(key: string, value: any) {
  return !key.match(/^_/) && typeof value !== "function";
}
