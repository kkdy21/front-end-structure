import { useUserStore } from '@/repositories/userRepository/store/userStore';
import { useRoleStore } from '@/repositories/roleRepository/store/roleStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardHome() {
    const { currentUser } = useUserStore();
    const { currentRole } = useRoleStore();

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
                                <dd>{currentUser?.name}</dd>
                            </div>
                            <div className="flex">
                                <dt className="w-24 font-medium text-muted-foreground">이메일:</dt>
                                <dd>{currentUser?.email}</dd>
                            </div>
                            <div className="flex">
                                <dt className="w-24 font-medium text-muted-foreground">역할:</dt>
                                <dd>{currentRole?.name}</dd>
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
                            {currentRole?.pageAccess.map((access) => (
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
