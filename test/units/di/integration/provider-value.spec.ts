import {Inject, InjectorService, ProviderScope, registerProvider, Service} from "@tsed/common";
import {expect} from "../../../tools";

registerProvider({
  provide: "MyValue",
  scope: ProviderScope.SINGLETON,
  deps: [],
  useValue: "Value"
});

@Service()
class SingletonService {
  constructor(@Inject("MyValue") public symbolService: String) {}
}

describe("Provider value", () => {
  before(async () => {
    this.injector = new InjectorService();
    this.injector.addProvider(SingletonService);
    this.injector.addProvider("MyValue");

    await this.injector.load();
  });

  it("should have loaded the symbol in injector", () => {
    expect(this.injector.get("MyValue")).to.equal("Value");
  });

  it("should inject symbolService in SingletonService", () => {
    this.instance = this.injector.invoke(SingletonService);
    expect(this.instance.symbolService).to.equal("Value");
  });
});
