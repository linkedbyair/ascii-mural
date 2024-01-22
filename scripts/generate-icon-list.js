const imagemagick = require("imagemagick");
const path = require("path");
const fs = require("fs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;
const { DOMParser } = require("xmldom");

/*
 ImageMagick command:
 convert path/to/file.png -colorspace gray -format "%[fx:100*mean]" info:
*/
function getLuminanceFromImage({ symbol, options }) {
  const { path } = symbol;
  if (options.log) {
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

        if (options.log) {
          console.log(`Luminance for ${symbol.name}: ${luminance}`);
        }
        resolve(luminance);
      }
    );
  });
}

function getSvgContents({ symbol, options }) {
  const { path } = symbol;
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
      const width = svg.getAttribute("width");
      const height = svg.getAttribute("height");
      // const contents = svg.innerHTML;
      const contents = `<g width="${width}" height="${height}">${svg.childNodes}</g>`;
      if (options.log) {
        console.log(`SVG for ${symbol.name} (${width}x${height}): ${contents}`);
      }
      // Move everything into a group element that can be added to a master SVG
      resolve(contents);
    });
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

  let processedIcons = [];
  let results = {
    failures: [],
  };

  for (const symbol of icons) {
    try {
      const luminance = await getLuminanceFromImage({ symbol, options });
      const svg = await getSvgContents({ symbol, options });
      processedIcons.push({
        luminance,
        svg,
        ...symbol,
      });
    } catch (err) {
      if (options.debug || options.log) {
        console.error(`Could not get luminance for ${err}`);
      }
      results.failures.push(err);
    }
  }

  const cleanedIcons = processedIcons.map((icon) => {
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
        cleanedIcons,
        null,
        2
      )}`
    );
  } else {
    fs.writeFileSync(
      path.resolve(options.output),
      JSON.stringify(cleanedIcons, null, 2)
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
