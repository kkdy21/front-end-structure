import {
    LayoutDashboard,
    Home,
    BarChart,
    Settings,
    FileText,
    FolderOpen,
    List,
    Plus,
    Shield,
    Users,
    Key,
    ChevronRight,
    LogOut,
    User,
    Bell,
    Search,
    Menu,
    type LucideProps,
} from 'lucide-react';
import type { IconName } from '@/types/menu';

const iconMap = {
    LayoutDashboard,
    Home,
    BarChart,
    Settings,
    FileText,
    FolderOpen,
    List,
    Plus,
    Shield,
    Users,
    Key,
    ChevronRight,
    LogOut,
    User,
    Bell,
    Search,
    Menu,
} as const;

export type ExtendedIconName = IconName | 'ChevronRight' | 'LogOut' | 'User' | 'Bell' | 'Search' | 'Menu';

interface IconProps extends LucideProps {
    name: ExtendedIconName;
}

export function Icon({ name, ...props }: IconProps) {
    const IconComponent = iconMap[name];
    if (!IconComponent) {
        return null;
    }
    return <IconComponent {...props} />;
}
