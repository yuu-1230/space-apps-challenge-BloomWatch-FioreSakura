import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BloomScope",
  description: "NASA Space Apps Challenge 2025",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        {/*
          Next.jsの標準ルールでは非推奨ですが、Cesiumの静的アセットを読み込むために
          この<link>タグは必要なので、ESLintの警告をこの行だけ無効化します。
        */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="static/cesium/Widgets/widgets.css" />
      </head>
      <body className={inter.className}>
        {children}
        <script src="static/cesium/Cesium.js" async></script>
      </body>
    </html>
  );
}
