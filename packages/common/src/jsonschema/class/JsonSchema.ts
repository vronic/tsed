import {
  deepExtends,
  descriptorOf,
  Enumerable,
  isArray,
  isArrayOrArrayClass,
  isBoolean,
  isDate,
  isPrimitiveOrPrimitiveClass,
  nameOf,
  NotEnumerable,
  primitiveOf
} from "@tsed/core";
import {JSONSchema6, JSONSchema6Type, JSONSchema6TypeName} from "json-schema";

/**
 *
 * @type {string[]}
 */
export const JSON_TYPES = ["string", "number", "integer", "boolean", "object", "array", "null", "any"];
/**
 *
 * @type {string[]}
 */
export const AUTO_MAP_KEYS: string[] = [];
/**
 *
 * @type {any[]}
 */
export const EXCLUDED_KEYS: string[] = [];

/**
 * Internal use only.
 * @returns {Function}
 * @decorator
 * @private
 * @param target
 * @param propertyKey
 */
function AutoMapKey(target: any, propertyKey: string): any {
  AUTO_MAP_KEYS.push(propertyKey);

  const descriptor = descriptorOf(target, propertyKey) || {configurable: true, writable: true};
  descriptor.enumerable = true;

  return descriptor;
}

function Exclude(target: any, propertyKey: string): any {
  EXCLUDED_KEYS.push(propertyKey);
}

export interface IJsonSchema extends JSONSchema6 {
  [key: string]: any;

  /**
   *
   * @returns {any}
   */
  toObject(): any;

  /**
   *
   * @returns {any}
   */
  toJSON(): any;
}

export interface IJsonSchemaCollection {
  [key: string]: IJsonSchema;
}
export class JsonSchema implements JSONSchema6 {
  @Exclude
  @NotEnumerable()
  private _refName: string;

  @Exclude
  @NotEnumerable()
  private _isCollection: boolean;
  /**
   *
   * @type {string}
   */
  @Enumerable()
  $id: string;

  @Exclude
  @NotEnumerable()
  private _type: JSONSchema6TypeName | JSONSchema6TypeName[];

  @Enumerable()
  id: string;

  @AutoMapKey
  $ref: string;

  @Enumerable()
  $schema: any;

  @Enumerable()
  title: string;

  @Enumerable()
  description: string;

  @Enumerable()
  default: JSONSchema6Type;

  @Enumerable()
  additionalItems: boolean | JSONSchema6;

  @Enumerable() private _items: IJsonSchema;

  @Enumerable()
  maxItems: number;

  @Enumerable()
  minItems: number;

  @Enumerable()
  uniqueItems: boolean;

  @Enumerable()
  maxProperties: number;

  @Enumerable()
  minProperties: number;

  @Enumerable()
  required: any | string[];

  @Enumerable()
  _properties: {[key: string]: JSONSchema6};

  @Enumerable()
  _additionalProperties: JsonSchema;

  @Enumerable()
  _definitions: {[p: string]: JSONSchema6};

  @Enumerable()
  _patternProperties: {[p: string]: JSONSchema6};

  @Enumerable()
  _dependencies: {[p: string]: JSONSchema6 | string[]};

  @Enumerable()
  _allOf: JSONSchema6[];

  @Enumerable()
  _anyOf: JSONSchema6[];

  @Enumerable()
  _oneOf: JSONSchema6[];

  @Enumerable()
  _not: JSONSchema6;

  @Enumerable()
  extends: string | string[];

  @AutoMapKey
  multipleOf: number;

  @AutoMapKey
  maximum: number;

  @AutoMapKey
  exclusiveMaximum: number;

  @AutoMapKey
  minimum: number;

  @AutoMapKey
  exclusiveMinimum: number;

  @AutoMapKey
  maxLength: number;

  @AutoMapKey
  minLength: number;

  @AutoMapKey
  pattern: string;

  @AutoMapKey
  format: string;

  @AutoMapKey
  enum: JSONSchema6Type[];

  @Exclude private _proxy: any;

  [key: string]: any;

  constructor(obj: any = {}) {
    this._proxy = new Proxy<JsonSchema>(this, {
      set(schema: JsonSchema, propertyKey: any, value: any) {
        schema.mapValue(propertyKey, value);

        return true;
      }
    } as any);

    this.merge(obj);
  }

  /**
   * May only be defined when "items" is defined, and is a tuple of JSONSchemas.
   *
   * This provides a definition for additional items in an array instance
   * when tuple definitions of the items is provided.  This can be false
   * to indicate additional items in the array are not allowed, or it can
   * be a schema that defines the schema of the additional items.
   *
   * @see https://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.6
   * @returns {boolean | JSONSchema6}
   */
  get additionalItems(): boolean | IJsonSchema {
    return this._additionalItems;
  }

