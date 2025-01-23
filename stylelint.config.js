module.exports = {
  extends: "stylelint-config-standard",
  rules: {
    indentation: 2, // Enforce 2-space indentation
    "string-quotes": "double", // Use double quotes for strings
    "selector-class-pattern": [
      "^[a-z][a-z0-9-_]*([A-Z][a-z0-9-_]*)?$", // Allow kebab-case, camelCase, or BEM-style
      {
        message: "Class names should follow kebab-case, camelCase, or BEM-style conventions.",
      },
    ],
    "declaration-block-no-duplicate-properties": true,
    "color-no-invalid-hex": true, // Disallow invalid hex colors
  },
};
