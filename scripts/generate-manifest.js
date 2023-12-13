const path = require("path");
const fs = require("fs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

const recipes = require("./icon-set-recipes");

async function generateIndexFile({ recipes, options }) {
  const fileContents = recipes
    .map(({ name }) => `export * from "./${name}.js"`)
    .join("\n");
  const filePath = path.resolve(options.outputDirectory, "index.js");

  if (options.debug) {
    console.log(`\n\nWould write index file to ${filePath}:\n${fileContents}`);
    return;
  } else {
    return fs.writeFileSync(filePath, fileContents);
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
  };

  generateIndexFile({ recipes, options });
}

try {
  run();
} catch (error) {
  console.log(error);
}
