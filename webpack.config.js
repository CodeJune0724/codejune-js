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
        libraryTarget: "umd"
    },

    mode: "production",

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.ts$/,
                use: {
                    loader: "ts-loader"
                }
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "./[name].css"
        }),

        new CssMinimizerWebpackPlugin()
    ],

    resolve: {
        extensions: [".ts", ".js"]
    },
};