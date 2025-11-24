import { Outlet } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardAnalytics() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">분석</h1>

            <Card>
                <CardHeader>
                    <CardTitle>분석 페이지</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        이 페이지에 접근하려면 <code className="rounded bg-muted px-1 py-0.5 text-sm">dashboard.analytics</code> 권한이 필요합니다.
                    </p>
                </CardContent>
            </Card>

            <Outlet />
        </div>
    );
}
