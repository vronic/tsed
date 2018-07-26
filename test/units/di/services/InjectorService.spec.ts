import {ExpressRouter, GlobalProviders, Inject, Provider, ProviderScope, ProviderType, Service, SettingsService} from "@tsed/common";
import {Metadata, prototypeOf, Store} from "@tsed/core";
import {InjectorService} from "../../../../packages/common/src/di";
import {inject} from "../../../../packages/testing/src/inject";
import {expect, Sinon} from "../../../tools";

@Service()
class Test {
  constructor(injectorService: InjectorService) {}

  @Inject()
  prop: InjectorService;

  @Inject()
  test(injectorService: InjectorService) {
    return injectorService;
  }

  test2(@Inject() injectorService: InjectorService) {
    return injectorService;
  }
}

describe("InjectorService", () => {
  describe("mapInvokeOptions()", () => {
    before(() => {
      this.setSettingsStub = Sinon.stub(InjectorService.prototype as any, "initSettings");
      this.injector = new InjectorService();
    });
    after(() => {
      this.setSettingsStub.restore();
    });

    describe("when is function", () => {
      before(() => {
        const token = function Target(injector: InjectorService) {};

        this.result = this.injector.mapInvokeOptions(token, {
          deps: [InjectorService],
          scope: "request",
          useScope: true
        });
      });
      it("should return configuration", () => {
        expect(this.result.constructor).to.be.a("function");
        expect(this.result.token).to.be.a("function");
        expect(this.result.deps).to.deep.eq([InjectorService]);
        expect(this.result.scope).to.eq(ProviderScope.REQUEST);
        expect(this.result.useScope).to.eq(true);
      });
    });

    describe("when is function (scope default)", () => {
      before(() => {
        const token = function Target(injector: InjectorService) {};
        this.result = this.injector.mapInvokeOptions(token, {
          deps: [InjectorService]
        });
      });
      it("should return configuration", () => {
        expect(this.result.constructor).to.be.a("function");
        expect(this.result.token).to.be.a("function");
        expect(this.result.deps).to.deep.eq([InjectorService]);
        expect(this.result.scope).to.eq(ProviderScope.SINGLETON);
        expect(this.result.useScope).to.eq(false);
      });
    });

    describe("when is function (without deps)", () => {
      before(() => {
        const token = function Target() {};
        this.result = this.injector.mapInvokeOptions(token, {});
      });
      it("should return configuration", () => {
        expect(this.result.constructor).to.be.a("function");
        expect(this.result.token).to.be.a("function");
        expect(this.result.deps).to.deep.eq([]);
        expect(this.result.scope).to.eq(ProviderScope.SINGLETON);
        expect(this.result.useScope).to.eq(false);
      });
    });

    describe("when is class (singleton)", () => {
      before(() => {
        this.result = this.injector.mapInvokeOptions(Test);
      });
      it("should return configuration", () => {
        expect(this.result.constructor).to.be.a("function");
        expect(this.result.token).to.be.a("function");
        expect(this.result.deps).to.deep.eq([InjectorService]);
        expect(this.result.scope).to.eq(ProviderScope.SINGLETON);
        expect(this.result.useScope).to.eq(false);
      });
    });

    describe("when is class (request)", () => {
      before(() => {
        this.result = this.injector.mapInvokeOptions(Test);
      });
      it("should return configuration", () => {
        expect(this.result.constructor).to.be.a("function");
        expect(this.result.token).to.be.a("function");
        expect(this.result.deps).to.deep.eq([InjectorService]);
        expect(this.result.scope).to.eq(ProviderScope.SINGLETON);
        expect(this.result.useScope).to.eq(false);
      });
    });

    describe("when is method", () => {
      before(() => {
        this.result = this.injector.mapInvokeOptions(function test() {}, {
          target: Test,
          methodName: "test"
        });
      });
      it("should return configuration", () => {
        expect(this.result.constructor).to.be.a("function");
        expect(this.result.token).to.be.a("function");
        expect(this.result.deps).to.deep.eq([InjectorService]);
        expect(this.result.scope).to.eq(ProviderScope.SINGLETON);
        expect(this.result.useScope).to.eq(false);
      });
    });

    describe("when the provide has useFactory", () => {
      before(() => {
        this.injector.set(ExpressRouter, GlobalProviders.get(ExpressRouter));
        this.result = this.injector.mapInvokeOptions(ExpressRouter, {
          useScope: true
        });
      });
      it("should return configuration", () => {
        expect(this.result.constructor).to.be.a("function");
        expect(this.result.token).to.be.a("function");
        expect(this.result.deps).to.deep.eq([Provider]);
        expect(this.result.scope).to.eq(ProviderScope.INSTANCE);
        expect(this.result.useScope).to.eq(true);
      });
    });
  });

  describe("invoke test with Inject decorator", () => {
    before(() => {
      this.injector = new InjectorService();
    });
    before(() => {
      this.instance = this.injector.invoke(Test);
    });

    it("should bind the method", () => {
      expect(this.instance.test("test")).to.be.instanceOf(InjectorService);
    });

    it("should bind the property", () => {
      expect(this.instance.prop).to.be.instanceOf(InjectorService);
    });
  });

  describe("has()", () => {
    before(() => {
      this.injector = new InjectorService();
    });
    it("should return true", () => {
      expect(this.injector.has(InjectorService)).to.be.true;
    });

    it("should return false", () => {
      expect(this.injector.has(Test)).to.be.false;
    });
  });

  describe("get()", () => {
    before(() => {
      this.injector = new InjectorService();
    });
    before(
      inject([InjectorService], (injector: InjectorService) => {
        this.injector2 = injector;
      })
    );

    it("should return element", () => {
      expect(this.injector.get(InjectorService)).to.be.instanceOf(InjectorService);
    });

    it("should return undefined", () => {
      expect(this.injector.get(Test)).to.be.undefined;
    });

    it("should get a service", () => {
      expect(this.injector2.get(InjectorService)).to.be.an.instanceof(InjectorService);
    });
  });

  describe("forEach()", () => {
    before(() => {
      this.injector = new InjectorService();
    });
    before(() => {
      this.list = [];
      this.injector.forEach((item: any) => {
        this.list.push(item);
      });
    });
    it("should return the list", () => {
      expect(this.list.length).to.eq(this.injector.size);
    });
  });

  describe("keys()", () => {
    before(() => {
      this.injector = new InjectorService();
    });
    before(() => {
      this.list = Array.from(this.injector.keys());
    });
    it("should return the list", () => {
      expect(this.list).to.be.an("array");
    });
  });

  describe("entries()", () => {
    before(() => {
      this.injector = new InjectorService();
    });
    before(() => {
      this.list = Array.from(this.injector.entries());
    });
    it("should return the list", () => {
      expect(this.list[0]).to.be.an("array");
    });
  });

  describe("values()", () => {
    before(() => {
      this.injector = new InjectorService();
    });
    before(() => {
      this.list = Array.from(this.injector.values());
    });
    it("should return the list", () => {
      expect(this.list).to.be.an("array");
      expect(this.list[0].instance).to.be.instanceof(InjectorService);
    });
  });

  describe("Array.from()", () => {
    before(() => {
      this.injector = new InjectorService();
    });
    before(() => {
      this.list = Array.from(this.injector);
    });

    it("should return a list", () => {
      expect(this.list).to.be.an("array");
    });
  });

  describe("getProvider()", () => {
    before(() => {
      this.injector = new InjectorService();
    });
    before(
      inject([InjectorService], (injector: InjectorService) => {
        this.provider = injector.getProvider(InjectorService);
      })
    );

    it("should return a provider", () => {
      expect(this.provider).to.be.instanceOf(Provider);
    });
  });

  describe("getProviders()", () => {
    before(() => {
      this.injector = new InjectorService();
    });
    describe("with type ProviderType.MIDDLEWARE", () => {
      before(
        inject([InjectorService], (injector: InjectorService) => {
          this.providers = injector.getProviders(ProviderType.MIDDLEWARE);
          this.hasOther = this.providers.find((item: any) => item.type !== ProviderType.MIDDLEWARE);
        })
      );

      it("should return a list", () => {
        expect(this.providers.length > 0).to.be.true;
      });

      it("should return a list", () => {
        expect(this.providers[0]).to.be.instanceOf(Provider);
      });

      it("should have only provider typed as CONVERTER", () => {
        expect(this.hasOther).to.be.undefined;
      });
    });

    describe("without type", () => {
      before(
        inject([InjectorService], (injector: InjectorService) => {
          this.providers = injector.getProviders();
          this.hasOther = this.providers.find((item: any) => item.type === ProviderType.MIDDLEWARE);
        })
      );

      it("sohuld return a list", () => {
        expect(this.providers.length > 0).to.be.true;
      });

      it("should return a list", () => {
        expect(this.providers[0]).to.be.instanceOf(Provider);
      });

      it("should have only provider typed as CONVERTER", () => {
        expect(!!this.hasOther).to.be.true;
      });
    });
  });

  describe("mapServices()", () => {
    before(() => {
      this.injector = new InjectorService();
    });
    describe("when serviceType is a string", () => {
      before(() => {
        this.injector = new InjectorService();
        this.symbol = "ServiceName";

        const locals = new Map();
        locals.set(this.symbol, "ServiceInstanceName");
        this.result = this.injector.mapServices({
          dependency: this.symbol,
          locals
        });
      });

      it("should return the service instance from the locals map", () => {
        expect(this.result).to.eq("ServiceInstanceName");
      });
    });

    describe("when dependency is a class from locals", () => {
      before(() => {
        this.injector = new InjectorService();

        this.symbol = class Test {};

        const locals = new Map();
        locals.set(this.symbol, new this.symbol());

        this.result = this.injector.mapServices({
          dependency: this.symbol,
          locals
        });
      });

      it("should return the service instance from the locals map", () => {
        expect(this.result).to.be.instanceOf(this.symbol);
      });
    });

    describe("when dependency is a class from registry (unknow)", () => {
      before(() => {
        this.injector = new InjectorService();

        this.symbol = class Test {};

        const locals = new Map();
        this.getStub = Sinon.stub(this.injector, "getProvider").returns(undefined);

        try {
          this.result = this.injector.mapServices({
            dependency: this.symbol,
            locals,
            token: class ServiceTest {}
          });
        } catch (er) {
          this.error = er;
        }
      });

      after(() => {
        this.getStub.restore();
      });

      it("should call GlobalProviders.has", () => {
        this.getStub.should.have.been.calledWithExactly(this.symbol);
      });

      it("should throw an error", () => {
        expect(this.error.message).to.eq("Service ServiceTest > Test not found.");
      });
    });

    describe("when dependency is a class from registry (know, buildable, instance undefined)", () => {
      before(() => {
        this.injector = new InjectorService();

        this.symbol = class Test {};

        this.locals = new Map();
        this.getStub = Sinon.stub(this.injector, "getProvider").returns({
          instance: undefined,
          provide: Test,
          type: "provider"
        });

        this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns({
          buildable: true,
          injectable: true
        });

        this.invokeStub = Sinon.stub(this.injector, "invoke").returns("instance");

        this.result = this.injector.mapServices({
          dependency: this.symbol,
          locals: this.locals,
          useScope: true,
          token: class ServiceTest {}
        });
      });

      after(() => {
        this.getStub.restore();
        this.invokeStub.restore();
        this.getRegistrySettingsStub.restore();
      });

      it("should call GlobalProviders.get", () => {
        this.getStub.should.have.been.calledWithExactly(this.symbol);
      });

      it("should call GlobalProviders.getRegistrySettings", () => {
        this.getRegistrySettingsStub.should.be.calledWithExactly("provider");
      });
      it("should build instance and return the service", () => {
        this.invokeStub.should.have.been.calledWithExactly(Test, this.locals, {useScope: true});
      });
      it("should return the service instance", () => {
        expect(this.result).to.deep.eq("instance");
      });
    });

    describe("when dependency is a class from registry (know, instance defined, not buildable)", () => {
      before(() => {
        this.injector = new InjectorService();

        this.symbol = class Test {};

        this.locals = new Map();
        this.getStub = Sinon.stub(this.injector, "getProvider").returns({
          instance: {instance: "instance"},
          useClass: "useClass",
          type: "provider"
        });

        this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns({
          buildable: false,
          injectable: true
        });

        this.invokeStub = Sinon.stub(this.injector, "invoke").returns("instance");

        this.result = this.injector.mapServices({
          dependency: this.symbol,
          locals: this.locals,
          useScope: true,
          token: class ServiceTest {}
        });
      });

      after(() => {
        this.getStub.restore();
        this.invokeStub.restore();
        this.getRegistrySettingsStub.restore();
      });

      it("should call GlobalProviders.get", () => {
        this.getStub.should.have.been.calledWithExactly(this.symbol);
      });

      it("should call GlobalProviders.getRegistrySettings", () => {
        this.getRegistrySettingsStub.should.be.calledWithExactly("provider");
      });
      it("should build instance and return the service", () => {
        return this.invokeStub.should.not.have.been.called;
      });
      it("should return the service instance", () => {
        expect(this.result).to.deep.eq({instance: "instance"});
      });
    });

    describe("when dependency is a class from registry (know, instance defined, buildable, SINGLETON)", () => {
      before(() => {
        this.injector = new InjectorService();

        this.symbol = class Test {};

        this.locals = new Map();
        this.getStub = Sinon.stub(this.injector, "getProvider").returns({
          instance: {instance: "instance"},
          useClass: "useClass",
          type: "provider",
          scope: ProviderScope.SINGLETON
        });

        this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns({
          buildable: true,
          injectable: true
        });

        this.invokeStub = Sinon.stub(this.injector, "invoke").returns("instance");

        this.result = this.injector.mapServices({
          dependency: this.symbol,
          locals: this.locals,
          useScope: true,
          token: class ServiceTest {}
        });
      });

      after(() => {
        this.getStub.restore();
        this.invokeStub.restore();
        this.getRegistrySettingsStub.restore();
      });

      it("should call GlobalProviders.get", () => {
        this.getStub.should.have.been.calledWithExactly(this.symbol);
      });

      it("should call GlobalProviders.getRegistrySettings", () => {
        this.getRegistrySettingsStub.should.be.calledWithExactly("provider");
      });
      it("should not build instance", () => {
        return this.invokeStub.should.not.have.been.called;
      });
      it("should return the service instance", () => {
        expect(this.result).to.deep.eq({instance: "instance"});
      });
    });

    describe("when dependency is a class from registry (know, instance defined, buildable, REQUEST)", () => {
      before(() => {
        this.injector = new InjectorService();

        this.symbol = class Test {};

        this.locals = new Map();
        this.getStub = Sinon.stub(this.injector, "getProvider").returns({
          instance: {instance: "instance"},
          provide: Test,
          type: "provider",
          scope: ProviderScope.REQUEST
        });

        this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns({
          buildable: true,
          injectable: true
        });

        this.invokeStub = Sinon.stub(this.injector, "invoke").returns("instance");

        this.result = this.injector.mapServices({
          dependency: this.symbol,
          locals: this.locals,
          useScope: true,
          parentScope: true,
          token: class ServiceTest {}
        });
      });

      after(() => {
        this.getStub.restore();
        this.invokeStub.restore();
        this.getRegistrySettingsStub.restore();
      });

      it("should call GlobalProviders.get", () => {
        this.getStub.should.have.been.calledWithExactly(this.symbol);
      });

      it("should call GlobalProviders.getRegistrySettings", () => {
        this.getRegistrySettingsStub.should.be.calledWithExactly("provider");
      });
      it("should build instance and return the service", () => {
        return this.invokeStub.should.have.been.calledWithExactly(Test, this.locals, {useScope: true});
      });
      it("should return the service instance", () => {
        expect(this.result).to.deep.eq("instance");
      });
    });

    describe("when dependency is a class from registry (know, instance defined, buildable, INSTANCE)", () => {
      before(() => {
        this.injector = new InjectorService();

        this.symbol = class Test {};

        this.locals = new Map();
        this.getStub = Sinon.stub(this.injector, "getProvider").returns({
          instance: {instance: "instance"},
          provide: Test,
          type: "provider",
          scope: ProviderScope.INSTANCE
        });

        this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns({
          buildable: true,
          injectable: true
        });

        this.invokeStub = Sinon.stub(this.injector, "invoke").returns("instance");

        this.result = this.injector.mapServices({
          dependency: this.symbol,
          locals: this.locals,
          useScope: true,
          parentScope: true,
          token: class ServiceTest {}
        });
      });

      after(() => {
        this.getStub.restore();
        this.invokeStub.restore();
        this.getRegistrySettingsStub.restore();
      });

      it("should call GlobalProviders.get", () => {
        this.getStub.should.have.been.calledWithExactly(this.symbol);
      });

      it("should call GlobalProviders.getRegistrySettings", () => {
        this.getRegistrySettingsStub.should.be.calledWithExactly("provider");
      });
      it("should build instance and return the service", () => {
        return this.invokeStub.should.have.been.calledWithExactly(Test, this.locals, {useScope: true});
      });
      it("should return the service instance", () => {
        expect(this.result).to.deep.eq("instance");
      });
    });

    describe("when dependency is a class from registry (know, instance defined, buildable, SCOPE ERROR)", () => {
      before(() => {
        this.injector = new InjectorService();

        this.symbol = class Test {};

        this.locals = new Map();
        this.getStub = Sinon.stub(this.injector, "getProvider").returns({
          instance: {instance: "instance"},
          provide: Test,
          type: "provider",
          scope: ProviderScope.REQUEST
        });

        this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns({
          buildable: true,
          injectable: true
        });

        this.invokeStub = Sinon.stub(this.injector, "invoke").returns("instance");

        try {
          this.result = this.injector.mapServices({
            dependency: this.symbol,
            locals: this.locals,
            useScope: true,
            parentScope: false,
            token: class ServiceTest {}
          });
        } catch (er) {
          this.error = er;
        }
      });

      after(() => {
        this.getStub.restore();
        this.invokeStub.restore();
        this.getRegistrySettingsStub.restore();
      });

      it("should call GlobalProviders.get", () => {
        this.getStub.should.have.been.calledWithExactly(this.symbol);
      });

      it("should call GlobalProviders.getRegistrySettings", () => {
        this.getRegistrySettingsStub.should.be.calledWithExactly("provider");
      });
      it("should not build instance", () => {
        return this.invokeStub.should.not.have.been.called;
      });
      it("should throw an error", () => {
        expect(this.error.message).to.eq(
          "Service of type Test can not be injected as it is request scoped, while ServiceTest is singleton scoped"
        );
      });
    });

    describe("when dependency is a class from registry (INJECTION ERROR)", () => {
      before(() => {
        this.injector = new InjectorService();

        this.symbol = class Test {};

        this.locals = new Map();
        this.getStub = Sinon.stub(this.injector, "getProvider").returns({
          instance: {instance: "instance"},
          provide: this.symbol,
          type: "provider",
          scope: ProviderScope.REQUEST
        });

        this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns({
          buildable: true,
          injectable: true
        });

        this.invokeStub = Sinon.stub(this.injector, "invoke").throws(new Error("Origin Error"));

        try {
          this.result = this.injector.mapServices({
            dependency: this.symbol,
            locals: this.locals,
            useScope: true,
            parentScope: true,
            token: class ServiceTest {}
          });
        } catch (er) {
          this.error = er;
        }
      });

      after(() => {
        this.getStub.restore();
        this.invokeStub.restore();
        this.getRegistrySettingsStub.restore();
      });

      it("should call GlobalProviders.get", () => {
        this.getStub.should.have.been.calledWithExactly(this.symbol);
      });

      it("should call GlobalProviders.getRegistrySettings", () => {
        this.getRegistrySettingsStub.should.be.calledWithExactly("provider");
      });
      it("should build instance and return the service", () => {
        return this.invokeStub.should.have.been.calledWithExactly(this.symbol, this.locals, {useScope: true});
      });
      it("should throw an error", () => {
        expect(this.error.message).to.deep.eq("Service ServiceTest > Test injection failed.");
      });

      it("should throw an error with origin error", () => {
        expect(this.error.origin.message).to.deep.eq("Origin Error");
      });
    });

    describe("when dependency is a class from registry (NOT INJECTABLE)", () => {
      before(() => {
        this.injector = new InjectorService();

        this.symbol = class Test {};

        this.locals = new Map();
        this.getStub = Sinon.stub(this.injector, "getProvider").returns({
          instance: {instance: "instance"},
          useClass: "useClass",
          type: "provider",
          scope: ProviderScope.REQUEST
        });

        this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns({
          buildable: true,
          injectable: false
        });

        this.invokeStub = Sinon.stub(this.injector, "invoke");

        try {
          this.result = this.injector.mapServices({
            dependency: this.symbol,
            locals: this.locals,
            useScope: true,
            parentScope: true,
            token: class ServiceTest {}
          });
        } catch (er) {
          this.error = er;
        }
      });

      after(() => {
        this.getStub.restore();
        this.invokeStub.restore();
        this.getRegistrySettingsStub.restore();
      });

      it("should call GlobalProviders.get", () => {
        this.getStub.should.have.been.calledWithExactly(this.symbol);
      });

      it("should call GlobalProviders.getRegistrySettings", () => {
        this.getRegistrySettingsStub.should.be.calledWithExactly("provider");
      });
      it("should not build service", () => {
        return this.invokeStub.should.not.have.been.called;
      });
      it("should throw an error", () => {
        expect(this.error.message).to.deep.eq("Service ServiceTest > Test not injectable.");
      });
    });
  });

  describe("build()", () => {
    before(() => {
      this.injector = new InjectorService();
    });

    describe("when the provider has scope ProviderScope.INSTANCE", () => {
      class Test {}

      before(() => {
        this.injector = new InjectorService();
        this.provider = new Provider(Test);
        this.provider.type = "controller";

        this.injector.set(Test, this.provider);
        this.injector.get(SettingsService).scopes = {
          [ProviderType.CONTROLLER]: ProviderScope.INSTANCE
        };

        this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns({
          buildable: true
        });

        this.invokeStub = Sinon.stub(this.injector, "invoke").returns(new Test());

        this.locals = this.injector.build();
      });

      after(() => {
        this.getRegistrySettingsStub.restore();
        this.invokeStub.restore();
      });

      it("should call InjectorService.invoke()", () => {
        this.invokeStub.should.not.have.been.called;
      });

      it("should not create an instance", () => {
        expect(this.provider.instance).to.be.undefined;
      });

      it("should set the default scope", () => {
        expect(this.provider.scope).to.eq(ProviderScope.INSTANCE);
      });

      it("should store the instance in locals map", () => {
        expect(this.locals.get(Test)).to.be.undefined;
      });
    });
    describe("when the provider has scope ProviderScope.REQUEST for controller", () => {
      class Test {}

      before(() => {
        this.injector = new InjectorService();
        this.provider = new Provider(Test);
        this.provider.type = "controller";

        this.injector.set(Test, this.provider);
        this.injector.get(SettingsService).scopes = {
          [ProviderType.CONTROLLER]: ProviderScope.REQUEST
        };

        this.invokeStub = Sinon.stub(this.injector, "invoke").returns(new Test());

        this.locals = this.injector.build();
      });

      after(() => {
        this.invokeStub.restore();
      });

      it("should call InjectorService.invoke()", () => {
        this.invokeStub.should.not.have.been.called;
      });

      it("should not create an instance", () => {
        expect(this.provider.instance).to.be.undefined;
      });

      it("should set the default scope", () => {
        expect(this.provider.scope).to.eq(ProviderScope.REQUEST);
      });

      it("should store the instance in locals map", () => {
        expect(this.locals.get(Test)).to.be.undefined;
      });
    });
    describe("when the provider has scope ProviderScope.SINGLETON for controller", () => {
      class Test {}

      before(() => {
        this.injector = new InjectorService();
        this.provider = new Provider(Test);
        this.provider.type = "controller";

        this.injector.set(Test, this.provider);
        this.injector.get(SettingsService).scopes = {
          [ProviderType.CONTROLLER]: ProviderScope.SINGLETON
        };

        this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns({
          buildable: true
        });

        this.invokeStub = Sinon.stub(this.injector, "invoke").returns(new Test());

        this.locals = this.injector.build();
      });

      after(() => {
        this.getRegistrySettingsStub.restore();
        this.invokeStub.restore();
      });

      it("should call InjectorService.invoke()", () => {
        this.invokeStub.should.have.been.calledWithExactly(Test, Sinon.match.instanceOf(Map));
      });

      it("should create an instance", () => {
        expect(this.provider.instance).to.be.instanceOf(Test);
      });

      it("should set the default scope", () => {
        expect(this.provider.scope).to.eq(ProviderScope.SINGLETON);
      });

      it("should store the instance in locals map", () => {
        expect(this.locals.get(Test)).to.be.instanceOf(Test);
      });
    });
  });

  describe("invoke()", () => {
    before(() => {
      this.injector = new InjectorService();
    });

    describe("when isClass", () => {
      class Test {}

      before(() => {
        this.constructStub = Sinon.stub().returns("instance");
        this.mapInvokeOptionsStub = Sinon.stub(this.injector, "mapInvokeOptions").returns({
          token: Test,
          deps: ["dependency"],
          scope: "singleton",
          useScope: false,
          construct: this.constructStub
        });
        this.mapServicesStub = Sinon.stub(this.injector, "mapServices").returns("dep1");
        this.bindInjectablePropertiesStub = Sinon.stub(this.injector, "bindInjectableProperties");

        this.result = this.injector.invoke(Test, "locals", {options: "options"});
      });

      after(() => {
        this.mapInvokeOptionsStub.restore();
        this.mapServicesStub.restore();
        this.bindInjectablePropertiesStub.restore();
      });

      it("should called mapInvokeOptions", () => {
        this.mapInvokeOptionsStub.should.have.been.calledWithExactly(Test, {options: "options"});
      });

      it("should called mapServices", () => {
        this.mapServicesStub.should.have.been.calledWithExactly({
          dependency: "dependency",
          token: Test,
          locals: "locals",
          useScope: false,
          parentScope: "singleton"
        });
      });

      it("should called construct function", () => {
        this.constructStub.should.have.been.calledWithExactly(["dep1"]);
      });

      it("should called bindInjectableProperties", () => {
        this.bindInjectablePropertiesStub.should.have.been.calledWithExactly("instance");
      });

      it("should return an instance", () => {
        expect(this.result).to.eq("instance");
      });
    });

    describe("when is not a class", () => {
      class Test {}

      before(() => {
        this.constructStub = Sinon.stub().returns("instance");
        this.mapInvokeOptionsStub = Sinon.stub(this.injector, "mapInvokeOptions").returns({
          token: "token",
          deps: ["dependency"],
          scope: "singleton",
          useScope: false,
          construct: this.constructStub
        });
        this.mapServicesStub = Sinon.stub(this.injector, "mapServices").returns("dep1");
        this.bindInjectablePropertiesStub = Sinon.stub(this.injector, "bindInjectableProperties");

        this.result = this.injector.invoke(Test, "locals", {options: "options"});
      });

      after(() => {
        this.mapInvokeOptionsStub.restore();
        this.mapServicesStub.restore();
        this.bindInjectablePropertiesStub.restore();
      });

      it("should called mapInvokeOptions", () => {
        this.mapInvokeOptionsStub.should.have.been.calledWithExactly(Test, {options: "options"});
      });

      it("should called mapServices", () => {
        this.mapServicesStub.should.have.been.calledWithExactly({
          dependency: "dependency",
          token: "token",
          locals: "locals",
          useScope: false,
          parentScope: "singleton"
        });
      });

      it("should called construct function", () => {
        this.constructStub.should.have.been.calledWithExactly(["dep1"]);
      });

      it("shouldn't called bindInjectableProperties", () => {
        this.bindInjectablePropertiesStub.should.not.have.been.called;
      });

      it("should return an instance", () => {
        expect(this.result).to.eq("instance");
      });
    });
  });

  describe("invokeMethod()", () => {
    class Test {}

    before(() => {
      this.injector = new InjectorService();
    });

    describe("when is method", () => {
      before(() => {
        this.handler = Sinon.stub();
        this.constructStub = Sinon.stub().returns("instance");
        this.getParamsTypesStub = Sinon.stub(Metadata, "getParamTypes").returns(["dep1"]);

        this.mapInvokeOptionsStub = Sinon.stub(this.injector, "mapInvokeOptions").returns({
          deps: ["dependency"],
          construct: this.constructStub
        });
        this.mapServicesStub = Sinon.stub(this.injector, "mapServices").returns("dep1");

        this.result = this.injector.invokeMethod(this.handler, "locals", {
          target: Test,
          methodName: "test"
        });
      });

      after(() => {
        this.mapInvokeOptionsStub.restore();
        this.mapServicesStub.restore();
        this.getParamsTypesStub.restore();
      });

      it("should called getParamsTypes", () => {
        this.getParamsTypesStub.should.have.been.calledWithExactly(prototypeOf(Test), "test");
      });

      it("should called mapInvokeOptions", () => {
        this.mapInvokeOptionsStub.should.have.been.calledWithExactly(this.handler, {
          deps: ["dep1"],
          target: Test,
          methodName: "test"
        });
      });

      it("should called mapServices", () => {
        this.mapServicesStub.should.have.been.calledWithExactly({
          dependency: "dependency",
          token: Test,
          locals: "locals",
          useScope: false
        });
      });

      it("should called construct function", () => {
        this.constructStub.should.have.been.calledWithExactly(["dep1"]);
      });

      it("should return an instance", () => {
        expect(this.result).to.eq("instance");
      });
    });
    describe("when is handler", () => {
      before(() => {
        this.handler = Sinon.stub();
        this.constructStub = Sinon.stub().returns("something");
        this.getParamsTypesStub = Sinon.stub(Metadata, "getParamTypes");

        this.mapInvokeOptionsStub = Sinon.stub(this.injector, "mapInvokeOptions").returns({
          deps: ["dependency"],
          construct: this.constructStub
        });
        this.mapServicesStub = Sinon.stub(this.injector, "mapServices").returns("dep1");
        this.result = this.injector.invokeMethod(this.handler, "locals", {
          deps: ["dep1"]
        });
      });

      after(() => {
        this.mapInvokeOptionsStub.restore();
        this.mapServicesStub.restore();
        this.getParamsTypesStub.restore();
      });

      it("should not called getParamsTypes", () => {
        this.getParamsTypesStub.should.not.have.been.called;
      });

      it("should called mapInvokeOptions", () => {
        this.mapInvokeOptionsStub.should.have.been.calledWithExactly(this.handler, {
          deps: ["dep1"]
        });
      });

      it("should called mapServices", () => {
        this.mapServicesStub.should.have.been.calledWithExactly({
          dependency: "dependency",
          token: this.handler,
          locals: "locals",
          useScope: false
        });
      });

      it("should called construct function", () => {
        this.constructStub.should.have.been.calledWithExactly(["dep1"]);
      });

      it("should return something", () => {
        expect(this.result).to.eq("something");
      });
    });
    describe("when method is already injected", () => {
      before(() => {
        this.handler = Sinon.stub().returns("something");
        this.handler.$injected = true;
        this.getParamsTypesStub = Sinon.stub(Metadata, "getParamTypes");

        this.mapInvokeOptionsStub = Sinon.stub(this.injector, "mapInvokeOptions");
        this.mapServicesStub = Sinon.stub(this.injector, "mapServices");

        this.result = this.injector.invokeMethod(this.handler, "locals", {
          target: Test,
          methodName: "test"
        });
      });

      after(() => {
        this.mapInvokeOptionsStub.restore();
        this.mapServicesStub.restore();
        this.getParamsTypesStub.restore();
      });

      it("should not called getParamsTypes", () => {
        this.getParamsTypesStub.should.not.have.been.called;
      });

      it("should not called mapInvokeOptions", () => {
        this.mapInvokeOptionsStub.should.not.have.been.called;
      });

      it("should not called mapServices", () => {
        this.mapServicesStub.should.not.have.been.called;
      });

      it("should called construct function", () => {
        this.handler.should.have.been.calledWithExactly("locals");
      });

      it("should return an instance", () => {
        expect(this.result).to.eq("something");
      });
    });
  });

  describe("bindInjectableProperties()", () => {
    class TestBind {}

    before(() => {
      this.injector = new InjectorService();
    });
    before(
      inject([InjectorService], (injector: any) => {
        this.injector = injector;
        this.instance = new TestBind();
        this.injectableProperties = {
          testMethod: {
            bindingType: "method"
          },
          testProp: {
            bindingType: "property"
          },
          testConst: {
            bindingType: "constant"
          },
          testValue: {
            bindingType: "value"
          },
          testCustom: {
            bindingType: "custom",
            onInvoke: Sinon.stub()
          }
        };

        Store.from(TestBind).set("injectableProperties", this.injectableProperties);

        Sinon.stub(injector, "bindMethod");
        Sinon.stub(injector, "bindProperty");
        Sinon.stub(injector, "bindConstant");
        Sinon.stub(injector, "bindValue");

        injector.bindInjectableProperties(this.instance);
      })
    );

    after(() => {
      this.injector.bindMethod.restore();
      this.injector.bindProperty.restore();
      this.injector.bindConstant.restore();
      this.injector.bindValue.restore();
    });

    it("should call bindMethod", () => {
      this.injector.bindMethod.should.have.been.calledWithExactly(this.instance, this.injectableProperties.testMethod);
    });

    it("should call bindProperty", () => {
      this.injector.bindProperty.should.have.been.calledWithExactly(this.instance, this.injectableProperties.testProp);
    });

    it("shoul call bindConstant", () => {
      this.injector.bindConstant.should.have.been.calledWithExactly(this.instance, this.injectableProperties.testConst);
    });

    it("should call bindValue", () => {
      this.injector.bindValue.should.have.been.calledWithExactly(this.instance, this.injectableProperties.testValue);
    });

    it("should call onInvoke", () => {
      this.injectableProperties.testCustom.onInvoke.should.have.been.calledWithExactly(
        this.injector,
        this.instance,
        this.injectableProperties.testCustom
      );
    });
  });

  describe("bindMethod()", () => {
    class TestBind {
      testMethod() {}
    }

    before(() => {
      this.injector = new InjectorService();
    });
    before(
      inject([InjectorService], (injector: any) => {
        this.injector = injector;
        this.instance = new TestBind();
        this.locals = new Map();

        Sinon.stub(this.injector, "invokeMethod");
        Sinon.stub(this.instance, "testMethod");

        this.injector.bindMethod(this.instance, {propertyKey: "testMethod"});

        this.instance.testMethod(this.locals);
      })
    );

    after(() => {
      this.injector.invokeMethod.restore();
    });

    it("should bind the method", () => {
      expect(this.instance.testMethod.$injected).to.be.true;
    });

    it("should call bindMethod()", () => {
      this.injector.invokeMethod.should.have.been.calledWithExactly(Sinon.match.func, this.locals, {
        target: TestBind,
        methodName: "testMethod"
      });
    });
  });

  describe("bindProperty()", () => {
    class TestBind {}

    before(() => {
      this.injector = new InjectorService();
    });
    before(
      inject([InjectorService], (injector: any) => {
        this.injector = injector;
        this.instance = new TestBind();

        Sinon.stub(this.injector, "get").returns(injector);

        this.injector.bindProperty(this.instance, {propertyKey: "testProp", useType: InjectorService});
        this.result = this.instance.testProp;
      })
    );

    after(() => {
      this.injector.get.restore();
    });

    it("should bind the method", () => {
      expect(this.result).to.be.instanceOf(InjectorService);
    });

    it("should call bindMethod()", () => {
      this.injector.get.should.have.been.calledWithExactly(InjectorService);
    });
  });

  describe("bindValue()", () => {
    class TestBind {}

    before(() => {
      this.injector = new InjectorService();
    });
    before(
      inject([InjectorService], (injector: any) => {
        this.injector = injector;
        this.instance = new TestBind();

        Sinon.stub(this.injector.settings, "get").returns("value");
        Sinon.stub(this.injector.settings, "set");

        this.injector.bindValue(this.instance, {propertyKey: "testProp", expression: "expression"});
        this.instance.testProp = "setValue";
        this.result = this.instance.testProp;
      })
    );

    after(() => {
      this.injector.settings.get.restore();
      this.injector.settings.set.restore();
    });

    it("should bind the method", () => {
      expect(this.result).to.equal("value");
    });

    it("should call get()", () => {
      this.injector.settings.get.should.have.been.calledWithExactly("expression");
    });

    it("should call set()", () => {
      this.injector.settings.set.should.have.been.calledWithExactly("expression", "setValue");
    });
  });

  describe("bindConstant()", () => {
    class TestBind {}

    before(() => {
      this.injector = new InjectorService();
    });
    before(
      inject([InjectorService], (injector: any) => {
        this.injector = injector;
        this.instance = new TestBind();

        Sinon.stub(this.injector.settings, "get").returns("value");

        this.injector.bindConstant(this.instance, {propertyKey: "testProp", expression: "expression"});
        this.result = this.instance.testProp;
      })
    );

    after(() => {
      this.injector.settings.get.restore();
    });

    it("should bind the method", () => {
      expect(this.result).to.equal("value");
    });

    it("should call bindMethod()", () => {
      this.injector.settings.get.should.have.been.calledWithExactly("expression");
    });
  });
});
