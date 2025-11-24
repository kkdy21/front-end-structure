import type { MenuItem } from '@/types/menu';
import { DASHBOARD_ROUTES, PAGE_NAME } from './constants';

export const dashboardMenu: MenuItem = {
  id: `${PAGE_NAME}`,
  title: '대시보드',
  path: DASHBOARD_ROUTES.ROOT,
  icon: 'LayoutDashboard',
  accessKey: `${PAGE_NAME}`,
  children: [
    {
      id: `${PAGE_NAME}-home`,
      title: '홈',
      path: DASHBOARD_ROUTES.HOME,
      icon: 'Home',
      accessKey: `${PAGE_NAME}.home`,
    },
    {
      id: `${PAGE_NAME}-analytics`,
      title: '분석',
      path: DASHBOARD_ROUTES.ANALYTICS,
      icon: 'BarChart',
      accessKey: `${PAGE_NAME}.analytics`,
      children: [
        {
          id: `${PAGE_NAME}-analytics-reports`,
          title: '리포트',
          path: DASHBOARD_ROUTES.ANALYTICS_REPORTS,
          icon: 'FileText',
          accessKey: `${PAGE_NAME}.analytics.reports`,
        },
      ],
    },
    {
      id: `${PAGE_NAME}-settings`,
      title: '설정',
      path: DASHBOARD_ROUTES.SETTINGS,
      icon: 'Settings',
      accessKey: `${PAGE_NAME}.settings`,
    },
  ],
} as const;