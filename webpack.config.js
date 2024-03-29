const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const glob = require("glob");

const parts = require("./webpack.parts");

const PATHS = {
  app: path.join(__dirname, "src"),
};

const commonConfig = merge([
  {
    plugins: [
      new HtmlWebpackPlugin({
        title: "Webpack demo",
      }),
    ],
  },
  parts.loadJavaScript({ include: PATHS.app }),
]);

const productionConfig = merge([
    parts.extractCSS({
        use: ["css-loader", parts.autoprefix()],
    }),
    parts.purifyCSS({
      paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }),
    }),
    parts.loadImages({
      options: {
        limit: 15000,
        name: "[name].[ext]",
      },
    }),
]);

const developmentConfig = merge([
  parts.devServer({
    // 如果有需要的话，可以在这里定义 host/port
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),
  parts.loadImages(),
]);

module.exports = mode => {
  if (mode === "production") {
    return merge(commonConfig, productionConfig, { mode });
  }

  return merge(commonConfig, developmentConfig, { mode });
};