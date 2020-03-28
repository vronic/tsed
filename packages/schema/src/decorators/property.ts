import {StoredJsonFn} from "./storedJsonFn";

export function Property(type?: any) {
  return StoredJsonFn(storedJson => {
    if (type) {
      storedJson.itemSchema.type(type);
    }
  });
}
