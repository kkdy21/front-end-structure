import { orderBy } from "firebase/firestore";
import BaseRepository from "@/repositories/baseRepository";
import type { MenuDTO } from "@/repositories/menuRepository/schema/dto/menuDTO";
import type { IMenuRepository } from "./IMenuRepository";
import type { GetMenuParameters } from "../schema/api-verbs/get";

class MenuRepository extends BaseRepository implements IMenuRepository {
  readonly collectionPath = "menus";

  async getMenuList(query?: GetMenuParameters): Promise<MenuDTO[]> {
    const constraints = [orderBy("order", "asc")];

    const results = await this.getCollection<MenuDTO>(
      this.collectionPath,
      constraints
    );

    // id로 필터링이 필요한 경우
    if (query?.id) {
      return results.filter((menu) => menu.id === query.id);
    }

    return results;
  }
}

export const menuRepository = new MenuRepository();
