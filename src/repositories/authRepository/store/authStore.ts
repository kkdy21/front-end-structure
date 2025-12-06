import { create } from 'zustand';
import type { User as FirebaseUser, Unsubscribe } from 'firebase/auth';
import type { BaseState, BaseActions } from '@/repositories/baseStore';
import { baseInitialState } from '@/repositories/baseStore';
import type { LoginParameters, SignupParameters } from '../schema/api-verbs/login';
import type { SignupResultDTO } from '../schema/dto/authDTO';
import { authRepository } from '../api/authRepository';

interface AuthState extends BaseState, BaseActions {
    // State
    firebaseUser: FirebaseUser | null;      // Firebase Auth User
    isAuthenticated: boolean;
    isInitializing: boolean;

    // Actions - 인증
    login: (params: LoginParameters) => Promise<FirebaseUser>;
    loginWithGoogle: () => Promise<FirebaseUser>;
    signup: (params: SignupParameters) => Promise<SignupResultDTO>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;

    // Actions - 상태 관리
    subscribeAuthState: (onInitialized: () => void) => Unsubscribe;

    // Actions - 내부
    setFirebaseUser: (user: FirebaseUser | null) => void;
    setInitializing: (isInitializing: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    // Initial State
    ...baseInitialState,
    firebaseUser: null,
    isAuthenticated: false,
    isInitializing: true,

    // Actions - 인증
    login: async (params) => {
        set({ isLoading: true, error: null });
        try {
            const firebaseUser = await authRepository.login(params);
            set({
                firebaseUser,
                isAuthenticated: true,
                isLoading: false,
            });
            return firebaseUser;
        } catch (err) {
            set({ error: err as Error, isLoading: false });
            throw err;
        }
    },

    loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
            const firebaseUser = await authRepository.loginWithGoogle();
            set({
                firebaseUser,
                isAuthenticated: true,
                isLoading: false,
            });
            return firebaseUser;
        } catch (err) {
            set({ error: err as Error, isLoading: false });
            throw err;
        }
    },

    signup: async (params) => {
        set({ isLoading: true, error: null });
        try {
            const result = await authRepository.signup(params);
            set({ isLoading: false });
            return result;
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
                firebaseUser: null,
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
    subscribeAuthState: (onInitialized) => {
        return authRepository.subscribeAuthState(
            // 로그인 상태
            (firebaseUser) => {
                set({
                    firebaseUser,
                    isAuthenticated: true,
                    isInitializing: false,
                });
                onInitialized();
            },
            // 로그아웃 상태
            () => {
                set({
                    firebaseUser: null,
                    isAuthenticated: false,
                    isInitializing: false,
                });
                onInitialized();
            }
        );
    },

    // Actions - 내부
    setFirebaseUser: (user) => set({
        firebaseUser: user,
        isAuthenticated: !!user,
    }),

    setInitializing: (isInitializing) => set({ isInitializing }),

    clearError: () => set({ error: null }),
}));
