import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    css: {
      postcss: "./postcss.config.js",
    },
    server: {
      proxy: {
        "/api/openai": {
          target: "https://api.z.ai",
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/openai/, "/api/paas/v4"),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              // Set the correct headers for the target API
              proxyReq.setHeader(
                "Authorization",
                `Bearer ${env.VITE_OPENAI_API_KEY || ""}`
              );
            });
          },
        },
      },
    },
  };
});
