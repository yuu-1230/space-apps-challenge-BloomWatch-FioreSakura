"use client";

import React, { useRef } from "react";
import { Viewer, ScreenSpaceEventHandler, ScreenSpaceEvent } from "resium";
import {
  Ion as CesiumIon,
  Cartesian3,
  Math as CesiumMath,
  Cartographic,
  SceneMode,
} from "cesium";

// .env.localファイルからCesium Ionのアクセストークンを読み込む
CesiumIon.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;

export default function CesiumMap({ onMapClick }) {
  // CesiumのViewerインスタンスにアクセスするための参照(ref)を作成
  const viewerRef = useRef(null);

  /**
   * 地図が左クリックされたときの処理
   */
  const handleLeftClick = (movement) => {
    // Viewerインスタンスがなければ処理を中断
    if (!viewerRef.current?.cesiumElement) return;
    const viewer = viewerRef.current.cesiumElement;

    // スクリーン座標(movement.position)から地球上の3D座標(Cartesian3)を取得
    const cartesian = viewer.scene.pickPosition(movement.position);

    // 3D座標が取得できた場合のみ処理を続行
    if (cartesian) {
      // 3D座標(Cartesian3)を地理座標(Cartographic)に変換
      const cartographic = Cartographic.fromCartesian(cartesian);
      // 地理座標(ラジアン)を度数法(一般的な緯度経度)に変換
      const longitude = CesiumMath.toDegrees(cartographic.longitude);
      const latitude = CesiumMath.toDegrees(cartographic.latitude);

      // 親コンポーネントに緯度経度を渡す
      onMapClick(latitude, longitude);
    }
  };

  return (
    <Viewer
      full
      ref={viewerRef}
      // 初期カメラ位置やオプションを設定
      sceneMode={SceneMode.SCENE3D}
      timeline={false}
      animation={false}
      baseLayerPicker={false}
      geocoder={false}
      homeButton={false}
      sceneModePicker={false}
      navigationHelpButton={false}
    >
      {/* クリックイベントをハンドリングするためのコンポーネント */}
      <ScreenSpaceEventHandler>
        {/* 左クリックイベント(LEFT_CLICK)に、定義した関数を紐付け */}
        <ScreenSpaceEvent action={handleLeftClick} type={"LEFT_CLICK"} />
      </ScreenSpaceEventHandler>
    </Viewer>
  );
}
