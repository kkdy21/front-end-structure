import { create } from 'zustand';
import type { User as FirebaseUser, Unsubscribe } from 'firebase/auth';
import type { User } from '@/repositories/userRepository/schema/dto/userDTO';
import type { Permissions } from '@/repositories/roleRepository/types';
import { RoleEntity } from '@/repositories/roleRepository/entity/roleEntity';
import type { BaseState, BaseActions } from '@/repositories/baseStore';
import { baseInitialState } from '@/repositories/baseStore';
import type { LoginParameters, SignupParameters } from '../schema/api-verbs/login';
import { authRepository } from '../api/authRepository';

interface AuthState extends BaseState, BaseActions {
    // State
    user: User | null;
    role: RoleEntity | null;
    permissions: Permissions;
    isAuthenticated: boolean;
    isInitializing: boolean;

    // Actions - 인증
    login: (params: LoginParameters) => Promise<void>;
    signup: (params: SignupParameters) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;

    // Actions - 상태 관리
    restoreAuthState: (firebaseUser: FirebaseUser) => Promise<void>;
    subscribeAuthState: (
        onInitialized: () => void
    ) => Unsubscribe;

    // Actions - 내부
    setPermissions: (permissions: Permissions) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    // Initial State
    ...baseInitialState,
    user: null,
    role: null,
    permissions: {},
    isAuthenticated: false,
    isInitializing: true,

    // Actions - 인증
    login: async (params) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authRepository.login(params);
            const roleEntity = new RoleEntity(response.role);
            set({
                user: response.user,
                role: roleEntity,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (err) {
            set({ error: err as Error, isLoading: false });
            throw err;
        }
    },

    signup: async (params) => {
        set({ isLoading: true, error: null });
        try {
            await authRepository.signup(params);
            set({ isLoading: false });
        } catch (err) {
            set({ error: err as Error, isLoading: false });
            throw err;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await authRepository.logout();
            set({
                user: null,
                role: null,
                permissions: {},
                isAuthenticated: false,
                isLoading: false,
            });
        } catch (err) {
            set({ error: err as Error, isLoading: false });
            throw err;
        }
    },

    resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            await authRepository.resetPassword(email);
            set({ isLoading: false });
        } catch (err) {
            set({ error: err as Error, isLoading: false });
            throw err;
        }
    },

    // Actions - 상태 관리
    restoreAuthState: async (firebaseUser) => {
        try {
            const response = await authRepository.restoreAuthState(firebaseUser);
            if (response) {
                const roleEntity = new RoleEntity(response.role);
                set({
                    user: response.user,
                    role: roleEntity,
                    isAuthenticated: true,
                });
            } else {
                // 유저/role 정보 없으면 로그아웃 처리
                await authRepository.logout();
                set({
                    user: null,
                    role: null,
                    permissions: {},
                    isAuthenticated: false,
                });
            }
        } catch (err) {
            console.error('인증 상태 복원 실패:', err);
            await authRepository.logout();
            set({
                user: null,
                role: null,
                permissions: {},
                isAuthenticated: false,
                error: err as Error,
            });
        }
    },

    subscribeAuthState: (onInitialized) => {
        return authRepository.subscribeAuthState(
            // 로그인 상태
            async (firebaseUser) => {
                await get().restoreAuthState(firebaseUser);
                set({ isInitializing: false });
                onInitialized();
            },
            // 로그아웃 상태
            () => {
                set({
                    user: null,
                    role: null,
                    permissions: {},
                    isAuthenticated: false,
                    isInitializing: false,
                });
                onInitialized();
            }
        );
    },

    // Actions - 내부
    setPermissions: (permissions) => set({ permissions }),

    clearError: () => set({ error: null }),
}));
