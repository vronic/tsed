import {ancestorsOf, deepExtends, isClass, Registry, Store, Type} from "@tsed/core";
import {JSONSchema6} from "json-schema";
import {EntityDescription} from "../../../core/class/EntityDescription";
import {JsonSchema} from "../class/JsonSchema";

const JSON_SCHEMA_FIELDS = ["additionalItems", "items", "additionalProperties", "properties", "dependencies", "oneOf"];

const toObj = (o: any) => JSON.parse(JSON.stringify(o));

export class JsonSchemaRegistry extends Registry<any, Partial<JsonSchema>> {
  /**
   *
   * @returns {JsonSchema}
   * @param entity
   */
  createFromEntity(entity: EntityDescription): JsonSchema {
    if (!this.has(entity.target)) {
      this.merge(entity.target, {
        type: entity.target
      });
      Store.from(entity.target).set("schema", this.get(entity.target));
    }

    const schema = this.get(entity.target);
    schema.properties = schema.properties || {};

    if (entity.types && entity.types.length) {
      const subSchema = schema.properties[entity.propertyKey] || new JsonSchema();
      const oneOf = entity.types.map(type => JsonSchemaRegistry.createJsonSchema(new JsonSchema(), type));
      // if (entity.collectionType) {
      //  schema.properties[entity.propertyKey].toCollection(entity.collectionType);
      // }
      subSchema.type = undefined;
      schema.properties[entity.propertyKey].oneOf = oneOf;
    } else {
      schema.properties[entity.propertyKey] = JsonSchemaRegistry.createJsonSchema(
        schema.properties[entity.propertyKey],
        entity.type,
        entity.collectionType
      );
    }

    return schema.properties[entity.propertyKey];
  }

  /**
   *
   * @param schema
   * @param type
   * @param collectionType
   */
  private static createJsonSchema(schema: JsonSchema = new JsonSchema(), type: any, collectionType?: any): JsonSchema {
    if (isClass(type)) {
      schema = Object.keys(schema.toObject()).reduce((newSchema: any, key: string) => {
        if (!(key === "type" || key === "items" || key === "additionalProperties")) {
          newSchema[key] = schema[key];
        }

        return newSchema;
      }, JsonSchema.ref(type));
    } else {
      schema.type = type;
    }

    if (collectionType) {
      schema.toCollection(collectionType);
    }

    return schema!;
  }

  /**
   *
   * @param target
   * @param {string} propertyKey
   * @param value
   */
  required(target: any, propertyKey: string, value?: boolean) {
    const schema = this.get(target) || {};
    const required = schema.required || [];

    if (value !== undefined) {
      const index = required.indexOf(propertyKey);
      if (value && index === -1) {
        schema.required = [].concat(required, [propertyKey as never]);
      }
      if (!value && index > -1) {
        required.splice(required.indexOf(propertyKey), 1);
      }
    }

    return (schema.required || []).some((p: string) => p === propertyKey);
  }

  /**
   *
   * @param {Type<any>} target
   * @returns {JSONSchema6}
   */
  getSchemaDefinition(target: Type<any>): JSONSchema6 {
    return ancestorsOf(target).reduce((acc: JSONSchema6, target: Type<any>) => {
      deepExtends(acc, this.getSchema(target));

      return acc;
    }, {});
  }

  /**
   *
   * @param {Type<any>} target
   * @returns {JSONSchema6}
   */
  private getSchema(target: Type<any>) {
    const schemaDefinition: JSONSchema6 = {};
    const schema = this.get(target);

    if (schema) {
      deepExtends(schemaDefinition, toObj(schema));
    }

    schemaDefinition.definitions = {};

    this.findReferences(schemaDefinition, schemaDefinition.definitions as any);

    return schemaDefinition;
  }

  /**
   *
   * @param {JsonSchema} schema
   * @param definitions
   */
  private findReferences(schema: JSONSchema6, definitions: {[p: string]: JSONSchema6}): JSONSchema6 {
    if (schema.$ref) {
      return this.getRef(schema, definitions);
    }

    JSON_SCHEMA_FIELDS.forEach((key: string) => {
      const value: any = (schema as any)[key];
      if (value) {
        if (value.$ref) {
          return this.getRef(value, definitions);
        }

        Object.keys(value).forEach((index: any) => {
          this.findReferences(value[index], definitions);
        });
      }
    });

    return schema;
  }

  /**
   *
   * @param {JSONSchema4} schema
   * @param definitions
   * @returns {JSONSchema4}
   */
  private getRef(schema: JSONSchema6, definitions: {[p: string]: JSONSchema6}): JSONSchema6 {
    const schemaName = this.getRefName(schema.$ref!);
    const refSchema = this.getSchemaByName(schemaName);

    if (refSchema) {
      if (!definitions[schemaName]) {
        definitions[schemaName] = {};
        this.findReferences(refSchema!, definitions);
        definitions[schemaName] = refSchema.toObject();
      }
    } else {
      schema.type = "object";
      delete schema.$ref;
    }

    return schema;
  }

  /**
   *
   * @param {string} ref
   * @returns {string}
   */
  private getRefName(ref: string): string {
    return ref.replace("#/definitions/", "");
  }

  /**
   *
   * @param {string} name
   * @returns {JsonSchema}
   */
  private getSchemaByName(name: string): JsonSchema | undefined {
    let currentSchema;
    this.forEach(schema => {
      if (schema.refName === name) {
        currentSchema = schema;
      }
    });

    return currentSchema;
  }
}

// tslint:disable-next-line: variable-name
export const JsonSchemesRegistry = new JsonSchemaRegistry(JsonSchema);
