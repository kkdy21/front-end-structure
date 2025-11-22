import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default ({ command, mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiServerDomain = env.VITE_BACKEND_BASE_URL;

  if (command === "serve") {
    console.log(` -----------------------------------------------------------`);
    console.log(`  Command   | ${command}`);
    console.log(`  Vite mode | ${mode}`);
    console.log(`  API Server | ${apiServerDomain}`);
    console.log(` -----------------------------------------------------------`);
  }

  return defineConfig({
    server: {
      proxy: {
        "/api": {
          target: apiServerDomain,
          changeOrigin: true,
          secure: true,
          headers: {
            Origin: apiServerDomain,
          },
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  });
};
