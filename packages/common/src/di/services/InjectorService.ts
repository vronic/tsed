import {
  Env,
  getClass,
  getClassOrSymbol,
  isClass,
  isObject,
  Metadata,
  nameOf,
  promiseTimeout,
  prototypeOf,
  RegistryKey,
  Store,
  Type
} from "@tsed/core";
import {$log} from "ts-log-debug";
import {ParentProvider, Provider} from "../class/Provider";
import {InjectionError} from "../errors/InjectionError";
import {InjectionScopeError} from "../errors/InjectionScopeError";
import {IInvokeMethodOptions, IProvider, LocalsContainer, ProviderScope, TokenProvider} from "../interfaces";
import {IInjectableProperties, IInjectablePropertyService, IInjectablePropertyValue} from "../interfaces/IInjectableProperties";
import {IInvokeMapService, IInvokeOptions, IInvokeSettings} from "../interfaces/IInvokeOptions";
import {ProviderType} from "../interfaces/ProviderType";
import {GlobalProviders, registerProvider} from "../registries/ProviderRegistry";
import {SettingsService} from "./SettingsService";

/**
 * This service contain all services collected by `@Service` or services declared manually with `InjectorService.factory()` or `InjectorService.service()`.
 *
 * ### Example:
 *
 * ```typescript
 * import {InjectorService} from "@tsed/common";
 *
 * // Import the services (all services are decorated with @Service()";
 * import MyService1 from "./services/service1";
 * import MyService2 from "./services/service2";
 * import MyService3 from "./services/service3";
 *
 * // When all services is imported you can load InjectorService.
 * const injector = new InjectorService()
 * injector.load();
 *
 * const myService1 = injector.get<MyService1>(MyServcice1);
 * ```
 *
 * > Note: `ServerLoader` make this automatically when you use `ServerLoader.mount()` method (or settings attributes) and load services and controllers during the starting server.
 *
 */
export class InjectorService extends Map<RegistryKey, Provider<any>> {
  constructor() {
    super();
    this.initInjector();
    this.initSettings();
  }

  get settings() {
    return this.getProvider(SettingsService)!.instance;
  }

  /**
   *
   */
  private initInjector() {
    this.forkProvider(InjectorService, this);
  }

  /**
   *
   */
  private initSettings() {
    const provider = GlobalProviders.get(SettingsService)!;

    this.forkProvider(SettingsService, this.invoke<SettingsService>(provider.useClass));
  }

  /**
   * Get a service or factory already constructed from his symbol or class.
   *
   * #### Example
   *
   * ```typescript
   * import {InjectorService} from "@tsed/common";
   * import MyService from "./services";
   *
   * class OtherService {
   *      constructor(injectorService: InjectorService) {
   *          const myService = injectorService.get<MyService>(MyService);
   *      }
   * }
   * ```
   *
   * @param target The class or symbol registered in InjectorService.
   * @returns {boolean}
   */
  get<T>(target: Type<T> | symbol | any): T | undefined {
    return (super.has(target) && super.get(getClassOrSymbol(target))!.instance) || undefined;
  }

  /**
   * The has() method returns a boolean indicating whether an element with the specified key exists or not.
   * @param key
   * @returns {boolean}
   */
  has(key: RegistryKey): boolean {
    return super.has(getClassOrSymbol(key)) && !!this.get(key);
  }

  hasProvider(key: RegistryKey) {
    return super.has(getClassOrSymbol(key));
  }

  /**
   *
   * @param obj
   */
  addProvider(obj: RegistryKey | IProvider<any>): this {
    let token: RegistryKey;
    let provider: IProvider<any>;

    if (isClass(obj) && "provide" in obj) {
      token = obj.provide;
      provider = obj as IProvider<any>;
    } else {
      token = obj as RegistryKey;
      provider = {provide: obj} as IProvider<any>;
    }

    if (!GlobalProviders.has(token)) {
      registerProvider(provider);
    }

    const clonedProvider = GlobalProviders.get(token)!.clone();

    Object.keys(provider).forEach(key => {
      clonedProvider[key] = (provider as any)[key];
    });

    this.set(token, clonedProvider);

    return this;
  }

  /**
   * The getProvider() method returns a specified element from a Map object.
   * @param key Required. The key of the element to return from the Map object.
   * @returns {T} Returns the element associated with the specified key or undefined if the key can't be found in the Map object.
   */
  getProvider(key: RegistryKey): Provider<any> | undefined {
    return super.get(getClassOrSymbol(key));
  }

