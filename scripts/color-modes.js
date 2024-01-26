const { toCamelCase } = require("js-convert-case");

function fullColor(settings = {}, { red, green, blue }) {
  return `rgb(${red}, ${green}, ${blue})`;
}

function grayscale(settings = {}, { luminance }) {
  return `rgb(${luminance}, ${luminance}, ${luminance})`;
}

function blackAndWhite(settings = {}, { luminance }) {
  // If less than threshold, we're selecting a background color for a white text.
  // If greater than threshold, we're selecting a text color for a white background.
  // In both cases, we are returning black.
  return "black";
}

const colorModes = {
  default: fullColor,
  fullColor: fullColor,
  grayscale: grayscale,
  blackAndWhite: blackAndWhite,
};

const getColorMode = (setting) => {
  if (!setting) {
    return colorModes.default;
  }
  const toCamelCaseSetting = toCamelCase(setting);
  if (!colorModes[toCamelCaseSetting]) {
    throw new Error(
      `Color mode "${setting}" is not supported. Supported color modes are: ${Object.keys(
        colorModes
      ).join(", ")}`
    );
  }
  return colorModes[toCamelCaseSetting] || colorModes.default;
};

module.exports = {
  fullColor: fullColor,
  grayscale: grayscale,
  blackAndWhite: blackAndWhite,
  colorModes: colorModes,
  getColorMode: getColorMode
};
