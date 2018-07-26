import {InjectorService, ProviderScope, Scope, Service} from "@tsed/common";
import {expect} from "../../../tools";

@Service()
@Scope(ProviderScope.SINGLETON)
export class SingletonService {
  constructor() {}
}

@Service()
@Scope(ProviderScope.REQUEST)
export class InnerService {
  private name = "innerService";

  constructor(public singletonService: SingletonService) {
    this.name = `innerService-random(${Math.ceil(Math.random() * 100)})`;
  }

  read() {
    return this.name;
  }
}

@Service()
@Scope(ProviderScope.REQUEST)
export class OuterService {
  constructor(public innerService: InnerService) {}
}

@Service()
@Scope("request")
export class RequestService {
  constructor(public innerService: InnerService, public outerService: OuterService, public singletonService: SingletonService) {}
}

describe("DI Request", () => {
  before(async () => {
    this.injector = new InjectorService();
    this.injector.addProvider(SingletonService);
    this.injector.addProvider(OuterService);
    this.injector.addProvider(InnerService);
    this.injector.addProvider(RequestService);

    await this.injector.load();

    this.locals = new Map();
    this.instance = this.injector.invokeRequest(RequestService, this.locals);
  });

  after(() => {});

  it("should construct RequestService", () => {
    expect(this.instance).to.be.instanceOf(RequestService);
  });

  it("should have a RequestService with innerService, outerService and singletonService", () => {
    expect(this.instance.innerService).to.be.instanceOf(InnerService);
    expect(this.instance.outerService).to.be.instanceOf(OuterService);
    expect(this.instance.singletonService).to.be.instanceOf(SingletonService);
  });

  it("should have outerService with innerService", () => {
    expect(this.instance.outerService.innerService).to.be.instanceOf(InnerService);
    expect(this.instance.innerService).to.eq(this.instance.outerService.innerService);
  });

  it("should have innerService with singleton", () => {
    expect(this.instance.innerService.singletonService).to.be.instanceOf(SingletonService);
    expect(this.instance.singletonService).to.eq(this.instance.innerService.singletonService);
    expect(this.injector.get(SingletonService)).to.eq(this.instance.innerService.singletonService);
  });
});
