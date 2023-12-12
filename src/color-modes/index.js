import {COLOR_MODES} from "../constants";

export function fullColor({red,green,blue}) {
  return `rgb(${red}, ${green}, ${blue})`;
}

export function grayscale({luminance}) {
  return `rgb(${luminance}, ${luminance}, ${luminance})`;
}

export function blackAndWhite({luminance}) {
  return luminance > 127 ? "#fff" : "#000";
}

export const colorModes = {
  default: fullColor,
  [COLOR_MODES.FULL_COLOR]: fullColor,
  [COLOR_MODES.GRAYSCALE]: grayscale,
  [COLOR_MODES.BLACK_AND_WHITE]: blackAndWhite,
}