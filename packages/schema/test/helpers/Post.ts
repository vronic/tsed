import {Property} from "../../src/decorators/property";
import {User} from "./User";

export class Post {
  @Property()
  id: string;

  @Property()
  owner: User;
}
