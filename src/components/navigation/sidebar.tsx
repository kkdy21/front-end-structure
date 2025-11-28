import * as React from 'react';
import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { Slot } from '@radix-ui/react-slot';
import { Box, IconButton, Tooltip } from '@radix-ui/themes';
import { PanelLeftIcon, XIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/utils/cn';

// Constants
const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

// Context
interface SidebarContextProps {
    state: 'expanded' | 'collapsed';
    open: boolean;
    setOpen: (open: boolean) => void;
    openMobile: boolean;
    setOpenMobile: (open: boolean) => void;
    isMobile: boolean;
    toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextProps | null>(null);

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider.');
    }
    return context;
}

// Provider
interface SidebarProviderProps {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export function SidebarProvider({
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children,
}: SidebarProviderProps) {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = useState(false);
    const [_open, _setOpen] = useState(defaultOpen);

    const open = openProp ?? _open;

    const setOpen = useCallback(
        (value: boolean | ((value: boolean) => boolean)) => {
            const openState = typeof value === 'function' ? value(open) : value;
            if (setOpenProp) {
                setOpenProp(openState);
            } else {
                _setOpen(openState);
            }
            document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
        },
        [setOpenProp, open]
    );

    const toggleSidebar = useCallback(() => {
        return isMobile ? setOpenMobile((prev) => !prev) : setOpen((prev) => !prev);
    }, [isMobile, setOpen]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                toggleSidebar();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleSidebar]);

    const state = open ? 'expanded' : 'collapsed';

    const contextValue = useMemo<SidebarContextProps>(
        () => ({
            state,
            open,
            setOpen,
            isMobile,
            openMobile,
            setOpenMobile,
            toggleSidebar,
        }),
        [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    );

    return (
        <SidebarContext.Provider value={contextValue}>
            <Box
                data-slot="sidebar-wrapper"
                className={cn('group/sidebar-wrapper', className)}
                style={{
                    '--sidebar-width': SIDEBAR_WIDTH,
                    '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
                    display: 'flex',
                    minHeight: '100vh',
                    width: '100%',
                    ...style,
                } as React.CSSProperties}
            >
                {children}
            </Box>
        </SidebarContext.Provider>
    );
}

// Sidebar
interface SidebarProps {
    side?: 'left' | 'right';
    variant?: 'sidebar' | 'floating' | 'inset';
    collapsible?: 'offcanvas' | 'icon' | 'none';
    children: React.ReactNode;
    className?: string;
}

export function Sidebar({
    side = 'left',
    variant = 'sidebar',
    collapsible = 'offcanvas',
    className,
    children,
}: SidebarProps) {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    if (collapsible === 'none') {
        return (
            <Box
                data-slot="sidebar"
                className={className}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    width: 'var(--sidebar-width)',
                    background: 'var(--color-background)',
                    color: 'var(--gray-12)',
                }}
            >
                {children}
            </Box>
        );
    }

    if (isMobile) {
        return (
            <DialogPrimitive.Root open={openMobile} onOpenChange={setOpenMobile}>
                <DialogPrimitive.Portal>
                    <DialogPrimitive.Overlay
                        className={cn(
                            'fixed inset-0 z-50 bg-black/50',
                            'data-[state=open]:animate-in data-[state=closed]:animate-out',
                            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
                        )}
                    />
                    <DialogPrimitive.Content
                        data-sidebar="sidebar"
                        data-slot="sidebar"
                        data-mobile="true"
                        className={cn(
                            'fixed inset-y-0 z-50 flex flex-col',
                            'data-[state=open]:animate-in data-[state=closed]:animate-out',
                            side === 'left'
                                ? 'left-0 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left'
                                : 'right-0 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
                            'data-[state=closed]:duration-300 data-[state=open]:duration-500'
                        )}
                        style={{
                            width: SIDEBAR_WIDTH_MOBILE,
                            background: 'var(--color-background)',
                            padding: 0,
                        }}
                    >
                        <DialogPrimitive.Title className="sr-only">Sidebar</DialogPrimitive.Title>
                        <DialogPrimitive.Description className="sr-only">
                            Navigation sidebar
                        </DialogPrimitive.Description>
                        <DialogPrimitive.Close
                            className="absolute top-4 right-4 rounded-full p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
                            style={{ zIndex: 10 }}
                        >
                            <XIcon className="size-4" />
                            <span className="sr-only">Close</span>
                        </DialogPrimitive.Close>
                        <Box
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                width: '100%',
                            }}
                        >
                            {children}
                        </Box>
                    </DialogPrimitive.Content>
                </DialogPrimitive.Portal>
            </DialogPrimitive.Root>
        );
    }

    return (
        <Box
            className={cn('group peer hidden md:block', className)}
            data-state={state}
            data-collapsible={state === 'collapsed' ? collapsible : ''}
            data-variant={variant}
            data-side={side}
            data-slot="sidebar"
            style={{ color: 'var(--gray-12)' }}
        >
            {/* Sidebar gap */}
            <Box
                data-slot="sidebar-gap"
                className={cn(
                    'relative bg-transparent transition-[width] duration-200 ease-linear',
                    'group-data-[collapsible=offcanvas]:w-0',
                    variant === 'floating' || variant === 'inset'
                        ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+16px)]'
                        : 'group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]'
                )}
                style={{ width: 'var(--sidebar-width)' }}
            />
            {/* Sidebar container */}
            <Box
                data-slot="sidebar-container"
                className={cn(
                    'fixed inset-y-0 z-10 hidden h-screen transition-[left,right,width] duration-200 ease-linear md:flex',
                    side === 'left'
                        ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
                        : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
                    variant === 'floating' || variant === 'inset'
                        ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+18px)]'
                        : cn(
                              'group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]',
                              side === 'left'
                                  ? 'border-r border-[var(--gray-5)]'
                                  : 'border-l border-[var(--gray-5)]'
                          )
                )}
                style={{ width: 'var(--sidebar-width)' }}
            >
                <Box
                    data-sidebar="sidebar"
                    data-slot="sidebar-inner"
                    className={cn(
                        variant === 'floating' &&
                            'rounded-lg border border-[var(--gray-5)] shadow-sm'
                    )}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        width: '100%',
                        background: 'var(--color-background)',
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

