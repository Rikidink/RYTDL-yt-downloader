import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [resolutions, setResolutions] = useState({});
  const [quality, setQuality] = useState(null);


  const fetchResolutions = async () => {
    try {
      const res = await axios.get('/resolutions', {
        params: { url: url }
      });

      setResolutions(res.data);

    }
    catch (err) {
      console.error('Error fetching resolutions:', err.message);
    }
  };


  const handleDownload = async () => {
    try {
      if (!quality) {
        alert('Please select a resolution');
        return
      }

      await axios.post('/download', {
        url: url,
        itag: quality[1]
      });
    }
    catch (err) {
      console.error("Error downloading video: ", err.message);
    }
  };



  return (
    <div>
      <h1>YouTube Video Downloader</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter video URL"
      />
      <button onClick={fetchResolutions}>Get Resolutions</button>

      <h2>Available Resolutions:</h2>
      <ul>
        {Object.entries(resolutions).map(([resolution, itagValue]) => (
          <li key={itagValue}>
            <button onClick={() => setQuality([resolution, itagValue])}>
              {resolution} (itag: {itagValue})
            </button>
          </li>
        ))}
      </ul>

      {quality && (
        <button onClick={handleDownload}>
          Download Video in {quality[0]}
        </button>
      )}
    </div>
  );
}

export default App;
