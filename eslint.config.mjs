import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        game: "readonly",
        Hooks: "readonly",
        ui: "readonly",
        foundry: "readonly",
        canvas: "readonly",
        CONFIG: "readonly",
        window: "readonly",
        document: "readonly",
        HTMLElement: "readonly",
        console: "readonly",
        fetch: "readonly"
      }
    }
  },
  {
    files: ["scripts/validate-manifest.mjs", "scripts/ci/**/*.mjs"],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        URL: "readonly"
      }
    }
  }
];
