const imagemagick = require("imagemagick");
const path = require("path");
const fs = require("fs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

const recipes = require("./icon-set-recipes");

function getPathToImage({ options, symbol }) {
  const { iconDirectory } = options;
  const { name, filled = false } = symbol;
  const fileName = filled ? `${name}_24px.svg` : `${name}_fill1_20px.svg`;
  return path.resolve(iconDirectory, name, "materialsymbolsoutlined", fileName);
}

/*
 ImageMagick command:
 convert path/to/file.png -colorspace gray -format "%[fx:100*mean]" info:
*/
function getLuminanceFromImage({ symbol, options }) {
  const { path } = symbol;
  if (options.debug) {
    console.log(`Getting luminance for ${symbol.name} at ${path}`);
  }
  return new Promise((resolve, reject) => {
    imagemagick.convert(
      [path, "-colorspace", "gray", "-format", '"%[fx:100*mean]"', "info:"],
      function (err, stdout) {
        if (err) {
          if (options.debug) {
            console.error(err);
          }
          reject(err);
        }
        const matches = stdout.match(/(\d+\.\d+)/);
        if (!matches || matches.length < 1) {
          return reject(symbol.name)
        };
        const luminance = parseInt(matches[1], 10);

        if (options.debug) {
          console.log(`Luminance for ${symbol.name}: ${luminance}`);
        }
        resolve({
          ...symbol,
          luminance,
        });
      }
    );
  });
}

function scaleLuminanceValues({ recipe, symbols, options }) {
  const luminanceValues = symbols.map(({ luminance }) => luminance);
  const minimumValue = Math.min(...luminanceValues);
  const maxiumumValue = Math.max(...luminanceValues);
  if (options.debug) {
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


async function processRecipe({ options, recipe }) {
  // Filter out non-existant symbols, add paths to ones that do exist
  const { omittedSymbols, permittedSymbols } = recipe.symbols.reduce(
    (acc, symbol) => {
      const path = getPathToImage({ options, symbol });
      if (fs.existsSync(path)) {
        acc.permittedSymbols.push({ ...symbol, path });
      } else {
        acc.omittedSymbols.push(symbol.name);
      }
      return acc;
    },
    { omittedSymbols: [], permittedSymbols: [] }
  );

  // Get the luminance values for each symbol
  // const symbolsWithLuminance = await Promise.all(permittedSymbols.map(async (symbol) => {
  //   return await getLuminanceFromImage({ symbol, options });
  // }));
  const luminanceResults = await Promise.allSettled(permittedSymbols.map(async (symbol) => {
    return await getLuminanceFromImage({ symbol, options });
  }));
  const symbolsWithLuminance = luminanceResults.filter(({ status }) => status === "fulfilled").map(({ value }) => value);
  const failedSymbols = luminanceResults.filter(({ status }) => status === "rejected").map(({ reason }) => reason);
  console.log('Failed symbols', failedSymbols)

  // Remap the luminance values to a scale of 0-255
  const scaledSymbols = scaleLuminanceValues({
    symbols: symbolsWithLuminance,
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
  if (options.debug) {
    console.log(`\n\nProcessing recipe "${recipe.name}"...`);
  }
  const { results, processedRecipe } = await processRecipe({ recipe, options });
  const { name, symbols } = processedRecipe;
  const outputPath = path.resolve(options.outputDirectory, `${name}.js`);
  const fileContents = `
import { SymbolSet } from "./symbol-set.js";

export const ${name} = new SymbolSet("${name}", [
  ${symbols
    .map(
      (symbol) =>
        `{ name: "${symbol.name}", luminance: ${symbol.luminance}, filled: "${
          symbol.filled || false
        }" }`
    )
    .join(",\n  ")}
]);
`.trimStart();

  if (!options.debug) {
    fs.writeFileSync(outputPath, fileContents);
  } else {
    console.log(`\n\nWould create file at ${outputPath}:\n${fileContents}`);
  }

  console.log(JSON.stringify(results, null, 2));

  return results;
}

function run() {
  if (!argv.outputDirectory) {
    throw new Error("Missing required argument: --output-directory");
  } else if (!fs.existsSync(argv.outputDirectory)) {
    throw new Error(`Output directory does not exist: ${argv.outputDirectory}`);
  }

  if (!argv.iconDirectory) {
    throw new Error("Missing required argument: --icon-directory");
  } else if (!fs.existsSync(argv.iconDirectory)) {
    throw new Error(`Icon directory does not exist: ${argv.iconDirectory}`);
  }

  let recipesToUse = recipes;
  if (argv.recipes) {
    const recipeNames = argv.recipes.split(",");
    recipesToUse = recipesToUse.filter(({ name }) =>
      recipeNames.includes(name)
    );
  }

  if (recipesToUse.length === 0) {
    throw new Error("No recipes to use.");
  }

  const debugMode = argv.debug;

  const options = {
    outputDirectory: argv.outputDirectory,
    iconDirectory: argv.iconDirectory,
    recipes: recipesToUse,
    debug: debugMode,
  };

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
