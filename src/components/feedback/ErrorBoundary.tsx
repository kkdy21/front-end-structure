import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router';
import { Box, Flex, Text, Button, Card } from '@radix-ui/themes';

// React Router Error Page
export function RouteErrorPage() {
    const error = useRouteError();
    const navigate = useNavigate();

    let errorMessage = '알 수 없는 오류가 발생했습니다.';

    if (isRouteErrorResponse(error)) {
        errorMessage = error.statusText || error.data?.message || errorMessage;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }

    const handleGoHome = () => {
        navigate('/', { replace: true });
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleReload = () => {
        window.location.reload();
    };

    return (
        <Flex
            align="center"
            justify="center"
            style={{
                minHeight: '100vh',
                padding: 'var(--space-4)',
                background: 'var(--color-background)',
            }}
        >
            <Card size="3" style={{ width: '100%', maxWidth: '400px' }}>
                <Flex direction="column" gap="4" p="4" align="center">
                    <Text size="5" weight="bold" color="red">
                        오류가 발생했습니다
                    </Text>
                    <Text size="2" color="gray" align="center">
                        예기치 않은 오류가 발생했습니다. 다시 시도해 주세요.
                    </Text>

                    <Box
                        style={{
                            width: '100%',
                            padding: 'var(--space-3)',
                            borderRadius: 'var(--radius-2)',
                            background: 'var(--gray-3)',
                        }}
                    >
                        <Text size="1" weight="medium" color="gray">
                            오류 메시지:
                        </Text>
                        <Text
                            as="p"
                            size="1"
                            color="red"
                            style={{
                                marginTop: 'var(--space-1)',
                                fontFamily: 'monospace',
                                wordBreak: 'break-word',
                            }}
                        >
                            {errorMessage}
                        </Text>
                    </Box>

                    <Flex gap="2" style={{ width: '100%' }}>
                        <Button
                            variant="outline"
                            style={{ flex: 1 }}
                            onClick={handleGoBack}
                        >
                            뒤로 가기
                        </Button>
                        <Button
                            variant="outline"
                            style={{ flex: 1 }}
                            onClick={handleGoHome}
                        >
                            홈으로
                        </Button>
                        <Button style={{ flex: 1 }} onClick={handleReload}>
                            새로고침
                        </Button>
                    </Flex>
                </Flex>
            </Card>
        </Flex>
    );
}

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = (): void => {
        this.setState({ hasError: false, error: null });
    };

    handleReload = (): void => {
        window.location.reload();
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Flex
                    align="center"
                    justify="center"
                    style={{
                        minHeight: '100vh',
                        padding: 'var(--space-4)',
                        background: 'var(--color-background)',
                    }}
                >
                    <Card size="3" style={{ width: '100%', maxWidth: '400px' }}>
                        <Flex direction="column" gap="4" p="4" align="center">
                            <Text size="5" weight="bold" color="red">
                                오류가 발생했습니다
                            </Text>
                            <Text size="2" color="gray" align="center">
                                예기치 않은 오류가 발생했습니다. 다시 시도해 주세요.
                            </Text>

                            {this.state.error && (
                                <Box
                                    style={{
                                        width: '100%',
                                        padding: 'var(--space-3)',
                                        borderRadius: 'var(--radius-2)',
                                        background: 'var(--gray-3)',
                                    }}
                                >
                                    <Text size="1" weight="medium" color="gray">
                                        오류 메시지:
                                    </Text>
                                    <Text
                                        as="p"
                                        size="1"
                                        color="red"
                                        style={{
                                            marginTop: 'var(--space-1)',
                                            fontFamily: 'monospace',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {this.state.error.message}
                                    </Text>
                                </Box>
                            )}

                            <Flex gap="2" style={{ width: '100%' }}>
                                <Button
                                    variant="outline"
                                    style={{ flex: 1 }}
                                    onClick={this.handleReset}
                                >
                                    다시 시도
                                </Button>
                                <Button style={{ flex: 1 }} onClick={this.handleReload}>
                                    페이지 새로고침
                                </Button>
                            </Flex>
                        </Flex>
                    </Card>
                </Flex>
            );
        }

        return this.props.children;
    }
}
