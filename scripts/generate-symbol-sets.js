const imagemagick = require("imagemagick");
const path = require("path");
const fs = require("fs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;
const { DOMParser } = require("xmldom");

const recipes = require("./recipes");
const {
  toHeaderCase,
  toKebabCase,
  toCamelCase,
  toSnakeCase,
} = require("js-convert-case");

function getPathsToSvgsByWeight({ options, symbol }) {
  const { iconDirectory } = options;
  const { name, filled = false } = symbol;
  const snakeCaseName = toSnakeCase(name);
  const weights = [100, 200, 300, 500, 600, 700];
  const style = filled ? "fill1" : "";
  const size = "20px";
  const paths = weights.reduce((acc, weight) => {
    acc[weight] = path.resolve(
      iconDirectory,
      snakeCaseName,
      "materialsymbolsoutlined",
      `${snakeCaseName}_wght${weight}${style}_${size}.svg`
    );
    return acc;
  }, {});
  return paths;
}

/*
 ImageMagick command:
 convert path/to/file.png -colorspace gray -format "%[fx:100*mean]" info:
*/
function getLuminanceForSymbol({ symbol, options }) {
  if (symbol.luminance) {
    if (options.debug || options.log) {
      console.log(
        `Skipping luminance calculation for ${symbol.name}, already has value of ${symbol.luminance}`
      );
    }
    return Promise.resolve(symbol.luminance);
  }
  const pathToMedianWeight = symbol.paths[500];
  if (options.debug || options.log) {
    console.log(`Getting luminance for ${symbol.name} at ${pathToMedianWeight}`);
  }
  return new Promise((resolve, reject) => {
    imagemagick.convert(
      [pathToMedianWeight, "-colorspace", "gray", "-format", '"%[fx:100*mean]"', "info:"],
      function (err, stdout) {
        if (err) {
          if (options.debug || options.log) {
            console.error(err);
          }
          reject(err);
        }
        const matches = stdout.match(/(\d+(\.\d+)?)/);
        if (!matches || matches.length < 1) {
          const errorMessage = `Luminance couldn't be calculated for ${symbol.name}. Output from ImageMagick: ${stdout}`;
          if (options.debug || options.log) {
            console.error(errorMessage);
          }
          return reject(errorMessage);
        }
        const luminance = Math.round((parseFloat(matches[1], 10) / 100) * 255);

        if (options.debug || options.log) {
          console.log(`Luminance for ${symbol.name}: ${luminance}`);
        }
        resolve(luminance);
      }
    );
  });
}

function scaleLuminanceValues({ recipe, symbols, options }) {
  const luminanceValues = symbols.map(({ luminance }) => luminance);
  const minimumValue = Math.min(...luminanceValues);
  const maxiumumValue = Math.max(...luminanceValues);
  if (options.debug || options.log) {
    console.log(
      `\nFor recipe "${recipe.name}"...\nMin. luminance: ${minimumValue}\nMax. luminance: ${maxiumumValue}`
    );
  }
  return symbols.map((symbol) => ({
    ...symbol,
    luminance: Math.round(
      ((symbol.luminance - minimumValue) / (maxiumumValue - minimumValue)) * 255
    ),
  }));
}

function getSvgContents({ symbol, weight, options }) {
  if (symbol.svg) {
    if (options.debug || options.log) {
      console.log(
        `Skipping svg calculation for ${symbol.name}, already has value of ${symbol.svg}`
      );
    }
    return Promise.resolve(symbol.svg);
  }

  const path = symbol.paths[weight];
  if (options.log) {
    console.log(`Getting svg for ${symbol.name} at ${path}`);
  }
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", function (err, data) {
      if (err) {
        if (options.debug || options.log) {
          console.error(err);
        }
        reject(err);
      }

      // Parse the SVG into a DOM
      const doc = new DOMParser().parseFromString(data, "image/svg+xml");
      // Extract the width and height attributes and the contents of the SVG
      const svg = doc.documentElement;
      const viewBox = svg.getAttribute("viewBox");
      if (viewBox) {
        if (options.log) {
          console.log(`Resizing svg for ${symbol.name}...`);
        }
        const [viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight] =
          viewBox.split(" ");
        const scale = 20 / viewBoxWidth;
        // const translateX = viewboxDimensions[0] > 0 ? viewboxDimensions[0]
        const translateX = 0; // TODO: ........
        const translateY = viewBoxY < 0 ? -1 * viewBoxY : 0;
        const inner = svg.childNodes;
        const resizedSvg = `
<svg width="20" height="20" viewBox="0 0 20 20">
  <g transform="scale(${scale}) translate(${translateX}, ${translateY})" transform-origin="top left">
    ${inner}
  </g>
</svg>
        `;
        return resolve(resizedSvg);
      }
      if (options.log) {
        // console.log(`SVG for ${symbol.name} (${width}x${height}): ${svg}`);
      }
      // Move everything into a group element that can be added to a master SVG
      resolve(encodeURIComponent(svg));
    });
  });
}

function getSvgsForAllWeights({ symbol, options }) {
  const weights = Object.keys(symbol.paths);
  return Promise.all(
    weights.map((weight) => getSvgContents({ symbol, weight, options }))
  ).then((svgs) => {
    return svgs.reduce((acc, svg, index) => {
      acc[weights[index]] = svg;
      return acc;
    }, {});
  });
}

