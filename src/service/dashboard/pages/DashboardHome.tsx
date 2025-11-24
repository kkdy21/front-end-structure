import { useAuthStore } from '@/repositories/authRepository/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardHome() {
    const { user, role } = useAuthStore();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">대시보드 홈</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>현재 사용자 정보</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-2">
                            <div className="flex">
                                <dt className="w-24 font-medium text-muted-foreground">이름:</dt>
                                <dd>{user?.name}</dd>
                            </div>
                            <div className="flex">
                                <dt className="w-24 font-medium text-muted-foreground">이메일:</dt>
                                <dd>{user?.email}</dd>
                            </div>
                            <div className="flex">
                                <dt className="w-24 font-medium text-muted-foreground">역할:</dt>
                                <dd>{role?.name}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>접근 가능한 페이지</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                            {role?.pageAccess.map((access) => (
                                <li key={access}>
                                    <code className="rounded bg-muted px-1 py-0.5 text-sm">{access}</code>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
