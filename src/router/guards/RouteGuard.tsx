import { useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { toast } from 'sonner';
import { useAuthStore } from '@/repositories/authRepository/store/authStore';
import { useRoleStore } from '@/repositories/roleRepository/store/roleStore';
import { AUTH_ROUTES } from '@/service/auth/routes/constants';
import { pathToAccessKey, matchesPattern } from '@/utils/accessPattern';

export function RouteGuard() {
    const { isAuthenticated } = useAuthStore();
    const { currentRole } = useRoleStore();
    const location = useLocation();
    const toastShownRef = useRef(false);

    // 1. 로그인 여부 체크
    if (!isAuthenticated) {
        return <Navigate to={AUTH_ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    // 2. role이 없거나 page_access가 비어있음
    if (!currentRole || currentRole.pageAccess.length === 0) {
        return <Navigate to="/" replace />;
    }

    // 3. page_access 패턴 기반 권한 체크
    const accessKey = pathToAccessKey(location.pathname);
    const isAllowed = matchesPattern(accessKey, currentRole.pageAccess);

    // 권한 없음 → toast 표시 후 홈으로
    useEffect(() => {
        if (!isAllowed && !toastShownRef.current) {
            toastShownRef.current = true;
            toast.error('접근 권한이 없습니다', {
                description: '해당 페이지에 접근할 수 있는 권한이 없습니다.',
            });
        }
    }, [isAllowed]);

    if (!isAllowed) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
