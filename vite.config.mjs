import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  if (command === "build" && !env.VITE_API_BASE_URL) {
    throw new Error(
      "[vite] VITE_API_BASE_URL is not set. " +
        "Set it in .env or .env.production before running a production build.",
    );
  }

  const devPort = parseInt(env.VITE_DEV_PORT, 10) || 5173;
  const allowedHost = env.VITE_ALLOWED_HOST || "illorac.com";

  return {
    base: "/",
    plugins: [react(), tailwindcss()],

    server: {
      host: true,
      port: devPort,
      open: true,
      allowedHosts: true,
      headers: {
        "Access-Control-Allow-Origin": `https://${allowedHost}`,
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept, Authorization",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      },
      proxy: {
        "/socket.io": {
          target: "http://localhost:4000",
          changeOrigin: true,
          ws: true,
          secure: false,
        },
        "/api": {
          target: "https://api.illorac.nl",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, "/api/v1"),
        },
      },
    },

    build: {
      outDir: "dist",
      assetsInlineLimit: 8 * 1024,
      sourcemap: "hidden",
    },
  };
});
