"use client";

export default function InfoPanel({ data, isLoading, error }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        width: "350px",
        maxHeight: "calc(100vh - 40px)",
        backgroundColor: "rgba(38, 38, 38, 0.85)",
        color: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        backdropFilter: "blur(10px)",
        overflowY: "auto",
        fontFamily: "sans-serif",
        zIndex: 10, // 地図より手前に表示
      }}
    >
      <h2 className="text-xl font-bold mb-4 border-b border-gray-500 pb-2">
        BloomScope Analysis
      </h2>

      {isLoading && <p>Analyzing satellite data... 🛰️</p>}

      {error && <p className="text-red-400">Error: {error}</p>}

      {!isLoading && !data && !error && (
        <p className="text-gray-300">
          Please click anywhere on the globe to start the analysis.
        </p>
      )}

      {data && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Prediction Result:</h3>
          <div className="bg-green-800/50 p-3 rounded-md text-center">
            <p className="text-gray-200 text-sm">Predicted Bloom Day (2023)</p>
            <p className="text-2xl font-bold text-green-300">
              {data.predicted_bloom_day}
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-1 text-center">
            Based on NDVI threshold model.
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">
            NDVI Time Series Data:
          </h3>
          <div className="bg-gray-900/70 p-3 rounded-md text-sm font-mono max-h-80 overflow-y-auto">
            <pre>{JSON.stringify(data.time_series, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
