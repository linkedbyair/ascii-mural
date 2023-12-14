const imagemagick = require("imagemagick");
const path = require("path");
const fs = require("fs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

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
          if (options.debug || options.log) {
            console.error(err);
          }
          reject(err);
        }
        const matches = stdout.match(/(\d+\.\d+)/);
        if (!matches || matches.length < 1) {
          return reject(symbol.name);
        }
        const luminance = Math.round((parseFloat(matches[1], 10) / 100) * 255);

        if (options.debug || options.log) {
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

async function run() {
  const output = argv.output || path.resolve(__dirname, "./icon-list.json");

  if (!argv.iconDirectory) {
    throw new Error("Missing required argument: --icon-directory");
  } else if (!fs.existsSync(argv.iconDirectory)) {
    throw new Error(`Icon directory does not exist: ${argv.iconDirectory}`);
  }

  const options = {
    output,
    iconDirectory: argv.iconDirectory,
    debug: argv.debug,
    log: argv.log,
  };

  if (options.debug) {
    console.log(
      `Would write icon list to ${options.output}, using icons from ${options.iconDirectory}, but debug mode is activated.`
    );
  } else if (options.log) {
    console.log(
      `Writing icon list to ${options.output}, using icons from ${options.iconDirectory}`
    );
  }

  const icons = fs
    .readdirSync(options.iconDirectory)
    .filter((name) =>
      fs.lstatSync(path.join(options.iconDirectory, name)).isDirectory()
    )
    .map((iconName) => {
      const outline = path.resolve(
        options.iconDirectory,
        iconName,
        "materialsymbolsoutlined",
        `${iconName}_20px.svg`
      );
      const filled = path.resolve(
        options.iconDirectory,
        iconName,
        "materialsymbolsoutlined",
        `${iconName}_fill1_20px.svg`
      );
      return [
        {
          name: iconName,
          path: outline,
          filled: false,
        },
        {
          name: iconName,
          path: filled,
          filled: true,
        },
      ];
    })
    .flat();

  let iconsWithLuminance = [];
  let results = {
    failures: [],
  };

  for (const symbol of icons) {
    try {
      iconsWithLuminance.push(await getLuminanceFromImage({ symbol, options }));
    } catch (err) {
      if (options.debug || options.log) {
        console.error(`Could not get luminance for ${err}`);
      }
      results.failures.push(err);
    }
  }

  const processedIcons = iconsWithLuminance.map((icon) => {
    const { name, luminance, filled } = icon;
    return {
      name,
      luminance,
      filled,
    };
  });

  if (options.debug) {
    console.log(
      `Would write icon list to ${options.output}:\n${JSON.stringify(
        processedIcons,
        null,
        2
      )}`
    );
  } else {
    fs.writeFileSync(
      path.resolve(options.output),
      JSON.stringify(processedIcons, null, 2)
    );
    if (options.log) {
      console.log(`Wrote icon list to ${options.output}`);
    }
  }
}

try {
  run();
} catch (error) {
  console.log(error);
}
