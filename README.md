# YouTube Video Downloader Electron Desktop App

![image](https://github.com/user-attachments/assets/27f7549d-3c22-4397-bd54-bbe4c4a7f3ff)

## Built using:
- Vite + React + Joy UI Components (Frontend)
- NodeJS + Express (Backend REST Api)
- Electron (Desktop app)

The app was first made as a traditional web app using React and Express communicated through REST Api calls.  

The desktop app is currently just for Windows (I haven't actually tested it on other platforms but electron-packager should have OS-specific options).  

Functionally, the app utilises two main dependencies:
- [distubejs/ytdl-core](https://github.com/distubejs/ytdl-core) (YouTube downloader node module)
- [ffmpeg](https://www.ffmpeg.org/) (video + audio processing software) which is interfaced using the fluent-ffmpeg node module

YouTube "videos" are actually formed by their respective video and audio counterparts so these parts are individually downloaded by ytdl-core and are combined using ffmpeg.
As a result **ffmpeg.exe** needs to be downloaded externally from the ffmpeg website and added in a folder named "ffmpeg" in the backend directory (and electron directory if building the desktop app from source).

For sake of categorisation, the electron directory is basically a copy and paste of the backend along with a static build of the frontend and the main.js electron entry point file.   
I just thought it'd be nice to have every seperate component of the app in different folders :)

## Usage:
It's pretty straightforward, just input the url and press the get resolutions button.

From there, you can see the available resolutions for the video (the app supports all resolutions up to and including 4k/2160p!).

Press download and the video gets downloaded depending on if using the web app or desktop app:

#### Desktop app:
Downloaded into the `resources/app/` folder (look for the `.mp4` file with the video title).

#### Web app:
Downloaded into the backend folder.

**NOTE:** It might take a little while for longer videos at resolutions greater than 1080p, this is because merging audio + video just takes a long time :(

![image](https://github.com/user-attachments/assets/1b3eced1-23ab-4ed1-9fbf-0d290d6ed9f8)


## Build/Run:

### Desktop app (packaged zip file)
1. Download the zipped app file in the releases.
2. Extract it and go into the app folder.
3. Run `RYTDL.exe`  
(The zipped app includes ffmpeg so no need to download it)

### Traditional Web App:
1. Install node modules for frontend and backend:
```bash
cd frontend
npm install

cd ../backend
npm install
```
2. Install [ffmpeg](https://www.ffmpeg.org/) and place ffmpeg.exe into a ffmpeg folder in the backend.
3. Run the backend and frontend in seperate terminals
```bash
# backend
node index.js

# frontend (in a seperate terminal)
npm run dev
```
4. Go to `localhost:5173` in a browser and you should see the interface.

---

### Desktop app (Electron)
1. Install node modules for the electron app:
```bash
cd electron
npm install
```
2. Install [ffmpeg](https://www.ffmpeg.org/) and place ffmpeg.exe into a ffmpeg folder in the electron folder.
3. Run the Electron app using `npx electron .` OR package it into an executable app with `npx electron-packager .`
4. The interface should pop up in a desktop window if just running it using `npx electron .`, otherwise, a folder containing the `.exe` for the app will be created if packaged.

## Implementation Notes/Details:
- The static build of the frontend is included in the electron folder (but not in the frontend folder). If you want to build the frontend yourself using `npm run build` you'll have to modify the `index.html` for it to work with Electron.
On line 8 and 9 where it says `src="/assets/index-Ccy0lpz4.js"` and `href="/assets/index-Cp3wgTPn.css"`, you must remove the prefixed `/` on the `/assets` so after removing it should look like this:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Youtube Downloader</title>
    <script type="module" crossorigin src="assets/index-Ccy0lpz4.js"></script>
    <link rel="stylesheet" crossorigin href="assets/index-Cp3wgTPn.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```
After that, you can copy and paste the `dist` folder into the Electron folder for it to display the interface. I'm pretty sure there is a way to prevent this without manually modifying it but after trying a couple methods I found online, I gave up.

- _Why does the downloaded video get downloaded to `resources/app/` in the desktop app and not somewhere more convenient?_  
It should be possible for user custom download path if the user inputs the full path to the folder in the interface which is then given to the backend but I wanted to do it through a dialog window by using
[window.showDirectoryPicker()](https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker)
but I believe its impossible because of security issues. I probably will implement the manual download path though.

- _Having the API and frontend both in the Electron app seems weird..._
Yes, it's pretty scuffed. If you take a look in the `main.js` file in the Electron app you'll see that the backend is actually run as a seperate node process that is forked from the main Electron node process.
Optimally, the Electron app would have just been the frontend that made calls to the API that is externally hosted somewhere else but I really didn't want to host it somewhere.
I could have also had the backend and frontend run in Electron's main and renderer processes but I would have had to redesign the whole backend to use IPC communication instead of HTTP requests.




