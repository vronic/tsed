import {SpecTypes} from "@tsed/schema";
import {expect} from "chai";
import {getJsonSchema} from "../utils/getJsonSchema";
import {Name} from "./name";

describe("@Name", () => {
  it("should declare name as alias (props)", () => {
    // WHEN
    class Model {
      @Name("num2")
      num: number;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        num2: {
          type: "number"
        }
      },
      type: "object"
    });
  });
  it("should declare name on class", () => {
    // WHEN
    @Name("ModelName")
    class Model {}

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      type: "object"
    });

    expect(getJsonSchema(Model, {spec: SpecTypes.OPENAPI})).to.deep.equal({
      type: "object"
    });
  });
});
