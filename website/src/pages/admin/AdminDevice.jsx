import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDevice() {

  const [recordings, setRecordings] = useState([]);

  useEffect(() => {

    axios
      .get("http://10.244.107.80:3000/ai-recordings")
      .then((response) => {

        console.log("AI RECORDINGS:");
        console.log(response.data);

        setRecordings(response.data);

      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  return (
    <div style={{ padding: "20px", color: "white" }}>

      <h1>AI Device Recordings</h1>

      {recordings.length === 0 && (
        <p>No recordings found.</p>
      )}

      {recordings.map((video) => (

        <div
          key={video.recording_id}
          style={{
            marginBottom: "40px",
            padding: "20px",
            background: "#222",
            borderRadius: "12px"
          }}
        >

          <h3>{video.violation_type}</h3>

          <p>{video.video_url}</p>

          <video
            width="700"
            controls
          >
            <source
              src={`http://10.244.107.80:3000${video.video_url}`}
              type="video/mp4"
            />
          </video>

        </div>
      ))}

    </div>
  );
}