  /**
   *
   * @param {RegistryKey} key
   * @param instance
   */
  forkProvider(key: RegistryKey, instance?: any): Provider<any> {
    const provider = GlobalProviders.get(key)!.clone();
    this.set(key, provider);

    provider.instance = instance;

    return provider;
  }

  /**
   *
   * @param token1
   * @param token2
   */
  createAlias(token1: Type<any>, token2: Type<any>): this {
    const provider = this.getProvider(token1)!;

    this.set(token2, provider);

    return this;
  }

  /**
   *
   * @param {ProviderType} type
   * @returns {[RegistryKey , Provider<any>][]}
   */
  getProviders(type?: ProviderType | string): Provider<any>[] {
    return Array.from(this)
      .filter(([key, provider]) => (type ? provider.type === type : true))
      .map(([key, provider]) => provider);
  }

  /**
   * Invoke the class and inject all services that required by the class constructor.
   *
   * #### Example
   *
   * ```typescript
   * import {InjectorService} from "@tsed/common";
   * import MyService from "./services";
   *
   * class OtherService {
   *     constructor(injectorService: InjectorService) {
   *          const myService = injectorService.invoke<MyService>(MyService);
   *      }
   *  }
   * ```
   *
   * @param target The injectable class to invoke. Class parameters are injected according constructor signature.
   * @param locals  Optional object. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted.
   * @param options Invoke options
   * @returns {T} The class constructed.
   */
  invoke<T>(target: TokenProvider, locals: LocalsContainer = new Map(), options: Partial<IInvokeOptions<T>> = {}): T {
    const {token, deps, scope, useScope, construct, parent} = this.mapInvokeOptions(target, options);
    const services = deps.map(dependency =>
      this.mapServices({
        token,
        parent,
        dependency,
        locals,
        useScope,
        parentScope: scope
      })
    );

    const instance = construct(services);

    if (instance && isObject(instance)) {
      this.bindInjectableProperties(instance);
    }

    return instance;
  }

  /**
   *
   * @param target
   * @param locals
   * @param options
   */
  invokeRequest<T>(target: TokenProvider, locals: LocalsContainer, options: Partial<IInvokeOptions<T>> = {}): T {
    const provider = this.getProvider(target);

    /* istanbul ignore next */
    if (!provider) {
      throw new Error(`${nameOf(target)} component not found in the injector`);
    }

    if (locals.has(target)) {
      return locals.get(target);
    }

    let instance;
    switch (provider.scope) {
      default:
      case ProviderScope.SINGLETON:
        instance = provider.instance;
        break;

      case ProviderScope.REQUEST:
        instance = this.invoke(provider.provide, locals, {...options, useScope: true});
        locals.set(target, instance);
        break;

      case ProviderScope.INSTANCE:
        instance = this.invoke(provider.provide, locals);
        break;
    }

    return instance;
  }

  /**
   * Invoke a class method and inject service.
   *
   * #### IInvokeMethodOptions options
   *
   * * **target**: Optional. The class instance.
   * * **methodName**: `string` Optional. The method name.
   * * **designParamTypes**: `any[]` Optional. List of injectable types.
   * * **locals**: `Map<Function, any>` Optional. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted.
   *
   * #### Example
   *
   * ```typescript
   * import {InjectorService} from "@tsed/common";
   *
   * class MyService {
   *      constructor(injectorService: InjectorService) {
   *          injectorService.invokeMethod(this.method, {
   *              target: this,
   *              methodName: 'method'
   *          });
   *      }
   *
   *   method(otherService: OtherService) {}
   * }
   * ```
   *
   * @returns {any}
   * @param handler The injectable method to invoke. Method parameters are injected according method signature.
   * @param locals
   * @param options Object to configure the invocation.
   */
  invokeMethod(handler: any, locals: LocalsContainer = new Map(), options: IInvokeMethodOptions<any>): any {
    const {target, methodName} = options;

    if (handler.$injected) {
      return handler.call(target, locals);
    }

    const {deps, construct} = this.mapInvokeOptions(handler, {
      deps: target && Metadata.getParamTypes(prototypeOf(target), methodName),
      ...options
    });

    const services = deps.map((dependency: any) =>
      this.mapServices({
        dependency,
        token: target || handler,
        locals,
        useScope: false
      })
    );

    return construct(services);
  }

