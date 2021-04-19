const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const sveltePreprocess = require("svelte-preprocess");
const { resolve } = require("path");

const appConfig = {
  entry: "./app/index.ts",
  output: {
    path: resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    assetModuleFilename: "[name].[contenthash][ext]",
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./static/index.html" }),
    new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
    new CopyPlugin({
      patterns: [ { from: "assets" } ]
    })
  ],
  experiments: { asyncWebAssembly: true },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: { emitCss: true, preprocess: sveltePreprocess({}) },
        },
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(ttf|eot|woff|woff2|svg)$/,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".svelte", ".wasm"],
    alias: {
      svelte: resolve("node_modules", "svelte"),
    },
  },
};

module.exports = (_, argv) => {
  if (argv.mode === "development") {
    appConfig.devtool = "source-map";
  }

  if (argv.mode === "production") {
  }

  return appConfig;
};
