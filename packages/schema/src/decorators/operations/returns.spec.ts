import {CollectionOf, MethodPath, Property, Returns, SpecTypes, StoredJson} from "@tsed/schema";
import {expect} from "chai";
import {getSpec} from "../../utils/getSpec";
import {Generics} from "../generic/generics";

describe("@Returns", () => {
  it("should declare a return type", async () => {
    // WHEN
    class Controller {
      @MethodPath("POST", "/")
      @(Returns(200, String).Description("description"))
      method() {}
    }

    // THEN
    const storedJson = StoredJson.from(Controller);
    const spec = storedJson.toJSON({spec: SpecTypes.SWAGGER});

    expect(spec).to.deep.equal({
      definitions: {},
      paths: {
        "/": {
          post: {
            parameters: [],
            responses: {
              "200": {
                description: "description",
                schema: {
                  type: "string"
                }
              }
            }
          }
        }
      }
    });
  });
  it("should throw an error when using of with String", async () => {
    // WHEN
    let actualError: any;
    try {
      class Controller {
        @MethodPath("POST", "/")
        @(Returns(200, String)
          .Of(Array)
          .Description("description"))
        method() {}
      }
    } catch (er) {
      actualError = er;
    }

    actualError.message.should.eq("Returns.Of cannot be used with the following primitive classes: String, Number, Boolean");
  });
  it("should declare an Array of string", async () => {
    // WHEN
    class Controller {
      @MethodPath("POST", "/")
      @(Returns(200, Array)
        .Of(String)
        .Description("description"))
      method() {}
    }

    // THEN
    const spec = getSpec(Controller, {spec: SpecTypes.SWAGGER});

    expect(spec).to.deep.equal({
      definitions: {},
      paths: {
        "/": {
          post: {
            parameters: [],
            produces: ["text/json"],
            responses: {
              "200": {
                description: "description",
                schema: {
                  items: {
                    type: "string"
                  },
                  type: "array"
                }
              }
            }
          }
        }
      }
    });
  });
  it("should declare an Array of Model", async () => {
    // WHEN
    class Model {
      @Property()
      id: string;
    }

    class Controller {
      @MethodPath("POST", "/")
      @(Returns(200, Array)
        .Of(Model)
        .Description("description"))
      method() {}
    }

    // THEN
    const spec = getSpec(Controller, {spec: SpecTypes.SWAGGER});

    expect(spec).to.deep.equal({
      definitions: {
        Model: {
          properties: {
            id: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      paths: {
        "/": {
          post: {
            parameters: [],
            produces: ["text/json"],
            responses: {
              "200": {
                description: "description",
                schema: {
                  items: {
                    $ref: "#/definitions/Model"
                  },
                  type: "array"
                }
              }
            }
          }
        }
      }
    });
  });
  it("should declare an Generic of Model", async () => {
    // WHEN
    @Generics("T")
    class Pagination<T> {
      @CollectionOf("T")
      data: string;

      @Property()
      totalCount: number;
    }

    @Generics("T")
    class Submission<T> {
      @Property()
      _id: string;

      @Property("T")
      data: T;
    }

    class Product {
      @Property()
      title: string;
    }

    class Controller {
      @MethodPath("POST", "/")
      @(Returns(200, Pagination)
        .Of(Submission)
        .Nested(Product)
        .Description("description"))
      async method(): Promise<Pagination<Submission<Product>> | null> {
        return null;
      }
    }

    // THEN
    const spec = getSpec(Controller, {spec: SpecTypes.SWAGGER});

    expect(spec).to.deep.equal({
      definitions: {
        Product: {
          properties: {
            title: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      paths: {
        "/": {
          post: {
            parameters: [],
            produces: ["text/json"],
            responses: {
              "200": {
                description: "description",
                schema: {
                  properties: {
                    data: {
                      properties: {
                        data: {
                          $ref: "#/definitions/Product"
                        }
                      },
                      type: "object"
                    },
                    totalCount: {
                      type: "number"
                    }
                  },
                  type: "object"
                }
              }
            }
          }
        }
      }
    });
  });
});