  /**
   *
   * @param {boolean | JSONSchema6} value
   */
  set additionalItems(value: boolean | IJsonSchema) {
    if (isBoolean(value)) {
      this._additionalItems = value as boolean;
    } else {
      this._additionalItems = JsonSchema.from(value);
    }
  }

  /**
   *
   * @returns {JsonSchema}
   */
  get additionalProperties(): any | IJsonSchema {
    return this._additionalProperties;
  }

  /**
   *
   * @param {JsonSchema} value
   */
  set additionalProperties(value: any) {
    this._additionalProperties = JsonSchema.from(value);
  }

  /**
   *
   * @returns {IJsonSchemaCollection}
   */
  get properties(): IJsonSchemaCollection {
    return this._properties;
  }

  /**
   *
   * @param value
   */
  set properties(value: IJsonSchemaCollection) {
    const obj: any = {};
    Object.keys(value).forEach(key => {
      obj[key] = JsonSchema.from(value[key]);
    });

    this._properties = obj;
  }

  /**
   *
   * @returns {IJsonSchema}
   */
  get not(): IJsonSchema {
    return this._not;
  }

  /**
   *
   * @param {IJsonSchema} value
   */
  set not(value: IJsonSchema) {
    this._not = JsonSchema.from(value);
  }

  /**
   *
   * @returns {IJsonSchema[]}
   */
  @AutoMapKey
  get oneOf(): IJsonSchema[] {
    return this._oneOf;
  }

  /**
   *
   * @param {IJsonSchema[]} value
   */
  set oneOf(value: IJsonSchema[]) {
    this._oneOf = value.map(item => JsonSchema.from(item));
  }

  /**
   *
   * @returns {IJsonSchema[]}
   */
  get anyOf(): IJsonSchema[] {
    return this._anyOf;
  }

  /**
   *
   * @param {IJsonSchema[]} value
   */
  set anyOf(value: IJsonSchema[]) {
    this._anyOf = value.map(item => JsonSchema.from(item));
  }

  /**
   *
   * @returns {IJsonSchema[]}
   */
  get allOf(): IJsonSchema[] {
    return this._allOf;
  }

  /**
   *
   * @param {IJsonSchema[]} value
   */
  set allOf(value: IJsonSchema[]) {
    this._allOf = value.map(item => JsonSchema.from(item));
  }

  /**
   *
   * @returns {Object}
   */
  get dependencies(): {[p: string]: IJsonSchema | string[]} {
    return this._dependencies;
  }

  /**
   *
   * @param {Object} value
   */
  set dependencies(value: {[p: string]: IJsonSchema | string[]}) {
    const obj: any = {};
    Object.keys(value).forEach(key => {
      obj[key] = JsonSchema.from(value[key]);
    });

    this._dependencies = obj;
  }

  /**
   *
   * @returns {Object}
   */
  get patternProperties(): IJsonSchemaCollection {
    return this._patternProperties;
  }

  /**
   *
   * @param {Object} value
   */
  set patternProperties(value: IJsonSchemaCollection) {
    const obj: any = {};
    Object.keys(value).forEach(key => {
      obj[key] = JsonSchema.from(value[key]);
    });

    this._patternProperties = obj;
  }

  /**
   *
   * @returns {IJsonSchemaCollection}
   */
  get definitions(): IJsonSchemaCollection {
    return this._definitions;
  }

  /**
   *
   * @param {IJsonSchemaCollection} value
   */
  set definitions(value: IJsonSchemaCollection) {
    const obj: any = {};
    Object.keys(value).forEach(key => {
      obj[key] = JsonSchema.from(value[key]);
    });

    this._definitions = obj;
  }

  /**
   *
   * @returns {IJsonSchema}
   */
  get items(): IJsonSchema {
    return this._items;
  }

  /**
   *
   * @param {IJsonSchema} value
   */
  set items(value: IJsonSchema) {
    this._items = JsonSchema.from(value);
  }

  /**
   *
   * @returns {JSONSchema6}
   */
  @NotEnumerable()
  get mapper(): IJsonSchema {
    return this._proxy;
  }

  /**
   *
   * @returns {any | JSONSchema6TypeName | JSONSchema6TypeName[]}
   */
  get type(): any | JSONSchema6TypeName | JSONSchema6TypeName[] {
    return this._type;
  }

