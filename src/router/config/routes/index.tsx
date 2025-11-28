import { Navigate, type RouteObject } from 'react-router';
import { ROOT_ROUTES } from '../constants';
import { publicRoutes } from './public';
import { privateRoutes } from './private';
import { RouteGuard } from '../../guards/RouteGuard';
import { PrivateLayout } from '../../layouts/PrivateLayout';
import { AUTH_ROUTES } from '@/service/auth/routes/constants';
import { RouteErrorPage } from '@/components/feedback';

// 모든 서비스 routes 통합
export const routes: RouteObject[] = [
    {
        path: ROOT_ROUTES.HOME,
        errorElement: <RouteErrorPage />,
        children: [
            {
                index: true,
                element: <Navigate to={AUTH_ROUTES.LOGIN} replace />,
            },

            // Public routes: 인증 불필요
            ...publicRoutes,

            // Private routes: RouteGuard(인증+권한) → PrivateLayout(레이아웃)
            {
                element: <RouteGuard />,
                errorElement: <RouteErrorPage />,
                children: [
                    {
                        element: <PrivateLayout />,
                        errorElement: <RouteErrorPage />,
                        children: privateRoutes,
                    },
                ],
            },

            {
                path: ROOT_ROUTES.NOT_FOUND,
                element: <div className="flex h-screen items-center justify-center">404 Not Found</div>,
            },
        ],
    },
];
