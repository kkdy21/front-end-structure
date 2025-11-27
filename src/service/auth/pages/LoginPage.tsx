import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '@/repositories/authRepository/store/authStore';
import { useRoleStore } from '@/repositories/roleRepository/store/roleStore';
import { useUserStore } from '@/repositories/userRepository/store/userStore';
import { DASHBOARD_ROUTES } from '@/service/dashboard/routes/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RoleEntity } from '@/repositories/roleRepository/entity/roleEntity';
import { UserEntity } from '@/repositories/userRepository/entity/userEntity';

// 테스트용 Mock 데이터 (2 depth 기준)
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
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">로그인</CardTitle>
                    <CardDescription>계정에 로그인하세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                {error.message}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">이메일</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">비밀번호</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? '로그인 중...' : '로그인'}
                        </Button>
                    </form>

                    {/* 테스트용 Mock 로그인 버튼 */}
                    <div className="border-t pt-4">
                        <p className="mb-3 text-center text-sm text-muted-foreground">
                            테스트용 Mock 로그인
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMockLogin('admin')}
                            >
                                Admin
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMockLogin('manager')}
                            >
                                Manager
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMockLogin('viewer')}
                            >
                                Viewer
                            </Button>
                        </div>
                        <p className="mt-2 text-center text-xs text-muted-foreground">
                            Admin: 전체 접근 | Manager: 분석 페이지 | Viewer: 홈만
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
