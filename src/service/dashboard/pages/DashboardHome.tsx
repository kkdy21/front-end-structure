import { User, Shield, Key, Activity, TrendingUp, Users, FileText } from 'lucide-react';
import { Box, Card, Flex, Grid, Text, Heading, Badge } from '@radix-ui/themes';
import { useUserStore } from '@/repositories/userRepository/store/userStore';
import { useRoleStore } from '@/repositories/roleRepository/store/roleStore';

export function DashboardHome() {
    const { currentUser } = useUserStore();
    const { currentRole } = useRoleStore();

    // 통계 카드 데이터 (실제로는 API에서 가져옴)
    const stats = [
        { title: '총 학생 수', value: '1,234', change: '+12%', icon: Users, color: 'blue' as const },
        { title: '활성 세션', value: '89', change: '+5%', icon: Activity, color: 'green' as const },
        { title: '완료 과제', value: '456', change: '+23%', icon: FileText, color: 'violet' as const },
        { title: '성장률', value: '18.2%', change: '+2.1%', icon: TrendingUp, color: 'amber' as const },
    ];

    return (
        <Flex direction="column" gap="6">
            {/* Page Header */}
            <Box>
                <Heading size="6" weight="bold">대시보드</Heading>
                <Text size="2" color="gray" mt="1">
                    안녕하세요, {currentUser?.name ?? '사용자'}님! 오늘도 좋은 하루 되세요.
                </Text>
            </Box>

            {/* Stats Grid */}
            <Grid columns={{ initial: '1', sm: '2', lg: '4' }} gap="4">
                {stats.map((stat) => {
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

            {/* Info Cards Grid */}
            <Grid columns={{ initial: '1', lg: '2' }} gap="5">
                {/* User Info Card */}
                <Card size="3">
                    <Flex direction="column" gap="4">
                        <Flex align="center" gap="3">
                            <Flex
                                align="center"
                                justify="center"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: 'var(--radius-3)',
                                    background: 'var(--accent-3)'
                                }}
                            >
                                <User style={{ width: '20px', height: '20px', color: 'var(--accent-11)' }} />
                            </Flex>
                            <Flex direction="column">
                                <Heading size="4">사용자 정보</Heading>
                                <Text size="2" color="gray">현재 로그인된 계정 정보</Text>
                            </Flex>
                        </Flex>

                        <Flex direction="column" gap="3">
                            <Flex
                                justify="between"
                                align="center"
                                p="3"
                                style={{ background: 'var(--gray-2)', borderRadius: 'var(--radius-2)' }}
                            >
                                <Text size="2" color="gray">이름</Text>
                                <Text size="2" weight="medium">{currentUser?.name ?? '-'}</Text>
                            </Flex>
                            <Flex
                                justify="between"
                                align="center"
                                p="3"
                                style={{ background: 'var(--gray-2)', borderRadius: 'var(--radius-2)' }}
                            >
                                <Text size="2" color="gray">이메일</Text>
                                <Text size="2" weight="medium">{currentUser?.email ?? '-'}</Text>
                            </Flex>
                            <Flex
                                justify="between"
                                align="center"
                                p="3"
                                style={{ background: 'var(--gray-2)', borderRadius: 'var(--radius-2)' }}
                            >
                                <Text size="2" color="gray">역할</Text>
                                <Badge size="2" color="blue">
                                    <Shield style={{ width: '12px', height: '12px' }} />
                                    {currentRole?.name ?? '-'}
                                </Badge>
                            </Flex>
                        </Flex>
                    </Flex>
                </Card>

                {/* Access Permissions Card */}
                <Card size="3">
                    <Flex direction="column" gap="4">
                        <Flex align="center" gap="3">
                            <Flex
                                align="center"
                                justify="center"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: 'var(--radius-3)',
                                    background: 'var(--green-3)'
                                }}
                            >
                                <Key style={{ width: '20px', height: '20px', color: 'var(--green-11)' }} />
                            </Flex>
                            <Flex direction="column">
                                <Heading size="4">접근 권한</Heading>
                                <Text size="2" color="gray">현재 역할에서 접근 가능한 페이지</Text>
                            </Flex>
                        </Flex>

                        <Flex wrap="wrap" gap="2">
                            {currentRole?.pageAccess.map((access) => (
                                <Badge key={access} size="2" variant="surface" color="gray">
                                    {access}
                                </Badge>
                            ))}
                            {(!currentRole?.pageAccess || currentRole.pageAccess.length === 0) && (
                                <Text size="2" color="gray">접근 권한이 없습니다.</Text>
                            )}
                        </Flex>
                    </Flex>
                </Card>
            </Grid>
        </Flex>
    );
}
