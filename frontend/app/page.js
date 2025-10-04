"use client";

import { useState } from "react";
// 各パーツをコンポーネントとしてインポートします
import CesiumMap from "@/components/CesiumMap";
import InfoPanel from "@/components/InfoPanel";

export default function Home() {
  // バックエンドから受け取った予測結果を保存するための状態
  const [predictionData, setPredictionData] = useState(null);
  // API通信中のローディング状態を管理
  const [isLoading, setIsLoading] = useState(false);
  // エラーが発生した際の情報を管理
  const [error, setError] = useState(null);

  /**
   * 地図コンポーネントからクリックイベントを受け取ったときに実行される関数
   * @param {number} latitude - クリックされた地点の緯度
   * @param {number} longitude - クリックされた地点の経度
   */
  const handleMapClick = (latitude, longitude) => {
    console.log(`Map clicked at: Lat ${latitude}, Lon ${longitude}`);

    // 新しい分析を開始する前に、状態をリセット
    setIsLoading(true);
    setPredictionData(null);
    setError(null);

    // バックエンドのAPIに緯度経度を付けてリクエスト
    fetch(`http://127.0.0.1:8000/api/predict?lat=${latitude}&lon=${longitude}`)
      .then((response) => {
        // HTTPステータスが200番台でない場合はエラーとして扱う
        if (!response.ok) {
          // バックエンドからのエラーメッセージを非同期で取得
          return response.json().then((err) => {
            throw new Error(err.detail || "Network response was not ok");
          });
        }
        return response.json();
      })
      .then((data) => {
        // 受け取ったデータを状態に保存
        setPredictionData(data);
      })
      .catch((err) => {
        // 通信中または処理中にエラーが発生した場合
        console.error("Error fetching prediction data:", err);
        setError(err.message);
      })
      .finally(() => {
        // 成功・失敗に関わらず、ローディング状態を終了
        setIsLoading(false);
      });
  };

  return (
    // position: 'relative' を親要素に設定し、子要素の絶対位置指定の基準とする
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* 地図コンポーネントにクリック処理用の関数を渡す */}
      <CesiumMap onMapClick={handleMapClick} />

      {/* 情報パネルコンポーネントに表示用のデータを渡す */}
      <InfoPanel data={predictionData} isLoading={isLoading} error={error} />
    </div>
  );
}
