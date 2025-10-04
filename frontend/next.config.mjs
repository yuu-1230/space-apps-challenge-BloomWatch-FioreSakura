// next-plugin-cesiumをインポート
import nextPluginCesium from "next-plugin-cesium";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ここに他のNext.jsの設定も追加できます
};

// 設定をCesiumプラグインでラップしてエクスポートする
export default nextPluginCesium(nextConfig);
