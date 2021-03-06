import {expect} from "chai";
import {UnknownPropertyError} from "./UnknownPropertyError";

describe("UnknownPropertyError", () => {
  it("should have a message", () => {
    class Test {}

    const errorInstance = new UnknownPropertyError(Test, "propertyKey");

    expect(errorInstance.message).to.equal("Property propertyKey on class Test is not allowed.");
    expect(errorInstance.name).to.equal("UNKNOWN_PROPERTY_ERROR");
  });
});
