const pluginTester = require("babel-plugin-tester").default;
const path = require("path");

const transform = require("../src").default;

pluginTester({
  fixtures: path.join(__dirname, "fixtures"),
  plugin: transform,
});
