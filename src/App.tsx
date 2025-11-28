import './App.css';
import { Theme } from '@radix-ui/themes';
import { RouterProvider, router } from './router';
import { AuthProvider } from './service/auth/components/AuthProvider';
import { ErrorBoundary, Toaster } from './components/feedback';

function App() {
    return (
        <Theme accentColor="blue" grayColor="slate" radius="medium" scaling="100%">
            <ErrorBoundary>
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
                <Toaster position="top-right" richColors />
            </ErrorBoundary>
        </Theme>
    );
}

export default App;
