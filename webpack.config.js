const path = require("path");

module.exports = {
    entry: {
        "index": "./src/index.js"
	},

    output: {
        path: path.resolve("dist"),
        filename: "[name].js",
        library: "index",
        libraryTarget: "umd"
    },

    mode: "production"
};