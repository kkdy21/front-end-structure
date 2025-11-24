import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardAnalyticsReports() {
    return (
        <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
                <CardTitle>리포트</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    이 페이지에 접근하려면 <code className="rounded bg-muted px-1 py-0.5 text-sm">dashboard.analytics.reports</code> 권한이 필요합니다.
                </p>
            </CardContent>
        </Card>
    );
}
