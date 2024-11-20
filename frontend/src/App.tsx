import { useState } from 'react';
import axios from 'axios';
import './App.css';



interface Resolutions {
  [resolution: string]: string;
}

function App() {
  const [url, setUrl] = useState<string>('');
  const [resolutions, setResolutions] = useState<Resolutions>({});
  const [quality, setQuality] = useState<[string, string] | null>(null);
  // const [downloadPath, setDownloadPath] = useState<string>('');
  

  const fetchResolutions = async () => {
    try {
      const res = await axios.get<Resolutions>('/api/resolutions', {
        params: { url: url }
      });
      console.log(res.data);
      setResolutions(res.data);

    }
    catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Error fetching resolutions:', err.message);
      }
      else {
        console.error('Unexpected error:', err);
      }

    }
  };


  const handleDownload = async () => {
    try {
      if (!quality) {
        alert('Please select a resolution');
        return
      }

      await axios.post('/api/download', {
        url: url,
        itag: quality[1]
      });
    }
    catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Error downloading:', err.message);
      }
      else {
        console.error('Unexpected error:', err);
      }    }
  };

  // const selectDownloadFolder = async () => {
  //   try {
  //     // Open a folder picker dialog
  //     const directoryHandle = await window.showDirectoryPicker(); // it does exist
  //     const folderName = directoryHandle.name;

  //     // Get full path for backend (Electron apps only)
  //     const path = folderName; // This assumes Electron integration
  //     setDownloadPath(path);
  //   } catch (err) {
  //     console.error('Error selecting folder:', err);
  //   }
  // };


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

      {/* <button onClick={selectDownloadFolder}>Select Download Folder (broken)</button>
      {downloadPath && <p>Selected folder: {downloadPath}</p>} */}

      {quality && (
        <button onClick={handleDownload}>
          Download Video in {quality[0]}
        </button>
      )}
    </div>
  );
}

export default App;
