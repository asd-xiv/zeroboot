module.exports = {
  rules: {
    "no-underscore-dangle": [
      "error",
      {
        allow: ["_dirname"],
      },
    ],
    "no-restricted-syntax": ["error", "BinaryExpression[operator='of']"],
  },
}
