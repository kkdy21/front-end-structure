import { Outlet } from 'react-router';
import { Box, Flex } from '@radix-ui/themes';
import { AppSidebar, AppHeader } from '@/components/layouts';
import { SidebarProvider, SidebarInset } from '@/components/navigation';

export function PrivateLayout() {
    return (
        <SidebarProvider>
            <Flex style={{ minHeight: '100vh', width: '100%' }}>
                <AppSidebar />
                <SidebarInset style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <AppHeader />
                    <Box
                        asChild
                        style={{
                            flex: 1,
                            overflow: 'auto',
                            background: 'var(--gray-2)',
                        }}
                    >
                        <main>
                            <Box
                                style={{
                                    maxWidth: '1280px',
                                    margin: '0 auto',
                                    padding: 'var(--space-6)',
                                }}
                            >
                                <Outlet />
                            </Box>
                        </main>
                    </Box>
                </SidebarInset>
            </Flex>
        </SidebarProvider>
    );
}
