import {ProxyMap, Type} from "@tsed/core";
import {Provider} from "../../di/class/Provider";
import {Service} from "../../di/decorators/service";
import {ProviderType} from "../../di/interfaces/ProviderType";
import {InjectorService} from "../../di/services/InjectorService";

/**
 * @deprecated This service will be removed in a future release. Use injectorService directly.
 */
@Service()
export class MiddlewareService extends ProxyMap<Type<any> | any, Provider<any>> {
  constructor(private injectorService: InjectorService) {
    super(injectorService, {filter: {type: ProviderType.MIDDLEWARE}});
  }
}
