import { communication, maps, social, weather } from "./icon-sets";
import { WEIGHTS } from "./constants.js";

function getPixelData(image) {
  image.loadPixels();
  return image.pixels
    .reduce((acc, cur, index) => {
      const chunkIndex = Math.floor(index / 4);

      if (!acc[chunkIndex]) {
        acc[chunkIndex] = [];
      }

      acc[chunkIndex].push(cur);

      return acc;
    }, [])
    .map((chunk) => ({
      red: chunk[0],
      green: chunk[1],
      blue: chunk[2],
      lightness: chunk.slice(0, 3).reduce((a, b) => (a, b)) / 3,
      color: `rgb(${chunk[0]}, ${chunk[1]}, ${chunk[2]})`,
      weight: WEIGHTS[Math.floor((lightness / 255) * (WEIGHTS.length - 1))],
      radius: floor(map(lightness, 0, 255, 0, 50)) + "%",
    }));
}

function getPixelHtml({ pixel, threshold = 128, symbolSet = communication }) {
  const { lightness } = pixel;
  const symbol = symbolSet.getSymbol(lightness);
  const picker = foobar.bind(this, pixel, symbol);

  if (lightness < threshold) {
    return picker({
      pixel: "dark",
      symbol: lightness > threshold / 2 ? "fill" : "outline",
    });
  } else {
    return picker({
      pixel: "light",
      symbol: lightness < 163 ? "fill" : "outline",
    });
  }
}

function foobar(pixel, symbol, style) {
  const backgroundColor = style.pixel === "light" ? "white" : pixel.color;
  const fillColor = style.symbol === "fill" ? 1 : 0;
  const showText = pixel.lightness !== 0 && pixel.lightness !== 255;
  return `
  <span
    class='material-symbols-outlined' 
    style="
      background-color: ${backgroundColor};
      color: white;
      font-variation-settings: 'wght' ${
        pixel.weight
      }, 'FILL_color' ${fillColor};
      border-radius: ${pixel.radius}
    "
    data-character="${symbol.index}"
  >
    ${showText ? symbol.text : ""}
  </span>`;
}

function getImage(source) {
  const image = loadImage(source);
  return {
    image,
    width: image.width,
    height: image.height,
    pixels: getPixelData(image),
  };
}

function getHtml({ image, ...props }) {
  return Array.from({ length: image.height }).map((_, rowIndex) => {
    const inner = Array.from({ length: image.width }).map((_, columnIndex) => {
      const pixelIndex = rowIndex * image.width + columnIndex;
      return getPixelHtml({ pixel: image.pixels[pixelIndex], ...props });
    });
    return `<div class="row">${inner.join("")}</div>`;
  }).join("");
}

function initializeUi() {
  const imageInput = document.getElementById("image");
  const thresholdInput = document.getElementById("threshold");
  const symbolSetInput = document.getElementById("symbol-set");
  const inputs = [imageInput, thresholdInput, symbolSetInput];
  const output = document.getElementById("output");
  const errorLog = document.getElementById("errors");
  const clearErrorsButton = document.getElementById("clear-errors");

  const logError = (error) => {
    errorLog.innerHTML += error.message;
  }

  const clearErrors = () => {
    errorLog.innerHTML = "";
  }

  const getSymbolSet = (key) => {
    switch(key) {
      case "communication":
        return communication;
      case "maps":
        return maps;
      case "social":
        return social;
      default:
        return weather;
    };
  }

  let unlisteners = [];

  const handleImageChange = () => {
    debugger;
    let image;
    try {
      image = getImage(imageInput.value);
    } catch (error) {
      return logError(error);
    }

    if (Boolean(unlisteners.length)) {
      unlisteners.forEach((unlistener) => unlistener());
    }

    const handleSettingChange = () => {
      try {
        const threshold = thresholdInput.value;
        const symbolSet = getSymbolSet(symbolSetInput.value);
        
        output.innerHTML = getHtml({
          image,
          threshold,
          symbolSet,
        });
      } catch(error) {
        return logError(error);
      }
    };
    
    unlisteners = inputs.map((input) => {
      input.addEventListener("change", handleSettingChange);

      return () => {
        input.removeEventListener("change", handleSettingChange);
      };
    });

    handleSettingChange();
  }

  clearErrorsButton.addEventListener("click", clearErrors);
  imageInput.addEventListener("change", handleImageChange);
}

document.addEventListener("DOMContentLoaded", initializeUi);