import type { MenuItem } from '@/types/menu';
import { ADMIN_ROUTES } from './constants';

export const adminMenu: MenuItem = {
  id: 'admin',
  title: '관리',
  path: ADMIN_ROUTES.ROOT,
  icon: 'Shield' as const,
  accessKey: 'admin' as const,
  children: [
    {
      id: 'admin-users',
      title: '사용자 관리',
      path: ADMIN_ROUTES.USERS,
      icon: 'Users' as const,
      accessKey: 'admin.users' as const,
    },
    {
      id: 'admin-roles',
      title: '권한 관리',
      path: ADMIN_ROUTES.ROLES,
      icon: 'Key' as const,
      accessKey: 'admin.roles' as const,
    },
  ],
} as const;