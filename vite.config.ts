import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
const pages = process.env.GITHUB_PAGES === "true" && repo;

export default defineConfig({
  plugins: [react()],
  base: pages ? `/${repo}/` : "/",
})
