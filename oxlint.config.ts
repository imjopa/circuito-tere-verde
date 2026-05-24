import { defineConfig } from "oxlint";

const config = defineConfig({
  plugins: ["typescript", "oxc", "react", "react-perf", "promise", "jsx-a11y"],
  categories: {
    correctness: "error",
    perf: "warn",
    suspicious: "warn",
  },
  env: {
    builtin: true,
    browser: true,
    es2023: true,
  },
  options: {
    typeAware: true,
    typeCheck: true,
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "typescript/explicit-function-return-type": "off",
    "typescript/explicit-module-boundary-types": "off",
    "typescript/no-unsafe-type-assertion": "off",
  },
  settings: {
    react: {
      version: "19.2.6",
      linkComponents: [
        {
          name: "Link",
          attribute: "to",
        },
      ],
    },
  },
});

export default config;