  /**
   *
   * @param {any | JSONSchema6TypeName | JSONSchema6TypeName[]} value
   */
  @Enumerable()
  set type(value: any | JSONSchema6TypeName | JSONSchema6TypeName[]) {
    if (value) {
      if (isArray(value)) {
        value = [].concat(value).map(item => ({type: item}));

        this.oneOf = value as IJsonSchema[];
      } else {
        this._refName = nameOf(value);
        this._type = JsonSchema.getJsonType(value);
      }
    } else {
      delete this._refName;
      delete this._type;
    }
  }

  /**
   *
   * @returns {string}
   */
  get refName() {
    return this._refName;
  }

  /**
   *
   * @returns {boolean}
   */
  get isCollection(): boolean {
    return this._isCollection;
  }

  /**
   *
   * @returns {boolean}
   */
  get isArray(): boolean {
    return this.type === "array";
  }

  /**
   *
   * @returns {"collection" | JSONSchema6TypeName | JSONSchema6TypeName[]}
   */
  get schemaType(): "collection" | JSONSchema6TypeName | JSONSchema6TypeName[] {
    if (this.isCollection) {
      if (!this.isArray) {
        return "collection";
      }
    }

    return this.type;
  }

  /**
   * Write value on the right place according to the schema type
   */
  mapValue(key: string, value: any) {
    switch (this.schemaType) {
      case "collection":
        (this.additionalProperties as any)[key] = value;
        break;
      case "array":
        console.log(key, value);
        this.items[key] = value;
        break;
      default:
        this[key] = value;
    }
  }

  /**
   *
   * @param collectionType
   */
  toCollection(collectionType: any) {
    this._isCollection = true;

    if (isArrayOrArrayClass(collectionType)) {
      this._items = this._items || new JsonSchema();
      console.log("===>", this._type);
      if (this._type) {
        this._items.type = this._type;
      }
      this._type = "array";

      this.forwardKeysTo(this, "_items");
    } else {
      this._additionalProperties = new JsonSchema();
      this._additionalProperties.type = this._type;
      delete this._type;

      this.forwardKeysTo(this, "_additionalProperties");
    }
  }

  /**
   *
   * @param instance
   * @param {string} property
   */
  private forwardKeysTo(instance: any, property: string) {
    AUTO_MAP_KEYS.forEach(key => {
      if (instance[key]) {
        instance[property][key] = instance[key];
        instance[`_${key}`] = undefined;
        delete instance[key];
      }
    });
  }

  /**
   *
   * @returns {{}}
   */
  toJSON() {
    const clone = (input: any): any => {
      if (input === undefined) {
        return input;
      }

      if (isPrimitiveOrPrimitiveClass(input)) {
        return input;
      }

      if (input instanceof JsonSchema && input !== this) {
        return input.toJSON();
      }

      const obj: any = isArray(input) ? [] : {};

      for (const key in input) {
        const propertyKey = key.replace("_", "");

        if (EXCLUDED_KEYS.indexOf(key) === -1 && typeof input[propertyKey] !== "function") {
          const value: any = input[propertyKey];

          if (value !== undefined) {
            obj[propertyKey] = clone(value);
          }
        }
      }

      return obj;
    };

    return clone(this);
  }

  /**
   *
   * @returns {any}
   */
  toObject() {
    return JSON.parse(JSON.stringify(this.toJSON()));
  }

  /**
   *
   * @param obj
   */
  merge(obj: any): this {
    const newJsonSchema = (collection: any[], value: JSONSchema6) => {
      collection.push(new JsonSchema(value));

      return collection;
    };

    deepExtends(this, obj, {
      oneOf: newJsonSchema,
      allOf: newJsonSchema,
      anyOf: newJsonSchema
    });

    return this;
  }

  /**
   *
   * @param value
   * @returns {JSONSchema6TypeName | JSONSchema6TypeName[]}
   */
  static getJsonType(value: any): JSONSchema6TypeName | JSONSchema6TypeName[] {
    if (isPrimitiveOrPrimitiveClass(value)) {
      if (JSON_TYPES.indexOf(value as string) > -1) {
        return value;
      }

      return primitiveOf(value);
    }

    if (isArrayOrArrayClass(value)) {
      if (value !== Array) {
        return value;
      }

      return "array";
    }

    if (isDate(value)) {
      return "string";
    }

    return "object";
  }

  /**
   *
   * @param type
   * @returns {JSONSchema6}
   */
  static ref(type: any): JsonSchema {
    return new JsonSchema({
      $ref: `#/definitions/${nameOf(type)}`
    });
  }

  /**
   *
   * @param value
   * @returns {JsonSchema}
   */
  static from(value: any): JsonSchema {
    return value instanceof JsonSchema ? value : new JsonSchema(value);
  }
}
