const imagemagick = require("imagemagick");
const path = require("path");
const fs = require("fs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;
const { DOMParser } = require("xmldom");
const parser = new DOMParser();
const { getSymbolSet } = require("./symbol-sets");
const { getColorMode } = require("./color-modes");

const DESIRED_RESOLUTION = 150; // DPI
const OUTPUT_RESOLUTION = 72; // DPI

async function run() {
  // Throw errors for required arguments
  if (!argv["symbol-set"]) {
    throw new Error("Missing required argument: --symbol-set");
  }

  if (!argv["input"]) {
    throw new Error("Missing required argument: --input");
  } else if (!fs.existsSync(argv["input"])) {
    throw new Error(`Input file does not exist: ${argv["input"]}`);
  }

  // Parse optional arguments and set defaults
  let format = argv["format"];
  if (format) {
    if (!format.startsWith(".")) {
      format = "." + format;
    }

    if (![".png", ".svg", ".tiff"].includes(format)) {
      throw new Error(`Output format must be one of: .png, .svg, .tiff`);
    }
  } else {
    format = ".tiff";
  }
  let output;
  if (argv["output"] && path.extname(argv["output"]) !== format) {
    throw new Error(
      "Output file path must match the specified format (which defaults to .tiff)"
    );
  } else if (argv["output"]) {
    output = argv["output"];
  } else {
    const originalFilename = path.basename(
      argv["input"],
      path.extname(argv["input"])
    );
    const outputFilename = originalFilename + format;
    output = path.resolve(__dirname, "../output", outputFilename);
  }
  const outputBasePath = output.replace(path.extname(output), "");
  const symbolSet = getSymbolSet(argv["symbol-set"]);
  const colorMode = getColorMode(argv["color-mode"]);
  const threshold =
    typeof argv.threshold !== "undefined" ? parseInt(argv.threshold, 10) : 128;
  if (
    typeof threshold !== "number" ||
    threshold < 0 ||
    threshold > 255 ||
    isNaN(threshold)
  ) {
    throw new Error(
      `Threshold must be a number between 0 and 255. You passed in ${threshold}.`
    );
  }
  const skipReassembly = Boolean(argv["skip-reassembly"]) || false;
  const isCheckered = Boolean(argv["checkered-pattern"]) || false;
  const backgroundColor = argv["background-color"] || null;
  const input = argv["input"];
  const log = Boolean(argv["log"]) || false;
  const widthInInches = parseInt(argv["width"], 10) || 1;

  const options = {
    input,
    output,
    outputBasePath,
    format,
    symbolSet,
    colorMode,
    threshold,
    isCheckered,
    backgroundColor,
    skipReassembly,
    log,
    widthInInches,
  };

  const size = await getImageSize({ options });

  if (typeof options.width !== "number" || Number.isNaN(options.width)) {
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

  if (options.log) {
    console.log(`Source image:`, options.input);
    console.log(`Source size: ${size.width}x${size.height}`);
    console.log(`Icon size: ${options.iconSize}x${options.iconSize}`);
    console.log(
      `Will create ${size.height} files, one for each row, each at ${
        options.iconSize * size.width
      }x${options.iconSize * size.height} pixels`
    );
    if (options.skipReassembly) {
      console.log(`Will not reassemble image from tiles.`);
    } else {
      console.log(
        `Will reassemble image from tiles at ${options.widthInPixels}x${options.widthInPixels} pixels`
      );
      console.log(`Output image: ${options.output}`);
    }
  }

  const tilePaths = [];
  const svgInners = [];
  for (let row = 0; row < size.height; row++) {
    const rect = {
      left: 0,
      top: row,
      width: size.width,
      height: 1,
    };
    const pixels = await getPixelData({ rect, options });
    const { svg, inner } = getSvgMarkup({ options, pixels, rect, size });
    const imageTilePath = `${outputBasePath}.row-${row}.svg`;
    tilePaths.push(imageTilePath);
    svgInners.push(inner);
    fs.writeFileSync(imageTilePath, svg);
  }
  console.log(`Created tiles:\n\n${tilePaths.join("\n- ")}`);

  if (!options.skipReassembly) {
    await reassembleImageFromTiles({ options, tilePaths, svgInners, size });
    console.log(`Created image: ${options.output}`);
  }

  console.log("Done.");
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
  if (options.log) {
    console.log(`Getting pixel data for row #${top}`);
  }
  return new Promise((resolve, reject) => {
    imagemagick.convert(
      [
        options.input,
        "-matte",
        "-background",
        "transparent",
        rect && "-extent",
        rect && `${width}x${height}+${left}+${top}`,
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
          if (options.log) {
            console.error(error);
          }
          reject(error);
        }

        const lines = data.split("\n");
        const pixels = lines
          .filter((line) => line !== "")
          .map((line, index) => {
            // Red (0-255), Green (0-255), Blue (0-255), Alpha (0-255)
            const channelPattern = `(\\d+\\.*\\d*)`;
            const rgbaPattern = Array.from({ length: 4 })
              .fill(channelPattern)
              .join(",");
            const pattern = "\\(" + rgbaPattern + "\\)";
            const channels = line.match(new RegExp(pattern));
            if (!channels || channels.length < 5) {
              return null;
            }
            const red = parseInt(channels[1], 10);
            const green = parseInt(channels[2], 10);
            const blue = parseInt(channels[3], 10);
            const alpha = parseInt(channels[4], 10);
            const luminance = Math.round((red + green + blue) / 3);
            const color = `rgba(${red}, ${green}, ${blue}, ${alpha})`;

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

function getSvgWrapper({ size, options }) {
  return {
    open: `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${options.widthInPixels}"
  height="${(options.widthInPixels * size.height) / size.width}"
  viewBox="0 0 ${size.width * options.iconSize} ${
      size.height * options.iconSize
    }"
>
  `,
    close: `</svg>`,
  };
}

function getSvgMarkup({ options, pixels, rect, size }) {
  if (options.log) {
    console.log(`Generating SVG for row ${rect.top}`);
  }
  const { open, close } = getSvgWrapper({ size, options });
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
  const svg = open + inner + close;
  return {
    svg,
    inner,
  };
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
  const pixelStyle = pixel.luminance < options.threshold ? "dark" : "light";
  const backgroundColor =
    pixelStyle === "light"
      ? options.backgroundColor || "white"
      : options.colorMode(options, pixel);
  const textColor =
    pixelStyle === "light"
      ? options.colorMode(options, pixel)
      : options.backgroundColor || "white";
  const justBackground = pixel.luminance === 255;
  const pixelTranslationX =
    options.iconSize * size.width * (position.column / size.width);
  const pixelTranslationY =
    options.iconSize * size.height * (position.row / size.height);
  const iconScaleToFitPixel = options.iconSize / 20;
  const weights = [700, 600, 500, 300, 200, 100];
  const weight =
    pixelStyle === "light"
      ? weights[Math.floor((pixel.luminance / 255) * (weights.length - 1))]
      : weights[
          Math.floor(((255 - pixel.luminance) / 255) * (weights.length - 1))
        ];
  const symbolSvg = decodeURIComponent(symbol.svgs[weight]);
  const symbolSvgDoc = parser.parseFromString(symbolSvg, "image/svg+xml");
  const symbolSvgContents = symbolSvgDoc.documentElement.childNodes;

  const group = `
  <g
    id="${symbol.name}"
    transform="translate(${pixelTranslationX}, ${pixelTranslationY})"
    data-row="${position.row}"
    data-column="${position.column}"
    data-symbol="${symbol.name}"
    data-symbol-filled="${symbol.filled}"
    data-weight="${weight}"
    data-luminance="${pixel.luminance}"
  >
    <rect
      width="${options.iconSize}"
      height="${options.iconSize}"
      fill="${backgroundColor}"
      x="0"
      y="0"
    />
    <g transform="translate(0.5075, 0.5075) scale(0.66)">
      <g fill="${textColor}" transform="scale(${iconScaleToFitPixel})">
        ${justBackground ? "" : symbolSvgContents}
      </g>
    </g>
  </g>
  `;
  return group;
}

function reassembleImageFromTiles({ options, tilePaths, svgInners, size }) {
  if (options.log) {
    console.log("Reassembling image from tiles.");
  }
  return new Promise(async (resolve, reject) => {
    if (options.format === ".svg") {
      const writeFileSteam = fs.createWriteStream(options.output);
      const { open, close } = getSvgWrapper({ size, options });
      writeFileSteam.on("finish", () => {
        resolve();
      });
      writeFileSteam.write(open);
      svgInners.forEach((inner) => {
        writeFileSteam.write(inner);
      });
      writeFileSteam.write(close);
      writeFileSteam.close();
    } else {
      const mergeImages = ({ inputs, output }) => {
        inputs = Array.isArray(inputs) ? inputs : [inputs];
        if (options.log) {
          const message =
            inputs.length > 1 ? "Merging tiles:" : "Merging tile:";
          console.log(`${message} ${inputs.join(", ")}`);
        }
        return new Promise((resolve, reject) => {
          const imagemagickOptionsForFormat = {
            ".tiff": [
              "-background",
              "none",
              "-compress",
              "lzw",
              "-format",
              "tiff",
            ],
            ".png": ["-background", "none"],
          };
          imagemagick.convert(
            [
              ...imagemagickOptionsForFormat[options.format],
              ...inputs,
              "-layers",
              "merge",
              output,
            ],
            (error, data) => {
              if (error) {
                reject(error);
              }
              resolve(data);
            }
          );
        });
      };

      await mergeImages({
        inputs: tilePaths[0],
        output: options.output,
      });

      for (let tilePath of tilePaths.slice(1)) {
        await mergeImages({
          inputs: [options.output, tilePath],
          output: options.output,
        });
      }
    }
  });
}

try {
  run();
} catch (error) {
  console.log(error);
}
