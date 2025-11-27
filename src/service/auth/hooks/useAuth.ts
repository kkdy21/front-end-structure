import { useCallback } from 'react';
import { useAuthStore } from '@/repositories/authRepository/store/authStore';
import { useRoleStore } from '@/repositories/roleRepository/store/roleStore';
import { useUserStore } from '@/repositories/userRepository/store/userStore';
import type { LoginParameters, SignupParameters } from '@/repositories/authRepository/schema/api-verbs/login';

/**
 * useAuth - 인증 관련 여러 store를 조합하는 훅
 *
 * 컨벤션:
 * - Store는 독립적이어야 함 (store끼리 직접 참조 금지)
 * - Repository는 독립적이어야 함 (repository끼리 직접 참조 금지)
 * - 여러 store/repository 데이터가 필요한 경우 hooks에서 조합
 */
export function useAuth() {
    // 각 store에서 필요한 상태/액션 가져오기
    const {
        firebaseUser,
        isAuthenticated,
        isInitializing,
        isLoading: authLoading,
        error: authError,
        login: authLogin,
        signup: authSignup,
        logout: authLogout,
        resetPassword,
        subscribeAuthState,
        clearError: clearAuthError,
    } = useAuthStore();

    const {
        currentRole,
        isLoading: roleLoading,
        error: roleError,
        getRoleByUserId,
        clearCurrentRole,
        clearError: clearRoleError,
    } = useRoleStore();

    const {
        currentUser,
        isLoading: userLoading,
        error: userError,
        getUserById,
        clearCurrentUser,
        clearError: clearUserError,
    } = useUserStore();

    // 통합 로그인: Firebase Auth → User 조회 → Role 조회
    const login = useCallback(async (params: LoginParameters) => {
        const firebaseUser = await authLogin(params);
        await Promise.all([
            getUserById(firebaseUser.uid),
            getRoleByUserId(firebaseUser.uid),
        ]);
    }, [authLogin, getUserById, getRoleByUserId]);

    // 통합 회원가입: Firebase Auth → User 생성
    const signup = useCallback(async (params: SignupParameters) => {
        const firebaseUser = await authSignup(params);
        // 회원가입 후 user 문서 생성 필요시 여기서 처리
        return firebaseUser;
    }, [authSignup]);

    // 통합 로그아웃: 모든 상태 초기화
    const logout = useCallback(async () => {
        await authLogout();
        clearCurrentRole();
        clearCurrentUser();
    }, [authLogout, clearCurrentRole, clearCurrentUser]);

    // 에러 전체 클리어
    const clearError = useCallback(() => {
        clearAuthError();
        clearRoleError();
        clearUserError();
    }, [clearAuthError, clearRoleError, clearUserError]);

    return {
        // State
        firebaseUser,
        user: currentUser,
        role: currentRole,
        isAuthenticated,
        isInitializing,
        isLoading: authLoading || roleLoading || userLoading,
        error: authError || roleError || userError,

        // Actions
        login,
        signup,
        logout,
        resetPassword,
        subscribeAuthState,
        clearError,

        // 개별 store 액션 (필요시)
        getRoleByUserId,
        getUserById,
    };
}
