const path = require("path");
const fs = require("fs");
const { toCamelCase } = require("js-convert-case");

const symbolSets = fs
  .readdirSync(__dirname)
  .map(function (file) {
    if (file === "index.js") return;
    return require(path.resolve(__dirname, file));
  })
  .filter(Boolean);

const getSymbolSet = function (name) {
  if (!name) {
    throw new Error("You must provide a symbol set name or id.");
  }
  const camelCaseName = toCamelCase(name);
  return symbolSets.find(function (symbolSet) {
    return (
      toCamelCase(symbolSet.name) === camelCaseName ||
      toCamelCase(symbolSet.id) === camelCaseName
    );
  });
};

module.exports = {
  getSymbolSet: getSymbolSet,
};
