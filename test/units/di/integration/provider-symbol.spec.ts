import {Inject, InjectorService, ProviderScope, registerProvider, Service} from "@tsed/common";
import {expect} from "../../../tools";

/**
 *
 */
export interface SymbolService {}

/**
 *
 */
// tslint:disable-next-line: variable-name
export const SymbolService = Symbol("SymbolService");

function test() {
  return "test";
}

registerProvider({
  provide: SymbolService,
  scope: ProviderScope.SINGLETON,
  deps: [],
  useFactory() {
    return test;
  }
});

@Service()
class SingletonService {
  constructor(@Inject(SymbolService) public symbolService: SymbolService) {}
}

describe("Provider symbol", () => {
  before(async () => {
    this.injector = new InjectorService();
    this.injector.addProvider(SingletonService);
    this.injector.addProvider(SymbolService);

    await this.injector.load();

    this.instance = this.injector.invoke(SingletonService);
  });

  it("should have loaded the symbol in injector", () => {
    expect(this.injector.get(SymbolService)).to.equal(test);
  });

  it("should inject symbolService in SingletonService", () => {
    expect(this.instance.symbolService).to.equal(test);
    expect(this.instance.symbolService()).to.equal("test");
  });
});
