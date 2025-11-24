export const PAGE_NAME = 'auth' as const;

// 전체 경로 상수
export const AUTH_ROUTES = {
  ROOT: `/${PAGE_NAME}`,
  LOGIN: `/${PAGE_NAME}/login`,
  REGISTER: `/${PAGE_NAME}/register`,
  FORGOT_PASSWORD: `/${PAGE_NAME}/forgot-password`,
} as const;

// 상대 경로 (선택적 - 필요시 사용)
export const AUTH_PATHS = {
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT_PASSWORD: 'forgot-password',
} as const;

export type AuthRoutePath = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];