// SidebarTrigger
interface SidebarTriggerProps {
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function SidebarTrigger({ className, onClick }: SidebarTriggerProps) {
    const { toggleSidebar } = useSidebar();

    return (
        <IconButton
            data-sidebar="trigger"
            data-slot="sidebar-trigger"
            variant="ghost"
            color="gray"
            size="2"
            className={className}
            onClick={(event) => {
                onClick?.(event);
                toggleSidebar();
            }}
        >
            <PanelLeftIcon className="size-4" />
            <span className="sr-only">Toggle Sidebar</span>
        </IconButton>
    );
}

// SidebarRail
interface SidebarRailProps {
    className?: string;
}

export function SidebarRail({ className }: SidebarRailProps) {
    const { toggleSidebar } = useSidebar();

    return (
        <button
            data-sidebar="rail"
            data-slot="sidebar-rail"
            aria-label="Toggle Sidebar"
            tabIndex={-1}
            onClick={toggleSidebar}
            title="Toggle Sidebar"
            className={cn(
                'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear sm:flex',
                'after:absolute after:inset-y-0 after:left-1/2 after:w-[2px]',
                'hover:after:bg-[var(--gray-6)]',
                'group-data-[side=left]:-right-4 group-data-[side=right]:left-0',
                'cursor-col-resize',
                className
            )}
        />
    );
}

// SidebarInset
interface SidebarInsetProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export function SidebarInset({ children, className, style }: SidebarInsetProps) {
    return (
        <Box
            asChild
            data-slot="sidebar-inset"
            className={cn('relative flex w-full flex-1 flex-col', className)}
            style={{ background: 'var(--color-background)', ...style }}
        >
            <main>{children}</main>
        </Box>
    );
}

// SidebarHeader
interface SidebarHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export function SidebarHeader({ children, className }: SidebarHeaderProps) {
    return (
        <Box
            data-slot="sidebar-header"
            data-sidebar="header"
            className={className}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px' }}
        >
            {children}
        </Box>
    );
}

// SidebarFooter
interface SidebarFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function SidebarFooter({ children, className }: SidebarFooterProps) {
    return (
        <Box
            data-slot="sidebar-footer"
            data-sidebar="footer"
            className={className}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px' }}
        >
            {children}
        </Box>
    );
}

// SidebarContent
interface SidebarContentProps {
    children: React.ReactNode;
    className?: string;
}

export function SidebarContent({ children, className }: SidebarContentProps) {
    return (
        <Box
            data-slot="sidebar-content"
            data-sidebar="content"
            className={cn('group-data-[collapsible=icon]:overflow-hidden', className)}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                flex: 1,
                minHeight: 0,
                overflow: 'auto',
            }}
        >
            {children}
        </Box>
    );
}

