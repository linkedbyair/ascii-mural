import {COLOR_MODES} from "../constants";

export function fullColor({red,green,blue}) {
  return `rgb(${red}, ${green}, ${blue})`;
}

export function grayscale({lightness}) {
  return `rgb(${lightness}, ${lightness}, ${lightness})`;
}

export function blackAndWhite({lightness}) {
  return lightness > 127 ? "#fff" : "#000";
}

export const colorModes = {
  default: fullColor,
  [COLOR_MODES.FULL_COLOR]: fullColor,
  [COLOR_MODES.GRAYSCALE]: grayscale,
  [COLOR_MODES.BLACK_AND_WHITE]: blackAndWhite,
}