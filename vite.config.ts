import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    css: {
      postcss: "./postcss.config.js",
    },
    server: {
      proxy: {
        "/api/openai": {
          target: "https://api.openai.com",
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/openai/, "/v1"),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              // Set the correct headers for the target API
              proxyReq.setHeader(
                "Authorization",
                `Bearer ${env.VITE_OPENAI_API_KEY || ""}`
              );
              proxyReq.setHeader("Content-Type", "application/json");
            });
          },
        },
      },
    },
  };
});
