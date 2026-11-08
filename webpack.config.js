const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  return {
    mode: argv.mode || "development",

    entry: "./src/index.js",

    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/template.html",
        scriptLoading: "defer",
      }),
    ],

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },

    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      port: 8080,
    },
  };
};