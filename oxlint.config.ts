import { defineConfig } from "oxlint";

const config = defineConfig({
  plugins: [
    "typescript",
    "oxc",
    "react",
    "react-perf",
    "promise",
    "jsx-a11y",
    "unicorn",
    "node",
    "jsdoc",
    "eslint",
  ],
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
    "oxc/no-map-spread": "off",
    "react/react-in-jsx-scope": "off",
    "react-perf/jsx-no-jsx-as-prop": "off",
    "react-perf/jsx-no-new-function-as-prop": "off",
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
  overrides: [
    {
      files: ["apps/web/**"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            paths: [
              {
                name: "@circuito/db",
                message: "Use @circuito/db/client instead",
              },
            ],
          },
        ],
      },
    },
  ],
});

export default config;
