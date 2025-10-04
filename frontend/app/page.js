// frontend/app/page.js
"use client"; // ブラウザで動作するコンポーネントであることを示す

import { useState, useEffect } from "react";

export default function Home() {
  // バックエンドからのメッセージを保存するための状態
  const [message, setMessage] = useState("Loading...");

  // このコンポーネントが最初に表示されたときに一度だけ実行される処理
  useEffect(() => {
    // バックエンドのAPI (http://127.0.0.1:8000/) にアクセス
    fetch("http://127.0.0.1:8000/")
      .then((response) => response.json())
      .then((data) => {
        // 受け取ったメッセージを状態にセットする
        setMessage(data.message);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setMessage("Failed to connect to backend.");
      });
  }, []); // 空の配列は「最初の一回だけ実行」を意味する

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">{message}</h1>
    </main>
  );
}
