import * as symbolSets from "./icon-sets";
import { COLOR_MODES, WEIGHTS } from "./constants.js";
import { colorModes } from "./color-modes/index.js";

const OUTPUT_RESOLUTION = 150; // DPI

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      image.src = e.target.result;
    };
    image.onload = () => {
      resolve(image);
    };
    fileReader.onerror = reject;
    fileReader.readAsDataURL(file);
  });
}

function getPixelData({ image }) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0, image.width, image.height);
  const imageData = context.getImageData(0, 0, image.width, image.height);
  if (!imageData || !imageData.data) {
    throw new Error("Could not get image data");
  }

  return imageData.data
    .reduce((acc, cur, index) => {
      const chunkIndex = Math.floor(index / 4);

      if (!acc[chunkIndex]) {
        acc[chunkIndex] = [];
      }

      acc[chunkIndex].push(cur);

      return acc;
    }, [])
    .map((chunk) => {
      const [red, green, blue, alpha] = chunk;
      // Photometric/digital ITU BT.709 http://www.itu.int/rec/R-REC-BT.709
      const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
      const color = `rgb(${red}, ${green}, ${blue})`;
      return {
        red,
        green,
        blue,
        alpha,
        luminance,
        color,
      };
    });
}

function getPixelHtml({ pixel, position, image, settings = {} }) {
  const {
    threshold = 128,
    symbolSet = communication,
    colorMode = METHODS[COLOR_MODES.FULL_COLOR],
    isCheckered = false,
    size,
  } = settings;

  if (typeof pixel === "undefined" || typeof pixel.alpha === "undefined") {
    debugger;
  }
  const iconSize = (size.width / image.width) * OUTPUT_RESOLUTION;

  if (
    (isCheckered && (position.row % 2 !== 0) ^ (position.column % 2 !== 0)) ||
    Math.round(pixel.alpha / 255) === 0
  ) {
    return `
    <span
      class='shrink-0 flex justify-center items-center' 
      style="
        width: ${iconSize}px;
        height: ${iconSize}px;
      "
    ></span>
    `;
  }

  const symbol = symbolSet.getSymbol({ pixel, settings });
  const colorFunction = colorModes[colorMode].bind(null, settings);
  const pixelStyle = pixel.luminance < threshold ? "dark" : "light";
  const backgroundColor =
    pixelStyle === "light" ? settings.backgroundColor : colorFunction(pixel);
  const textColor =
    pixelStyle === "light" ? colorFunction(pixel) : settings.backgroundColor;
  const fillColor = symbol.filled ? 1 : 0;
  const showText = pixel.luminance !== 255;
  const fontSize = (3 / 4) * iconSize;
  const weight =
    pixelStyle === "light"
      ? WEIGHTS[Math.floor((pixel.luminance / 255) * (WEIGHTS.length - 1))]
      : WEIGHTS[
          Math.floor(((255 - pixel.luminance) / 255) * (WEIGHTS.length - 1))
        ];

  return `
  <span
    class='material-symbols-outlined shrink-0 flex justify-center items-center' 
    style="
      width: ${iconSize}px;
      height: ${iconSize}px;
      display: flex;
      font-size: ${fontSize}px;
      background-color: ${backgroundColor};
      color: ${textColor};
      font-variation-settings: 'wght' ${weight}, 'FILL' ${fillColor};
    "
  >
    ${showText ? symbol.name : ""}
  </span>`;
}

function getHtml({ pixels, image, ...settings }) {
  return Array.from({ length: image.height })
    .map((_, rowIndex) => {
      const inner = Array.from({ length: image.width }).map(
        (_, columnIndex) => {
          const pixelIndex = rowIndex * image.width + columnIndex;
          return getPixelHtml({
            image,
            settings,
            pixel: pixels[pixelIndex],
            position: {
              row: rowIndex,
              column: columnIndex,
              pixel: pixelIndex,
            },
          });
        }
      );
      return `<div class="flex flex-row no-wrap">${inner.join("")}</div>`;
    })
    .join("");
}

