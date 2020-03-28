import {SpecTypes} from "@tsed/schema";
import {expect} from "chai";
import {Consumes, In, MethodPath, Min, Name, Required} from "../decorators";
import {Path} from "../decorators/operations/path";
import {getSpec} from "./getSpec";

describe("getSpec()", () => {
  it("should return swagger spec for the given controllers (swagger)", () => {
    @Path("/controller")
    class Controller1 {
      @Consumes("application/json")
      @MethodPath("POST", "/")
      method(@In("body") @Required() @Name("num") @Min(0) num: number, @In("body") @Required() @Name("test") @Min(0) num2: number) {}
    }

    expect(getSpec(Controller1)).to.deep.eq({
      definitions: {},
      paths: {
        "/controller": {
          post: {
            consumes: ["application/json"],
            parameters: [
              {
                in: "body",
                name: "body",
                required: true,
                schema: {
                  properties: {
                    num: {
                      minimum: 0,
                      type: "number"
                    },
                    test: {
                      minimum: 0,
                      type: "number"
                    }
                  },
                  required: ["num", "test"],
                  type: "object"
                }
              }
            ],
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
  it("should return swagger spec for the given controllers (openapi)", () => {
    @Path("/controller")
    class Controller1 {
      @Consumes("application/json")
      @MethodPath("POST", "/")
      method(@In("body") @Required() @Name("num") @Min(0) num: number, @In("body") @Required() @Name("test") @Min(0) num2: number) {}
    }

    expect(getSpec(Controller1, {spec: SpecTypes.OPENAPI})).to.deep.eq({
      components: {
        schemas: {}
      },
      paths: {
        "/controller": {
          post: {
            parameters: [],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    properties: {
                      num: {
                        minimum: 0,
                        type: "number"
                      },
                      test: {
                        minimum: 0,
                        type: "number"
                      }
                    },
                    required: ["num", "test"],
                    type: "object"
                  }
                }
              },
              required: true
            },
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
