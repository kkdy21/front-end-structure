import type { MenuDTO } from "@/repositories/menuRepository/schema/dto/menuDTO";
import type { GetMenuParameters } from "../schema/api-verbs/get";

export interface IMenuRepository {
  collectionPath: string;
  getMenuList(query?: GetMenuParameters): Promise<MenuDTO[]>;
}
