"use client";

import React, { useRef, useEffect } from "react";

export default function CesiumMap({ onMapClick }) {
  const cesiumContainer = useRef(null);
  // viewerインスタンスをコンポーネントのライフサイクルで管理するためのref
  const viewerRef = useRef(null);

  useEffect(() => {
    // window.Cesiumが利用可能かチェック
    if (typeof window !== "undefined" && window.Cesium) {
      // 既にviewerが初期化されていない場合のみ実行
      if (cesiumContainer.current && !viewerRef.current) {
        window.Cesium.Ion.defaultAccessToken =
          process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;

        const viewer = new window.Cesium.Viewer(cesiumContainer.current, {
          infoBox: false, // クリック時の情報ボックスを非表示に
          selectionIndicator: false, // クリック時の選択インジケーターを非表示に
        });

        viewerRef.current = viewer; // refにviewerインスタンスを保存

        const handler = new window.Cesium.ScreenSpaceEventHandler(
          viewer.canvas
        );
        handler.setInputAction((movement) => {
          const cartesian = viewer.camera.pickEllipsoid(movement.position);
          if (cartesian) {
            const cartographic =
              window.Cesium.Cartographic.fromCartesian(cartesian);
            const longitude = window.Cesium.Math.toDegrees(
              cartographic.longitude
            );
            const latitude = window.Cesium.Math.toDegrees(
              cartographic.latitude
            );
            // 親コンポーネントに緯度経度を通知
            onMapClick(latitude, longitude);
          }
        }, window.Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }
    }

    // クリーンアップ関数（コンポーネントがアンマウントされるときに実行）
    return () => {
      // 開発モードでの二重描画を防ぐため、viewerを破棄する
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [onMapClick]); // onMapClickが変更された場合にもエフェクトを再実行

  return (
    <div ref={cesiumContainer} style={{ width: "100%", height: "100%" }} />
  );
}
