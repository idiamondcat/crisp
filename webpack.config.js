const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require ( 'eslint-webpack-plugin' ) ;

module.exports = {
  entry: path.join(__dirname, "src", "index"),
  output: {
    path: path.join(__dirname, "dist"),
    filename: "index.js",
    assetModuleFilename: (pathData) => {
      const filepath = path
        .dirname(pathData.filename)
        .split("/")
        .slice(1)
        .join("/");
      return `${filepath}/[name][ext]`;
    },
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
      filename: "index.html",
    }),
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: ["dist"],
        },
        onEnd: {
          copy: [
            {
              source: path.join("src", "assets"),
              destination: path.join("dist", "assets"),
            },
            {
              source: path.join("public", "pages"),
              destination: path.join("dist", "pages"),
            },
          ],
        },
      },
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new ESLintPlugin({ extensions: "ts" }),
  ],
  devtool: "inline-source-map",
  devServer: {
    watchFiles: path.join(__dirname, "src"),
    port: 9000,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: "ts-loader",
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg|webp|avif|ico)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
};