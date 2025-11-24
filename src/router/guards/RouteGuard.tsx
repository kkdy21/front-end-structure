import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '@/repositories/authRepository/store/authStore';
import { AUTH_ROUTES } from '@/service/auth/routes/constants';
import { pathToAccessKey, matchesPattern } from '@/utils/accessPattern';

export function RouteGuard() {
  const { isAuthenticated, role } = useAuthStore();
  const location = useLocation();

  // 1. 로그인 여부 체크
  if (!isAuthenticated) {
    return <Navigate to={AUTH_ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // 2. role이 없거나 page_access가 비어있음
  if (!role || role.pageAccess.length === 0) {
    return <Navigate to="/" replace />;
  }

  // 3. page_access 패턴 기반 권한 체크
  const accessKey = pathToAccessKey(location.pathname);
  const isAllowed = matchesPattern(accessKey, role.pageAccess);

  if (!isAllowed) {
    // 권한 없음 → 홈 또는 403 페이지로
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
