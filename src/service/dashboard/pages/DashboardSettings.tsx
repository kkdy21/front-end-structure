import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardSettings() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">설정</h1>

            <Card>
                <CardHeader>
                    <CardTitle>설정 페이지</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        이 페이지에 접근하려면 <code className="rounded bg-muted px-1 py-0.5 text-sm">dashboard.settings</code> 권한이 필요합니다.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
