import './App.css';
import { RouterProvider, router } from './router';
import { AuthProvider } from './service/auth/components/AuthProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/sonner';

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
            <Toaster position="top-right" richColors />
        </ErrorBoundary>
    );
}

export default App;
