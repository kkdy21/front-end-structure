import { create } from "zustand";
import { referenceRepository } from "@/repositories/referenceRepository";
import { MenuEntity } from "@/repositories/menuRepository/entity/menuEntity";
import type { GetMenuParameters } from "@/repositories/menuRepository/schema/api-verbs/get";
import type { BaseState, BaseActions } from "@/repositories/baseStore";
import { baseInitialState } from "@/repositories/baseStore";
import type { MenuDTO } from "@/repositories/menuRepository/schema/dto/menuDTO";

interface MenuState extends BaseState, BaseActions {
  // State
  menus: MenuEntity[];

  // Actions
  fetchMenus: (params?: GetMenuParameters) => Promise<void>;
}

export const useMenuStore = create<MenuState>((set) => {
  const menu = referenceRepository.menuRepository;

  return {
    // Initial State
    ...baseInitialState,
    menus: [],

    // Actions
    fetchMenus: async (params) => {
      set({ isLoading: true, error: null });
      try {
        const data = await menu.getMenuList(params);
        const entities = data.map(
          (dto: MenuDTO, index: number) => new MenuEntity(dto, index)
        );
        set({ menus: entities, isLoading: false });
      } catch (err) {
        set({ error: err as Error, isLoading: false });
      }
    },

    clearError: () => set({ error: null }),
  };
});
