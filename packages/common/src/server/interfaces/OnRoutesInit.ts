import {IProvider} from "@tsed/di";

export interface OnRoutesInit {
  $onRoutesInit(components: Partial<IProvider<any>>[]): void | Promise<any>;
}
