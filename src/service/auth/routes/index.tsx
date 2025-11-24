import { Navigate, type RouteObject } from 'react-router';
import { AUTH_ROUTES, AUTH_PATHS } from './constants';
import { LoginPage } from '../pages/LoginPage';

export const authRoutes: RouteObject[] = [
    {
        path: AUTH_ROUTES.ROOT,
        children: [
            {
                index: true,
                element: <Navigate to={AUTH_ROUTES.LOGIN} replace />,
            },
            {
                path: AUTH_PATHS.LOGIN,
                element: <LoginPage />,
            },
            // TODO: 회원가입, 비밀번호 찾기 페이지 추가
            // {
            //     path: AUTH_PATHS.REGISTER,
            //     element: <RegisterPage />,
            // },
            // {
            //     path: AUTH_PATHS.FORGOT_PASSWORD,
            //     element: <ForgotPasswordPage />,
            // },
        ],
    },
];
