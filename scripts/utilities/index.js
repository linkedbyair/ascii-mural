module.exports = {
  toKebabCase: function toKebabCase(string) {
    // First replace camelCase with snake_case
    // Then replace snake_case with kebab-case
    return string
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .replace(/[_\s]/g, "-")
      .toLowerCase();
  },

  toCamelCase: function parameterize(string) {
    // First replace kebab-case with snake_case
    // Then replace snake_case with camelCase
    return string
      .replace(/[-\s]/g, "_")
      .toLowerCase()
      .replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
  },

  toHumanReadable: function toHumanReadable(string) {
    // First replace snake_case with kebab-case
    // Then replace kebab-case with human readable
    // Then capitalize the first letter of each word
    return string
      .replace(/_/g, "-")
      .replace(/-/g, " ")
      .replace(/\b([a-z])/g, (match, letter) => letter.toUpperCase());
  },
};
