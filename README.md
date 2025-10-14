# BloomScope - NASA Space Apps Challenge 2025
## Team FioreSakura
**このリポジトリはNASA Space Apps Challengeの開発途中のコードの一部であり、最終的に提出されたものではありません。**
## 最終提出資料
プレゼン資料 ： https://www.canva.com/design/DAG04XVDjz4/zWUaaKVBEHxQtUGIKsJnTA/view

youtube ： https://youtu.be/Hb5Z6hqt9nQ

デプロイリポジトリ ： https://github.com/tanabedesu/myproject/tree/main/nasa_spaceapps

## 概要
NASA Space Apps Challenge 2025 のテーマ「BloomWatch」に取り組むためのプロジェクトです。

Google Earth Engine (GEE) の衛星データを活用し、地球上の植物の開花フェノロジー（生物季節）を可視化する Web アプリケーションを開発します。

<img width="720" height="378" alt="image" src="https://github.com/user-attachments/assets/97fe6f3e-19b6-49b8-b82f-ecc55168fef2" />

## 🚀 技術スタック

- **フロントエンド:** Next.js, React, Tailwind CSS, Cesium.js (Resium)
- **バックエンド:** Python, FastAPI
- **データソース:** Google Earth Engine (GEE)

---

## 🛠️ 環境構築

このプロジェクトをローカル環境で動かすための手順です。

### **1. 事前準備**

以下のツールとアカウントが利用可能な状態にしてください。

- **Node.js** (v18.x or later)
- **Python** (3.9 or later)
- **Git**
- **Google Earth Engine (GEE) アカウント**
  - 未登録の場合は、[公式サイト](https://earthengine.google.com/) から Google アカウントでサインアップしてください。（承認に時間がかかる場合があります）

### **2. プロジェクトのセットアップ**

まず、このリポジトリをクローンします。

Bash

`git clone <your-repository-url>
cd bloomscope`

### **3. バックエンド (Python/FastAPI)**

1. **`backend`ディレクトリに移動します。**Bash

   `cd backend`

2. **仮想環境を作成し、有効化します。**Bash

   `# 仮想環境を作成
   python -m venv venv

   # 仮想環境を有効化

   # Mac/Linux

   source venv/bin/activate

   # Windows

   .\venv\Scripts\activate`

3. **必要なライブラリをインストールします。\***もし `requirements.txt` がまだなければ、以下のコマンドで作成してください。\*`pip freeze > requirements.txt`Bash

   `pip install -r requirements.txt`

4. **Google Earth Engine の認証を行います。**Bash

   `earthengine authenticate`

   ブラウザが起動し、認証プロセスが始まります。指示に従って認証を完了してください。

### **4. フロントエンド (Next.js)**

1. **`frontend`ディレクトリに移動します。**Bash

   `# プロジェクトルートから移動する場合
cd frontend`

2. **必要なライブラリをインストールします。**Bash

   `npm install`

3. **環境変数を設定します。**`frontend`ディレクトリの直下に `.env.local` という名前のファイルを作成し、Cesium Ion のアクセストークンを記述します。Code snippet

   `NEXT_PUBLIC_CESIUM_ION_TOKEN="ここにあなたのCesium Ionトークンを貼り付け"`

   - トークンは [Cesium Ion 公式サイト](https://ion.cesium.com/) で無料アカウントを作成すると取得できます。

---

## ▶️ 実行方法

アプリケーションを起動するには、**2 つのターミナル**が必要です。

1. **ターミナル 1: バックエンドサーバーの起動**Bash

   `cd backend

   ### 仮想環境を有効化

   source venv/bin/activate # or .\venv\Scripts\activate

   ### サーバーを起動

   uvicorn main:app --reload`

   サーバーが `http://127.0.0.1:8000` で起動します。

2. **ターミナル 2: フロントエンドサーバーの起動**Bash

   `cd frontend

   ### サーバーを起動

   npm run dev`

   アプリケーションが `http://localhost:3000` で起動します。

ブラウザで `http://localhost:3000` にアクセスすると、アプリケーションが表示されます。
