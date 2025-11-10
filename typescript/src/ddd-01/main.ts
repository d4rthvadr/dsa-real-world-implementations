import { Item } from "./entities";
import { ItemRepository } from "./item-repository";
import Repository from "./repository.base";
import { ID } from "./types";

function main() {
  const itemRepository: Repository<Item, ID> = new ItemRepository();

  itemRepository.save({ id: "_id_01" }, 123);
}

main();
