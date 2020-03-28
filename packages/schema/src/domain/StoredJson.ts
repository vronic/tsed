import {
  DecoratorTypes,
  descriptorOf,
  getDecoratorType,
  isArrayOrArrayClass,
  isClass,
  isCollection,
  isDate,
  isObject,
  isPrimitiveOrPrimitiveClass,
  nameOf,
  Store,
  Type
} from "@tsed/core";
import {IJsonSerializerOptions} from "../interfaces";
import {buildPath} from "../utils/buildPath";
import {getJsonPathParameters} from "../utils/getJsonPathParameters";
import {JsonOperation} from "./JsonOperation";
import {JsonParameter} from "./JsonParameter";
import {JsonSchema} from "./JsonSchema";
import {SpecTypes} from "./SpecTypes";

export interface IStoredJsonOptions {
  target: Type<any>;
  propertyKey?: string | symbol;
  index?: number;
  descriptor?: any;
  type?: Type<any>;
  collectionType?: Type<any>;
}

function concatParameters(parameters: any[], operation: any) {
  return parameters
    .map(param => {
      const f = operation.parameters.find((p: any) => p.in === param.in && p.name === param.name);

      return f || param;
    })
    .concat(...operation.parameters.filter((param: any) => param.in !== "path"));
}

function mergeOperation(obj: any, operation: any, {rootPath, path, method}: any) {
  return getJsonPathParameters(rootPath, path).reduce((obj, {path, parameters}) => {
    parameters = concatParameters(parameters, operation);
    path = !!path ? path : "/";

    obj.paths[path] = {
      ...obj.paths[path],
      [method.toLowerCase()]: {
        ...operation,
        parameters
      }
    };

    return obj;
  }, obj);
}

const getSchema = (type: any) =>
  isClass(type)
    ? StoredJson.from(type).schema
    : JsonSchema.from({
        type
      });

export class StoredJson implements IStoredJsonOptions {
  readonly target: Type<any>;
  readonly propertyKey: string | symbol | undefined;
  readonly index: number | undefined;
  readonly descriptor: number | undefined;
  readonly decoratorType: DecoratorTypes;
  readonly propertyName: string;
  readonly children: StoredJson[] = [];
  /**
   * Type of the collection (Array, Map, Set, etc...)
   */
  public collectionType: Type<any>;
  public path: string = "/";
  protected _type: Type<any>;
  protected _schema: JsonSchema;
  protected _operation: JsonOperation;
  protected _parameter: JsonParameter;

  protected constructor({target, propertyKey, index, descriptor}: IStoredJsonOptions) {
    this.target = target;
    this.propertyKey = propertyKey;
    this.descriptor = descriptor;
    this.index = index;
    this.propertyName = String(index !== undefined ? index : propertyKey);
    this.decoratorType = getDecoratorType([target, propertyKey, descriptor || index]);
    this.build();
  }

  get schema(): JsonSchema {
    return this._schema;
  }

  get operation(): JsonOperation | undefined {
    return this._operation;
  }

  get parameter(): JsonParameter | undefined {
    return this._parameter;
  }

  /**
   *
   * @returns {Type<any>}
   */
  get type(): Type<any> {
    return this._type;
  }

  /**
   *
   * @param value
   */
  set type(value: Type<any>) {
    this._type = value;
    this.build();
  }

  /**
   * Return the class name of the entity.
   * @returns {string}
   */
  get targetName(): string {
    return nameOf(this.target);
  }

  /**
   *
   * @returns {string}
   */
  get typeName(): string {
    return nameOf(this._type);
  }

  /**
   *
   * @returns {string}
   */
  get collectionName(): string {
    return this.collectionType ? nameOf(this.collectionType) : "";
  }

  /**
   *
   * @returns {boolean}
   */
  get isCollection(): boolean {
    return !!this.collectionType;
  }

  /**
   *
   * @returns {boolean}
   */
  get isArray() {
    return isArrayOrArrayClass(this.collectionType);
  }

  /**
   *
   * @returns {boolean}
   */
  get isPrimitive() {
    return isPrimitiveOrPrimitiveClass(this._type);
  }

  /**
   *
   * @returns {boolean}
   */
  get isDate() {
    return isDate(this.type);
  }

  /**
   *
   * @returns {boolean}
   */
  get isObject() {
    return isObject(this.type);
  }

  get isClass() {
    return isClass(this.type);
  }

  get itemSchema(): JsonSchema {
    return this.isCollection ? this.schema.itemSchema() : this.schema;
  }

  get parentSchema(): JsonSchema {
    return this.parent.schema;
  }

