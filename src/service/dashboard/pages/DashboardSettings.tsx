import { Settings, User, Bell, Shield, Palette, Globe } from 'lucide-react';
import { Box, Card, Flex, Grid, Text, Heading, TextField, Button, Code, Callout } from '@radix-ui/themes';

export function DashboardSettings() {
    const settingsSections = [
        {
            title: '프로필 설정',
            description: '개인 정보 및 계정 설정을 관리합니다.',
            icon: User,
            color: 'blue' as const,
        },
        {
            title: '알림 설정',
            description: '이메일 및 푸시 알림을 설정합니다.',
            icon: Bell,
            color: 'amber' as const,
        },
        {
            title: '보안 설정',
            description: '비밀번호 및 2단계 인증을 관리합니다.',
            icon: Shield,
            color: 'green' as const,
        },
        {
            title: '테마 설정',
            description: '다크 모드 및 색상 테마를 설정합니다.',
            icon: Palette,
            color: 'violet' as const,
        },
        {
            title: '언어 설정',
            description: '인터페이스 언어를 변경합니다.',
            icon: Globe,
            color: 'red' as const,
        },
    ];

    return (
        <Flex direction="column" gap="6">
            {/* Page Header */}
            <Flex justify="between" align="center">
                <Box>
                    <Heading size="6" weight="bold">설정</Heading>
                    <Text size="2" color="gray" mt="1">애플리케이션 설정을 관리합니다.</Text>
                </Box>
                <Flex
                    align="center"
                    justify="center"
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-3)',
                        background: 'var(--gray-3)'
                    }}
                >
                    <Settings style={{ width: '20px', height: '20px', color: 'var(--gray-11)' }} />
                </Flex>
            </Flex>

            {/* Settings Grid */}
            <Grid columns={{ initial: '1', sm: '2', lg: '3' }} gap="4">
                {settingsSections.map((section) => {
                    const IconComponent = section.icon;
                    return (
                        <Card
                            key={section.title}
                            size="2"
                            asChild
                            style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                        >
                            <button className="hover:shadow-md">
                                <Flex gap="4" align="start">
                                    <Flex
                                        align="center"
                                        justify="center"
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: 'var(--radius-3)',
                                            background: `var(--${section.color}-3)`,
                                            flexShrink: 0
                                        }}
                                    >
                                        <IconComponent style={{ width: '24px', height: '24px', color: `var(--${section.color}-11)` }} />
                                    </Flex>
                                    <Flex direction="column" gap="1">
                                        <Text size="3" weight="medium">{section.title}</Text>
                                        <Text size="2" color="gray">{section.description}</Text>
                                    </Flex>
                                </Flex>
                            </button>
                        </Card>
                    );
                })}
            </Grid>

            {/* Quick Settings Card */}
            <Card size="3">
                <Flex direction="column" gap="4">
                    <Flex direction="column">
                        <Heading size="4">빠른 설정</Heading>
                        <Text size="2" color="gray">자주 사용하는 설정을 빠르게 변경할 수 있습니다.</Text>
                    </Flex>

                    <Grid columns={{ initial: '1', sm: '2' }} gap="5">
                        <Flex direction="column" gap="2">
                            <Text as="label" size="2" weight="medium" htmlFor="displayName">
                                표시 이름
                            </Text>
                            <TextField.Root
                                id="displayName"
                                placeholder="이름을 입력하세요"
                                size="2"
                            />
                        </Flex>
                        <Flex direction="column" gap="2">
                            <Text as="label" size="2" weight="medium" htmlFor="email">
                                이메일
                            </Text>
                            <TextField.Root
                                id="email"
                                type="email"
                                placeholder="이메일을 입력하세요"
                                size="2"
                            />
                        </Flex>
                    </Grid>

                    <Flex justify="end">
                        <Button size="2">변경사항 저장</Button>
                    </Flex>
                </Flex>
            </Card>

            {/* Access Info */}
            <Callout.Root color="gray" size="1">
                <Callout.Text>
                    이 페이지에 접근하려면 <Code size="1">dashboard.settings</Code> 권한이 필요합니다.
                </Callout.Text>
            </Callout.Root>
        </Flex>
    );
}
