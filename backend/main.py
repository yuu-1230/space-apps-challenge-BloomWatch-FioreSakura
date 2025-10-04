# backend/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import ee

# --- GEEの初期化 ---
# サーバー起動時に一度だけ実行される
try:
    ee.Initialize()
    print("Google Earth Engine is initialized successfully.")
except Exception as e:
    print(f"Error initializing Earth Engine: {e}")

# --- ヘルパー関数（予測モデル） ---
def find_bloom_day(time_series_data):
    """
    NDVIの時系列データから、春に初めて閾値を超えた日を探す。
    """
    NDVI_THRESHOLD = 0.35  # 開花と判断するNDVIの基準値 (0.3〜0.4あたりで調整)
    SCALE_FACTOR = 0.0001  # MODIS NDVIのスケール係数

    # 3月〜5月を春とする
    for entry in time_series_data:
        date_str = entry['date']
        month = int(date_str.split('-')[1])
        
        # GEEからデータが取得できずNoneになる場合があるためチェック
        if entry['ndvi'] is None:
            continue

        ndvi_value = entry['ndvi'] * SCALE_FACTOR

        # 春の期間に、NDVIが基準値を超えた最初の日付を返す
        if 3 <= month <= 5 and ndvi_value > NDVI_THRESHOLD:
            return date_str  # 発見！

    return "Not Found in Spring"  # 見つからなかった場合

# --- FastAPIアプリケーション ---
app = FastAPI()

origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "BloomScope Backend is running!"}

# --- 予測APIエンドポイント ---
@app.get("/api/predict")
def predict_bloom(lat: float, lon: float):
    """
    指定された緯度経度(lat, lon)に基づいて、2023年の開花日を予測する
    """
    # 緯度経度のバリデーション
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        raise HTTPException(status_code=400, detail="Invalid latitude or longitude.")
    
    try:
        # 1. APIから受け取った緯度経度で地点を定義
        point = ee.Geometry.Point(lon, lat)
        
        # 2. GEEでNDVIデータを取得
        ndvi_collection = ee.ImageCollection('MODIS/061/MOD13A2').select('NDVI')
        filtered_collection = ndvi_collection.filterDate('2023-01-01', '2023-12-31')

        # 3. 指定地点の時系列データを抽出
        def get_ndvi_at_point(image):
            date = image.date().format('YYYY-MM-dd')
            ndvi = image.reduceRegion(ee.Reducer.first(), point, 1000).get('NDVI')
            return ee.Feature(None, {'date': date, 'ndvi': ndvi})

        ndvi_timeseries = filtered_collection.map(get_ndvi_at_point)
        
        # 4. GEEのサーバーから計算結果を取得
        result = ndvi_timeseries.getInfo()
        
        formatted_data = [
            feature['properties'] for feature in result['features']
        ]

        # 5. 予測モデルを呼び出し、開花日を予測
        predicted_day = find_bloom_day(formatted_data)

        # 6. フロントエンドに時系列データと予測結果の両方を返す
        return {
            "time_series": formatted_data,
            "predicted_bloom_day": predicted_day
        }
    except Exception as e:
        # GEEの処理中にエラーが発生した場合
        print(f"Error during GEE processing or prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))