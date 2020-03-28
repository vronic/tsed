import {expect} from "chai";
import {Post} from "../../test/helpers/Post";
import {CollectionOf} from "../decorators/collections/collectionOf";
import {Consumes} from "../decorators/operations/consumes";
import {In} from "../decorators/operations/in";
import {MethodPath} from "../decorators/operations/methodPath";
import {Min} from "../decorators/minimum";
import {Name} from "../decorators/name";
import {Property} from "../decorators/property";
import {Required} from "../decorators/required";
import {Returns} from "../decorators/returns";
import {SpecTypes} from "./SpecTypes";
import {StoredJson} from "./StoredJson";

const swaggerSpecValidator = require("swagger-spec-validator");

describe("StoredJson", () => {
  describe("When declaring property", () => {
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
      const classSchema = StoredJson.from(Model);

      expect(classSchema.schema.toJSON()).to.deep.equal({
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
    it("should declare all schema correctly (alias)", () => {
      // WHEN
      class Model {
        @Name("prop_1")
        @Required()
        prop1: string;
      }

      // THEN
      const classSchema = StoredJson.from(Model);

      expect(classSchema.schema.toJSON()).to.deep.equal({
        type: "object",
        required: ["prop_1"],
        properties: {
          prop_1: {
            minLength: 1,
            type: "string"
          }
        }
      });
    });
    it("should declare prop with a nested model", () => {
      // WHEN
      class NestedModel {
        @Property()
        id: string;

        @Property()
        prop1: string;
      }

      class Model {
        @Property()
        id: string;

        @Property()
        nested: NestedModel;
      }

      // THEN

      expect(StoredJson.from(NestedModel).schema.toJSON()).to.deep.equal({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          prop1: {
            type: "string"
          }
        }
      });

      expect(StoredJson.from(Model).schema.toJSON()).to.deep.equal({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          nested: {
            $ref: "#/definitions/NestedModel"
          }
        },
        definitions: {
          NestedModel: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                type: "string"
              }
            }
          }
        }
      });
    });
    it("should declare prop with a nested model with named model", () => {
      // WHEN
      @Name("Nested")
      class NestedModel {
        @Property()
        id: string;

        @Property()
        prop1: string;
      }

      class Model {
        @Property()
        id: string;

        @Property()
        nested: NestedModel;
      }

      // THEN
      expect(StoredJson.from(NestedModel).schema.toJSON()).to.deep.equal({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          prop1: {
            type: "string"
          }
        }
      });

      expect(StoredJson.from(Model).schema.toJSON()).to.deep.equal({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          nested: {
            $ref: "#/definitions/Nested"
          }
        },
        definitions: {
          Nested: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                type: "string"
              }
            }
          }
        }
      });
    });
    it("should declare prop with a nested of nested model (Array)", () => {
      // WHEN
      class ChildModel {
        @Property()
        id: string;

        @Property()
        prop1: string;
      }

      class NestedModel {
        @Property()
        id: string;

        @CollectionOf(ChildModel)
        children: ChildModel[];
      }

      class Model {
        @Property()
        id: string;

        @Property()
        nested: NestedModel;
      }

      // THEN
      expect(StoredJson.from(ChildModel).schema.toJSON()).to.deep.equal({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          prop1: {
            type: "string"
          }
        }
      });

      expect(StoredJson.from(NestedModel).schema.toJSON()).to.deep.equal({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          children: {
            type: "array",
            items: {
              $ref: "#/definitions/ChildModel"
            }
          }
        },
        definitions: {
          ChildModel: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                type: "string"
              }
            }
          }
        }
      });

      expect(StoredJson.from(Model).schema.toJSON()).to.deep.equal({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          nested: {
            $ref: "#/definitions/NestedModel"
          }
        },
        definitions: {
          NestedModel: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              children: {
                type: "array",
                items: {
                  $ref: "#/definitions/ChildModel"
                }
              }
            }
          },
          ChildModel: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                type: "string"
              }
            }
          }
        }
      });
    });
    it("should declare prop with a nested of nested model (Set)", () => {
      // WHEN
      class ChildModel {
        @Property()
        id: string;

        @Property()
        prop1: string;
      }

      class NestedModel {
        @Property()
        id: string;

        @CollectionOf(ChildModel)
        children: Set<ChildModel>;
      }

      class Model {
        @Property()
        id: string;

        @Property()
        nested: NestedModel;
      }

      // THEN
      expect(StoredJson.from(ChildModel).schema.toJSON()).to.deep.equal({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          prop1: {
            type: "string"
          }
        }
      });

      expect(StoredJson.from(NestedModel).schema.toJSON()).to.deep.equal({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          children: {
            type: "array",
            uniqueItems: true,
            items: {
              $ref: "#/definitions/ChildModel"
            }
          }
        },
        definitions: {
          ChildModel: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                type: "string"
              }
            }
          }
        }
      });

      expect(StoredJson.from(Model).schema.toJSON()).to.deep.equal({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          nested: {
            $ref: "#/definitions/NestedModel"
          }
        },
        definitions: {
          NestedModel: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              children: {
                type: "array",
                uniqueItems: true,
                items: {
                  $ref: "#/definitions/ChildModel"
                }
              }
            }
          },
          ChildModel: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                type: "string"
              }
            }
          }
        }
      });
    });
    it("should declare prop with a nested of nested model (Map)", () => {
      // WHEN
      class ChildModel {
        @Property()
        id: string;

        @Property()
        prop1: string;
      }

      class NestedModel {
        @Property()
        id: string;

        @CollectionOf(ChildModel)
        children: Map<string, ChildModel>;
      }

      class Model {
        @Property()
        id: string;

        @Property()
        nested: NestedModel;
      }

      // THEN
      expect(StoredJson.from(ChildModel).schema.toJSON()).to.deep.equal({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          prop1: {
            type: "string"
          }
        }
      });

      expect(StoredJson.from(NestedModel).schema.toJSON()).to.deep.equal({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          children: {
            type: "object",
            additionalProperties: {
              $ref: "#/definitions/ChildModel"
            }
          }
        },
        definitions: {
          ChildModel: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                type: "string"
              }
            }
          }
        }
      });

      expect(StoredJson.from(Model).schema.toJSON()).to.deep.equal({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          nested: {
            $ref: "#/definitions/NestedModel"
          }
        },
        definitions: {
          NestedModel: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              children: {
                type: "object",
                additionalProperties: {
                  $ref: "#/definitions/ChildModel"
                }
              }
            }
          },
          ChildModel: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                type: "string"
              }
            }
          }
        }
      });
    });
    it("should accept circular ref", () => {
      // WHEN

      // THEN
      const classSchema = StoredJson.from(Post);

      expect(classSchema.schema.toJSON()).to.deep.equal({
        definitions: {
          Post: {
            properties: {
              id: {
                type: "string"
              },
              owner: {
                $ref: "#/definitions/User"
              }
            },
            type: "object"
          },
          User: {
            properties: {
              name: {
                type: "string"
              },
              posts: {
                items: {
                  $ref: "#/definitions/Post"
                },
                type: "array"
              }
            },
            type: "object"
          }
        },
        properties: {
          id: {
            type: "string"
          },
          owner: {
            $ref: "#/definitions/User"
          }
        },
        type: "object"
      });
    });
  });
  describe("When declaring schema on param", () => {
    it("should declare all schema correctly (path - swagger2)", async () => {
      // WHEN
      class Controller {
        method(@In("path") @Name("basic") basic: string) {}
      }

      // THEN
      StoredJson.from(Controller).toJSON({
        spec: SpecTypes.SWAGGER
      });

      const paramSchema = StoredJson.from(Controller, "method", 0);
      const methodSchema = paramSchema.parent;
      const operation = methodSchema.operation!.toJSON();

      expect(
        await validate(
          createSpec({
            swagger: "2.0",
            paths: {
              "/{basic}": {
                post: operation
              }
            }
          })
        )
      ).to.eq(true);

      expect(operation).to.deep.equal({
        parameters: [
          {
            in: "path",
            name: "basic",
            required: true,
            type: "string"
          }
        ],
        responses: {
          "200": {
            description: ""
          }
        }
      });
    });
    it("should declare all schema correctly (query - swagger2)", async () => {
      // WHEN
      class Controller {
        @MethodPath("GET", "/:id")
        method(@In("query") @Name("basic") basic: string) {}
      }

      // THEN
      const storedJson = StoredJson.from(Controller);
      const spec = storedJson.toJSON({spec: SpecTypes.SWAGGER});

      expect(
        await validate(
          createSpec({
            swagger: "2.0",
            ...spec
          })
        )
      ).to.eq(true);

      expect(spec).to.deep.equal({
        definitions: {},
        paths: {
          "/{id}": {
            get: {
              parameters: [
                {
                  in: "path",
                  name: "id",
                  required: true,
                  type: "string"
                },
                {
                  in: "query",
                  name: "basic",
                  required: false,
                  type: "string"
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
    it("should declare all schema correctly (path optional - swagger2)", async () => {
      // WHEN
      class Controller {
        @MethodPath("GET", "/:id?")
        method(@In("path") @Name("id") id: string) {}
      }

      // THEN
      const storedJson = StoredJson.from(Controller);
      const spec = storedJson.toJSON({spec: SpecTypes.SWAGGER});

      expect(
        await validate(
          createSpec({
            swagger: "2.0",
            ...spec
          })
        )
      ).to.eq(true);

      expect(spec).to.deep.equal({
        definitions: {},
        paths: {
          "/": {
            get: {
              parameters: [],
              responses: {
                "200": {
                  description: ""
                }
              }
            }
          },
          "/{id}": {
            get: {
              parameters: [
                {
                  in: "path",
                  name: "id",
                  required: true,
                  type: "string"
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
    it("should declare all schema correctly (responses - swagger2)", async () => {
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

      expect(
        await validate(
          createSpec({
            swagger: "2.0",
            ...spec
          })
        )
      ).to.eq(true);
    });

    describe("body ", () => {
      describe("without model", () => {
        class Controller {
          @Consumes("application/json")
          @MethodPath("POST", "/")
          method(@In("body") @Required() @Name("num") @Min(0) num: number, @In("body") @Required() @Name("test") @Min(0) num2: number) {}
        }

        it("should declare all schema correctly (body - swagger2)", async () => {
          // THEN
          const spec = StoredJson.from(Controller).toJSONSpec({spec: SpecTypes.SWAGGER});

          expect(spec).to.deep.equal({
            definitions: {},
            paths: {
              "/": {
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

          expect(
            await validate(
              createSpec({
                swagger: "2.0",
                ...spec
              })
            )
          ).to.eq(true);
        });
        it("should declare all schema correctly (body - openapi3)", async () => {
          // THEN
          const spec = StoredJson.from(Controller).toJSONSpec({spec: SpecTypes.OPENAPI});

          expect(
            await validate(
              createSpec({
                openapi: "3.0.0",
                ...spec
              })
            )
          ).to.eq(true);

          expect(spec).to.deep.equal({
            components: {
              schemas: {}
            },
            paths: {
              "/": {
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
      describe("with model", () => {
        class MyModel {
          @Property()
          prop: string;
        }

        class Controller {
          @Consumes("application/json")
          @MethodPath("POST", "/")
          method(@In("body") @Required() num: MyModel) {}
        }

        it("should declare all schema correctly (body - swagger2)", async () => {
          // THEN
          const spec = StoredJson.from(Controller).toJSON({spec: SpecTypes.SWAGGER});

          expect(spec).to.deep.equal({
            definitions: {
              MyModel: {
                type: "object",
                properties: {
                  prop: {
                    type: "string"
                  }
                }
              }
            },
            paths: {
              "/": {
                post: {
                  consumes: ["application/json"],
                  parameters: [
                    {
                      in: "body",
                      name: "body",
                      required: true,
                      schema: {
                        $ref: "#/definitions/MyModel"
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

          expect(
            await validate(
              createSpec({
                swagger: "2.0",
                ...spec
              })
            )
          ).to.eq(true);
        });
        it("should declare all schema correctly (body - openapi3)", async () => {
          // THEN
          const spec = StoredJson.from(Controller).toJSONSpec({spec: SpecTypes.OPENAPI});

          expect(spec).to.deep.equal({
            components: {
              schemas: {
                MyModel: {
                  properties: {
                    prop: {
                      type: "string"
                    }
                  },
                  type: "object"
                }
              }
            },
            paths: {
              "/": {
                post: {
                  parameters: [],
                  requestBody: {
                    content: {
                      "application/json": {
                        schema: {
                          $ref: "#/components/schemas/MyModel"
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

          expect(
            await validate(
              createSpec({
                openapi: "3.0.0",
                ...spec
              })
            )
          ).to.eq(true);
        });
      });
    });
  });
});

async function validate(spec: any) {
  try {
    const result = await swaggerSpecValidator.validate(JSON.stringify(spec));

    if (Object.keys(result).length > 0) {
      return result;
    }
  } catch (er) {
    return er.message;
  }

  return true;
}

function createSpec(spec: any) {
  return {
    ...spec,
    info: {
      description: "description",
      version: "1.0.0",
      title: "title"
    }
  };
}