async function processRecipe({ options, recipe }) {
  // Filter out non-existant symbols, add paths to ones that do exist
  const { omittedSymbols, permittedSymbols } = recipe.symbols.reduce(
    (acc, symbol) => {
      const paths = getPathsToSvgsByWeight({ options, symbol });
      const allPathsExist = Object.values(paths).every((path) =>
        fs.existsSync(path)
      );
      if (allPathsExist) {
        acc.permittedSymbols.push({ ...symbol, paths });
      } else {
        acc.omittedSymbols.push(symbol.name);
      }
      return acc;
    },
    { omittedSymbols: [], permittedSymbols: [] }
  );

  // Get the luminance values for each symbol
  // const symbolsWithLuminance = await Promise.all(permittedSymbols.map(async (symbol) => {
  //   return await getLuminanceForSymbol({ symbol, options });
  // }));
  const processedSymbols = [];
  const failedSymbols = [];
  for (const symbol of permittedSymbols) {
    const luminance = await getLuminanceForSymbol({ symbol, options });
    const svgs = await getSvgsForAllWeights({ symbol, options });
    if (!luminance || !svgs) {
      failedSymbols.push(symbol.name);
      continue;
    }
    processedSymbols.push({ ...symbol, luminance, svgs });
  }

  // Remap the luminance values to a scale of 0-255
  const scaledSymbols = scaleLuminanceValues({
    symbols: processedSymbols,
    recipe,
    options,
  });

  // Sort the symbols by luminance
  const sortedSymbols = scaledSymbols.sort((a, b) => a.luminance - b.luminance);

  // Reconstruct the recipe with the sorted symbols
  const processedRecipe = {
    ...recipe,
    symbols: sortedSymbols,
  };

  // Create an objet to log the results
  const results = {
    name: recipe.name,
    notFound: omittedSymbols,
    failed: failedSymbols,
  };

  return {
    processedRecipe,
    results,
  };
}

async function generateSymbolSetFile({ recipe, options }) {
  if (options.debug || options.log) {
    console.log(`\n\nProcessing recipe "${recipe.name}"...`);
  }
  const { results, processedRecipe } = await processRecipe({ recipe, options });
  const { id, name, symbols } = processedRecipe;
  const outputPath = path.resolve(
    options.outputDirectory,
    `${toKebabCase(name)}.js`
  );
  const json = symbols.map((symbol) => ({
    name: symbol.name,
    luminance: symbol.luminance,
    filled: symbol.filled || false,
    svgs: symbol.svgs,
  }));
  const fileContents = `
const { SymbolSet } = require("./symbol-set.js");

module.exports = new SymbolSet(
  "${id || toCamelCase(name)}",
  "${toHeaderCase(name)}",
  ${JSON.stringify(json, null, 2)}
);
`.trimStart();

  if (options.debug) {
    console.log(`\n\nWould create file at ${outputPath}:\n${fileContents}`);
  } else {
    fs.writeFileSync(outputPath, fileContents);
    if (options.log) {
      console.log(
        `\n\nCreated file at ${outputPath}\n${JSON.stringify(results, null, 2)}`
      );
    }
  }

  return results;
}

function run() {
  let outputDirectory;
  if (argv.outputDirectory && !fs.existsSync(argv.outputDirectory)) {
    throw new Error(`Output directory does not exist: ${argv.outputDirectory}`);
  } else if (argv.outputDirectory) {
    outputDirectory = argv.outputDirectory;
  } else {
    outputDirectory = path.resolve(__dirname, "../scripts/symbol-sets");
  }

  if (!argv.iconDirectory) {
    throw new Error("Missing required argument: --icon-directory");
  } else if (!fs.existsSync(argv.iconDirectory)) {
    throw new Error(`Icon directory does not exist: ${argv.iconDirectory}`);
  }

  let recipesToUse = recipes;
  if (argv.recipes) {
    const namesToCheck = argv.recipes
      .split(",")
      .map((name) => [
        name.trim(),
        toKebabCase(name.trim()),
        toCamelCase(name.trim()),
        toHeaderCase(name.trim()),
      ])
      .flat();
    recipesToUse = recipes.filter(
      ({ id, name }) => namesToCheck.includes(name) || namesToCheck.includes(id)
    );
  }

  if (recipesToUse.length === 0) {
    throw new Error("No recipes to use.");
  }

  const options = {
    outputDirectory: outputDirectory,
    iconDirectory: argv.iconDirectory,
    recipes: recipesToUse,
    debug: argv.debug,
    log: argv.log,
  };

  if (options.debug) {
    console.log(`DEBUG MODE IS ACTIVATED. NO FILES WILL BE SAVED.`);
  }
  if (options.debug || options.log) {
    console.log(
      `Creating symbol sets for the following recipes: ${recipesToUse
        .map(({ name }) => name)
        .join(", ")}}. Recipe will be generated at ${options.outputDirectory}`
    );
  }

  const results = options.recipes.map((recipe) =>
    generateSymbolSetFile({ recipe, options })
  );

  results.forEach((result) => {
    console.log(result);
  });
}

try {
  run();
} catch (error) {
  console.log(error);
}
