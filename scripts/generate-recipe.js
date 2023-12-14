const path = require("path");
const fs = require("fs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { parameterize, toHumanReadable, toKebabCase } = require("./utilities");
const argv = yargs(hideBin(process.argv)).argv;

async function run() {
  if (!argv.outputDirectory) {
    throw new Error("Missing required argument: --output-directory");
  } else if (!fs.existsSync(argv.outputDirectory)) {
    throw new Error(`Output directory does not exist: ${argv.outputDirectory}`);
  }

  const input = argv.input || path.resolve(__dirname, "./icon-list.json");
  if (!fs.existsSync(input)) {
    throw new Error(`Input file does not exist: ${input}`);
  }

  if (!argv.name) {
    throw new Error("Missing required argument: --name");
  }

  if (argv.size && Number.isNaN(parseInt(argv.size, 10))) {
    throw new Error(`Invalid size: ${argv.size}`);
  }

  const options = {
    input,
    outputDirectory: argv.outputDirectory,
    name: argv.name,
    size: argv.size || 7,
    debug: argv.debug,
    log: argv.log,
  };

  if (options.debug) {
    console.log(
      `Generating a recipe of ${options.size} icons, selected from the list at ${options.input}. Recipe would be generated at ${options.outputDirectory}, but debug mode is activated.`
    );
  } else if (options.log) {
    console.log(
      `Generating a recipe of ${options.size} icons, selected from the list at ${options.input}. Recipe will be generated at ${options.outputDirectory}.`
    );
  }

  const icons = JSON.parse(fs.readFileSync(input, "utf8"));
  const iconsSortedByLuminance = icons.sort(
    (a, b) => a.luminance - b.luminance
  );
  const minLuminance = iconsSortedByLuminance[0].luminance;
  const maxLuminance =
    iconsSortedByLuminance[iconsSortedByLuminance.length - 1].luminance;
  const luminanceRange = maxLuminance - minLuminance;
  const step = luminanceRange / options.size;

  const distribution = iconsSortedByLuminance.reduce(
    (acc, icon) => {
      const lastValue = acc[acc.length - 1].luminance;
      const luminance = icon.luminance;
      const delta = luminance - lastValue;
      if (delta >= step) {
        acc.push(icon);
      }
      return acc;
    },
    [iconsSortedByLuminance[0]]
  );
  const processedSymbols = distribution.map((symbol) => {
    const { name, filled, luminance } = symbol;
    return {
      name,
      filled,
      luminance,
    };
  });

  const fileContents = `
module.exports = {
  name: "${toHumanReadable(options.name)}",
  symbols: ${JSON.stringify(processedSymbols, null, 2)}
}
`.trimStart();
  const outputPath = path.join(
    options.outputDirectory,
    `${toKebabCase(options.name)}.js`
  );

  if (options.debug) {
    console.log(`\n\nWould create file at ${outputPath}:\n${fileContents}`);
  } else {
    fs.writeFileSync(outputPath, fileContents);
    if (options.log) {
      console.log(`\n\nCreated file at ${outputPath}`);
    }
  }
}

try {
  run();
} catch (error) {
  console.log(error);
}
