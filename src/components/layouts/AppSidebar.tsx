import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { Box, Flex, Text } from '@radix-ui/themes';
import { useRoleStore } from '@/repositories/roleRepository/store/roleStore';
import { ALL_MENUS, filterMenusByAccess } from '@/router/config/menu/menuFilter';
import type { MenuItem } from '@/types/menu';
import { Icon } from '@/components/icons';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarFooter,
    SidebarRail,
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/navigation';

export function AppSidebar() {
    const { currentRole } = useRoleStore();
    const location = useLocation();

    const filteredMenus = useMemo(() => {
        if (!currentRole) return [];
        return filterMenusByAccess(ALL_MENUS, currentRole.pageAccess);
    }, [currentRole]);

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b border-[var(--gray-5)]">
                <Flex align="center" gap="3" p="3" style={{ height: '56px' }}>
                    <Flex
                        align="center"
                        justify="center"
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-2)',
                            background: 'var(--accent-9)',
                            flexShrink: 0,
                        }}
                    >
                        <Text size="2" weight="bold" style={{ color: 'white' }}>
                            W
                        </Text>
                    </Flex>
                    <Text
                        size="3"
                        weight="medium"
                        className="group-data-[collapsible=icon]:hidden"
                        style={{ color: 'var(--gray-12)' }}
                    >
                        WiseUp
                    </Text>
                </Flex>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel style={{ color: 'var(--gray-10)' }}>
                        Menu
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredMenus.map((menu) => (
                                <MenuItemComponent
                                    key={menu.id}
                                    menu={menu}
                                    currentPath={location.pathname}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-[var(--gray-5)]">
                <Box p="3" className="group-data-[collapsible=icon]:hidden">
                    <Text size="1" style={{ color: 'var(--gray-9)' }}>
                        2024 WiseUp
                    </Text>
                </Box>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}

interface MenuItemProps {
    menu: MenuItem;
    currentPath: string;
}

function MenuItemComponent({ menu, currentPath }: MenuItemProps) {
    const isActive =
        currentPath === menu.path || currentPath.startsWith(menu.path + '/');
    const hasChildren = menu.children && menu.children.length > 0;
    const [isOpen, setIsOpen] = useState(isActive);

    if (hasChildren) {
        return (
            <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="group/collapsible"
            >
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={menu.title}>
                            <Icon
                                name={menu.icon}
                                className="size-4"
                                style={{ color: 'var(--gray-11)', flexShrink: 0 }}
                            />
                            <Text
                                size="2"
                                className="group-data-[collapsible=icon]:hidden"
                                style={{ flex: 1 }}
                            >
                                {menu.title}
                            </Text>
                            <ChevronRight
                                className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden"
                                style={{ color: 'var(--gray-9)', flexShrink: 0 }}
                            />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {menu.children!.map((child) => (
                                <SubMenuItemComponent
                                    key={child.id}
                                    menu={child}
                                    currentPath={currentPath}
                                />
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        );
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive} tooltip={menu.title}>
                <Link to={menu.path}>
                    <Icon
                        name={menu.icon}
                        className="size-4"
                        style={{ color: isActive ? 'var(--accent-11)' : 'var(--gray-11)', flexShrink: 0 }}
                    />
                    <Text
                        size="2"
                        className="group-data-[collapsible=icon]:hidden"
                    >
                        {menu.title}
                    </Text>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

interface SubMenuItemProps {
    menu: MenuItem;
    currentPath: string;
}

function SubMenuItemComponent({ menu, currentPath }: SubMenuItemProps) {
    const isActive = currentPath === menu.path;
    const hasChildren = menu.children && menu.children.length > 0;

    if (hasChildren) {
        return (
            <>
                <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={isActive}>
                        <Link to={menu.path}>
                            <Icon
                                name={menu.icon}
                                className="size-4"
                                style={{ color: isActive ? 'var(--accent-11)' : 'var(--gray-10)', flexShrink: 0 }}
                            />
                            <Text size="2">{menu.title}</Text>
                        </Link>
                    </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                {menu.children!.map((child) => (
                    <SubMenuItemComponent
                        key={child.id}
                        menu={child}
                        currentPath={currentPath}
                    />
                ))}
            </>
        );
    }

    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive}>
                <Link to={menu.path}>
                    <Icon
                        name={menu.icon}
                        className="size-4"
                        style={{ color: isActive ? 'var(--accent-11)' : 'var(--gray-10)', flexShrink: 0 }}
                    />
                    <Text size="2">{menu.title}</Text>
                </Link>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    );
}
