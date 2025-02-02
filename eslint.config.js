import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import vitest from "@vitest/eslint-plugin";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  {
    ignores: [
      ".DS_Store",
      ".vscode/",
      "archive/",
      "coverage/",
      "dist/",
      "node_modules/",
      "package-lock.json",
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.js"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    name: "vitest",
    files: ["test/**/*.spec.ts"],
    ...vitest.configs.recommended,
  },
  eslintPluginPrettierRecommended,
);
