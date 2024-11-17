import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [resolutions, setResolutions] = useState({});
  const [itag, setItag] = useState(null);

  const handleChange = (event) => {
    console.log("why");
    setUrl(event.target.value);
  };

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

  const handleItag = async (itag) => {
    // setItag(itag);
    try {
      if (!itag) {
        alert('Please select a resolution');
        return
      }

      await axios.post('/download', {
        url: url,
        itag: itag
      });
    }
    catch (err) {
      console.error("Error downloading video: ", err.message);
    }
  };

  const handleDownload = async () => {
    try {
      if (!itag) {
        alert('Please select a resolution');
        return
      }

      await axios.post('/download', {
        url: url,
        itag: itag
      });
    }
    catch (err) {
      console.error("Error downloading video: ", err.message);
    }
  };



  return (
    <div>
      <h1>YouTube Video Downloader! Enjoy the plain HTML :)</h1>

      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder='Enter video URL' />
      <button onClick={fetchResolutions}>Get Resolutions</button>

      <h2>Available Resolutions:</h2>
      <ul>
      {Object.entries(resolutions).map(([resolution, itag]) => (
          <li key={itag}>
            <button onClick={() => handleItag(itag)}>
              {resolution} (itag: {itag})
            </button>
          </li>
        ))}
      </ul>

      {/* <button onClick={handleDownload}>Download Video</button> */}
    </div>
  );
}

export default App;
