import {Controller, Get, Scope} from "@tsed/common";
import {$log} from "ts-log-debug";
import {Docs, Hidden} from "../../../../../packages/swagger/src";
import {CalendarModel} from "../../models/Calendar";
import {InnerService} from "../../services/InnerService";
import {OuterService} from "../../services/OuterService";

@Controller("/products")
@Scope("request")
@Hidden()
@Docs("hidden")
export class ProductsCtrl {
  constructor(public innerService: InnerService, public outerService: OuterService, @Inject(Product) public product: MongooseModel<Product>, @Inject(Variant) public variant: MongooseModel<Variant>) {
    $log.debug("Controller New Instance");
    $log.debug("innerService == outerService.innerService? ", innerService === outerService.innerService);
  }

  @Get("/")
  async renderCalendars(): Promise<CalendarModel[]> {
    return [{id: "1", name: "test"}];
  }

  $onDestroy() {
    $log.debug("Destroy controller");
  }


  @Post("/")
  async save(@BodyParams() body: Product) {
    const product = new this.product(body);

    return await product.save();
  }

  @Post("/variant")
  async saveVariant(@BodyParams() body: Variant) {
    const variant = new this.variant(body);

    return await variant.save();
  }

  @Get("/list")
  async getList() {
    console.log("this.product.find({})", await this.product.find({}));

    return {products: await this.product.find({})};
  }
}
