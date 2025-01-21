import js from "@eslint/js";
import perfectionist from "eslint-plugin-perfectionist";
import prettier from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tailwind from "eslint-plugin-tailwindcss";
import globals from "globals";
import tseslint from "typescript-eslint";

const config = tseslint.config(
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,cjs,mjs,ts,tsx}"],
    extends: [
      js.configs.recommended,
      perfectionist.configs["recommended-natural"],
    ],
    rules: {
      "perfectionist/sort-enums": "off",
      "perfectionist/sort-interfaces": "off",
      "perfectionist/sort-intersection-types": "off",
      "perfectionist/sort-jsx-props": "off",
      "perfectionist/sort-maps": "off",
      "perfectionist/sort-object-types": "off",
      "perfectionist/sort-objects": "off",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ...tailwind.configs["flat/recommended"],
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.js"],
          defaultProject: "tsconfig.json",
        },
      },
    },
    plugins: {
      react,
      // TODO: Upgrade eslint-plugin-react-hooks to newer version when this type
      // error fix is released: https://github.com/facebook/react/pull/30774
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
    settings: { react: { version: "19.0" } },
  },
  prettier,
);

export default config;
