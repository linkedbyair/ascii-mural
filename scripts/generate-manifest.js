const path = require("path");
const fs = require("fs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

const recipes = require("./icon-set-recipes");
const { toKebabCase } = require("./utilities");

async function generateIndexFile({ recipes, options }) {
  const fileContents = recipes
    .map(({ name }) => `export * from "./${toKebabCase(name)}.js"`)
    .join("\n");
  const filePath = path.resolve(options.outputDirectory, "index.js");

  if (options.debug) {
    console.log(`\n\nWould write index file to ${filePath}:\n${fileContents}`);
    return;
  } else {
    fs.writeFileSync(filePath, fileContents);
    if (options.log) {
      console.log(`\n\nWrote index file to ${filePath}`);
    }
    return;
  }
}

function run() {
  if (!argv.outputDirectory) {
    throw new Error("Missing required argument: --output-directory");
  }

  const debugMode = argv.debug;

  const options = {
    outputDirectory: argv.outputDirectory,
    debug: debugMode,
    log: argv.log,
  };

  if (options.debug) {
    console.log(`Would write symbol sets to ${options.outputDirectory}, but debug mode is activated.`);
  } else if (options.log) {
    console.log(`Writing symbol sets to ${options.outputDirectory}`);
  }

  generateIndexFile({ recipes, options });
}

try {
  run();
} catch (error) {
  console.log(error);
}
