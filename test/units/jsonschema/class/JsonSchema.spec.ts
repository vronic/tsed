import * as Ajv from "ajv";
import {JsonSchema} from "../../../../packages/common/src/jsonschema/class/JsonSchema";
import {expect} from "../../../tools";

describe("JsonSchema", () => {
  const ajv = new Ajv({});

  describe("toCollection()", () => {
    describe("when the type is string", () => {
      before(() => {
        this.schema = new JsonSchema({type: String});
        this.schema.toCollection(Array);
      });

      it("should have a correct jsonSchema", () => {
        expect(this.schema.toJSON()).to.deep.eq({
          type: "array",
          items: {
            type: "string"
          }
        });
      });

      it("should validate data", () => {
        expect(ajv.validate(this.schema.toJSON(), ["test"])).to.eq(true);
      });

      it("shouldn't validate data", () => {
        expect(ajv.validate(this.schema.toJSON(), [1])).to.eq(false);
      });
    });

    describe("when the type is object", () => {
      before(() => {
        this.schema = new JsonSchema({type: Object});
        this.schema.toCollection(Array);
      });

      it("should have a correct jsonSchema", () => {
        expect(this.schema.toJSON()).to.deep.eq({
          type: "array",
          items: {
            type: "object"
          }
        });
      });

      it("should validate data", () => {
        expect(ajv.validate(this.schema.toJSON(), [{test: "test"}])).to.eq(true);
      });

      it("shouldn't validate data", () => {
        expect(ajv.validate(this.schema.toJSON(), [1])).to.eq(false);
      });
    });

    describe("when the type is number or string", () => {
      before(() => {
        this.schema = new JsonSchema({type: ["number", "string"]});
      });

      it("should have a correct jsonSchema", () => {
        expect(this.schema.toJSON()).to.deep.eq({
          oneOf: [{type: "number"}, {type: "string"}]
        });
      });

      it("should validate data", () => {
        expect(ajv.validate(this.schema.toJSON(), 1)).to.eq(true);
        expect(ajv.validate(this.schema.toJSON(), "1")).to.eq(true);
      });

      it("shouldn't validate data", () => {
        expect(ajv.validate(this.schema.toJSON(), false)).to.eq(false);
      });
    });

    describe("when the type is an array number or string (1)", () => {
      before(() => {
        this.schema = new JsonSchema({type: ["number", "string"]});
        this.schema.toCollection(Array);
      });

      it("should have a correct jsonSchema", () => {
        expect(this.schema.toJSON()).to.deep.eq({
          type: "array",
          items: {
            oneOf: [{type: "number"}, {type: "string"}]
          }
        });
      });

      it("should validate data", () => {
        expect(ajv.validate(this.schema.toJSON(), [1, "1"])).to.eq(true);
      });

      it("shouldn't validate data", () => {
        expect(ajv.validate(this.schema.toJSON(), false)).to.eq(false);
      });
    });

    describe("when the type is an array of number or string (2)", () => {
      before(() => {
        this.schema = new JsonSchema({type: Object});
        this.schema.toCollection(Array);
        this.schema.mapper.type = ["number", "string"];
      });

      it("should have a correct jsonSchema", () => {
        expect(this.schema.toJSON()).to.deep.eq({
          type: "array",
          items: {
            oneOf: [{type: "number"}, {type: "string"}]
          }
        });
      });

      it("should validate data", () => {
        expect(ajv.validate(this.schema.toJSON(), [1, "1"])).to.eq(true);
      });

      it("shouldn't validate data", () => {
        expect(ajv.validate(this.schema.toJSON(), false)).to.eq(false);
      });
    });

    describe("when there have already data", () => {
      before(() => {
        this.schema = new JsonSchema({type: Object});
        this.schema.mapValue("type", ["number", "string"]);
        this.schema.mapValue("enum", ["1", "2"]);

        this.schema.toCollection(Array);
      });

      it("should have a correct jsonSchema", () => {
        expect(this.schema.toJSON()).to.deep.eq({
          type: "array",
          items: {
            type: ["number", "string"],
            enum: ["1", "2"]
          }
        });
      });
    });
  });

  describe("mapValue()", () => {
    describe("when the schema is a string", () => {
      before(() => {
        this.schema = new JsonSchema();
        this.schema.type = String;
        this.schema.mapValue("enum", ["1", "2"]);
      });

      it("should have a correct jsonSchema", () => {
        expect(this.schema.toJSON()).to.deep.eq({enum: ["1", "2"], type: "string"});
      });
    });

    describe("when the schema is a array", () => {
      before(() => {
        this.schema = new JsonSchema();
        this.schema.type = String;
        this.schema.toCollection(Array);
        this.schema.mapValue("enum", ["1", "2"]);
      });

      it("should have a correct jsonSchema", () => {
        expect(this.schema.toJSON()).to.deep.eq({
          type: "array",
          items: {
            enum: ["1", "2"],
            type: "string"
          }
        });
      });
    });

    describe("when the schema is a Set", () => {
      before(() => {
        this.schema = new JsonSchema({
          type: String
        });

        this.schema.toCollection(Set);
        this.schema.mapper.enum = ["1", "2"];
      });

      it("should have a correct jsonSchema", () => {
        expect(this.schema.toJSON()).to.deep.eq({
          additionalProperties: {
            enum: ["1", "2"],
            type: "string"
          }
        });
      });
    });
  });

  describe("getJsonType()", () => {
    it("should return number", () => {
      expect(JsonSchema.getJsonType(Number)).to.eq("number");
    });

    it("should return string", () => {
      expect(JsonSchema.getJsonType(String)).to.eq("string");
    });

    it("should return boolean", () => {
      expect(JsonSchema.getJsonType(Boolean)).to.eq("boolean");
    });

    it("should return array", () => {
      expect(JsonSchema.getJsonType(Array)).to.eq("array");
    });

    it("should return string when date is given", () => {
      expect(JsonSchema.getJsonType(Date)).to.eq("string");
    });

    it("should return object", () => {
      expect(JsonSchema.getJsonType({})).to.eq("object");
    });

    it("should return object when class is given", () => {
      expect(JsonSchema.getJsonType(class {})).to.eq("object");
    });

    it("should return [string] when an array is given", () => {
      expect(JsonSchema.getJsonType(["string"])).to.deep.eq(["string"]);
    });
    it("should return string when an string is given", () => {
      expect(JsonSchema.getJsonType("string")).to.deep.eq("string");
    });
  });

  describe("toJSON()", () => {
    before(() => {
      this.jsonSchema = new JsonSchema();
      this.jsonSchema.description = "description";
      this.jsonSchema.type = class Test {};
    });
    it("should return object", () => {
      expect(this.jsonSchema.toJSON()).to.deep.eq({type: "object", description: "description"});
    });
  });

  describe("with oneOf", () => {
    describe("primitive", () => {
      before(() => {
        this.jsonSchema = new JsonSchema({
          description: "description",
          oneOf: [{type: Boolean}, {type: Number}]
        });
      });
      it("should return object", () => {
        expect(this.jsonSchema.toJSON()).to.deep.eq({
          description: "description",
          oneOf: [
            {
              type: "boolean"
            },
            {
              type: "number"
            }
          ]
        });
      });
    });

    describe("primitive + Collection", () => {
      before(() => {
        this.jsonSchema = new JsonSchema({
          description: "description",
          oneOf: [{type: Boolean}, {type: Number}]
        });
        this.jsonSchema.toCollection(Array);
      });
      it("should return object", () => {
        expect(this.jsonSchema.toJSON()).to.deep.eq({
          description: "description",
          type: "array",
          items: {
            oneOf: [{type: Boolean}, {type: Number}]
          }
        });
      });
    });
  });
});
