import React, { useState, useEffect } from "react";
import "../../styles/alerts.css";

export default function GuideAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [viewAlert, setViewAlert] = useState(null);

  const [severityFilter, setSeverityFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  // ⭐ DEFENSIVE CHECK: Safely pull user data from localStorage
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  /* ================= LOAD ALERTS ================= */
  useEffect(() => {
    if (user) {
      fetchAlerts();
    } else {
      console.warn("GuideAlerts: No signed-in user found in localStorage.");
      setLoading(false);
    }
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      
      // 🌟 FORCE LOG: See exactly what value is being passed to the URL
      console.log("Raw user object from storage:", user);
      
      const userId = user.id || user.user_id; 
      console.log("Evaluated User ID string going to fetch call:", userId);
  
      const res = await fetch(`/alerts/user/${userId}`);
      const data = await res.json();
      
      console.log("Raw data payload array returned from server:", data);
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER LOGIC ================= */
  const filteredAlerts = alerts
    // optional: hide dismissed by default
    .filter((a) => a.status !== "Dismissed")
    .filter((a) => {
      const matchSeverity =
        severityFilter === "All" || a.severity === severityFilter;

      const matchType =
        typeFilter === "All" || a.activity_type === typeFilter;

      return matchSeverity && matchType;
    });

  return (
    <div className="admin-alerts-page">
      {/* HEADER */}
      <header className="page-header">
        <div>
          <h1>Alerts</h1>
          <p>View and respond to assigned alerts</p>
        </div>
      </header>

      {/* FILTERS */}
      <div className="header-actions">
        <select
          className="filter-select"
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
        >
          <option value="All">All Severity</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>

        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="All">All Types</option>
          <option>Plant Damage</option>
          <option>Wildlife Disturbance</option>
          <option>Regulation Violation</option>
        </select>
      </div>

      {/* ALERT LIST */}
      <div className="alert-list">
        {filteredAlerts.length === 0 && (
          <p style={{ color: "#888" }}>No alerts found</p>
        )}

        {filteredAlerts.map((a) => (
          <div
            key={a.alert_id}
            className="alert-item"
            onClick={() => setViewAlert(a)}
          >
            <div className="left-info">
              <b>{a.activity_type}</b>

              {/* ⭐ SHOW TYPE OF ALERT */}
              <small>
                {a.is_broadcast ? "broadcast alert" : "assigned to you"}
              </small>

              <small>{a.location}</small>
              <small className="time">{a.timestamp}</small>
            </div>

            <div className="right-info">
              <span className={`badge ${a.severity.toLowerCase()}`}>
                {a.severity}
              </span>
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
            <h2>{viewAlert.activity_type}</h2>

            <p>{viewAlert.description}</p>

            <p>
              <b>Location:</b> {viewAlert.location}
            </p>

            <p>
              <b>Severity:</b> {viewAlert.severity}
            </p>

            <p>
              <b>Status:</b> {viewAlert.status}
            </p>

            <button onClick={() => setViewAlert(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
