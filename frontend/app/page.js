"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import InfoPanel from "@/components/InfoPanel";

export default function Home() {
  const [predictionData, setPredictionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // CesiumMapコンポーネントを動的に、かつクライアントサイドでのみインポートします。
  // これにより、サーバーサイドレンダリング時のエラーを回避します。
  const CesiumMap = useMemo(
    () =>
      dynamic(() => import("@/components/CesiumMap"), {
        ssr: false, // サーバーサイドレンダリングを無効化
        // 地図が読み込まれるまでの間に表示するローディング画面
        loading: () => (
          <div
            style={{
              width: "100vw",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#002B4D",
            }}
          >
            <p style={{ color: "white", fontSize: "1.5rem" }}>
              Loading Globe...
            </p>
          </div>
        ),
      }),
    []
  );

  /**
   * 地図がクリックされたときに呼び出される関数
   * @param {number} latitude - クリックされた地点の緯度
   * @param {number} longitude - クリックされた地点の経度
   */
  const handleMapClick = (latitude, longitude) => {
    setIsLoading(true);
    setPredictionData(null);
    setError(null);

    // バックエンドの予測APIにリクエストを送信
    fetch(`http://127.0.0.1:8000/api/predict?lat=${latitude}&lon=${longitude}`)
      .then((response) => {
        // レスポンスが正常でない場合はエラーを投げる
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.detail || "Network response was not ok");
          });
        }
        return response.json();
      })
      .then((data) => {
        setPredictionData(data); // 成功したらデータをセット
      })
      .catch((err) => {
        setError(err.message); // エラーが発生したらエラーメッセージをセット
      })
      .finally(() => {
        setIsLoading(false); // 成功・失敗に関わらずローディングを終了
      });
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* 地図コンポーネントをレンダリングし、クリックイベント用の関数を渡す */}
      <CesiumMap onMapClick={handleMapClick} />
      {/* 情報パネルコンポーネントに、表示に必要なデータと状態を渡す */}
      <InfoPanel data={predictionData} isLoading={isLoading} error={error} />
    </div>
  );
}
