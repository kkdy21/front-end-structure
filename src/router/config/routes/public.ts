import type { RouteObject } from 'react-router';
import { authRoutes } from '@/service/auth/routes';

// 인증 불필요한 라우트
export const publicRoutes: RouteObject[] = [
  ...authRoutes, // 로그인, 회원가입 등
  // 랜딩페이지, 소개페이지 등 추가 가능
];
