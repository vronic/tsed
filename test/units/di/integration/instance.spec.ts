import {InjectorService, ProviderScope, Scope, Service} from "@tsed/common";
import {expect} from "../../../tools";

@Service()
@Scope(ProviderScope.INSTANCE)
class InstanceService {}

@Service()
class ParentInstanceService {
  constructor(public instance1: InstanceService, public instance2: InstanceService) {}
}

describe("DI Instance", () => {
  before(async () => {
    this.injector = new InjectorService();
    this.injector.addProvider(InstanceService);
    this.injector.addProvider(ParentInstanceService);

    await this.injector.load();

    this.parentInstance = this.injector.get(ParentInstanceService);
  });

  after(() => {});

  it("should construct ParentInstanceService", () => {
    expect(this.parentInstance).to.be.instanceOf(ParentInstanceService);
  });

  it("should have instance1 and instance 2", () => {
    expect(this.parentInstance.instance1).to.be.instanceOf(InstanceService);
    expect(this.parentInstance.instance2).to.be.instanceOf(InstanceService);
  });

  it("should have two differents instances of InstanceService", () => {
    expect(this.parentInstance.instance1).not.equal(this.parentInstance.instance2);
  });
});
