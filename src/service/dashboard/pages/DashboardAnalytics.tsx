import { BarChart3, Users, Eye, Clock, Download, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { Box, Card, Flex, Grid, Text, Heading, Tabs, Badge, IconButton } from '@radix-ui/themes';

export function DashboardAnalytics() {
    const overviewStats = [
        { title: '총 방문자', value: '12,345', change: '+20.1%', icon: Users, color: 'blue' as const },
        { title: '페이지뷰', value: '45,678', change: '+15.2%', icon: Eye, color: 'violet' as const },
        { title: '평균 체류 시간', value: '3m 42s', change: '+5.4%', icon: Clock, color: 'green' as const },
    ];

    const reports = [
        { title: '월간 리포트', period: '2024년 11월', status: 'completed', statusLabel: '완료' },
        { title: '주간 리포트', period: '11월 4주차', status: 'in_progress', statusLabel: '진행 중' },
        { title: '일간 리포트', period: '11월 28일', status: 'pending', statusLabel: '대기 중' },
    ];

    const exportFormats = [
        { name: 'CSV', description: '스프레드시트 호환 형식', icon: FileText },
        { name: 'Excel', description: 'Microsoft Excel 형식', icon: FileText },
        { name: 'PDF', description: '인쇄용 문서 형식', icon: FileText },
    ];

    return (
        <Flex direction="column" gap="6">
            {/* Page Header */}
            <Flex justify="between" align="center">
                <Box>
                    <Heading size="6" weight="bold">분석</Heading>
                    <Text size="2" color="gray" mt="1">데이터 분석 및 리포트를 확인하세요.</Text>
                </Box>
                <Flex
                    align="center"
                    justify="center"
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-3)',
                        background: 'var(--violet-3)'
                    }}
                >
                    <BarChart3 style={{ width: '20px', height: '20px', color: 'var(--violet-11)' }} />
                </Flex>
            </Flex>

            {/* Tabs */}
            <Tabs.Root defaultValue="overview">
                <Tabs.List>
                    <Tabs.Trigger value="overview">개요</Tabs.Trigger>
                    <Tabs.Trigger value="reports">리포트</Tabs.Trigger>
                    <Tabs.Trigger value="export">내보내기</Tabs.Trigger>
                </Tabs.List>

                {/* Overview Tab */}
                <Tabs.Content value="overview">
                    <Flex direction="column" gap="5" mt="5">
                        <Grid columns={{ initial: '1', sm: '2', lg: '3' }} gap="4">
                            {overviewStats.map((stat) => {
                                const IconComponent = stat.icon;
                                return (
                                    <Card key={stat.title} size="2">
                                        <Flex justify="between" align="start">
                                            <Flex direction="column" gap="1">
                                                <Text size="2" color="gray">{stat.title}</Text>
                                                <Heading size="6">{stat.value}</Heading>
                                                <Text size="1" color="green">{stat.change} from last month</Text>
                                            </Flex>
                                            <Flex
                                                align="center"
                                                justify="center"
                                                style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: 'var(--radius-3)',
                                                    background: `var(--${stat.color}-3)`
                                                }}
                                            >
                                                <IconComponent style={{ width: '24px', height: '24px', color: `var(--${stat.color}-11)` }} />
                                            </Flex>
                                        </Flex>
                                    </Card>
                                );
                            })}
                        </Grid>

                        {/* Chart Placeholder */}
                        <Card size="3">
                            <Flex direction="column" gap="3">
                                <Flex direction="column">
                                    <Heading size="4">방문자 추이</Heading>
                                    <Text size="2" color="gray">최근 30일간 방문자 통계</Text>
                                </Flex>
                                <Flex
                                    align="center"
                                    justify="center"
                                    direction="column"
                                    gap="2"
                                    style={{
                                        height: '256px',
                                        background: 'var(--gray-2)',
                                        borderRadius: 'var(--radius-2)'
                                    }}
                                >
                                    <BarChart3 style={{ width: '48px', height: '48px', color: 'var(--gray-8)' }} />
                                    <Text size="2" color="gray">차트가 여기에 표시됩니다</Text>
                                </Flex>
                            </Flex>
                        </Card>
                    </Flex>
                </Tabs.Content>

                {/* Reports Tab */}
                <Tabs.Content value="reports">
                    <Flex direction="column" gap="5" mt="5">
                        <Card size="3">
                            <Flex direction="column" gap="4">
                                <Flex direction="column">
                                    <Heading size="4">리포트 목록</Heading>
                                    <Text size="2" color="gray">생성된 리포트를 확인하고 다운로드하세요.</Text>
                                </Flex>
                                <Flex direction="column" gap="3">
                                    {reports.map((report, index) => (
                                        <Flex
                                            key={index}
                                            justify="between"
                                            align="center"
                                            p="4"
                                            style={{
                                                border: '1px solid var(--gray-4)',
                                                borderRadius: 'var(--radius-2)',
                                                transition: 'background 0.2s'
                                            }}
                                            className="hover:bg-gray-2"
                                        >
                                            <Flex align="center" gap="4">
                                                <Flex
                                                    align="center"
                                                    justify="center"
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: 'var(--radius-2)',
                                                        background: 'var(--gray-3)'
                                                    }}
                                                >
                                                    <FileText style={{ width: '20px', height: '20px', color: 'var(--gray-11)' }} />
                                                </Flex>
                                                <Flex direction="column">
                                                    <Text size="2" weight="medium">{report.title}</Text>
                                                    <Text size="1" color="gray">{report.period}</Text>
                                                </Flex>
                                            </Flex>
                                            <Flex align="center" gap="3">
                                                {report.status === 'completed' && (
                                                    <Badge size="1" color="green">
                                                        <CheckCircle style={{ width: '12px', height: '12px' }} />
                                                        {report.statusLabel}
                                                    </Badge>
                                                )}
                                                {report.status === 'in_progress' && (
                                                    <Badge size="1" color="amber">
                                                        <Loader2 style={{ width: '12px', height: '12px' }} className="animate-spin" />
                                                        {report.statusLabel}
                                                    </Badge>
                                                )}
                                                {report.status === 'pending' && (
                                                    <Badge size="1" color="gray">
                                                        {report.statusLabel}
                                                    </Badge>
                                                )}
                                                {report.status === 'completed' && (
                                                    <IconButton variant="ghost" color="gray" size="1">
                                                        <Download style={{ width: '16px', height: '16px' }} />
                                                    </IconButton>
                                                )}
                                            </Flex>
                                        </Flex>
                                    ))}
                                </Flex>
                            </Flex>
                        </Card>
                    </Flex>
                </Tabs.Content>

                {/* Export Tab */}
                <Tabs.Content value="export">
                    <Flex direction="column" gap="5" mt="5">
                        <Card size="3">
                            <Flex direction="column" gap="4">
                                <Flex direction="column">
                                    <Heading size="4">데이터 내보내기</Heading>
                                    <Text size="2" color="gray">분석 데이터를 다양한 형식으로 내보낼 수 있습니다.</Text>
                                </Flex>
                                <Grid columns={{ initial: '1', sm: '3' }} gap="4">
                                    {exportFormats.map((format) => {
                                        const IconComponent = format.icon;
                                        return (
                                            <Flex
                                                key={format.name}
                                                direction="column"
                                                align="center"
                                                gap="3"
                                                p="5"
                                                asChild
                                                style={{
                                                    border: '1px solid var(--gray-4)',
                                                    borderRadius: 'var(--radius-3)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <button className="hover:border-accent-6 hover:bg-gray-2">
                                                    <Flex
                                                        align="center"
                                                        justify="center"
                                                        style={{
                                                            width: '48px',
                                                            height: '48px',
                                                            borderRadius: 'var(--radius-2)',
                                                            background: 'var(--gray-3)'
                                                        }}
                                                    >
                                                        <IconComponent style={{ width: '24px', height: '24px', color: 'var(--gray-11)' }} />
                                                    </Flex>
                                                    <Flex direction="column" align="center">
                                                        <Text size="2" weight="medium">{format.name}</Text>
                                                        <Text size="1" color="gray">{format.description}</Text>
                                                    </Flex>
                                                </button>
                                            </Flex>
                                        );
                                    })}
                                </Grid>
                            </Flex>
                        </Card>
                    </Flex>
                </Tabs.Content>
            </Tabs.Root>
        </Flex>
    );
}
