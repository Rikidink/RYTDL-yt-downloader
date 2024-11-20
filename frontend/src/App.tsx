import { useState } from 'react';
import axios from 'axios';
import './App.css';

import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';


interface Resolutions {
  [resolution: string]: string;
}

function App() {
  const [url, setUrl] = useState<string>('');
  const [resolutions, setResolutions] = useState<Resolutions>({});
  const [quality, setQuality] = useState<[string, string] | null>(null);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [loadResolutions, setLoadResolutions] = useState<boolean>(false);
  const { mode, setMode } = useColorScheme();
  // const [downloadPath, setDownloadPath] = useState<string>('');
  

  const fetchResolutions = async () => {
    try {
      setLoadResolutions(true);
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
    finally {
      setLoadResolutions(false);
    }
  };


  const handleDownload = async () => {
    try {
      if (!quality) {
        alert('Please select a resolution');
        return
      }

      setDownloading(true);

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
      }
    }
    finally {
      setDownloading(false);
    }
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
      <Button
        onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
        variant="outlined"
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
        disabled={downloading}
        sx={{ marginBottom: 2, width: '100%' }} // Space below input
      />
      <Button onClick={fetchResolutions} size='lg' loading={loadResolutions} disabled={downloading} sx={{ marginBottom: 2 }}>
        Get Resolutions
      </Button>

      <h2>Available Resolutions:</h2>
      
      <ButtonGroup
        size="lg"
        variant="solid"
        spacing={2} // Space between buttons
        sx={{ marginBottom: 2 }} // Space below ButtonGroup
      >
        {Object.entries(resolutions).map(([resolution, itagValue]) => (
          <Button onClick={() => setQuality([resolution, itagValue])}>
            {resolution} (itag: {itagValue})
          </Button>
        ))}
      </ButtonGroup>

      {quality && (
        <Button onClick={handleDownload} size='lg' variant='solid' color='success' loading={downloading} loadingPosition='end' sx={{ marginTop: 2 }}>
          {downloading ? "Downloading..." : `Download Video in ${quality[0]}`}
        </Button>
      )}
    </div>

  );
}

// function ToggleThemeButton() {
//   const { mode, setMode } = useColorScheme();

//   return (
//     <Button
//       onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
//       variant="outlined"
//       sx={{ marginBottom: 2 }}
//     >
//       Toggle {mode === 'light' ? 'Dark' : 'Light'} Mode
//     </Button>
//   );
// }

function AppWrapper() {
  return (
    <CssVarsProvider>
      <App />
    </CssVarsProvider>
  );
}

export default AppWrapper;
