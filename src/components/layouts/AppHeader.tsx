import { LogOut, User, Bell } from 'lucide-react';
import { Flex, Text, Separator, IconButton, Avatar } from '@radix-ui/themes';
import { useAuthStore } from '@/repositories/authRepository/store/authStore';
import { useUserStore } from '@/repositories/userRepository/store/userStore';
import { useRoleStore } from '@/repositories/roleRepository/store/roleStore';
import { SidebarTrigger } from '@/components/navigation';

export function AppHeader() {
    const { logout } = useAuthStore();
    const { currentUser } = useUserStore();
    const { currentRole } = useRoleStore();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <Flex
            asChild
            align="center"
            justify="between"
            px="4"
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                height: '56px',
                borderBottom: '1px solid var(--gray-5)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)'
            }}
        >
            <header>
                <Flex align="center" gap="2">
                    <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
                    <Separator orientation="vertical" style={{ height: '16px' }} />
                    <Text size="2" color="gray">Dashboard</Text>
                </Flex>

                <Flex align="center" gap="1">
                    <IconButton variant="ghost" color="gray" size="2" radius="full">
                        <Bell style={{ width: '16px', height: '16px' }} />
                    </IconButton>

                    <Separator orientation="vertical" style={{ height: '16px', margin: '0 8px' }} />

                    <Flex align="center" gap="3" px="3" py="1">
                        <Avatar
                            size="2"
                            radius="full"
                            fallback={<User style={{ width: '16px', height: '16px' }} />}
                            color="blue"
                        />
                        <Flex direction="column" display={{ initial: 'none', sm: 'flex' }}>
                            <Text size="2" weight="medium">
                                {currentUser?.name ?? '사용자'}
                            </Text>
                            <Text size="1" color="gray">
                                {currentRole?.name ?? 'Guest'}
                            </Text>
                        </Flex>
                    </Flex>

                    <IconButton
                        variant="ghost"
                        color="gray"
                        size="2"
                        radius="full"
                        onClick={handleLogout}
                        style={{ cursor: 'pointer' }}
                    >
                        <LogOut style={{ width: '16px', height: '16px' }} />
                    </IconButton>
                </Flex>
            </header>
        </Flex>
    );
}
