const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const { resolve } = require("path");

const appConfig = {
  entry: "./src/app/index.ts",
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
          options: { emitCss: true },
        },
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  resolve: { extensions: [".ts", ".js", ".svelte"] },
  output: { filename: "bundle.js", path: resolve(__dirname, "dist") },
  mode: "production",
};

const workerConfig = {
  entry: "./src/app/worker.js",
  target: "webworker",
  plugins: [
    new WasmPackPlugin({
      crateDirectory: resolve(__dirname, "src/solver"),
      outDir: resolve(__dirname, "src/solver/pkg"),
      forceMode: "production",
    }),
  ],
  experiments: {
    asyncWebAssembly: true,
  },
  resolve: { extensions: [".js", ".wasm"] },
  output: { filename: "worker.js", path: resolve(__dirname, "dist") },
  mode: "production",
};

module.exports = [appConfig, workerConfig];
