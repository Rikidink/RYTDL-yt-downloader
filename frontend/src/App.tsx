import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import Alert from '@mui/joy/Alert';

import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';


interface Resolutions {
  [resolution: string]: string;
}

function App() {
  const [url, setUrl] = useState<string>('');
  const [resolutions, setResolutions] = useState<Resolutions>({});
  const [quality, setQuality] = useState<[string, string] | null>(null);
  const [downloadingVid, setDownloadingVid] = useState<boolean>(false);
  const [downloadingAud, setDownloadingAud] = useState<boolean>(false);
  const [loadResolutions, setLoadResolutions] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const { mode, setMode } = useColorScheme();
  
  useEffect(() => {
    // Reset resolutions and quality when URL changes
    setResolutions({});
    setQuality(null);
  }, [url]);


  // sends GET request to api to get available resolutions for a video
  const fetchResolutions = async () => {
    try {
      setLoadResolutions(true);
      const res = await axios.get<Resolutions>('/api/resolutions', {
      // const res = await axios.get<Resolutions>('http://localhost:8080/api/resolutions', {  // this is so electron does the requests properly
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
    finally {
      setLoadResolutions(false);
    }
  };

  // sends POST request to api to download video
  const handleDownload = async () => {
    try {
      if (!quality) {
        alert('Please select a resolution');
        return
      }

      setDownloadingVid(true);

      await axios.post('/api/download', {
      // await axios.post('http://localhost:8080/api/download', {  // this is so electron does the requests properly
        url: url,
        itag: quality[1]
      });

      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
      }, 4000);

    }
    catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Error downloading:', err.message);
      }
      else {
        console.error('Unexpected error:', err);
      }
    }
    finally {
      setDownloadingVid(false);
    }
  };

  const handleDownloadAudio = async () => {
    try {
      setDownloadingAud(true);

      await axios.post('/api/downloadAudio', {
        url: url,
      });

      setShowPopup(true)

      setTimeout(() => {
        setShowPopup(false);
      }, 4000);
    }
    catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Error downloading:', err.message);
      }
      else {
        console.error('Unexpected error:', err);
      }
    }
    finally {
      setDownloadingAud(false);
    }
  }

  return (
    <div>
      <Button
        onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
        variant="soft"
        sx={{ marginBottom: 2 }}
      >
        Toggle {mode === 'light' ? 'Dark' : 'Light'} Mode
      </Button>

      <h1>YouTube Video Downloader</h1>
      
      <Input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter video URL"
        disabled={downloadingVid || downloadingAud}
        sx={{ marginBottom: 2, width: '100%' }} // Space below input
      />

      <ButtonGroup
        size="lg"
        variant="solid"
        color='primary'
        spacing={2} // Space between buttons
        sx={{
          marginBottom: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >

        <Button onClick={fetchResolutions} loading={loadResolutions} disabled={downloadingVid || downloadingAud}>
          Download with video
        </Button>

        <Button onClick={handleDownloadAudio} loading={downloadingAud} loadingPosition='end' disabled={downloadingVid || downloadingAud || loadResolutions}>
          {downloadingAud ? "Downloading..." : "Download only Audio"}
        </Button>

      </ButtonGroup>

      {Object.keys(resolutions).length > 0 && (<h2>Available Resolutions:</h2>)}
      
      <ButtonGroup
        size="lg"
        variant="solid"
        spacing={2} // Space between buttons
        disabled={downloadingVid || downloadingAud}
        sx={{
          marginBottom: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {Object.entries(resolutions).map(([resolution, itagValue]) => (
          <Button onClick={() => setQuality([resolution, itagValue])}>
            {resolution}
          </Button>
        ))}
      </ButtonGroup>

      {quality && (
        <Button onClick={handleDownload} size='lg' variant='solid' color='success' loading={downloadingVid} disabled={downloadingAud} loadingPosition='end' sx={{ marginTop: 2 }}>
          {downloadingVid ? "Downloading..." : `Download Video in ${quality[0]}`}
        </Button>
      )}

      {showPopup && (<Alert
        key={'Success'}
        variant="soft"
        color='success'
        sx={{position: 'fixed', bottom: '20px', right:'20px', fontSize: '1.25rem', padding: '16px 32px'}}
      >
        Download completed!
      </Alert>)}
    </div>

  );
}

// this is for enabling dark/light mode toggling
function AppWrapper() {
  return (
    <CssVarsProvider>
      <App />
    </CssVarsProvider>
  );
}

export default AppWrapper;
