import {MethodPath} from "@tsed/schema";
import {expect} from "chai";
import {getJsonSchema} from "../utils/getJsonSchema";
import {getSpec} from "../utils/getSpec";
import {Description} from "./description";

describe("@Description", () => {
  it("should declare description on class", () => {
    // WHEN
    @Description("Description")
    class Model {}

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      description: "Description",
      type: "object"
    });
  });
  it("should declare description on method", () => {
    // WHEN

    class Model {
      @MethodPath("GET", "/")
      @Description("Description")
      method() {}
    }

    // THEN
    expect(getSpec(Model)).to.deep.equal({
      definitions: {},
      paths: {
        "/": {
          get: {
            description: "Description",
            parameters: [],
            responses: {
              "200": {
                description: ""
              }
            }
          }
        }
      }
    });
  });
});
