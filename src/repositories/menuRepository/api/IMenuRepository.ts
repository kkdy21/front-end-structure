import type { MenuDTO } from "@/repositories/menuRepository/schema/dto/menuDTO";
import type { AxiosResponse } from "axios";
import type { GetMenuParameters } from "../schema/api-verbs/get";

export interface IMenuRepository {
  getMenuList(query?: GetMenuParameters): Promise<AxiosResponse<MenuDTO[]>>;
}
