import CopyWebpackPlugin from "copy-webpack-plugin";
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(
              path.dirname(require.resolve("cesium/package.json")),
              "Build/Cesium"
            ),
            to: "static/cesium",
            // ビルドエラーを防ぐための重要なオプション
            info: { minimized: true },
          },
        ],
      })
    );
    return config;
  },
};

export default nextConfig;
