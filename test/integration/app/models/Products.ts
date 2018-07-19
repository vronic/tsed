/* tslint:disable variable-name */
import {Default, IgnoreProperty, Property, PropertyType, Required} from "@tsed/common";
import {Model, Ref} from "../../../../src/mongoose/decorators";
import {Description} from "../../../../src/swagger";

@Model()
export class Product {
  @IgnoreProperty() _id?: string;

  @IgnoreProperty() __v?: number;

  @Required() title: string;

  @Required() price: number;

  @Default(0)
  discount: number;

  @Property() shopifyId: string;

  @Default(false)
  availability: boolean;

  @Default(false)
  @Description("True when the default shipping settings are set")
  shipping: boolean;

  @Property() description: string;

  @Default(false)
  draft: boolean;

  @Ref("Variant") variants: Variant[];

  @Required()
  @Ref("ProductCategory")
  categories: ProductCategory[];
}

@Model({name: "product_variants"})
export class Variant {
  @IgnoreProperty() _id?: string;

  @IgnoreProperty() __v?: number;

  @Ref("Product") product: Product;

  @Property() name: string;

  @PropertyType(String) options: string[];

  @Default("Infinity") quantity?: number;

  @Property() sku: string;

  @Default(0)
  @Description("Describes how much to be added on top of the base price")
  additional?: number;
}

@Model({name: "product_categories"})
export class ProductCategory {
  @IgnoreProperty() _id?: string;

  @IgnoreProperty() __v?: number;

  @Required() name: string;
}
