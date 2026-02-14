import path from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import perfectionist from "eslint-plugin-perfectionist";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);

const compat = new FlatCompat({
  baseDirectory: currentDirectory,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "public/**",
      "dist/**",
      "build/**",
      ".turbo/**",
      "coverage/**",
      "next-env.d.ts",
      "prisma/**",
      "prisma/seed-with-cloudinary.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    plugins: {
      perfectionist,
    },
    rules: {
      "max-len": ["warn", { code: 120, ignoreStrings: true, ignoreTemplateLiterals: true, ignoreUrls: true }],
      "object-curly-newline": "off",
      "function-paren-newline": "off",
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "function", next: "*" },
        { blankLine: "always", prev: "export", next: "*" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "react/no-unescaped-entities": "warn",
      "@next/next/no-img-element": "warn",
      "perfectionist/sort-imports": [
        "error",
        {
          type: "natural",
          order: "asc",
          groups: ["type", "builtin", "external", "internal", ["parent", "sibling", "index"], "side-effect", "style"],
          internalPattern: ["^@/.*"],
        },
      ],
    },
  },
];

export default eslintConfig;
