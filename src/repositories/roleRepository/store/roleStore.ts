import { create } from 'zustand';
import { RoleEntity } from '@/repositories/roleRepository/entity/roleEntity';
import type { RoleDTO } from '@/repositories/roleRepository/schema/dto/roleDTO';
import type { RoleGetListParameters } from '@/repositories/roleRepository/schema/api-verbs/get';
import type {
    UserWithRoleResponse,
    AssignRoleParameters,
    RemoveRoleParameters,
} from '@/repositories/roleRepository/schema/api-verbs/admin';
import type { BaseState, BaseActions } from '@/repositories/baseStore';
import { baseInitialState } from '@/repositories/baseStore';
import { referenceRepository } from '@/repositories/referenceRepository';

interface RoleState extends BaseState, BaseActions {
    // State
    roles: RoleEntity[];                    // 전체 role 목록 (관리자용)
    currentRole: RoleEntity | null;         // 현재 유저의 role

    // Admin State
    adminRoles: RoleEntity[];               // Admin API로 조회한 Role 목록 (Entity 변환)
    usersWithRoles: UserWithRoleResponse[]; // Role별 유저 목록

    // Actions - 조회
    getRoles: (params?: RoleGetListParameters) => Promise<void>;
    getRoleByUserId: (userId: string) => Promise<void>;

    // Actions - Admin API
    adminGetRoles: (includeInactive?: boolean) => Promise<RoleEntity[]>;
    adminGetUsersByRole: (roleId: string) => Promise<UserWithRoleResponse[]>;
    adminGetAllUsersWithRoles: () => Promise<UserWithRoleResponse[]>;
    adminAssignRole: (params: AssignRoleParameters) => Promise<UserWithRoleResponse>;
    adminRemoveRole: (params: RemoveRoleParameters) => Promise<UserWithRoleResponse>;

    // Actions - 상태 관리
    setCurrentRole: (role: RoleEntity | null) => void;
    setDefaultRole: () => void;             // 기본 role 설정 (RBAC 우회용)
    clearCurrentRole: () => void;
    clearAdminState: () => void;
}

export const useRoleStore = create<RoleState>((set, get) => {
    const { roleRepository } = referenceRepository;

    return {
        // Initial State
        ...baseInitialState,
        roles: [],
        currentRole: null,
        adminRoles: [],
        usersWithRoles: [],

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

        // Actions - Admin API
        adminGetRoles: async (includeInactive = false) => {
            set({ isLoading: true, error: null });
            try {
                const roles = await roleRepository.adminGetRoles({ includeInactive });
                // RoleResponse → RoleEntity 변환
                const entities = roles.map(role => new RoleEntity({
                    id: role.id,
                    name: role.name,
                    displayName: role.displayName,
                    description: role.description,
                    pageAccess: role.pageAccess,
                    isActive: role.isActive,
                    createdAt: role.createdAt,
                    updatedAt: role.updatedAt,
                }));
                set({ adminRoles: entities, isLoading: false });
                return entities;
            } catch (err) {
                set({ error: err as Error, isLoading: false });
                throw err;
            }
        },

        adminGetUsersByRole: async (roleId) => {
            set({ isLoading: true, error: null });
            try {
                const { users } = await roleRepository.adminGetUsersByRole({ roleId });
                return users;
            } catch (err) {
                set({ error: err as Error, isLoading: false });
                throw err;
            }
        },

        /**
         * 모든 Role의 유저를 조회하여 합침
         */
        adminGetAllUsersWithRoles: async () => {
            set({ isLoading: true, error: null });
            try {
                let { adminRoles } = get();

                // Role 목록이 없으면 먼저 조회
                if (adminRoles.length === 0) {
                    // store action 호출 (Entity 변환 포함)
                    adminRoles = await get().adminGetRoles(false);
                }

                // 각 Role별 유저 조회 (실패해도 계속 진행)
                const userPromises = adminRoles.map(role =>
                    roleRepository.adminGetUsersByRole({ roleId: role.id })
                        .catch(err => {
                            console.warn(`Failed to get users for role ${role.id}:`, err);
                            return { role: null, users: [] };
                        })
                );
                const results = await Promise.all(userPromises);

                // 유저 목록 합침 (중복 제거)
                const userMap = new Map<string, UserWithRoleResponse>();
                results.forEach((result) => {
                    const users = result?.users ?? [];
                    users.forEach(user => {
                        userMap.set(user.id, user);
                    });
                });

                const allUsers = Array.from(userMap.values());
                set({ usersWithRoles: allUsers, isLoading: false });
                return allUsers;
            } catch (err) {
                set({ error: err as Error, isLoading: false });
                throw err;
            }
        },

        adminAssignRole: async (params) => {
            set({ isLoading: true, error: null });
            try {
                const updatedUser = await roleRepository.adminAssignRole(params);

                // 로컬 상태 업데이트
                set((state) => ({
                    usersWithRoles: state.usersWithRoles.map(u =>
                        u.id === updatedUser.id ? updatedUser : u
                    ),
                    isLoading: false,
                }));

                return updatedUser;
            } catch (err) {
                set({ error: err as Error, isLoading: false });
                throw err;
            }
        },

        adminRemoveRole: async (params) => {
            set({ isLoading: true, error: null });
            try {
                const updatedUser = await roleRepository.adminRemoveRole(params);

                // 로컬 상태 업데이트
                set((state) => ({
                    usersWithRoles: state.usersWithRoles.map(u =>
                        u.id === updatedUser.id ? updatedUser : u
                    ),
                    isLoading: false,
                }));

                return updatedUser;
            } catch (err) {
                set({ error: err as Error, isLoading: false });
                throw err;
            }
        },

        // Actions - 상태 관리
        setCurrentRole: (role) => set({ currentRole: role }),

        /**
         * 기본 role 설정 - RBAC 백엔드 없이 모든 페이지 접근 허용
         * 추후 백엔드 연동 시 getRoleByUserId로 교체
         */
        setDefaultRole: () => {
            const defaultRoleDTO: RoleDTO = {
                id: 'default-user',
                name: 'User',
                description: '기본 사용자',
                pageAccess: [
                    'dashboard',
                    'student',
                    'timetable',
                    'seat',
                    'attendance',
                    'shared',
                    'admin',
                ],
                isActive: true,
            };
            const defaultRole = new RoleEntity(defaultRoleDTO);
            set({ currentRole: defaultRole, isLoading: false, error: null });
        },

        clearCurrentRole: () => set({ currentRole: null }),

        clearAdminState: () => set({ adminRoles: [], usersWithRoles: [] }),

        clearError: () => set({ error: null }),
    };
});
