const imagemagick = require("imagemagick");
const path = require("path");
const fs = require("fs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;
const { DOMParser } = require("xmldom");
const parser = new DOMParser();
const symbolSets = require("./symbol-sets");
const { colorModes } = require("./color-modes");
const { COLOR_MODES } = require("./constants");

async function run() {
  if (!argv["input"]) {
    throw new Error("Missing required argument: --input");
  } else if (!fs.existsSync(argv["input"])) {
    throw new Error(`Input file does not exist: ${argv["input"]}`);
  }

  let output;
  if (argv["output"] && path.extname(argv["output"]) !== ".svg") {
    throw new Error("Output file must be an SVG");
  } else if (argv["output"]) {
    output = argv["output"];
  } else {
    const originalFilename = path.basename(
      argv["input"],
      path.extname(argv["input"])
    );
    const outputFilename = `${originalFilename}.svg`;
    output = path.resolve(__dirname, "../output", outputFilename);
  }

  // TODO: either make this interactive or make it more flexible.
  // User should be able to pass in
  // - a symbol set ID (camelCase)
  // - a symbol set ID (kebab-case)
  // - a symbol set name (human readable, wrapped in quotes)
  if (!argv["symbol-set"]) {
    throw new Error("Missing required argument: --symbol-set");
  } else if (!symbolSets.hasOwnProperty(argv["symbol-set"])) {
    throw new Error(`Symbol set does not exist: ${argv["symbol-set"]}`);
  }

  let colorMode;
  if (argv["color-mode"] && !COLOR_MODES.hasOwnProperty(argv["color-mode"])) {
    throw new Error(`Color mode does not exist: ${argv["color-mode"]}`);
  } else if (argv["color-mode"]) {
    colorMode = argv["color-mode"];
  } else {
    colorMode = COLOR_MODES.FULL_COLOR;
  }

  const threshold = parseInt(argv.threshold, 10) || 128;
  if (
    typeof threshold !== "number" ||
    threshold < 0 ||
    threshold > 255 ||
    isNaN(threshold)
  ) {
    throw new Error(`Threshold must be a number between 0 and 255`);
  }

  const isCheckered = Boolean(argv["checkered-pattern"]) || false;

  const backgroundColor = argv["background-color"] || null;

  const options = {
    input: argv.input,
    output: output,
    symbolSet: symbolSets[argv["symbol-set"]],
    colorMode: colorMode,
    threshold: threshold,
    isCheckered: isCheckered,
    backgroundColor: backgroundColor,
    iconSize: argv["icon-size"] || 20,
  };

  const size = await getImageSize({ options });
  const pixels = await getPixelData({ options, size });
  const svg = getSvg({ options, pixels, size });
  await writeSvg({ svg, options });
}

function getImageSize({ options }) {
  return new Promise((resolve, reject) => {
    imagemagick.identify(options.input, (error, data) => {
      if (error) {
        reject(error);
      }

      const { width, height } = data;
      resolve({ width, height });
    });
  });
}

async function getPixelData({ options, size }) {
  return new Promise(async (resolve, reject) => {
    const data = [];
    for (let row = 0; row < size.height; row++) {
      try {
        const dataForRow = await extractPixelDataFromImageMagick({
          rect: {
            left: 0,
            top: row,
            width: size.width,
            height: 1,
          },
          options,
        });
        data.push(dataForRow);
      } catch(error) {
        reject(error);
      }
    }
    resolve(data.flat());
  });

  // Go through the image row by row, because ImageMagick might crash if we try to get all pixels at once.
  return Promise.all(
    Array.from({ length: size.height }).map((_, row) => {
      return extractPixelDataFromImageMagick({
        rect: {
          left: 0,
          top: row,
          width: size.width,
          height: 1,
        },
        options,
      });
    })
  ).then((rows) => rows.flat());
}

function extractPixelDataFromImageMagick({ rect, options }) {
  const { left, top, width, height } = rect;
  return new Promise((resolve, reject) => {
    imagemagick.convert(
      [
        options.input,
        rect && '-extent', 
        rect && `${width}x${height}+${left}+${top}`,
        "-matte",
        "text:",
      ].filter((x) => Boolean(x)),
      (error, data) => {
        /*
        The output of the convert command is a string of RGBA values, one per line.
        It will look something like this:

        # ImageMagick pixel enumeration: 16,16,255,srgba
        0,0: (1,55,29,255)  #01371DFF  srgba(1,55,29,1)
        1,0: (1,55,29,255)  #01371DFF  srgba(1,55,29,1)
        ...etc etc
        */
        if (error) {
          reject(error);
        }

        const lines = data.split("\n");
        const pixels = lines
          .filter((line) => line !== "")
          .map((line) => {
            // Red (0-255), Green (0-255), Blue (0-255), Alpha (0-255)
            const channels = line.match(/\((\d+),(\d+),(\d+),(\d+)\)/);
            if (!channels || channels.length < 5) {
              return null;
            }
            const red = parseInt(channels[1], 10);
            const green = parseInt(channels[2], 10);
            const blue = parseInt(channels[3], 10);
            const alpha = parseInt(channels[4], 10);
            const luminance = Math.round((red + green + blue) / 3);
            const color = `rgb(${red}, ${green}, ${blue})`;
            return {
              red,
              green,
              blue,
              alpha,
              luminance,
              color,
            };
          })
          .filter((pixel) => pixel !== null);
        resolve(pixels);
      }
    );
  });
}

function getSvg({ options, pixels, size }) {
  const inner = Array.from({ length: size.height })
    .map((_, row) =>
      Array.from({ length: size.width }).map((_, column) => {
        const pixelIndex = row * size.width + column;
        const pixel = pixels[pixelIndex];
        const position = { row, column, pixel: pixelIndex };
        return getPixelHtml({ pixel, size, position, options });
      })
    )
    .flat()
    .filter((pixel) => pixel !== null)
    .join("");
  return `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${size.width}"
  height="${size.height}"
  viewBox="0 0 ${size.width * options.iconSize} ${
    size.height * options.iconSize
  }"
>
  ${inner}
</svg>`;
}

function getPixelHtml({ pixel, size, position, options }) {
  if (
    (options.isCheckered &&
      (position.row % 2 !== 0) ^ (position.column % 2 !== 0)) ||
    Math.round(pixel.alpha / 255) === 0
  ) {
    return null;
  }

  const symbol = options.symbolSet.getSymbol({ pixel, options });
  const colorFunction = colorModes[options.colorMode].bind(null, options);
  const pixelStyle = pixel.luminance < options.threshold ? "dark" : "light";
  const backgroundColor =
    pixelStyle === "light"
      ? options.backgroundColor || "white"
      : colorFunction(pixel);
  const textColor =
    pixelStyle === "light"
      ? colorFunction(pixel)
      : options.backgroundColor || "white";
  const justBackground = pixel.luminance === 255;
  const translateX =
    options.iconSize * size.width * (position.column / size.width);
  const translateY =
    options.iconSize * size.height * (position.row / size.height);
  const transform = `translate(${translateX}, ${translateY})`;
  const symbolSvg = decodeURIComponent(symbol.svg);
  const symbolSvgDoc = parser.parseFromString(symbolSvg, "image/svg+xml");
  const symbolSvgContents = symbolSvgDoc.documentElement.childNodes;

  const group = `
  <g transform="${transform}">
    <rect width="${options.iconSize}" height="${
    options.iconSize
  }" fill="${backgroundColor}" x="0" y="0" />
    <g fill="${textColor}">
      ${justBackground ? "" : symbolSvgContents}
    </g>
  </g>
  `;
  return group;
}

function writeSvg({ svg, options }) {
  return new Promise((resolve, reject) => {
    fs.writeFile(options.output, svg, (error) => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });
}

try {
  run();
} catch (error) {
  console.log(error);
}
