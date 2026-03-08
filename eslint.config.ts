import eslint from "@eslint/js";
import eslintPrettier from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["**/dist", "**/node_modules"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.recommended,
      eslintPrettier
    ],
    plugins: {
      react,
      import: importPlugin,
      "@typescript-eslint": tseslint.plugin
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        ecmaFeatures: {
          tsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.node
      },
      ecmaVersion: 2020,
      sourceType: "module"
    },
    settings: {
      react: {
        version: "detect"
      },
      "import/resolver": {
        typescript: true,
        node: true
      }
    },
    rules: {
      indent: [
        "error",
        2,
        {
          SwitchCase: 1
        }
      ],
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "lines-between-class-members": [
        "error",
        "always",
        {
          exceptAfterSingleLine: true
        }
      ],
      "no-undef": "off",
      "newline-after-var": "error",
      "newline-before-return": "error",
      "no-trailing-spaces": "error",
      "prefer-const": "error",
      "react/display-name": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/no-unknown-property": "off",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-inferrable-types": "error",
      "@typescript-eslint/no-unused-vars": "error"
    }
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "import/extensions": [
        "error",
        "never",
        {
          ts: "never",
          tsx: "never",
          css: "always",
          svg: "always"
        }
      ]
    }
  },
  {
    ignores: ["src/**/*.{ts,tsx}"],
    rules: {
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          ts: "always",
          js: "always",
          json: "always"
        }
      ]
    }
  }
]);
