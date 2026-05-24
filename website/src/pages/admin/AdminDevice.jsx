import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDevice() {

  const [recordings, setRecordings] = useState([]);

  useEffect(() => {

    fetchRecordings();

  }, []);

  const fetchRecordings = async () => {

    try {

      const response = await axios.get(
        "http://172.20.10.2:3000/ai-recordings"
      );

      setRecordings(response.data);

    } catch (err) {

      console.log(err);

    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h1>AI Detection Recordings</h1>

      {recordings.map((video) => (

        <div
          key={video.recording_id}
          style={{
            marginBottom: "30px",
            background: "#1e1e24",
            padding: "20px",
            borderRadius: "12px"
          }}
        >

          <p>{video.violation_type}</p>

          <video
            controls
            width="500"
          >
            <source
              src={`http://172.20.10.2:3000${video.video_url}`}
              type="video/mp4"
            />
          </video>

        </div>

      ))}

    </div>
  );
}