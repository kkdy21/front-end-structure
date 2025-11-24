import { dashboardMenu } from '@/service/dashboard/routes/menu';
// import { projectMenu } from '@/service/project/routes/menu'; // TODO: project 서비스 생성 후 활성화
import { adminMenu } from '@/service/auth/routes/admin/menu';
import { matchesPattern } from '@/utils/accessPattern';
import type { MenuItem } from '@/types/menu';

// MenuItem 타입 re-export
export type { MenuItem };

/**
 * 모든 메뉴 수집
 * 새 서비스 추가 시 여기에 import 추가
 */
export const ALL_MENUS = [
  dashboardMenu,
  // projectMenu, // TODO: project 서비스 생성 후 활성화
  adminMenu,
  // 새 서비스 메뉴 추가 위치
].filter(Boolean); // null 제거

/**
 * 접속한 유저의 role의 page_access 패턴에 따라 메뉴 필터링
 */
export function filterMenusByAccess(
  menus: typeof ALL_MENUS,
  pageAccess: string[]
): typeof ALL_MENUS {
  return menus
    .map((menu: MenuItem) => {
      // 현재 메뉴가 접근 가능한지 체크
      const hasAccess = matchesPattern(menu.accessKey, pageAccess);

      // children 재귀 필터링
      const filteredChildren = menu.children && menu.children.length > 0
        ? filterMenusByAccess(menu.children as MenuItem[], pageAccess)
        : [];

      // 본인은 접근 불가능하고, 접근 가능한 children도 없으면 제거
      if (!hasAccess && filteredChildren.length === 0) {
        return null;
      }

      return {
        ...menu,
        children: filteredChildren,
      };
    })
    .filter((menu): menu is NonNullable<typeof menu> => menu !== null);
}