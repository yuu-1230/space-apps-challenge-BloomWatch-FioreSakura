const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

const cesiumSource = "node_modules/cesium/Build/Cesium";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // `require` is a part of the CommonJS module system, which is why this file is now a `.js` file.

    // Add the CopyWebpackPlugin to copy Cesium's assets
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          // The main Cesium assets
          {
            from: path.join(__dirname, cesiumSource),
            to: path.join(__dirname, "public/static/cesium"),
            info: { minimized: true },
          },
          // Specific subdirectories that Cesium needs
          {
            from: path.join(__dirname, cesiumSource, "Assets"),
            to: path.join(__dirname, "public/static/cesium/Assets"),
            info: { minimized: true },
          },
          {
            from: path.join(__dirname, cesiumSource, "ThirdParty"),
            to: path.join(__dirname, "public/static/cesium/ThirdParty"),
            info: { minimized: true },
          },
          {
            from: path.join(__dirname, cesiumSource, "Workers"),
            to: path.join(__dirname, "public/static/cesium/Workers"),
            info: { minimized: true },
          },
        ],
      })
    );

    // These configurations are important for Cesium to work correctly with Webpack.
    config.output.sourcePrefix = "";
    config.amd = {
      ...config.amd,
      toUrlUndefined: true,
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, // fs is a node-only module, it doesn't exist in the browser
    };
    // Suppress warnings about critical dependencies in Cesium
    config.module.unknownContextCritical = false;
    config.module.rules.push({
      test: /\.js$/,
      enforce: "pre",
      use: ["source-map-loader"],
    });

    return config;
  },
};

// Use `module.exports` for CommonJS modules
module.exports = nextConfig;
