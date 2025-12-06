import { create } from 'zustand';
import { UserEntity } from '@/repositories/userRepository/entity/userEntity';
import type { UserDTO, UserDataStatsDTO, UserDataBackupDTO } from '@/repositories/userRepository/schema/dto/userDTO';
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
    dataStats: UserDataStatsDTO | null;     // 사용자 데이터 통계
    lastBackup: UserDataBackupDTO | null;   // 마지막 백업 정보

    // Actions - 조회
    getUsers: (params?: UserGetListParameters) => Promise<void>;
    getUserById: (userId: string) => Promise<void>;

    // Actions - CRUD
    createUser: (params: UserCreateParameters) => Promise<void>;
    updateUser: (params: UserUpdateParameters) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;

    // Actions - 프로필 관리
    deactivateUserProfile: (userId: string) => Promise<void>;
    restoreUserProfile: (userId: string) => Promise<void>;
    deleteUserProfilePermanently: (userId: string, confirmDeletion: boolean) => Promise<void>;

    // Actions - 데이터 관리
    getUserDataStats: (userId: string) => Promise<void>;
    createUserDataBackup: (userId: string) => Promise<UserDataBackupDTO>;

    // Actions - 상태 관리
    setCurrentUser: (user: UserEntity | null) => void;
    clearCurrentUser: () => void;
    clearDataStats: () => void;
}

export const useUserStore = create<UserState>((set) => {
    const { userRepository } = referenceRepository;

    return {
        // Initial State
        ...baseInitialState,
        users: [],
        currentUser: null,
        dataStats: null,
        lastBackup: null,

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

        // Actions - 프로필 관리
        deactivateUserProfile: async (userId) => {
            set({ isLoading: true, error: null });
            try {
                await userRepository.deactivateUserProfile({ userId });
                // 사용자 목록 및 현재 사용자 상태 갱신
                const updatedUser = await userRepository.getUser({ userId });
                if (updatedUser) {
                    const updatedEntity = new UserEntity(updatedUser);
                    set((state) => ({
                        users: state.users.map((u) =>
                            u.id === userId ? updatedEntity : u
                        ),
                        currentUser:
                            state.currentUser?.id === userId
                                ? updatedEntity
                                : state.currentUser,
                        isLoading: false,
                    }));
                } else {
                    set({ isLoading: false });
                }
            } catch (err) {
                set({ error: err as Error, isLoading: false });
                throw err;
            }
        },

        restoreUserProfile: async (userId) => {
            set({ isLoading: true, error: null });
            try {
                await userRepository.restoreUserProfile({ userId });
                // 사용자 목록 및 현재 사용자 상태 갱신
                const updatedUser = await userRepository.getUser({ userId });
                if (updatedUser) {
                    const updatedEntity = new UserEntity(updatedUser);
                    set((state) => ({
                        users: state.users.map((u) =>
                            u.id === userId ? updatedEntity : u
                        ),
                        currentUser:
                            state.currentUser?.id === userId
                                ? updatedEntity
                                : state.currentUser,
                        isLoading: false,
                    }));
                } else {
                    set({ isLoading: false });
                }
            } catch (err) {
                set({ error: err as Error, isLoading: false });
                throw err;
            }
        },

        deleteUserProfilePermanently: async (userId, confirmDeletion) => {
            set({ isLoading: true, error: null });
            try {
                await userRepository.deleteUserProfilePermanently({ userId, confirmDeletion });
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

        // Actions - 데이터 관리
        getUserDataStats: async (userId) => {
            set({ isLoading: true, error: null });
            try {
                const stats = await userRepository.getUserDataStats({ userId });
                set({ dataStats: stats, isLoading: false });
            } catch (err) {
                set({ error: err as Error, isLoading: false });
                throw err;
            }
        },

        createUserDataBackup: async (userId) => {
            set({ isLoading: true, error: null });
            try {
                const backup = await userRepository.createUserDataBackup({ userId });
                set({ lastBackup: backup, isLoading: false });
                return backup;
            } catch (err) {
                set({ error: err as Error, isLoading: false });
                throw err;
            }
        },

        // Actions - 상태 관리
        setCurrentUser: (user) => set({ currentUser: user }),

        clearCurrentUser: () => set({ currentUser: null }),

        clearDataStats: () => set({ dataStats: null, lastBackup: null }),

        clearError: () => set({ error: null }),
    };
});
