module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  "no-use-before-define": ["error", { variables: false }],
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "airbnb-typescript",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    // Prettier plugin and recommended rules
    "plugin:prettier/recommended",
  ],
  rules: {
    // Include .prettierrc.js rules
    "prettier/prettier": 0,
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-console": "off",
    "import/extensions": "off",
  },
};
