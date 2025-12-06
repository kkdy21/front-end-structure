import { useEffect, useRef, useMemo } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { toast } from 'sonner';
import { useAuthStore } from '@/repositories/authRepository/store/authStore';
import { useRoleStore } from '@/repositories/roleRepository/store/roleStore';
import { AUTH_ROUTES } from '@/service/auth/routes/constants';
import { pathToAccessKey, matchesPattern } from '@/utils/accessPattern';
import { Spinner, SpinnerContainer, SpinnerFullPage, SpinnerText } from '@/components/feedback';

export function RouteGuard() {
    const { isAuthenticated, isInitializing } = useAuthStore();
    const { currentRole } = useRoleStore();
    const location = useLocation();
    const toastShownRef = useRef(false);

    // 권한 체크 로직 (훅 규칙 준수를 위해 먼저 계산)
    const accessKey = useMemo(() => pathToAccessKey(location.pathname), [location.pathname]);
    const isAllowed = useMemo(() => {
        if (!currentRole) return false;
        const hasNoPageAccess = currentRole.pageAccess.length === 0;
        return hasNoPageAccess || matchesPattern(accessKey, currentRole.pageAccess);
    }, [currentRole, accessKey]);

    // 권한 없음 toast (모든 훅은 조건부 return 전에 호출)
    useEffect(() => {
        if (currentRole && !isAllowed && !toastShownRef.current) {
            toastShownRef.current = true;
            toast.error('접근 권한이 없습니다', {
                description: '해당 페이지에 접근할 수 있는 권한이 없습니다.',
            });
        }
    }, [currentRole, isAllowed]);

    // 0. 초기화 중이면 로딩 표시 (새로고침 시 Firebase Auth 복원 대기)
    if (isInitializing) {
        return (
            <SpinnerFullPage>
                <SpinnerContainer>
                    <Spinner size="lg" />
                    <SpinnerText>인증 확인 중...</SpinnerText>
                </SpinnerContainer>
            </SpinnerFullPage>
        );
    }

    // 1. 로그인 여부 체크
    if (!isAuthenticated) {
        return <Navigate to={AUTH_ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    // 2. role이 없으면 홈으로 리다이렉트
    if (!currentRole) {
        return <Navigate to="/" replace />;
    }

    // 3. 권한 없으면 홈으로
    if (!isAllowed) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
