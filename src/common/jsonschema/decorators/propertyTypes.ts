import {PropertyMetadata} from "../class/PropertyMetadata";
import {PropertyRegistry} from "../registries/PropertyRegistry";

export const oneOf = Symbol("oneOf");

export function PropertyTypes(...types: any[]) {
  return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
    console.log("====>", types);
    propertyMetadata.types = types;
  });
}
