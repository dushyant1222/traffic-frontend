import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  // ---------------- STATES ----------------
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const [vehicleCount, setVehicleCount] = useState(0);
  const [signalTime, setSignalTime] = useState(0);

  const ML = "https://dushyant006-traffic-ml.hf.space";
const BACKEND = "https://traffic-singnal-backend.onrender.com";

  const [loading, setLoading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

  const [streaming, setStreaming] = useState(false);
  const videoRef = useRef(null);
  const [vipLane, setVipLane] = useState("");
  const [vipActive, setVipActive] = useState(false);


  // 🚑 FEATURE STATES
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [aiOutput, setAiOutput] = useState("");
  const [challan, setChallan] = useState("");
  const [analytics, setAnalytics] = useState("");

  // 🌍 IMPACT STATES
  const [co2Saved, setCo2Saved] = useState(0);
  const [fuelSaved, setFuelSaved] = useState(0);

  const [aiData, setAiData] = useState({
  peakHour: "",
  trafficLevel: "",
  risk: "",
  density: [5, 10, 15, 8, 12]
});

const handleVIP = (lane) => {
  setVipLane(lane);
  setVipActive(true);

  // Override system
  setSignalTime(30);
  setVehicleCount(`VIP Lane ${lane}`);

  // Auto reset after 10 sec
  setTimeout(() => {
    setVipActive(false);
    setVipLane("");
  }, 10000);
};

  // ---------------- IMAGE DETECTION ----------------
  const handleImageSubmit = async () => {
    if (!imageFile) return alert("Upload image");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const res = await axios.post(`${ML}/detect-vehicles`, formData);
      const count = res.data.vehicle_count;

      const backend = await axios.post(`${BACKEND}/api/traffic/status`, {
        vehicleCount: count,
      });

      setVehicleCount(count);
      setSignalTime(backend.data.signalTime);
    } catch {
      alert("Error in detection");
    }

    setLoading(false);
  };

  // ---------------- VIDEO ----------------
  const handleVideoUpload = async () => {
    if (!videoFile) return alert("Upload video");

    setVideoUploading(true);

    const formData = new FormData();
    formData.append("file", videoFile);

    try {
      await axios.post(`${ML}/detect-video`, formData);
      alert("Video running in OpenCV");
    } catch {
      alert("Video upload failed");
    }

    setVideoUploading(false);
  };

  // ---------------- WEBCAM ----------------
 
 
  // ---------------- 🚑 EMERGENCY FEATURE ----------------
  const handleEmergency = () => {
    setEmergencyActive(true);

    // override system
    setSignalTime(30);
    setVehicleCount("Priority 🚑");

    setTimeout(() => {
      setEmergencyActive(false);
    }, 10000);
  };

  // ---------------- OTHER FEATURES ----------------
  const handleAI = () => {
  const hours = ["5 PM", "6 PM", "7 PM"];
  const trafficLevels = ["LOW", "MEDIUM", "HIGH"];
  const risks = ["LOW", "MODERATE", "HIGH"];

  const newData = {
    peakHour: hours[Math.floor(Math.random() * hours.length)],
    trafficLevel: trafficLevels[Math.floor(Math.random() * trafficLevels.length)],
    risk: risks[Math.floor(Math.random() * risks.length)],
    density: Array.from({ length: 6 }, () => Math.floor(Math.random() * 20) + 5)
  };

  setAiData(newData);
};

  const handleChallan = () => {
    setChallan("Overspeed detected → Challan issued 🚨");
  };

  const handleAnalytics = () => {
    setAnalytics("Peak Hour: 6PM | Avg Traffic: 32 vehicles");
  };

  // ---------------- 🌍 CO2 + FUEL LOGIC ----------------
  useEffect(() => {
    const interval = setInterval(() => {

      if (
        signalTime > 0 &&
        typeof vehicleCount === "number" &&
        vehicleCount > 0
      ) {
        const co2 = vehicleCount * 2.3;
        const fuel = vehicleCount * 0.8;

        setCo2Saved(prev => prev + co2);
        setFuelSaved(prev => prev + fuel);
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [vehicleCount, signalTime]);

  // ---------------- UI ----------------
  return (
    <>
      {/* HEADER */}
      <header className="header">
        <h1>🚦 Smart Traffic Control System</h1>
        <button className="login">Login</button>
      </header>

      <div className="container">

        {/* LEFT PANEL */}
        <div className="panel">

          <h2>Control Panel</h2>

          {/* IMAGE */}
          <div className="input-group">
            <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
            <button onClick={handleImageSubmit}>
              {loading ? "Detecting..." : "Upload Image"}
            </button>
          </div>

          {/* VIDEO */}
          <div className="input-group">
            <input type="file" onChange={(e) => setVideoFile(e.target.files[0])} />
            <button onClick={handleVideoUpload}>
              {videoUploading ? "Uploading..." : "Upload Video"}
            </button>
          </div>

          

          {/* FEATURE CARDS */}
          <div className="features">

            <div className="card emergency">
              <h3>🚑 Emergency Corridor</h3>
              <p>GPS-based signal priority</p>
              <button onClick={handleEmergency}>
                {emergencyActive ? "ACTIVE" : "Activate"}
              </button>
            </div>

            <div className="card ai">
              <h3>🧠 AI Predictor</h3>
              <button onClick={handleAI}>Run</button>
              <p>{aiOutput}</p>
            </div>

            <div className="card challan">
              <h3>🚨 E-Challan</h3>
              <button onClick={handleChallan}>Generate</button>
              <p>{challan}</p>
            </div>
            <div className="vip-panel">
  <h2>🚨 Manual Override (VIP Control)</h2>

  <div className="vip-buttons">
    {["A", "B", "C", "D"].map((lane) => (
      <button
        key={lane}
        className="vip-btn"
        onClick={() => handleVIP(lane)}
      >
        {lane}
      </button>
    ))}
  </div>

  {vipActive && (
    <p className="vip-status">
      ⚡ VIP Lane Active: <strong>{vipLane}</strong>
    </p>
  )}
</div>

            <div className="card analytics">
              <div className="ai-panel">
  <h2>🧠 AI Predictive Analytics</h2>

  <button onClick={handleAI} className="ai-btn">Run AI Analysis</button>

  <div className="ai-results">
    <p>📊 Peak Hour: <strong>{aiData.peakHour}</strong></p>
    <p>🚗 Traffic Level: <strong>{aiData.trafficLevel}</strong></p>
    <p>⚠ Risk Level: <strong>{aiData.risk}</strong></p>
  </div>

  {/* Density Bars */}
  <div className="density-bars">
    {aiData.density.map((val, i) => (
      <div
        key={i}
        className="bar"
        style={{ height: `${val * 3}px` }}
      ></div>
    ))}
  </div>
</div>
              
            </div>
            
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="live">

          <h2>Live Monitoring</h2>

          <video ref={videoRef} autoPlay muted />

         

          {/* STATS */}
          <div className="stats">
            <p>🚗 Vehicles: {vehicleCount}</p>
            <p>⏱ Timer: {signalTime}s</p>
          </div>

          {/* 🌍 IMPACT */}
          <div className="impact-box">
            <h3>🌍 Environmental Impact</h3>
            <p>CO₂ Saved: <strong>{co2Saved.toFixed(2)} g</strong></p>
            <p>Fuel Saved: <strong>{fuelSaved.toFixed(2)} ml</strong></p>
            <p style={{ fontSize: "12px", opacity: 0.7 }}>
              *Estimated using idle emission model
            </p>
          </div>

        </div>

      </div>
    </>
  );
}

export default App;