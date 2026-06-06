import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://demo-wijndomein-de-boe.vercel.app",
  vite: {
    plugins: [tailwindcss()],
  },
});
