import {In, MinLength, Name, Required} from "@tsed/schema";
import {expect} from "chai";
import {StoredJson} from "./StoredJson";

describe("JsonParameter", () => {
  it("should declare parameter", () => {
    // GIVEN
    class Ctrl {
      method(@In("body") @Required() @Name("test") @MinLength(1) test: string) {}
    }

    // WHEN
    const storedParam = StoredJson.from(Ctrl, "method", 0);
    const storedMethod = StoredJson.fromMethod(Ctrl, "method");

    // THEN
    expect(storedParam.toJSON()).to.deep.eq({
      minLength: 1,
      type: "string"
    });
    expect(storedMethod.operation!.toJSON()).to.deep.eq({
      parameters: [
        {
          in: "body",
          name: "body",
          required: true,
          schema: {
            properties: {
              test: {
                minLength: 1,
                type: "string"
              }
            },
            required: ["test"],
            type: "object"
          }
        }
      ],
      responses: {
        "200": {
          description: ""
        }
      }
    });
  });
});
