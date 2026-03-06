import type { Config } from "stylelint";

export default {
  ignoreFiles: ["node_modules/**", "dist/**"],
  extends: [
    "stylelint-config-standard",
    "stylelint-config-tailwindcss",
    "stylelint-config-recess-order"
  ],
  plugins: ["stylelint-order"],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen",
          "theme",
          "utility",
          "container",
          "layer",
          "source",
          "plugin",
          "custom-variant"
        ]
      }
    ],
    "function-no-unknown": [
      true,
      {
        ignoreFunctions: ["theme"]
      }
    ],
    "declaration-block-no-duplicate-properties": [
      true,
      {
        ignore: ["consecutive-duplicates-with-different-values"]
      }
    ],
    "no-descending-specificity": null,
    "import-notation": "string",
    "selector-class-pattern": null
  }
} satisfies Config;
