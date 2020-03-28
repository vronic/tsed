import * as Ajv from "ajv";
import {expect} from "chai";
import {StoredJson} from "../domain/StoredJson";
import {Allow} from "./allow";
import {Property} from "./property";
import {Required} from "./required";

describe("@Allow", () => {
  it("should declare required and allow field (without Allow)", () => {
    // WHEN
    class Model {
      @Required()
      allow: string;
    }

    // THEN
    const classSchema = StoredJson.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
      properties: {
        allow: {
          type: "string",
          minLength: 1
        }
      },
      required: ["allow"],
      type: "object"
    });

    const validate = new Ajv().compile(classSchema.toJSON());
    expect(validate({allow: ""})).to.equal(false);
    expect(validate({allow: 0})).to.equal(false);
    expect(validate({})).to.equal(false);
  });
  it("should declare required and allow field (with Allowed empty string)", () => {
    // WHEN
    class Model {
      @Allow("")
      allow: string;
    }

    // THEN
    const classSchema = StoredJson.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
      properties: {
        allow: {
          type: "string"
        }
      },
      required: ["allow"],
      type: "object"
    });

    const validate = new Ajv().compile(classSchema.toJSON());
    expect(validate({allow: ""})).to.equal(true);
    expect(validate({})).to.equal(false);
  });
  it("should declare required and allow field (with Allowed null basic type)", () => {
    // WHEN
    class Model {
      @Allow(null)
      allow: string;
    }

    // THEN
    const classSchema = StoredJson.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
      properties: {
        allow: {
          minLength: 1,
          type: ["string", "null"]
        }
      },
      required: ["allow"],
      type: "object"
    });

    const validate = new Ajv().compile(classSchema.toJSON());
    expect(validate({allow: null})).to.equal(true);
    expect(validate({})).to.equal(false);
  });
  it("should declare required and allow field (with Allowed null NestedModel)", () => {
    // WHEN
    class NestedModel {
      @Property()
      prop: string;
    }

    class Model {
      @Allow(null)
      allow: NestedModel;
    }

    // THEN
    const classSchema = StoredJson.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
      definitions: {
        NestedModel: {
          properties: {
            prop: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      properties: {
        allow: {
          oneOf: [
            {
              type: "null"
            },
            {
              $ref: "#/definitions/NestedModel"
            }
          ]
        }
      },
      required: ["allow"],
      type: "object"
    });

    const validate = new Ajv().compile(classSchema.toJSON());
    expect(validate({allow: null})).to.equal(true);
    expect(validate({})).to.equal(false);
  });
});
