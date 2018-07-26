import {InjectorService, ProviderScope, registerProvider, Service} from "@tsed/common";
import {Type} from "@tsed/core";
import {Inject} from "../../../../packages/common/src/di/decorators/inject";
import {expect} from "../../../tools";

export type FunctionService = {
  (target: Type<any>, targetKey: string, descriptor: TypedPropertyDescriptor<Function> | number): any;
};

/**
 * Inject the ExpressRouter (Express.Router) instance.
 *
 * ### Example
 *
 * ```typescript
 * import {ExpressRouter, Service} from "@tsed/common";
 *
 * @Controller("/")
 * export default class OtherService {
 *    constructor(@ExpressRouter router: ExpressRouter) {}
 * }
 * ```
 *
 * @param {Type<any>} target
 * @param {string} targetKey
 * @param {TypedPropertyDescriptor<Function> | number} descriptor
 * @returns {any}
 * @decorator
 */
export function FunctionService(target: Type<any>, targetKey: string, descriptor: TypedPropertyDescriptor<Function> | number) {
  return Inject(FunctionService)(target, targetKey, descriptor);
}

function test() {
  return "test";
}

registerProvider({
  provide: FunctionService,
  deps: [],
  scope: ProviderScope.SINGLETON,
  useFactory() {
    return test;
  }
});

@Service()
class SingletonService {
  constructor(@FunctionService public functionService: FunctionService) {}
}

describe("Provider function", () => {
  before(async () => {
    this.injector = new InjectorService();
    this.injector.addProvider(SingletonService);
    this.injector.addProvider(FunctionService);

    await this.injector.load();

    this.instance = this.injector.invoke(SingletonService);
  });

  it("should have loaded the symbol in injector", () => {
    expect(this.injector.get(FunctionService)).to.equal(test);
  });

  it("should inject functionService in SingletonService", () => {
    expect(this.instance.functionService).to.equal(test);
    expect(this.instance.functionService()).to.equal("test");
  });
});
