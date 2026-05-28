import React, { useState, useEffect } from "react";
import "../../styles/alerts.css";

export default function GuideAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [viewAlert, setViewAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🛠️ FIX: Filter by Status and Sensor Type instead of old Severity
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  /* ================= LOAD ALERTS ================= */
  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      console.log("Fetching all global database alerts from /alerts...");
  
      const res = await fetch("/alerts");
      const data = await res.json();
      
      console.log("Raw data payload array returned from server:", data);
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching global alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER LOGIC ================= */
  const filteredAlerts = alerts
    .filter((a) => a.status !== "Dismissed") // Don't show dismissed items by default
    .filter((a) => {
      // 🛠️ FIX: Match against actual database keys
      const matchStatus = statusFilter === "All" || a.status === statusFilter;
      const matchType = typeFilter === "All" || a.sensor_type === typeFilter;
      return matchStatus && matchType;
    });

  return (
    <div className="admin-alerts-page">
      {/* HEADER */}
      <header className="page-header">
        <div>
          <h1>IoT System Alerts</h1>
          <p>Real-time telemetry and hardware logging entries</p>
        </div>
      </header>

      {/* FILTERS */}
      <div className="header-actions">
        {/* Status Dropdown Filter Selection */}
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option>New</option>
          <option>Reviewing</option>
          <option>Resolved</option>
        </select>

        {/* Hardware Dropdown Filter Selection */}
        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="All">All Sensor Types</option>
          <option>Smart Sensor System</option>
          <option>PIR Sensor</option>
          <option>Ultrasonic Sensor</option>
        </select>
      </div>

      {/* ALERT LIST */}
      <div className="alert-list">
        {loading ? (
          <p style={{ color: "#888" }}>Loading telemetry datastream...</p>
        ) : filteredAlerts.length === 0 ? (
          <p style={{ color: "#888" }}>No active alerts found</p>
        ) : null}

        {!loading && filteredAlerts.map((a) => (
          <div
            key={a.id} // 🛠️ FIX: Use 'id' primary key column instead of 'alert_id'
            className="alert-item"
            onClick={() => setViewAlert(a)}
          >
            <div className="left-info">
              {/* 🛠️ FIX: Render actual sensor type name string */}
              <b>{a.sensor_type}</b>

              {/* 🛠️ FIX: Render actual log notification details text string */}
              <p style={{ margin: "4px 0", color: "#444", fontSize: "14px" }}>
                {a.alert_message}
              </p>

              {/* 🛠️ FIX: Use 'triggered_at' date tracking */}
              <small className="time">
                {new Date(a.triggered_at).toLocaleString()}
              </small>
            </div>

            <div className="right-info">
              {/* Status State Label Badge */}
              <span className={`status ${a.status?.toLowerCase()}`}>
                {a.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW MODAL */}
      {viewAlert && (
        <div className="modal">
          <div className="modal-content">
            <h2>{viewAlert.sensor_type} Details</h2>
            <hr />
            <p style={{ margin: "15px 0", fontSize: "15px", lineHeight: "1.4" }}>
              <b>Alert Message:</b> {viewAlert.alert_message}
            </p>
            <p>
              <b>Triggered Time:</b> {new Date(viewAlert.triggered_at).toLocaleString()}
            </p>
            <p>
              <b>Current Status State:</b> {viewAlert.status}
            </p>
            <button onClick={() => setViewAlert(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
