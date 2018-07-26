import {getClass, isClass, nameOf, NotEnumerable, Store, Type} from "@tsed/core";
import {ProviderScope} from "../interfaces";
import {IProvider} from "../interfaces/IProvider";
import {ProviderType} from "../interfaces/ProviderType";

export class Provider<T> implements IProvider<T> {
  @NotEnumerable()
  protected _useClass: Type<T>;

  @NotEnumerable()
  protected _instance: T;

  @NotEnumerable()
  protected _scope: ProviderScope;
  /**
   *
   */
  public type: ProviderType | any = ProviderType.PROVIDER;
  /**
   *
   */
  public instance: T;
  /**
   *
   */
  public deps: any[];
  /**
   *
   */
  public useFactory: Function;
  /**
   *
   */
  public useValue: any;

  @NotEnumerable()
  private _store: Store;

  [key: string]: any;

  constructor(protected _provide: any) {
    if (isClass(this._provide)) {
      this._provide = getClass(this._provide);
      this._store = Store.from(this._provide);
    }
  }

  /**
   *
   * @returns {any}
   */
  get provide(): any {
    return this._provide;
  }

  /**
   *
   * @param value
   */
  set provide(value: any) {
    this._provide = getClass(value);
  }

  /**
   *
   * @returns {Type<T>}
   */
  get useClass(): Type<T> {
    return this._useClass || this._provide;
  }

  /**
   *
   * @param value
   */
  set useClass(value: Type<T>) {
    if (isClass(value)) {
      this._store = Store.from(value);
      this._useClass = getClass(value);
    }
  }

  /**
   *
   * @returns {string}
   */
  get className() {
    return nameOf(this.provide);
  }

  /**
   *
   * @returns {Store}
   */
  public get store(): Store {
    return this._store;
  }

  /**
   * Get the scope of the provider.
   * @returns {boolean}
   */
  get scope(): ProviderScope {
    return (this._store && this.store.get("scope")) || this._scope;
  }

  /**
   * Change the scope value of the provider.
   * @param scope
   */
  set scope(scope: ProviderScope) {
    if (this._store) {
      this.store.set("scope", scope);
    } else {
      this._scope = scope;
    }
  }

  clone(): Provider<any> {
    const provider = new Provider(this._provide);
    provider.type = this.type;
    provider.useClass = this._useClass;
    provider._instance = this._instance;
    provider.useFactory = this.useFactory;
    provider.deps = this.deps;
    provider._options = this._options;
    provider._scope = this._scope;

    return provider;
  }
}
