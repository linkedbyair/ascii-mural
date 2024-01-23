const path = require("path");
const fs = require("fs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

const recipes = require("./recipes");
const { toKebabCase, toCamelCase } = require("./utilities");

async function generateIndexFile({ recipes, options }) {
  const { importLines, exportLines } = recipes.reduce(
    ({ importLines, exportLines }, { name }) => {
      const camelCaseName = toCamelCase(name);
      const kebabCaseName = toKebabCase(name);
      return {
        importLines: [
          ...importLines,
          `const ${camelCaseName} = require("./${kebabCaseName}.js")`,
        ],
        exportLines: [...exportLines, `${camelCaseName}: ${camelCaseName}`],
      };
    },
    { importLines: [], exportLines: [] }
  );
  const fileContents =
    importLines.join("\n") +
    "\n\n" +
    `module.exports = {${exportLines.join(", ")}}`;
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
  const outputDirectory =
    argv.outputDirectory ||
    path.resolve(__dirname, "../", "scripts", "symbol-sets");
  if (!fs.existsSync(outputDirectory)) {
    throw new Error("Output directory does not exist");
  }

  const options = {
    outputDirectory,
    debug: argv.debugMode,
    log: argv.log,
  };

  if (options.debug) {
    console.log(
      `Would write symbol sets to ${options.outputDirectory}, but debug mode is activated.`
    );
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
