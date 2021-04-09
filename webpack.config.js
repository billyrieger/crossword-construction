const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const sveltePreprocess = require("svelte-preprocess");
const { resolve } = require("path");

const appConfig = {
  entry: "./src/app/index.ts",
  output: { path: resolve(__dirname, "dist"), filename: "bundle.js" },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({ template: "./index.html" }),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: { emitCss: true, preprocess: sveltePreprocess({}) },
        },
      },
      { test: /\.ts$/, use: "ts-loader" },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] },
    ],
  },
  resolve: { extensions: [".ts", ".js", ".svelte"] },
  mode: "development",
};

const workerConfig = {
  entry: "./src/app/worker.ts",
  output: { path: resolve(__dirname, "dist"), filename: "worker.js" },
  target: "webworker",
  module: { rules: [{ test: /\.ts$/, use: "ts-loader" }] },
  experiments: { asyncWebAssembly: true },
  mode: "development",
};

module.exports = [appConfig, workerConfig];
