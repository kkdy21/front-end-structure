import "./App.css";
import { RouterProvider, router } from "./router";
import { AuthProvider } from "./service/auth/components/AuthProvider";

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

export default App;
