import type { RouteObject } from 'react-router';
import { ADMIN_ROUTES } from './constants';

// TODO: 실제 페이지 컴포넌트로 교체
// import AdminLayout from '../pages/AdminLayout';
// import UsersPage from '../pages/UsersPage';
// import RolesPage from '../pages/RolesPage';

export const adminRoutes: RouteObject[] = [
  {
    path: ADMIN_ROUTES.ROOT,
    // element: <AdminLayout />,
    children: [
      {
        index: true,
        // element: <Navigate to={ADMIN_ROUTES.USERS} replace />,
      },
      {
        path: ADMIN_ROUTES.USERS,
        // element: <UsersPage />,
      },
      {
        path: ADMIN_ROUTES.ROLES,
        // element: <RolesPage />,
      },
    ],
  },
];