  get parent(): StoredJson {
    const {target, propertyKey, decoratorType} = this;

    switch (decoratorType) {
      case DecoratorTypes.PARAM:
        return StoredJson.fromMethod(target, propertyKey as string);
      case DecoratorTypes.METHOD:
      case DecoratorTypes.PROP:
        return StoredJson.from(target);
    }

    return this;
  }

  /**
   *
   * @param args
   */
  static from(...args: any[]): StoredJson {
    const store = Store.from(...args);

    if (!store.has(StoredJson)) {
      const storedSchema = new StoredJson({
        target: args[0],
        propertyKey: args[1],
        index: typeof args[2] === "number" ? args[2] : undefined,
        descriptor: typeof args[2] === "object" ? args[2] : undefined
      });

      store.set(StoredJson, storedSchema);
    }

    return store.get(StoredJson);
  }

  static fromMethod(target: any, propertyKey: string | symbol) {
    return this.from(target, propertyKey, descriptorOf(target, propertyKey));
  }

  public toJSON(options: IJsonSerializerOptions = {}) {
    switch (options.spec) {
      case SpecTypes.OPENAPI:
      case SpecTypes.SWAGGER:
        return this.toJSONSpec({...options, root: false});

      default:
        return this.schema.toJSON({...options, schemas: {}});
    }
  }

  public toJSONSpec(options: IJsonSerializerOptions = {}) {
    const {spec = SpecTypes.SWAGGER, schemas = {}, paths = {}, rootPath = "/"} = options;

    const specJson: any = this.children.reduce(
      (obj, storedJson) => {
        if (!storedJson.operation) {
          return obj;
        }

        const operation = storedJson.operation.toJSON({...options, spec, schemas});

        storedJson.operation!.methodsPaths.forEach(({path, method}) => {
          if (method) {
            mergeOperation(obj, operation, {rootPath: buildPath(rootPath + this.path), path, method});
          }
        });

        return obj;
      },
      {paths}
    );

    if (spec === SpecTypes.OPENAPI) {
      specJson.components = {
        schemas
      };
    } else {
      specJson.definitions = schemas;
    }

    return specJson;
  }

  protected build() {
    if (!this._type) {
      let type: any;

      switch (this.decoratorType) {
        case DecoratorTypes.PARAM:
          type = Store.getParamTypes(this.target, this.propertyKey)[this.index!] || Object;
          break;
        case DecoratorTypes.CLASS:
          type = this.target;
          break;
        case DecoratorTypes.PROP:
          type = Store.getType(this.target, this.propertyKey);
          break;
        case DecoratorTypes.METHOD:
          type = Store.getReturnType(this.target, this.propertyKey);
      }

      if (isCollection(type)) {
        this.collectionType = type;
      } else {
        this._type = type;
      }
    }

    this._type = this._type || Object;

    switch (this.decoratorType) {
      default:
        this._schema = JsonSchema.from();
        break;

      case DecoratorTypes.CLASS:
        this._schema = JsonSchema.from({
          type: this.type
        });
        break;
      case DecoratorTypes.METHOD:
        this._operation = this.createOperation();
        break;
      case DecoratorTypes.PARAM:
        this._parameter = this.createParameter();
        break;
      case DecoratorTypes.PROP:
        this._schema = this.createProperty();
        break;
    }
  }

  protected createProperty(): any {
    const parentStoredSchema = this.parent;

    const properties = parentStoredSchema.schema.get("properties");

    let schema: JsonSchema = properties[this.propertyName];

    if (!schema) {
      parentStoredSchema.children.push(this);

      schema = JsonSchema.from({
        type: this.collectionType || this.type
      });

      if (this.collectionType) {
        schema.itemSchema(this.type);
      }
    }

    parentStoredSchema.schema.addProperties(this.propertyName, schema);

    return schema;
  }

  protected createOperation(): JsonOperation {
    const parentStoredSchema = this.parent;
    const properties = parentStoredSchema.schema.get("properties");

    let operation: JsonOperation = properties[this.propertyName];

    if (!operation) {
      operation = new JsonOperation();
      parentStoredSchema.children.push(this);
    }

    // response schema of the method
    this._schema = new JsonSchema();

    parentStoredSchema.schema.addProperties(this.propertyName, this.schema);

    return operation;
  }

  protected createParameter(): JsonParameter {
    const methodStoredSchema = this.parent;
    methodStoredSchema.children[this.index!] = this;

    const parameter = new JsonParameter();

    this._schema = getSchema(this.collectionType || this.type);

    parameter.schema(this._schema);

    if (this.collectionType) {
      this._schema.itemSchema(getSchema(this.type));
    }

    methodStoredSchema.operation!.addParameter(this.index as number, parameter);

    return parameter;
  }
}
