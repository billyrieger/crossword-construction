const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const sveltePreprocess = require("svelte-preprocess");
const { resolve } = require("path");

const appConfig = {
  entry: "./app/index.ts",
  output: { path: resolve(__dirname, "dist"), filename: "bundle.js" },
  plugins: [
    new HtmlWebpackPlugin({ template: "./static/index.html" }),
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
  // optimization: {
  //   minimize: true,
  //   minimizer: [new CssMinimizerPlugin()],
  // },
  resolve: { extensions: [".ts", ".js", ".svelte"] },
};

const workerConfig = {
  entry: "./app/worker.ts",
  output: { path: resolve(__dirname, "dist"), filename: "worker.js" },
  target: "webworker",
  experiments: { asyncWebAssembly: true },
  module: {
    rules: [{ test: /\.ts$/, use: "ts-loader" }],
  },
  mode: "development",
};

module.exports = (_, argv) => {
  if (argv.mode === "development") {
    appConfig.devtool = "source-map";
  }

  return [appConfig, workerConfig];
};
