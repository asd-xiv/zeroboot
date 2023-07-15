module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      importAssertions: true,
      jsx: true,
    },
  },
  env: {
    browser: false,
    es2021: true,
    node: true,
  },
  plugins: ["testing-library"],
  extends: [
    "airbnb",
    "airbnb-typescript",
    ...[
      "../rules/base.js",
      "../rules/import.js",
      "../rules/typescript.js",
      "../rules/react.js",
      "../rules/unicorn.js",
      "../rules/jest.js",
      "../rules/prettier.js",
    ].map(require.resolve),
  ],
  rules: {
    "no-console": "off",
  },
  overrides: [
    {
      files: ["**/?(*.)test.tsx"],
      extends: ["plugin:testing-library/react"],
    },
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
}
