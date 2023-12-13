import {COLOR_MODES} from "../constants";

export function fullColor(settings={}, {red,green,blue}) {
  return `rgb(${red}, ${green}, ${blue})`;
}

export function grayscale(settings={}, {luminance}) {
  return `rgb(${luminance}, ${luminance}, ${luminance})`;
}

export function blackAndWhite(settings={}, {luminance}) {
  // If less than threshold, we're selecting a background color for a white text.
  // If greater than threshold, we're selecting a text color for a white background.
  // In both cases, we are returning black.
  return "black";
}

export const colorModes = {
  default: fullColor,
  [COLOR_MODES.FULL_COLOR]: fullColor,
  [COLOR_MODES.GRAYSCALE]: grayscale,
  [COLOR_MODES.BLACK_AND_WHITE]: blackAndWhite,
}