function initializeUi() {
  const imageInput = document.getElementById("image");
  const thresholdInput = document.getElementById("threshold");
  const symbolSetInput = document.getElementById("symbol-set");
  const output = document.getElementById("output");
  const errorLog = document.getElementById("errors");
  const widthInput = document.getElementById("width");
  const heightInput = document.getElementById("height");
  const colorModeInput = document.getElementById("color-mode");
  const backgroundColorInput = document.getElementById("background-color");
  const checkedPatternInput = document.getElementById("checkered-pattern");
  const inputs = [
    thresholdInput,
    symbolSetInput,
    colorModeInput,
    backgroundColorInput,
    checkedPatternInput,
  ];

  // Populate symbol set dropdown
  symbolSetInput.innerHTML = Object.values(symbolSets)
    .map(({ id, name }) => `<option value="${id}">${name}</option>`)
    .join("");

  const getSymbolSet = (key) => {
    return symbolSets[key];
  };

  const updateSizes = (image, event) => {
    if (!event) {
      widthInput.value = 1;
      heightInput.value = Math.floor(image.height / image.width);;
    } else if (event.target && event.target === heightInput) {
      const height = parseInt(heightInput.value, 10);
      const width = Math.floor(height * (image.width / image.height));
      if (widthInput.value !== width) {
        widthInput.value = width;
      }
    } else {
      const width = parseInt(widthInput.value, 10);
      const height = Math.floor(width * (image.height / image.width));
      if (heightInput.value !== height) {
        heightInput.value = height;
      }
    }
  };

  const readSizes = () => {
    return {
      width: parseInt(widthInput.value, 10),
      height: parseInt(heightInput.value, 10),
    };
  };

  let primaryUnlisteners = [];
  const unlistenPrimaryEvents = () => {
    primaryUnlisteners.forEach((unlistener) => unlistener());
    primaryUnlisteners = [];
  };
  let secondaryUnlisteners = [];
  const unlistenSecondaryEvents = () => {
    secondaryUnlisteners.forEach((unlistener) => unlistener());
    secondaryUnlisteners = [];
  };

  const handleImageChange = async () => {
    unlistenPrimaryEvents();
    unlistenSecondaryEvents();

    let image;
    try {
      image = await loadImage(imageInput.files[0]);
    } catch (error) {
      console.error(error);
    }

    updateSizes(image);
    const pixels = getPixelData({ image });
    console.log(pixels)

    const handleSizeChange = (e) => {
      unlistenSecondaryEvents();
      updateSizes(image, e);
      const size = readSizes();

      const handleSettingChange = () => {
        try {
          const threshold = parseInt(thresholdInput.value, 10);
          const symbolSet = getSymbolSet(symbolSetInput.value);
          const colorMode = colorModeInput.value;
          const backgroundColor = backgroundColorInput.value;
          const isCheckered = checkedPatternInput.checked;

          output.innerHTML = getHtml({
            pixels,
            image,
            size,
            threshold,
            symbolSet,
            colorMode,
            backgroundColor,
            isCheckered,
          });
          output.style.backgroundColor = backgroundColor;
        } catch (error) {
          console.error(error);
        }
      };

      secondaryUnlisteners = inputs.map((input) => {
        input.addEventListener("change", handleSettingChange);

        return () => {
          input.removeEventListener("change", handleSettingChange);
        };
      });

      handleSettingChange();
    };

    [widthInput, heightInput].forEach((input) => {
      input.addEventListener("change", handleSizeChange);
      primaryUnlisteners.push(() =>
        input.removeEventListener("change", handleSizeChange)
      );
    });

    handleSizeChange();
  };

  imageInput.addEventListener("change", handleImageChange);
}

document.addEventListener("DOMContentLoaded", initializeUi);
