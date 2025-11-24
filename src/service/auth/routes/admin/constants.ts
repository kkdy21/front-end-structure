// 메뉴에서 사용되는 정적 경로만 정의
export const PAGE_NAME = 'admin' as const;

// 전체 경로 상수
export const ADMIN_ROUTES = {
  ROOT: `/${PAGE_NAME}`,
  USERS: `/${PAGE_NAME}/users`,
  ROLES: `/${PAGE_NAME}/roles`,
} as const;

// 상대 경로 (선택적 - 필요시 사용)
export const ADMIN_PATHS = {
  USERS: 'users',
  ROLES: 'roles',
} as const;

export type AdminRoutePath = (typeof ADMIN_ROUTES)[keyof typeof ADMIN_ROUTES];