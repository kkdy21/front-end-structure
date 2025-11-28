import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ShieldCheck, User, Eye } from 'lucide-react';
import { Box, Card, Flex, Text, Heading, TextField, Button, Callout, Separator } from '@radix-ui/themes';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '@/repositories/authRepository/store/authStore';
import { useRoleStore } from '@/repositories/roleRepository/store/roleStore';
import { useUserStore } from '@/repositories/userRepository/store/userStore';
import { DASHBOARD_ROUTES } from '@/service/dashboard/routes/constants';
import { RoleEntity } from '@/repositories/roleRepository/entity/roleEntity';
import { UserEntity } from '@/repositories/userRepository/entity/userEntity';

// Mock 데이터 (2 depth 기준)
const MOCK_USERS = {
    admin: {
        user: { id: 'admin-001', email: 'admin@test.com', name: '관리자' },
        role: {
            role_id: 'role-admin',
            name: 'Admin',
            role_type: 'ADMIN',
            page_access: ['dashboard', 'admin'], // 전체 허용
            state: 'ENABLED' as const,
        },
        icon: ShieldCheck,
        description: '전체 접근',
        color: 'green' as const,
    },
    manager: {
        user: { id: 'manager-001', email: 'manager@test.com', name: '매니저' },
        role: {
            role_id: 'role-manager',
            name: 'Manager',
            role_type: 'MANAGER',
            page_access: ['dashboard.home', 'dashboard.analytics'], // 홈, 분석
            state: 'ENABLED' as const,
        },
        icon: User,
        description: '홈, 분석',
        color: 'blue' as const,
    },
    viewer: {
        user: { id: 'viewer-001', email: 'viewer@test.com', name: '뷰어' },
        role: {
            role_id: 'role-viewer',
            name: 'Viewer',
            role_type: 'VIEWER',
            page_access: ['dashboard.home'], // 홈만
            state: 'ENABLED' as const,
        },
        icon: Eye,
        description: '홈만',
        color: 'gray' as const,
    },
};

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading, error } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const from = (location.state as { from?: Location })?.from?.pathname || DASHBOARD_ROUTES.HOME;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password });
            navigate(from, { replace: true });
        } catch {
            // error는 store에서 관리
        }
    };

    // 테스트용 Mock 로그인 - 각 store 독립적으로 업데이트
    const handleMockLogin = (userType: keyof typeof MOCK_USERS) => {
        const mockData = MOCK_USERS[userType];
        const roleEntity = new RoleEntity(mockData.role);
        const userEntity = new UserEntity(mockData.user);

        // 각 store 독립적으로 업데이트
        useAuthStore.setState({
            firebaseUser: null, // Mock이므로 Firebase User 없음
            isAuthenticated: true,
            isLoading: false,
            error: null,
        });

        useRoleStore.setState({
            currentRole: roleEntity,
            isLoading: false,
            error: null,
        });

        useUserStore.setState({
            currentUser: userEntity,
            isLoading: false,
            error: null,
        });

        navigate(from, { replace: true });
    };

    return (
        <Flex
            align="center"
            justify="center"
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(to bottom right, var(--gray-2), white, var(--blue-2))'
            }}
            p="4"
        >
            <Box style={{ width: '100%', maxWidth: '400px' }}>
                {/* Logo / Brand */}
                <Flex direction="column" align="center" mb="6">
                    <Flex
                        align="center"
                        justify="center"
                        mb="4"
                        style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: 'var(--radius-3)',
                            background: 'var(--accent-9)',
                            boxShadow: '0 10px 25px -10px var(--accent-8)'
                        }}
                    >
                        <Text size="6" weight="bold" style={{ color: 'white' }}>W</Text>
                    </Flex>
                    <Heading size="6" weight="bold">WiseUp</Heading>
                    <Text size="2" color="gray" mt="1">학습 관리 시스템</Text>
                </Flex>

                {/* Login Card */}
                <Card size="4" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}>
                    <Flex direction="column" gap="5">
                        {/* Card Header */}
                        <Flex direction="column" align="center" gap="1">
                            <Heading size="5" weight="medium">로그인</Heading>
                            <Text size="2" color="gray">계정 정보를 입력하세요</Text>
                        </Flex>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <Flex direction="column" gap="4">
                                {error && (
                                    <Callout.Root color="red" size="1">
                                        <Callout.Text>{error.message}</Callout.Text>
                                    </Callout.Root>
                                )}

                                <Flex direction="column" gap="2">
                                    <Text as="label" size="2" weight="medium" htmlFor="email">
                                        이메일
                                    </Text>
                                    <TextField.Root
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="email@example.com"
                                        size="3"
                                    />
                                </Flex>

                                <Flex direction="column" gap="2">
                                    <Text as="label" size="2" weight="medium" htmlFor="password">
                                        비밀번호
                                    </Text>
                                    <TextField.Root
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="********"
                                        size="3"
                                    />
                                </Flex>

                                <Button type="submit" size="3" disabled={isLoading} style={{ marginTop: '8px' }}>
                                    {isLoading ? '로그인 중...' : '로그인'}
                                </Button>
                            </Flex>
                        </form>

                        {/* Divider */}
                        <Flex align="center" gap="3">
                            <Separator size="4" style={{ flex: 1 }} />
                            <Text size="1" color="gray" style={{ textTransform: 'uppercase' }}>
                                테스트 계정
                            </Text>
                            <Separator size="4" style={{ flex: 1 }} />
                        </Flex>

                        {/* Mock Login Buttons */}
                        <Flex gap="3">
                            {(Object.keys(MOCK_USERS) as (keyof typeof MOCK_USERS)[]).map((userType) => {
                                const mockUser = MOCK_USERS[userType];
                                const IconComponent = mockUser.icon;
                                return (
                                    <Button
                                        key={userType}
                                        type="button"
                                        variant="soft"
                                        color={mockUser.color}
                                        onClick={() => handleMockLogin(userType)}
                                        style={{ flex: 1, flexDirection: 'column', height: 'auto', padding: '12px 8px' }}
                                    >
                                        <IconComponent style={{ width: '20px', height: '20px', marginBottom: '4px' }} />
                                        <Text size="2" weight="medium">{mockUser.role.name}</Text>
                                        <Text size="1" color="gray">{mockUser.description}</Text>
                                    </Button>
                                );
                            })}
                        </Flex>
                    </Flex>
                </Card>

                {/* Footer */}
                <Text size="1" color="gray" align="center" mt="6" style={{ display: 'block' }}>
                    2024 WiseUp. All rights reserved.
                </Text>
            </Box>
        </Flex>
    );
}