  /**
   *
   * @param token
   * @param options
   */
  private mapInvokeOptions(token: TokenProvider, options: Partial<IInvokeOptions<any>> = {}): IInvokeSettings {
    const {target, methodName, useScope = false, parent} = options;

    let deps: TokenProvider[] | undefined = options.deps;
    let scope = options.scope;
    let construct = (deps: TokenProvider[]) => {};

    if (this.hasProvider(token)) {
      const provider = this.getProvider(token)!;
      if (provider.useFactory) {
        construct = (deps: TokenProvider[]) => provider.useFactory(...deps);
      } else if (provider.useValue) {
        construct = () => (typeof provider.useValue === "function" ? provider.useValue() : provider.useValue);
      } else if (provider.useClass) {
        deps = deps || Metadata.getParamTypes(provider.useClass);
        construct = (deps: TokenProvider[]) => new provider.useClass(...deps);
      }

      deps = deps || provider.deps;
      scope = scope || provider.scope || Store.from(token).get("scope");
    } else {
      if (isClass(token)) {
        construct = (deps: TokenProvider[]) => {
          try {
            return new token(...deps);
          } catch (er) {
            console.error(token, isClass(token), er);
          }
        };
      }
    }
    if (target && methodName) {
      deps = deps || Metadata.getParamTypes(prototypeOf(target), methodName);
      construct = (deps: TokenProvider[]) => token(...deps);
    } else {
      if (isClass(token)) {
        deps = deps || Metadata.getParamTypes(token);
      }
    }

    if (!isClass(token) && typeof token === "function") {
      construct = (deps: TokenProvider[]) => token(...deps);
    }

    return {
      token,
      deps: deps! || [],
      useScope,
      scope: scope || ProviderScope.SINGLETON,
      parent,
      construct
    };
  }

  /**
   *
   * @returns {any}
   * @param options
   */
  private mapServices(options: IInvokeMapService) {
    const {token, dependency, locals, parentScope, useScope, parent} = options;
    const serviceName = typeof dependency === "function" ? nameOf(dependency) : dependency;
    const localService = locals.get(serviceName) || locals.get(dependency);

    if (localService) {
      return localService;
    }

    if (dependency === Provider) {
      return this.getProvider(token);
    }

    if (dependency === ParentProvider) {
      return this.getProvider(parent);
    }

    const provider = this.getProvider(dependency);
    if (!provider) {
      throw new InjectionError(token, serviceName.toString());
    }

    const {injectable} = GlobalProviders.getRegistrySettings(provider.type);
    const rebuild = provider.scope === ProviderScope.INSTANCE || provider.scope === ProviderScope.REQUEST;

    if (!injectable) {
      throw new InjectionError(token, serviceName.toString(), "not injectable");
    }

    if (provider.instance && !rebuild) {
      return provider.instance;
    }

    if (rebuild && useScope && !parentScope) {
      throw new InjectionScopeError(provider.provide, token);
    }

    try {
      const instance = this.invoke<any>(provider.provide, locals, {useScope, parent: token});

      if (provider.scope !== ProviderScope.INSTANCE) {
        locals.set(provider.provide, instance);
      }

      return instance;
    } catch (er) {
      console.log("Err", er);
      const error = new InjectionError(token, serviceName.toString(), "injection failed");
      (error as any).origin = er;
      throw error;
    }
  }

  /**
   *
   * @param instance
   */
  private bindInjectableProperties(instance: any) {
    // TODO test if store exists
    const store = Store.from(getClass(instance));
    if (store && store.has("injectableProperties")) {
      const properties: IInjectableProperties = store.get("injectableProperties") || [];

      Object.keys(properties)
        .map(key => properties[key])
        .forEach(definition => {
          switch (definition.bindingType) {
            case "method":
              this.bindMethod(instance, definition);
              break;
            case "property":
              this.bindProperty(instance, definition);
              break;
            case "constant":
              this.bindConstant(instance, definition);
              break;
            case "value":
              this.bindValue(instance, definition);
              break;
            case "custom":
              definition.onInvoke(this, instance, definition);
              break;
          }
        });
    }
  }

  /**
   *
   * @param instance
   * @param {string} propertyKey
   */
  private bindMethod(instance: any, {propertyKey}: IInjectablePropertyService) {
    const target = getClass(instance);
    const originalMethod = instance[propertyKey];

    instance[propertyKey] = (locals: Map<Function, string> | any = new Map<Function, string>()) => {
      return this.invokeMethod(originalMethod!.bind(instance), locals instanceof Map ? locals : undefined, {
        target,
        methodName: propertyKey
      });
    };

    instance[propertyKey].$injected = true;
  }

