// 메뉴에서 사용되는 정적 경로만 정의
export const PAGE_NAME = 'dashboard' as const;

// 전체 경로 상수
export const DASHBOARD_ROUTES = {
  ROOT: `/${PAGE_NAME}`,
  HOME: `/${PAGE_NAME}/home`,
  ANALYTICS: `/${PAGE_NAME}/analytics`,
  ANALYTICS_REPORTS: `/${PAGE_NAME}/analytics/reports`,
  SETTINGS: `/${PAGE_NAME}/settings`,
} as const;

// 상대 경로 (선택적 - 필요시 사용)
export const DASHBOARD_PATHS = {
  HOME: 'home',
  ANALYTICS: 'analytics',
  ANALYTICS_REPORTS: 'analytics/reports',
  SETTINGS: 'settings',
} as const;

export type DashboardRoutePath = (typeof DASHBOARD_ROUTES)[keyof typeof DASHBOARD_ROUTES];
