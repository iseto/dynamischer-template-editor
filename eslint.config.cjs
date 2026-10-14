const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const reactHooks = require("eslint-plugin-react-hooks");
const jsxA11y = require("eslint-plugin-jsx-a11y");
module.exports = [
  { ignores: ["dist/**", "node_modules/**", "src/tests/node_modules/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        FileReader: "readonly",
        DOMParser: "readonly",
        NodeFilter: "readonly",
        Blob: "readonly",
        URL: "readonly",
        React: "readonly",
        HTMLElement: "readonly",
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
    },
  },
];