// SidebarGroup
interface SidebarGroupProps {
    children: React.ReactNode;
    className?: string;
}

export function SidebarGroup({ children, className }: SidebarGroupProps) {
    return (
        <Box
            data-slot="sidebar-group"
            data-sidebar="group"
            className={className}
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                minWidth: 0,
                padding: '8px',
            }}
        >
            {children}
        </Box>
    );
}

// SidebarGroupLabel
interface SidebarGroupLabelProps {
    children: React.ReactNode;
    className?: string;
    asChild?: boolean;
    style?: React.CSSProperties;
}

export function SidebarGroupLabel({ children, className, asChild, style }: SidebarGroupLabelProps) {
    const Comp = asChild ? Slot : 'div';

    return (
        <Comp
            data-slot="sidebar-group-label"
            data-sidebar="group-label"
            className={cn(
                'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
                'transition-[margin,opacity] duration-200 ease-linear',
                className
            )}
            style={{
                display: 'flex',
                alignItems: 'center',
                height: '32px',
                flexShrink: 0,
                padding: '0 8px',
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--gray-10)',
                borderRadius: 'var(--radius-2)',
                ...style,
            }}
        >
            {children}
        </Comp>
    );
}

// SidebarGroupContent
interface SidebarGroupContentProps {
    children: React.ReactNode;
    className?: string;
}

export function SidebarGroupContent({ children, className }: SidebarGroupContentProps) {
    return (
        <Box
            data-slot="sidebar-group-content"
            data-sidebar="group-content"
            className={className}
            style={{ width: '100%', fontSize: '14px' }}
        >
            {children}
        </Box>
    );
}

// SidebarMenu
interface SidebarMenuProps {
    children: React.ReactNode;
    className?: string;
}

export function SidebarMenu({ children, className }: SidebarMenuProps) {
    return (
        <ul
            data-slot="sidebar-menu"
            data-sidebar="menu"
            className={className}
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                minWidth: 0,
                gap: '4px',
                listStyle: 'none',
                margin: 0,
                padding: 0,
            }}
        >
            {children}
        </ul>
    );
}

// SidebarMenuItem
interface SidebarMenuItemProps {
    children: React.ReactNode;
    className?: string;
}

export function SidebarMenuItem({ children, className }: SidebarMenuItemProps) {
    return (
        <li
            data-slot="sidebar-menu-item"
            data-sidebar="menu-item"
            className={cn('group/menu-item relative', className)}
            style={{ listStyle: 'none' }}
        >
            {children}
        </li>
    );
}