  /**
   *
   * @param instance
   * @param {string} propertyKey
   * @param {any} useType
   */
  private bindProperty(instance: any, {propertyKey, useType}: IInjectablePropertyService) {
    Object.defineProperty(instance, propertyKey, {
      get: () => {
        return this.get(useType);
      }
    });
  }

  /**
   *
   * @param instance
   * @param {string} propertyKey
   * @param {any} useType
   */
  private bindValue(instance: any, {propertyKey, expression, defaultValue}: IInjectablePropertyValue) {
    const descriptor = {
      get: () => this.settings.get(expression) || defaultValue,
      set: (value: any) => this.settings.set(expression, value),
      enumerable: true,
      configurable: true
    };
    Object.defineProperty(instance, propertyKey, descriptor);
  }

  /**
   *
   * @param instance
   * @param {string} propertyKey
   * @param {any} useType
   */
  private bindConstant(instance: any, {propertyKey, expression, defaultValue}: IInjectablePropertyValue) {
    const clone = (o: any) => {
      if (o) {
        return Object.freeze(JSON.parse(JSON.stringify(o)));
      }

      return defaultValue;
    };

    const descriptor = {
      get: () => clone(this.settings.get(expression)),

      enumerable: true,
      configurable: true
    };
    Object.defineProperty(instance, propertyKey, descriptor);

    return descriptor;
  }

  /**
   * Initialize injectorService and load all services/factories.
   */
  async load(): Promise<any> {
    this.build();

    return Promise.all([this.emit("$onInit")]);
  }

  /**
   *
   * @returns {Map<Type<any>, any>}
   */
  private build(): LocalsContainer {
    const locals: LocalsContainer = new Map();

    this.toArray().sort((p1, p2) => {
      p1.global;
    });

    this.forEach(provider => {
      const defaultScope: ProviderScope = this.settings.scopeOf(provider.type);

      if (defaultScope && !provider.scope) {
        provider.scope = defaultScope;
      }

      if (provider.scope === ProviderScope.SINGLETON) {
        if (!locals.has(provider.provide)) {
          provider.instance = this.invoke(provider.provide, locals);

          if (provider.instance) {
            locals.set(provider.provide, provider.instance);
          }
        } else {
          provider.instance = locals.get(provider.provide);
        }
      }
    });

    return locals;
  }

  /**
   * Emit an event to all service. See service [lifecycle hooks](/docs/services.md#lifecycle-hooks).
   * @param eventName The event name to emit at all services.
   * @param args List of the parameters to give to each services.
   * @returns {Promise<any[]>} A list of promises.
   */
  public emit(eventName: string, ...args: any[]) {
    const promises: Promise<any>[] = [];

    $log.debug("\x1B[1mCall hook", eventName, "\x1B[22m");

    this.forEach(provider => {
      const service = provider.instance;

      if (isClass(service) && eventName in service) {
        /* istanbul ignore next */
        if (eventName === "$onInjectorReady") {
          $log.warn("$onInjectorReady hook is deprecated, use $onInit hook insteadof. See https://goo.gl/KhvkVy");
        }

        const promise: any = service[eventName](...args);

        /* istanbul ignore next */
        if (promise && promise.then) {
          promises.push(
            promiseTimeout(promise, 1000).then(result => InjectorService.checkPromiseStatus(eventName, result, nameOf(provider.useClass)))
          );
        }
      }
    });

    /* istanbul ignore next */
    if (promises.length) {
      $log.debug("\x1B[1mCall hook", eventName, " promises built\x1B[22m");

      return promiseTimeout(Promise.all(promises), 2000).then(result => InjectorService.checkPromiseStatus(eventName, result));
    }

    return Promise.resolve();
  }

  public toArray() {
    return Array.from(this.values());
  }

  /**
   *
   * @param {string} eventName
   * @param result
   * @param {string} service
   */

  /* istanbul ignore next */
  private static checkPromiseStatus(eventName: string, result: any, service?: string) {
    if (!result.ok) {
      const msg = `Timeout on ${eventName} hook. Promise are unfulfilled ${service ? "on service" + service : ""}`;
      if (process.env.NODE_ENV === Env.PROD) {
        throw msg;
      } else {
        setTimeout(() => $log.warn(msg, "In production, the warning will down the server!"), 1000);
      }
    }
  }
}

/**
 * Create the first service InjectorService
 */
registerProvider({
  provide: InjectorService,
  scope: ProviderScope.SINGLETON,
  global: true
});
