# backend/main.py
from fastapi import FastAPI
# ↓↓↓↓ このCORSミドルウェアのインポートが重要 ↓↓↓↓
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ↓↓↓↓ アクセスを許可するオリジン(URL)のリスト ↓↓↓↓
origins = [
    "http://localhost:3000", # フロントエンドのURL
]

# ↓↓↓↓ このapp.add_middlewareの部分が丸ごと必要 ↓↓↓↓
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    # メッセージはご自身のものに書き換えてOKです
    return {"message": "バックエンドサーバーは正常に起動しています！"}