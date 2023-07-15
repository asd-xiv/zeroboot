module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      importAssertions: true,
    },
  },
  env: {
    browser: false,
    es2021: true,
    node: true,
  },
  plugins: [],
  extends: [
    "airbnb",
    "airbnb-typescript",
    ...[
      "../rules/base.js",
      "../rules/jsdoc.js",
      "../rules/import.js",
      "../rules/typescript.js",
      "../rules/jest.js",
      "../rules/unicorn.js",
      // "../rules/functional.js",
      "../rules/prettier.js",
    ].map(require.resolve),
  ],
  rules: {
    "no-console": "off",
    "unicorn/prefer-event-target": "off",
    "unicorn/prevent-abbreviations": [
      "error",
      {
        replacements: {
          i: {
            index: true,
          },
          params: false,
          lib: false,
          args: {
            params: true,
          },
          props: {
            options: true,
          },
          fn: false,
          acc: false,
        },
      },
    ],
  },
}
