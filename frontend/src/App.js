import React, { useState } from "react";
import axios from "axios";
import { UploadCloud, Leaf } from "lucide-react";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const diseaseDescriptions = {
    "Powdery Mildew":
      "A fungal disease that appears as white powder on leaves. It spreads in humid conditions and weakens plant growth.",
    "Leaf Blight (Sigatoka)":
      "A serious banana disease causing large dark patches, reducing photosynthesis and crop yield.",
    "Anthracnose":
      "A fungal infection common in mango causing dark sunken lesions on fruit and leaves.",
    "Septoria Leaf Spot":
      "A tomato disease causing yellow leaves with black spots, leading to leaf drop.",
    "Leaf Spot Disease":
      "Dark fungal or bacterial spots that damage leaves and reduce plant health.",
    "Blight":
      "Rapid yellowing and death of plant tissue, often spreading quickly.",
    "Healthy":
      "No visible disease detected. The plant appears healthy."
  };

  const handleFile = (file) => {
    if (!file) return;
    setFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return alert("Upload image first");

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/analyze",
        formData
      );
      setResult(res.data);
    } catch {
      alert("Error analyzing image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-10 py-6">
        <h1 className="text-2xl font-bold text-green-800 flex items-center gap-2">
          🌿 BOTANICAL ARCHIVIST
        </h1>
        <p className="text-green-700 font-medium">
          Smart Plant Detection
        </p>
      </div>

      {/* HERO */}
      <div className="text-center mt-6 mb-10">
        <h2 className="text-5xl font-bold text-green-900">
          Identify Plants Instantly
        </h2>
        <p className="text-green-700 mt-4 text-lg">
          Upload a leaf image and get plant name & disease insights 🌱
        </p>
      </div>

      {/* MAIN SECTION */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">

        {/* LEFT */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div
            className="border-2 border-dashed border-green-300 rounded-2xl p-10 text-center hover:border-green-500 transition cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFile(e.dataTransfer.files[0]);
            }}
          >
            <UploadCloud size={40} className="mx-auto text-green-500 mb-4" />
            <p className="text-gray-600 mb-3">
              Drag & drop or upload leaf image
            </p>

            {/* ✅ FIXED INPUT (filename hidden) */}
            <input
              type="file"
              onChange={(e) => handleFile(e.target.files[0])}
              className="hidden"
              id="fileUpload"
            />

            <label
              htmlFor="fileUpload"
              className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-600 transition"
            >
              Choose File
            </label>

            {/* ✅ Feedback without showing name */}
            {file && (
              <p className="text-green-600 text-sm mt-2">
                ✅ Image selected
              </p>
            )}
          </div>

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-6 rounded-xl w-full shadow-md"
            />
          )}

          <button
            onClick={handleUpload}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-lg transition"
          >
            {loading ? "Analyzing..." : "Analyze Plant"}
          </button>
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col justify-center">

          {!result && !loading && (
            <div className="text-center text-gray-500">
              🌿 Your plant result will appear here
            </div>
          )}

          {loading && (
            <div className="text-center text-green-600 text-lg animate-pulse">
              🔍 Analyzing plant...
            </div>
          )}

          {result && (
            <div className="space-y-6">

              <div className="flex items-center gap-2">
                <Leaf className="text-green-600" />
                <h2 className="text-3xl font-bold text-green-900">
                  {result.plant}
                </h2>
              </div>

              <div className="bg-red-100 p-4 rounded-xl space-y-2">
                <p className="text-red-600 font-semibold text-lg">
                  Disease: {result.disease || "Not detected"}
                </p>

                <p className="text-gray-700 text-sm">
                  {diseaseDescriptions[result.disease] ||
                    "No detailed information available for this disease."}
                </p>
              </div>

              <div>
                <p className="text-gray-600 mb-2">
                  Confidence
                </p>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all duration-700"
                    style={{ width: result.confidence }}
                  ></div>
                </div>

                <p className="text-sm mt-1 text-gray-500">
                  {result.confidence}
                </p>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* 🌿 COMMON DISEASES */}
      <div className="mt-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">
          🌿 Common Plant Diseases
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Root Rot", desc: "Caused by overwatering, leading to decaying roots." },
            { name: "Downy Mildew", desc: "Yellow patches with gray growth underneath leaves." },
            { name: "Canker", desc: "Dead sunken areas on stems caused by fungi or bacteria." }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-5">
              <h3 className="text-xl font-semibold text-green-800">
                {item.name}
              </h3>
              <p className="text-gray-600 mt-2">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 📊 AI STATS */}
      <div className="mt-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">
          📊 AI Model Performance
        </h2>

        <div className="space-y-6">
          {[
            { label: "Accuracy", value: 92 },
            { label: "Disease Detection", value: 88 },
            { label: "Plant Classification", value: 95 }
          ].map((item, i) => (
            <div key={i}>
              <p className="text-gray-700 mb-1">{item.label}</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full"
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🧠 HOW IT WORKS */}
      <div className="mt-20 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-green-900 mb-6">
          🧠 How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            "Upload plant image 📸",
            "AI analyzes patterns 🤖",
            "Get plant & disease 🌿"
          ].map((step, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-lg font-medium text-gray-700">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center mt-16 pb-6 text-green-700">
        Made with 🌱
      </div>

    </div>
  );
}

export default App;