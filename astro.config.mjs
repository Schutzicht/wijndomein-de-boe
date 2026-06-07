import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://wijndomein-de-boe.vercel.app",
  vite: {
    plugins: [tailwindcss()],
  },
});
