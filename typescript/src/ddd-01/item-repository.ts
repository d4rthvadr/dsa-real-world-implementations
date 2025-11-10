import { Item } from "./entities";
import Repository from "./repository.base";

export class ItemRepository extends Repository<Item, string> {
  constructor() {
    super();
  }

  get path(): string {
    return "items";
  }

  toResource<E>(entity: unknown): E {
    // transform to explict body type
    return entity as E;
  }
}
