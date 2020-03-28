import {expect} from "chai";
import {StoredJson} from "../domain/StoredJson";
import {ExclusiveMaximum} from "./exclusiveMaximum";

describe("@ExclusiveMaximum", () => {
  it("should declare exclusiveMaximum value", () => {
    // WHEN
    class Model {
      @ExclusiveMaximum(0, true)
      num: number;
    }

    // THEN
    const classSchema = StoredJson.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
      properties: {
        num: {
          exclusiveMaximum: 0,
          type: "number"
        }
      },
      type: "object"
    });
  });
});
