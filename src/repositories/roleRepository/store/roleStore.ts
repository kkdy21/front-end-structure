import { create } from 'zustand';
import { RoleEntity } from '@/repositories/roleRepository/entity/roleEntity';
import type { RoleDTO } from '@/repositories/roleRepository/schema/dto/roleDTO';
import type { RoleGetListParameters } from '@/repositories/roleRepository/schema/api-verbs/get';
import type { BaseState, BaseActions } from '@/repositories/baseStore';
import { baseInitialState } from '@/repositories/baseStore';
import { referenceRepository } from '@/repositories/referenceRepository';

interface RoleState extends BaseState, BaseActions {
    // State
    roles: RoleEntity[];                    // 전체 role 목록 (관리자용)
    currentRole: RoleEntity | null;         // 현재 유저의 role

    // Actions - 조회
    getRoles: (params?: RoleGetListParameters) => Promise<void>;
    getRoleByUserId: (userId: string) => Promise<void>;

    // Actions - 상태 관리
    setCurrentRole: (role: RoleEntity | null) => void;
    clearCurrentRole: () => void;
}

export const useRoleStore = create<RoleState>((set) => {
    const { roleRepository } = referenceRepository;

    return {
        // Initial State
        ...baseInitialState,
        roles: [],
        currentRole: null,

        // Actions - 조회
        getRoles: async (params) => {
            set({ isLoading: true, error: null });
            try {
                const data = await roleRepository.getRoles(params);
                const entities = data.map((dto: RoleDTO) => new RoleEntity(dto));
                set({ roles: entities, isLoading: false });
            } catch (err) {
                set({ error: err as Error, isLoading: false });
                throw err;
            }
        },

        getRoleByUserId: async (userId) => {
            set({ isLoading: true, error: null });
            try {
                const data = await roleRepository.getRoleByUserId({ userId });
                const entity = data ? new RoleEntity(data) : null;
                set({ currentRole: entity, isLoading: false });
            } catch (err) {
                set({ error: err as Error, isLoading: false });
                throw err;
            }
        },

        // Actions - 상태 관리
        setCurrentRole: (role) => set({ currentRole: role }),

        clearCurrentRole: () => set({ currentRole: null }),

        clearError: () => set({ error: null }),
    };
});
