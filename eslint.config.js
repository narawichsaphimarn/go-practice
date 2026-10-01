import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [tseslint.configs.base],
    rules: {
      complexity: ["error", { max: 15 }],
      "max-params": ["error", { max: 7 }],
    },
  },
);
