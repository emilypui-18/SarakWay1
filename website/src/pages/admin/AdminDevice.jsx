import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDevice() {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        // 1. Retrieve and validate the user object
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          console.warn("No user found in localStorage.");
          setLoading(false);
          return;
        }
  
        const user = JSON.parse(storedUser);
        const token = user?.token;
  
        // 2. Critical debug: Check if token exists
        if (!token) {
          console.error("Token is missing! User object:", user);
          setLoading(false);
          return;
        }
  
        console.log("Authorization Header being set:", `Bearer ${token}`);
  
        // 3. Perform the authenticated request
        const response = await axios.get("http://3.83.197.89:3000/ai-recordings", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
  
        console.log("AI RECORDINGS:", response.data);
        setRecordings(response.data);
      } catch (err) {
        console.error("Error fetching recordings:", err.response || err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert("Unauthorized: Admin privileges required.");
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchRecordings();
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
