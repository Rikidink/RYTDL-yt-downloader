const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn, fork } = require('child_process');
const fs = require('fs');


let mainWindow;
let backendProcess;

// function startBackend() {
//   const indexPath = path.join(__dirname, 'index.js');
//   backendProcess = spawn('node', [indexPath]);
  
//   backendProcess.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
//   });

//   backendProcess.stderr.on('data', (data) => {
//     console.error(`stderr: ${data}`);
//   });

//   backendProcess.on('close', (code) => {
//     console.log(`Backend process exited with code ${code}`);
//   });
// }

function startBackend() {
  // console.log("DIRNAME:", __dirname)
  backendProcess = fork(path.join(app.getAppPath(), 'index.js'));

  backendProcess.on('message', (message) => {
    console.log('Backend message:', message);
  });

  backendProcess.on('error', (error) => {
    console.error('Backend process error:', error);
  });

  backendProcess.on('exit', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
}

function quitApp() {
  if (backendProcess) {
    backendProcess.kill(); // Kill the backend process
    console.log('Attempted to kill backend process');
    
    // Wait for a few seconds before checking if the process is still running
    setTimeout(() => {
      if (!backendProcess.killed) {
        console.log('Backend process is still running');
      } else {
        console.log('Backend process was killed');
      }

      app.quit(); // Quit Electron app after the delay
    }, 5000); // Wait for 5 seconds before checking

  } 
  else {
    app.quit(); // Quit immediately if backendProcess is not defined
  }
}


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile('./dist/index.html');
  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', () => {
  startBackend();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    quitApp();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  quitApp();
});
