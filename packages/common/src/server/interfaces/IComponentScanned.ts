import {Type} from "@tsed/core";

export interface IComponentScanned {
  endpoint?: string;
  classes: {[key: string]: any};
  components: Type<any>[];

  [key: string]: any;
}
