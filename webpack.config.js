const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const sveltePreprocess = require("svelte-preprocess");
const { resolve } = require("path");

const appConfig = {
  entry: "./app/index.ts",
  output: {
    path: resolve(__dirname, "dist"),
    filename: "[chunkhash].js",
    assetModuleFilename: "[contenthash][ext]",
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./static/index.html" }),
    new MiniCssExtractPlugin({ filename: "[chunkhash].css" }),
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
      { test: /\.s?css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] },
      {
        test: /\.(ttf|eot|woff|woff2|svg)$/,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".svelte"],
    alias: {
      svelte: resolve("node_modules", "svelte"),
    },
  },
};

const workerConfig = {
  entry: "./app/worker.ts",
  output: { path: resolve(__dirname, "dist"), filename: "worker.js" },
  target: "webworker",
  experiments: { asyncWebAssembly: true },
  module: {
    rules: [{ test: /\.ts$/, use: "ts-loader" }],
  },
};

module.exports = (_, argv) => {
  if (argv.mode === "development") {
    appConfig.devtool = "source-map";
  }

  if (argv.mode === "production") {
  }

  return [appConfig, workerConfig];
};
