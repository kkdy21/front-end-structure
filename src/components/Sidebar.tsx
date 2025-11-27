import { useMemo } from 'react';
import { Link, useLocation } from 'react-router';
import { useRoleStore } from '@/repositories/roleRepository/store/roleStore';
import { ALL_MENUS, filterMenusByAccess, type MenuItem } from '@/router/config/menu/menuFilter';

// 정적 메뉴 + page_access 기반 필터링
export function Sidebar() {
    const { currentRole } = useRoleStore();
    const location = useLocation();

    const filteredMenus = useMemo(() => {
        if (!currentRole) return [];
        return filterMenusByAccess(ALL_MENUS, currentRole.pageAccess);
    }, [currentRole]);

    return (
        <nav className="w-64 border-r bg-sidebar p-4">
            <ul className="space-y-2">
                {filteredMenus.map((menu) => (
                    <MenuItemComponent
                        key={menu.id}
                        menu={menu}
                        currentPath={location.pathname}
                    />
                ))}
            </ul>
        </nav>
    );
}

interface MenuItemProps {
    menu: MenuItem;
    currentPath: string;
}

function MenuItemComponent({ menu, currentPath }: MenuItemProps) {
    const isActive = currentPath === menu.path || currentPath.startsWith(menu.path + '/');
    const hasChildren = menu.children && menu.children.length > 0;

    return (
        <li>
            <Link
                to={menu.path}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'hover:bg-sidebar-accent/50'
                    }`}
            >
                <span className="icon">{menu.icon}</span>
                <span>{menu.title}</span>
            </Link>

            {hasChildren && (
                <ul className="ml-4 mt-1 space-y-1">
                    {menu.children!.map((child) => (
                        <MenuItemComponent
                            key={child.id}
                            menu={child}
                            currentPath={currentPath}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}
