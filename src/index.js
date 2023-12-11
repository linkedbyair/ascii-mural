import { communication, maps, social, weather } from "./icon-sets";
import { WEIGHTS } from "./constants.js";

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

function getPixelData({ image, size }) {
  size ||= {};
  size.width ||= image.width;
  size.height ||= image.height;

  image.width = size.width;
  image.height = size.height;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = size.width;
  canvas.height = size.height;
  context.drawImage(image, 0, 0, size.width, size.height);
  const imageData = context.getImageData(0, 0, size.width, size.height);
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
      const [red, green, blue] = chunk;
      const lightness = chunk.slice(0, 3).reduce((a, b) => (a, b)) / 3;
      const color = `rgb(${red}, ${green}, ${blue})`;
      const weight =
        WEIGHTS[Math.floor((lightness / 255) * (WEIGHTS.length - 1))];
      const radius = Math.floor((lightness / 255) * 50) + "%";
      return {
        red,
        green,
        blue,
        lightness,
        color,
        weight,
        radius,
      };
    });
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
    class='material-symbols-outlined flex justify-center items-center w-[12px] h-[12px]' 
    style="
      font-size: 9px !important;
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

function getHtml({ pixels, size, ...props }) {
  return Array.from({ length: size.height })
    .map((_, rowIndex) => {
      const inner = Array.from({ length: size.width }).map((_, columnIndex) => {
        const pixelIndex = rowIndex * size.width + columnIndex;
        return getPixelHtml({ pixel: pixels[pixelIndex], ...props });
      });
      return `<div class="flex flex-row no-wrap">${inner.join("")}</div>`;
    })
    .join("");
}

function initializeUi() {
  const imageInput = document.getElementById("image");
  const thresholdInput = document.getElementById("threshold");
  const symbolSetInput = document.getElementById("symbol-set");
  const inputs = [imageInput, thresholdInput, symbolSetInput];
  const output = document.getElementById("output");
  const errorLog = document.getElementById("errors");
  const clearErrorsButton = document.getElementById("clear-errors");
  const widthInput = document.getElementById("width");
  const heightInput = document.getElementById("height");

  const logError = (error) => {
    errorLog.innerHTML += error.message;
  };

  const clearErrors = () => {
    errorLog.innerHTML = "";
  };

  const getSymbolSet = (key) => {
    switch (key) {
      case "communication":
        return communication;
      case "maps":
        return maps;
      case "social":
        return social;
      default:
        return weather;
    }
  };

  const updateSizes = (image, event) => {
    if (event.target === widthInput) {
      const width = parseInt(widthInput.value, 10);
      const height = Math.floor(width / (image.width / image.height));
      if (heightInput.value !== height) {
        heightInput.value = height;
      }
    } else {
      const height = parseInit(heightInput.value, 10);
      const width = Math.floor(height * (image.width / image.height));
      if (widthInput.value !== width) {
        widthInput.value = width;
      }
    }
  };

  const readSizes = () => {
    return {
      width: parseInt(widthInput.value, 10),
      height: parseInt(heightInput.value, 10),
    };
  };

  let unlisteners = [];

  const unlistenExistingEvents = () => {
    if (Boolean(unlisteners.length)) {
      unlisteners.forEach((unlistener) => unlistener());
    }
  };

  const handleImageChange = async () => {
    unlistenExistingEvents();

    let image;
    try {
      image = await loadImage(imageInput.files[0]);
    } catch (error) {
      console.error(error);
      return logError(error);
    }

    updateSizes(image, { target: widthInput });
    
    const handleSizeChange = (e) => {
      unlistenExistingEvents();

      const size = readSizes();
      const pixels = getPixelData({
        image,
        size,
      });

      const handleSettingChange = () => {
        try {
          const threshold = thresholdInput.value;
          const symbolSet = getSymbolSet(symbolSetInput.value);
  
          output.innerHTML = getHtml({
            pixels,
            size,
            threshold,
            symbolSet,
          });
        } catch (error) {
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
    };

    [widthInput, heightInput].forEach((input) => {
      input.addEventListener("change", handleSizeChange);
      unlisteners.push(() => input.removeEventListener("change", handleSizeChange));
    });

    handleSizeChange();
  };

  clearErrorsButton.addEventListener("click", clearErrors);
  imageInput.addEventListener("change", handleImageChange);
}

document.addEventListener("DOMContentLoaded", initializeUi);
