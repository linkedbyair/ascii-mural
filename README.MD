# Known Issues

- Generator will fail if you request an icon that doesn't exist in your downloaded Google Material Design Icons

# Generating symbol sets

## Prerequisites 

**You must have ImageMagick installed**

On a mac, use homebrew to install

```sh
# This version works with Economy :-)
brew install imagemagick@6
```

**Make sure you have the Google Material Design Icons repository downloaded**

You can download it from [GitHub](https://github.com/google/material-design-icons). This is a massive repository (18GB) so make you give yourself time to download this archive.

## Steps

**1. Create a recipe**

A recipe is an instruction file that declares what icons to use. It will be a file that exports a JavaScript object, with an entry for the symbol set's name, and an entry for the symbols you want to include. Each symbol is defined with its own object. 

Create a file at `./scripts/icon-set-recipes/<id>.js`

```js
module.exports = {
  name: "name_of_your_symbol_set",
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
yarn generate:symbol-sets --icon-directory=/path/to/material-design-icons-master/symbols/web --recipes=name_of_your_symbol_set
```

**3. Regenerate the symbol set manifest**

A single file exports all of the available symbol sets for the tool to use. This file can be automatically generated with a script.

```sh
yarn generate:manifest
```
