import {expect} from "chai";
import {CollectionOf} from "../decorators/collections/collectionOf";
import {Property} from "../decorators/property";
import {Required} from "../decorators/required";
import {getJsonSchema} from "./getJsonSchema";

describe("getJsonSchema", () => {
  it("should declare all schema correctly (basic)", () => {
    // WHEN
    class Model {
      @Property()
      @Required()
      prop1: string;

      @CollectionOf(String)
      prop2: string[];

      @CollectionOf(String)
      prop3: Set<string>;

      @CollectionOf(String)
      prop4: Map<string, string>;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      type: "object",
      required: ["prop1"],
      properties: {
        prop1: {
          minLength: 1,
          type: "string"
        },
        prop2: {
          type: "array",
          items: {
            type: "string"
          }
        },
        prop3: {
          type: "array",
          uniqueItems: true,
          items: {
            type: "string"
          }
        },
        prop4: {
          type: "object",
          additionalProperties: {
            type: "string"
          }
        }
      }
    });
  });
});
