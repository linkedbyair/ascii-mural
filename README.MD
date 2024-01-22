# ASCII Mural Tool

This is a tool to generate ASCII-ish images using icons from the Material Design Icons repository. 

# Helpful tip

Many of the commands documented below require you to pass in an argument to specify where you have downloaded Google's material design icons. To save yourself some typing, you can save this value to variable and reuse it easily.

```sh
export icon_dir=/Users/your-user-name/Downloads/material-design-icons-master/symbols/web
```

You would use this value as `$icon_dir`. For example:

```sh
yarn generate:icon-list --icon-directory=$icon_dir
```

# Installation 

### Prerequisites
**You must have Node installed**

Node is a JavaScript runtime. We recommend you use nvm to manage your node versions. [Installation instructions for nvm can be found here.](https://github.com/nvm-sh/nvm#installing-and-updating). Once you have it installed and working, you can run the following commands.

Note that this repository does not independently specify a minimum node version.

```sh
# Install the latest version
nvm install --lts

# Tell the terminal to use this version
nvm use --lts
```

**You must have ImageMagick installed**

ImageMagick is a set of tools that allow us to process images. On a mac, use homebrew to install

```sh
# This version works with Economy :-)
brew install imagemagick@6
```

**You must have Yarn installed**

Yarn is a package manager that allows use to install third party dependencies, as well as run custom commands. [Installation instructions can be found here.](https://yarnpkg.com/getting-started/install)

**You must have the Google Material Design Icons repository downloaded, if you are going to customize the available symbol sets**

If you are just going to use the tool as-is, then you don't have to download the repository.

If you _are_ going to make changes to tool, such as creating new symbol sets, then you can download it from [GitHub](https://github.com/google/material-design-icons). This is a massive repository (18GB) so make you give yourself time to download this archive.

### Install

```sh
yarn
```


# Terminology

* Symbol (aka icon): a particular icon in google's material design icon library, in a particular style (filled or outlined)
* Symbol Set: a JavaScript file that describes which icons to use when rendering an image. The file contains an array of object, each describing the icon, its style, and its luminance value. Symbol sets have a function to pick a specific icon given a luminance value & set of settings.
* Recipe: an JavaScript file that is used to generate a SymbolSet. It contains a list of icons you want to use. When a recipe is processed, a program analyzes the requested icons and finds luminance values. Then it generates a symbol set file.


# Getting a list of icons by luminance values

If you are going to generate a recipe, you will need to know the luminance values for each icon. This repository contains a script that will generate a JSON file with that information. [A version of this file is included in this repository](https://github.com/linkedbyair/ascii-mural/blob/857bda6d8cac4aa9bd8d6aea81c8be60561bba29/scripts/icon-list.json), but you can regenerate it whenever you want.

```sh
yarn generate:icon-list --icon-directory=$icon_dir
```

You can optionally supply a `--debug` argument to see what's happening.

# Writing a recipe

Create a file at `scripts/recipes/lowercase-recipe-name.js`. Use the code sample below as the basis of this file.

```js
module.exports = {
  id: "lowercase-recipe-name",
  name: "Title Case Recipe Name",
  symbols: [
    { name: "icon_name", filled: false }, 
    { name: "icon_name", filled: false },  
  ],
};
```

# Generating a recipe

Usually the recipe is handcrafted, so that you use the icons you specifically want. However, in the event that you only care about luminance values, this repository includes a script that will generate a recipe based solely on a (roughly) even distribution of luminance values.

Note that you must have an up-to-date `./scripts/icon-list.json` to run this script. [See instructions here.](#getting-a-list-of-icons-by-luminance-values) A main list is commited to git, though, so you don't necessarily have to do this.

```sh
yarn generate:recipe --icon-directory=/path/to/material-design-icons-master/symbols/web --name="Your Recipe Name" --size="number-of-symbols-in-recipe"
```

You can optionally pass in a `--input` argument to specify a custom list of icons. This may be useful if you are looking to omit certain icons.

```sh
yarn generate:recipe --icon-directory=/path/to/material-design-icons-master/symbols/web --name="Your Recipe Name" --size="number-of-symbols-in-recipe" --input=/path/to/list-of-icons.json
```

Note that this command only generates a recipe. You will need to the [generate the symbol set](#generating-symbol-sets-from-recipes) and [the manifest](#generating-the-symbol-set-manifest) to get the web-based tool to show it as an option.

# Generating symbol sets from recipes

### Steps

**1. Create a recipe**

A recipe is an instruction file that declares what icons to use. It will be a file that exports a JavaScript object, with an entry for the symbol set's name, and an entry for the symbols you want to include. Each symbol is defined with its own object. 

You can pick the icons you want to use from [this list](https://fonts.google.com/icons?icon.style=Outlined&icon.platform=web).

Create a file at `./scripts/recipes/<id>.js`

```js
module.exports = {
  id: "nameOfYourSymbolSet",
  name: "Name of Your Symbol Set",
  symbols: [
    // If you want to use the "filled" variant of the icon, declare that with the `filled` key
    { name: 'name_of_symbol', filled: true },
    { name: 'another_name', filled: false },
  ],
};
```

**2. Run the symbol set generator**

This repository has a script you can run to automatically generate a symbol set file, which is a declaration of icons along with luminance values. You will need to supply a number of arguments.

| argument | required | description |
|----------|----------|-------------|
|`--icon-directory`|yes|Path to the directory where the Material Design icons live. As of the time of this writing, you will want to path the `symbols/web` directory. You cannot use `~` in the path. The path must be absolute or relative to your present working directory.|
|`--recipes`|no|A comma-separated list of names of symbol sets you want to generate. The names refer to the `name` key in the recipe.|
|`--debug`|no|Include if you want to read logs of the output before you create files. This can be useful if your attempt to generate a symbol set fails.| 

```sh
yarn generate:symbol-sets --icon-directory=$icon_dir --recipes=name_of_your_symbol_set
```

**3. Regenerate the symbol set manifest**

A single file exports all of the available symbol sets for the tool to use. This file can be automatically generated with a script.

```sh
yarn generate:manifest
```

**4. Re-build this app's javascript

```sh
yarn build
```

# Generating the symbol set manifest 

A single file exports all of the available symbol sets for the tool to use. This file can be automatically generated with a script.

```sh
yarn generate:manifest
```

# Generate an image

This script accepts an image and creates a new image where each source image pixel is replaced with a symbol. 

```sh
yarn generate:image --input /path/to/image.png --symbol-set automaticallyGenerated10Shades
```

| option | required? | default value | description |
|--------|-----------|---------------|-------------|
|`input`|yes| |The path to the image that you want to convert|
|`symbol-set`|yes| |The name of the symbol set you want to use|
|`threshold`|no|128|The luminance value where we switch from colorful pixel backdrop/white-colored icon to white pixel background/colorful icon.|
|`color-mode`|no|`"full-color"|The color function you want to use. `full-color`, `grayscale`, or `black-and-white`|
|`checkered-pattern`|no|`false`|Whether or not the image outputs (tiles and reassembled) should have the icons arranged in a checkerboard pattern |
|`format`|no|`.tiff`|The type of image you want for the final processed image. PNG, SVG, and TIFF only.|
|`width`|no|matches input image size|The width of the output image **in inches**|
|`skip-reassembly`|no|`false`|If true, will generate files for image tiles, but not the reassembled image|
|`log`|no|`false`|If true, will spit out logs while the program is running|
