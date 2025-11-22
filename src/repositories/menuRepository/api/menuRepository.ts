import BaseRepository from "@/repositories/baseRepository";
import type { MenuDTO } from "@/repositories/menuRepository/schema/dto/menuDTO";
import type { IMenuRepository } from "./IMenuRepository";
import type { AxiosResponse } from "axios";
import type { GetMenuParameters } from "../schema/api-verbs/get";
import qs from "qs";

class MenuRepository extends BaseRepository implements IMenuRepository {
  async getMenuList(
    query?: GetMenuParameters
  ): Promise<AxiosResponse<MenuDTO[]>> {
    const queryString = query ? qs.stringify(query) : "";
    return this.get<MenuDTO[]>(`/api/menu${queryString}`);
  }
}

export const menuRepository = new MenuRepository();
