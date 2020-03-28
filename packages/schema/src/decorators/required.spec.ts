import {expect} from "chai";
import {StoredJson} from "../domain/StoredJson";
import {Required} from "./required";

describe("@Required", () => {
  it("should declare required field", () => {
    // WHEN
    class Model {
      @Required()
      num: number;
    }

    // THEN
    const classSchema = StoredJson.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
      properties: {
        num: {
          type: "number"
        }
      },
      required: ["num"],
      type: "object"
    });
  });
});
