import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDevice() {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

  import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDevice() {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://3.83.197.89:3000/admin/device", {
          headers: {
            "x-test-mode": "true" // Your current bypass
          }
        });
        setRecordings(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  if (loading) return <div style={{ padding: "20px", color: "white" }}>Loading...</div>;

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>AI Device Recordings</h1>

      {recordings.length === 0 && <p>No recordings found.</p>}

      {recordings.map((video) => (
        <div
          key={video.recording_id}
          style={{
            marginBottom: "40px",
            padding: "20px",
            background: "#222",
            borderRadius: "12px",
          }}
        >
          <h3>{video.violation_type}</h3>
          <p>Location: {video.video_url}</p>

          <video width="700" controls>
            {/* Ensure the base URL and video_url combine correctly */}
            <source
              src={`http://3.83.197.89:3000${video.video_url}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      ))}
    </div>
  );
}
