module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    '*.eslintrc.js',
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["error", "single", { "allowTemplateLiterals": true }],
    "object-curly-spacing": ["error", "always"],
    "semi": ["error", "always"],
    "require-jsdoc": "off",
    "import/no-unresolved": 0,
    "indent": ["error", 2],
    "max-len": ["error", { 
      "code": 100, 
      "tabWidth": 4, 
      "comments": 100, 
      "ignoreComments": false, 
      "ignoreTrailingComments": true, 
      "ignoreUrls": true, 
      "ignoreStrings": true, 
      "ignoreTemplateLiterals": true, 
      "ignoreRegExpLiterals": true 
    }],
  },
};
