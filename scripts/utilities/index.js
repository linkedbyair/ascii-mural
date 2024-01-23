module.exports = {
  toKebabCase: function toKebabCase(string) {
    return (
      string
        .replace(/\s+/g, "-")
        // Strip out any characters that aren't alphanumeric, hyphens, or underscores
        .replace(/[^a-zA-Z0-9\-\_]/g, "")
        // Replace camelCase with snake_case
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        // Replace snake_case with kebab-case
        .replace(/[_\s]/g, "-")
        // Make everything lowercase
        .toLowerCase()
    );
  },

  toCamelCase: function toCamelCase(string) {
    // First replace kebab-case with snake_case
    // Then replace snake_case with camelCase
    return (
      string
        // Strip out any characters that aren't alphanumeric, hyphens, or underscores
        .replace(/[^a-zA-Z0-9\-\_\s]/g, "")
        // Replace kebab-case with snake_case
        .replace(/[-\s]/g, "_")
        // Make everything lowercase
        .toLowerCase()
        // Replace snake_case with camelCase
        .replace(/_([a-z0-9])/g, (match, letter) => letter.toUpperCase())
    );
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

  toSnakeCase: function toSnakeCase(string) {
    // First replace kebab-case with snake_case
    // Then replace camelCase with snake_case
    return (
      string
        .trim()
        // Strip out any characters that aren't alphanumeric, hyphens, or underscores
        .replace(/[^a-zA-Z0-9\-\_\s]/g, "")
        // Replace kebab-case with snake_case
        .replace(/[-\s]/g, "_")
        // Replace camelCase with snake_case
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        // Make everything lowercase
        .toLowerCase()
    );
  },
};
