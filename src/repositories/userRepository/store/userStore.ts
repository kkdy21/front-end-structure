import { create } from 'zustand';
import { UserEntity } from '@/repositories/userRepository/entity/userEntity';
import type { UserDTO } from '@/repositories/userRepository/schema/dto/userDTO';
import type { UserGetListParameters } from '@/repositories/userRepository/schema/api-verbs/get';
import type { UserCreateParameters } from '@/repositories/userRepository/schema/api-verbs/create';
import type { UserUpdateParameters } from '@/repositories/userRepository/schema/api-verbs/update';
import type { BaseState, BaseActions } from '@/repositories/baseStore';
import { baseInitialState } from '@/repositories/baseStore';
import { referenceRepository } from '@/repositories/referenceRepository';

interface UserState extends BaseState, BaseActions {
    // State
    users: UserEntity[];                    // 전체 user 목록 (관리자용)
    currentUser: UserEntity | null;         // 현재 로그인한 user

    // Actions - 조회
    getUsers: (params?: UserGetListParameters) => Promise<void>;
    getUserById: (userId: string) => Promise<void>;

    // Actions - CRUD
    createUser: (params: UserCreateParameters) => Promise<void>;
    updateUser: (params: UserUpdateParameters) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;

    // Actions - 상태 관리
    setCurrentUser: (user: UserEntity | null) => void;
    clearCurrentUser: () => void;
}

export const useUserStore = create<UserState>((set) => {
    const { userRepository } = referenceRepository;

    return {
        // Initial State
        ...baseInitialState,
        users: [],
        currentUser: null,

        // Actions - 조회
        getUsers: async (params) => {
            set({ isLoading: true, error: null });
            try {
                const data = await userRepository.getUsers(params);
                const entities = data.map((dto: UserDTO) => new UserEntity(dto));
                set({ users: entities, isLoading: false });
            } catch (err) {
                set({ error: err as Error, isLoading: false });
                throw err;
            }
        },

        getUserById: async (userId) => {
            set({ isLoading: true, error: null });
            try {
                const data = await userRepository.getUser({ userId });
                const entity = data ? new UserEntity(data) : null;
                set({ currentUser: entity, isLoading: false });
            } catch (err) {
                set({ error: err as Error, isLoading: false });
                throw err;
            }
        },

        // Actions - CRUD
        createUser: async (params) => {
            set({ isLoading: true, error: null });
            try {
                const data = await userRepository.createUser(params);
                const newEntity = new UserEntity(data);
                set((state) => ({
                    users: [...state.users, newEntity],
                    isLoading: false,
                }));
            } catch (err) {
                set({ error: err as Error, isLoading: false });
                throw err;
            }
        },

        updateUser: async (params) => {
            set({ isLoading: true, error: null });
            try {
                const data = await userRepository.updateUser(params);
                const updatedEntity = new UserEntity(data);
                set((state) => ({
                    users: state.users.map((u) =>
                        u.id === updatedEntity.id ? updatedEntity : u
                    ),
                    currentUser:
                        state.currentUser?.id === updatedEntity.id
                            ? updatedEntity
                            : state.currentUser,
                    isLoading: false,
                }));
            } catch (err) {
                set({ error: err as Error, isLoading: false });
                throw err;
            }
        },

        deleteUser: async (userId) => {
            set({ isLoading: true, error: null });
            try {
                await userRepository.deleteUser(userId);
                set((state) => ({
                    users: state.users.filter((u) => u.id !== userId),
                    currentUser:
                        state.currentUser?.id === userId ? null : state.currentUser,
                    isLoading: false,
                }));
            } catch (err) {
                set({ error: err as Error, isLoading: false });
                throw err;
            }
        },

        // Actions - 상태 관리
        setCurrentUser: (user) => set({ currentUser: user }),

        clearCurrentUser: () => set({ currentUser: null }),

        clearError: () => set({ error: null }),
    };
});