// SidebarMenuButton
interface SidebarMenuButtonProps {
    children: React.ReactNode;
    className?: string;
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string;
    size?: 'default' | 'sm' | 'lg';
    variant?: 'default' | 'outline';
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function SidebarMenuButton({
    children,
    className,
    asChild,
    isActive = false,
    tooltip,
    size = 'default',
    onClick,
}: SidebarMenuButtonProps) {
    const Comp = asChild ? Slot : 'button';
    const { isMobile, state } = useSidebar();

    const sizeStyles: React.CSSProperties = {
        default: { height: '32px', fontSize: '14px' },
        sm: { height: '28px', fontSize: '12px' },
        lg: { height: '48px', fontSize: '14px' },
    }[size];

    const button = (
        <Comp
            data-slot="sidebar-menu-button"
            data-sidebar="menu-button"
            data-size={size}
            data-active={isActive}
            className={cn(
                'peer/menu-button',
                'group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2',
                className
            )}
            onClick={onClick}
            style={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                gap: '8px',
                overflow: 'hidden',
                borderRadius: 'var(--radius-2)',
                padding: '8px',
                textAlign: 'left',
                outline: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 150ms, color 150ms',
                background: isActive ? 'var(--accent-3)' : 'transparent',
                color: isActive ? 'var(--accent-11)' : 'var(--gray-12)',
                fontWeight: isActive ? 500 : 400,
                ...sizeStyles,
            }}
            onMouseEnter={(e) => {
                if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'var(--gray-3)';
                }
            }}
            onMouseLeave={(e) => {
                if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                }
            }}
        >
            {children}
        </Comp>
    );

    if (!tooltip || state !== 'collapsed' || isMobile) {
        return button;
    }

    return (
        <Tooltip content={tooltip} side="right">
            {button}
        </Tooltip>
    );
}

// SidebarMenuSub
interface SidebarMenuSubProps {
    children: React.ReactNode;
    className?: string;
}

export function SidebarMenuSub({ children, className }: SidebarMenuSubProps) {
    return (
        <ul
            data-slot="sidebar-menu-sub"
            data-sidebar="menu-sub"
            className={cn('group-data-[collapsible=icon]:hidden', className)}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                marginLeft: '14px',
                paddingLeft: '10px',
                paddingTop: '2px',
                paddingBottom: '2px',
                borderLeft: '1px solid var(--gray-5)',
                listStyle: 'none',
                minWidth: 0,
            }}
        >
            {children}
        </ul>
    );
}

// SidebarMenuSubItem
interface SidebarMenuSubItemProps {
    children: React.ReactNode;
    className?: string;
}

export function SidebarMenuSubItem({ children, className }: SidebarMenuSubItemProps) {
    return (
        <li
            data-slot="sidebar-menu-sub-item"
            data-sidebar="menu-sub-item"
            className={cn('group/menu-sub-item relative', className)}
            style={{ listStyle: 'none' }}
        >
            {children}
        </li>
    );
}

// SidebarMenuSubButton
interface SidebarMenuSubButtonProps {
    children: React.ReactNode;
    className?: string;
    asChild?: boolean;
    isActive?: boolean;
    size?: 'sm' | 'md';
}

export function SidebarMenuSubButton({
    children,
    className,
    asChild,
    isActive = false,
    size = 'md',
}: SidebarMenuSubButtonProps) {
    const Comp = asChild ? Slot : 'a';

    return (
        <Comp
            data-slot="sidebar-menu-sub-button"
            data-sidebar="menu-sub-button"
            data-size={size}
            data-active={isActive}
            className={cn('group-data-[collapsible=icon]:hidden', className)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: 0,
                height: '28px',
                overflow: 'hidden',
                borderRadius: 'var(--radius-2)',
                padding: '0 8px',
                outline: 'none',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background-color 150ms, color 150ms',
                background: isActive ? 'var(--accent-3)' : 'transparent',
                color: isActive ? 'var(--accent-11)' : 'var(--gray-11)',
                fontSize: size === 'sm' ? '12px' : '14px',
            }}
            onMouseEnter={(e) => {
                if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'var(--gray-3)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--gray-12)';
                }
            }}
            onMouseLeave={(e) => {
                if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'var(--gray-11)';
                }
            }}
        >
            {children}
        </Comp>
    );
}

// Collapsible exports (using Radix Collapsible directly)
export const Collapsible = CollapsiblePrimitive.Root;
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger;
export const CollapsibleContent = CollapsiblePrimitive.Content;
