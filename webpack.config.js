const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

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
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "./[name].css"
        }),

        new CssMinimizerWebpackPlugin(),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "./src/zj0724-common.d.ts",
                    to: "zj0724-common.d.ts"
                }
            ]
        })
    ]
};