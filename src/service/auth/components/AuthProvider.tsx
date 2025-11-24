import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/repositories/authRepository/store/authStore';
import { Loading } from '@/shared/components/Loading';

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * 앱 초기화 시 Firebase Auth 상태를 감지하고 authStore를 복원하는 Provider
 * App.tsx에서 최상위에 감싸서 사용
 */
export function AuthProvider({ children }: AuthProviderProps) {
    const { isInitializing, subscribeAuthState } = useAuthStore();

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        try {
            unsubscribe = subscribeAuthState(() => {
                // 초기화 완료 콜백
            });
        } catch (err) {
            // Firebase 초기화 실패 시 (env 설정 오류 등)
            console.warn('Firebase Auth 초기화 실패, Mock 모드로 전환:', err);
            useAuthStore.setState({ isInitializing: false });
        }

        return () => unsubscribe?.();
    }, [subscribeAuthState]);

    if (isInitializing) {
        return <Loading />;
    }

    return <>{children}</>;
}
