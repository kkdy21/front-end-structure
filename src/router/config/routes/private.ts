import type { RouteObject } from 'react-router';
import { dashboardRoutes } from '@/service/dashboard/routes';

// 인증 필요한 라우트 
export const privateRoutes: RouteObject[] = [
  ...dashboardRoutes,
  // 다른 인증 필요 서비스 라우트 추가
];
