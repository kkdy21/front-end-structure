import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { RepositoryProvider } from "./repositories/referenceRepository.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RepositoryProvider>
            <App />
        </RepositoryProvider>
    </StrictMode>
);
