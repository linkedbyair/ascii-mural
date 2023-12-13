const path = require("path");
const fs = require("fs");

module.exports = fs.readdirSync(__dirname).map(function(file) {
  if (file === "index.js") return;
  return require(path.resolve(__dirname, file));
}).filter(Boolean);
