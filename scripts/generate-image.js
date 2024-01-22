const imagemagick = require("imagemagick");
const path = require("path");
const fs = require("fs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;
const { DOMParser } = require("xmldom");
const parser = new DOMParser();
const svg2img = require("svg2img");
const symbolSets = require("./symbol-sets");
const { colorModes } = require("./color-modes");
const { COLOR_MODES } = require("./constants");

const DESIRED_RESOLUTION = 150; // DPI
const OUTPUT_RESOLUTION = 72; // DPI

async function run() {
  if (!argv["input"]) {
    throw new Error("Missing required argument: --input");
  } else if (!fs.existsSync(argv["input"])) {
    throw new Error(`Input file does not exist: ${argv["input"]}`);
  }

  let output;
  if (argv["output"] && path.extname(argv["output"]) !== ".png") {
    throw new Error("Output file must be an PNG");
  } else if (argv["output"]) {
    output = argv["output"];
  } else {
    const originalFilename = path.basename(
      argv["input"],
      path.extname(argv["input"])
    );
    const outputFilename = `${originalFilename}.png`;
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
    widthInInches: parseInt(argv["width"], 10) || 1,
    scale: 1,
  };

  const size = await getImageSize({ options });

  if (
    typeof options.width !== "number" ||
    Number.isNaN(options.width)
  ) {
    options.width = size.width / OUTPUT_RESOLUTION;
  }

  /*
    If the options.widthInInches describes the output width in inches,
    and the DESIRED_RESOLUTION describes the number of pixels per inch in the printed product,
    and the OUTPUT_RESOLUTION describes the default number of pixels per inch (72),
    and the size.width describes the number of pixels in the input image,
    then each individual icon (pixel) in the output image should be...
  */
  options.iconSize =
    (options.widthInInches *
      OUTPUT_RESOLUTION *
      (DESIRED_RESOLUTION / OUTPUT_RESOLUTION)) /
    size.width;
  options.widthInPixels = size.width * options.iconSize;

  const pngs = [];
  for (let row = 0; row < size.height; row++) {
    const rect = {
      left: 0,
      top: row,
      width: size.width,
      height: 1,
    };
    const pixels = await getPixelData({ rect, options });
    const markup = getSvgMarkup({ options, pixels, rect, size });
    const png = await createPngForRow({ svg: markup, row, options });
    pngs.push(png);
  }

  console.log("Successfully generated PNGs for each row of pixels");
  console.log(pngs.join("\n"));

  // Use ImageMagick to create a collage of all the rows, layered on top of each other, and save it as a PNG
  const collageArgs = pngs.concat([
    "-background",
    "none",
    "-layers",
    "merge",
    options.output,
  ]);
  console.log("ImageMagick command:");
  console.log("convert", collageArgs.join(" "));
  imagemagick.convert(collageArgs, (error, data) => {
    if (error) {
      throw new Error(error);
    }

    console.log("Saved collage to", options.output);
    console.log("Cleaning up temporary files...");
    // pngs.forEach((png) => fs.unlinkSync(png));
  });
}

function createPngForRow({ svg, row, options }) {
  return new Promise((resolve, reject) => {
    svg2img(
      svg,
      {
        format: "png",
        resvg: {
          fitTo: {
            mode: "width",
            value: options.widthInPixels,
          },
        },
      },
      async (error, buffer) => {
        if (error) {
          reject(error);
        }
        const tempFile = path.resolve(__dirname, "../output", `row${row}.png`);
        fs.writeFile(tempFile, buffer, (error) => {
          if (error) {
            reject(error);
          }

          resolve(tempFile);
        });
      }
    );
  });
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

function getPixelData({ rect, options }) {
  const { left, top, width, height } = rect;
  return new Promise((resolve, reject) => {
    imagemagick.convert(
      [
        options.input,
        rect && "-extent",
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

function getSvgMarkup({ options, pixels, rect, size }) {
  if (options.log) {
    console.log(
      `Generating SVG for rect ${rect.width}x${rect.height} at ${rect.left},${rect.top}`
    );
  }
  const inner = Array.from({ length: rect.height })
    .map((_, row) =>
      Array.from({ length: rect.width }).map((_, column) => {
        const rowIndex = row + rect.top;
        const columnIndex = column + rect.left;
        const pixelIndex = row * rect.width + column;
        const pixel = pixels[pixelIndex];
        const position = {
          row: rowIndex,
          column: columnIndex,
          pixel: pixelIndex,
        };
        return getSvgMarkupForPixel({ pixel, size, position, options });
      })
    )
    .flat()
    .filter((pixel) => pixel !== null)
    .join("");
  return `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="${size.width * options.iconSize}"
    height="${size.height * options.iconSize}"
    viewBox="0 0 ${size.width * options.iconSize} ${
    size.height * options.iconSize
  }"
  >
    ${inner}
  </svg>`;
}

function getSvgMarkupForPixel({ pixel, size, position, options }) {
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
  const scale = options.iconSize / 20; // NOTE: assuming all symbol sources are 20x20
  const transform = `translate(${translateX}, ${translateY})`;
  const symbolSvg = decodeURIComponent(symbol.svg);
  const symbolSvgDoc = parser.parseFromString(symbolSvg, "image/svg+xml");
  const symbolSvgContents = symbolSvgDoc.documentElement.childNodes;

  const group = `
  <g transform="${transform}">
    <rect width="${options.iconSize}" height="${
    options.iconSize
  }" fill="${backgroundColor}" x="0" y="0" />
    <g fill="${textColor}" transform="scale(${scale})">
      ${justBackground ? "" : symbolSvgContents}
    </g>
  </g>
  `;
  return group;
}

try {
  run();
} catch (error) {
  console.log(error);
}
