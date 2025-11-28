import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/repositories/authRepository/store/authStore';
import { useRoleStore } from '@/repositories/roleRepository/store/roleStore';
import { useUserStore } from '@/repositories/userRepository/store/userStore';
import { Spinner, SpinnerContainer, SpinnerFullPage, SpinnerText } from '@/components/feedback';

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * 앱 초기화 시 Firebase Auth 상태를 감지하고 관련 store들을 복원하는 Provider
 * App.tsx에서 최상위에 감싸서 사용
 *
 * 컨벤션:
 * - AuthProvider는 여러 store를 조합하는 역할만 담당
 * - 각 store는 독립적으로 자신의 상태만 관리
 */
export function AuthProvider({ children }: AuthProviderProps) {
    const { isInitializing, subscribeAuthState } = useAuthStore();
    const { getRoleByUserId, clearCurrentRole } = useRoleStore();
    const { getUserById, clearCurrentUser } = useUserStore();

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        try {
            unsubscribe = subscribeAuthState(async () => {
                // 초기화 완료 후 Firebase User가 있으면 추가 정보 로드
                const { firebaseUser, isAuthenticated } = useAuthStore.getState();
                if (firebaseUser) {
                    try {
                        await Promise.all([
                            getUserById(firebaseUser.uid),
                            getRoleByUserId(firebaseUser.uid),
                        ]);
                    } catch (err) {
                        console.error('사용자 정보 로드 실패:', err);
                        // 정보 로드 실패 시 초기화
                        clearCurrentUser();
                        clearCurrentRole();
                    }
                } else if (!isAuthenticated) {
                    // 진짜 로그아웃 상태일 때만 초기화
                    // Mock 로그인의 경우 isAuthenticated=true, firebaseUser=null 이므로 초기화하지 않음
                    clearCurrentUser();
                    clearCurrentRole();
                }
            });
        } catch (err) {
            // Firebase 초기화 실패 시 (env 설정 오류 등)
            console.warn('Firebase Auth 초기화 실패, Mock 모드로 전환:', err);
            useAuthStore.setState({ isInitializing: false });
        }

        return () => unsubscribe?.();
    }, [subscribeAuthState, getUserById, getRoleByUserId, clearCurrentUser, clearCurrentRole]);

    if (isInitializing) {
        return (
            <SpinnerFullPage>
                <SpinnerContainer>
                    <Spinner size="lg" />
                    <SpinnerText>로딩 중...</SpinnerText>
                </SpinnerContainer>
            </SpinnerFullPage>
        );
    }

    return <>{children}</>;
}
