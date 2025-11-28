import { Navigate, type RouteObject } from 'react-router';
import { DASHBOARD_ROUTES, DASHBOARD_PATHS } from './constants';
import { DashboardHome } from '../pages/DashboardHome';
import { DashboardAnalytics } from '../pages/DashboardAnalytics';
import { DashboardSettings } from '../pages/DashboardSettings';

// 권한 체크는 router/guards/RequireAuth에서 일괄 처리
export const dashboardRoutes: RouteObject[] = [
    {
        path: DASHBOARD_ROUTES.ROOT,
        children: [
            {
                index: true,
                element: <Navigate to={DASHBOARD_ROUTES.HOME} replace />,
            },
            {
                path: DASHBOARD_PATHS.HOME,
                element: <DashboardHome />,
            },
            {
                path: DASHBOARD_PATHS.ANALYTICS,
                element: <DashboardAnalytics />,
            },
            {
                path: DASHBOARD_PATHS.SETTINGS,
                element: <DashboardSettings />,
            },
        ],
    },
];
