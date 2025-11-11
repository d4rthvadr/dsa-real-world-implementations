import { Item } from "./entities";
import { ItemRepository } from "./item-repository";
import Repository from "./repository.base";
import { ID } from "./types";

async function main() {
  const itemRepository: Repository<Item, ID> = new ItemRepository();

  await itemRepository.save({ id: "_id_01" }, 123);
}

main()
  .then(() => {
    console.log("Done");
  })
  .catch((e) => {
    console.error("Error in main:", e);
  });
