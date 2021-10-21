const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");

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

    mode: "production",

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "./[name].css"
        }),

        new CssMinimizerWebpackPlugin()
    ]
};