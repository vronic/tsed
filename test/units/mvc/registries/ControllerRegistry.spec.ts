import {ControllerProvider, ExpressRouter} from "@tsed/common";
import {expect} from "../../../tools";

describe("ControllerRegistry", () => {
  class Test {}

  before(() => {
    this.locals = new Map();
    this.provider = new ControllerProvider(Test);
    this.provider.router = "router";
  });

  it("should store ExpressRouter", () => {
    expect(this.locals.has(ExpressRouter)).to.eq(true);
  });

  it("should return ExpressRouter", () => {
    expect(this.locals.get(ExpressRouter)).to.eq("router");
  });
});
