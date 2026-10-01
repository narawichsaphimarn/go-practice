import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
const pages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  plugins: [react()],
  base: pages ? "/project_005_golang_practice/" : "/",
})
