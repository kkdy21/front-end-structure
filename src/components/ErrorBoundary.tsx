import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// React Router용 에러 페이지
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
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-destructive">
                        오류가 발생했습니다
                    </CardTitle>
                    <CardDescription>
                        예기치 않은 오류가 발생했습니다. 다시 시도해 주세요.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-md bg-muted p-3">
                        <p className="text-sm font-medium text-muted-foreground">
                            오류 메시지:
                        </p>
                        <code className="mt-1 block text-xs text-destructive">
                            {errorMessage}
                        </code>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={handleGoBack}
                        >
                            뒤로 가기
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={handleGoHome}
                        >
                            홈으로
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleReload}
                        >
                            새로고침
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
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
                <div className="flex min-h-screen items-center justify-center bg-background p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl text-destructive">
                                오류가 발생했습니다
                            </CardTitle>
                            <CardDescription>
                                예기치 않은 오류가 발생했습니다. 다시 시도해 주세요.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {this.state.error && (
                                <div className="rounded-md bg-muted p-3">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        오류 메시지:
                                    </p>
                                    <code className="mt-1 block text-xs text-destructive">
                                        {this.state.error.message}
                                    </code>
                                </div>
                            )}
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={this.handleReset}
                                >
                                    다시 시도
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={this.handleReload}
                                >
                                    페이지 새로고침
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
