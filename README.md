![image](https://github.com/user-attachments/assets/72bfc165-af7a-4ee8-958d-3937000ca3d6)


# RYTDL - A YouTube Video Downloader Electron Desktop App

![image](https://github.com/user-attachments/assets/27f7549d-3c22-4397-bd54-bbe4c4a7f3ff)

## Built using:
- Vite + React + Joy UI Components (Frontend)
- NodeJS + Express (Backend REST Api)
- Electron (Desktop app)

The app was first made as a traditional web app using React and Express communicated through REST Api calls.  

The desktop app is currently just for Windows (I haven't actually tested it on other platforms but electron-builder is able to also build for Linux and macOS).  

Functionally, the app utilises two main dependencies:
- [distubejs/ytdl-core](https://github.com/distubejs/ytdl-core) (YouTube downloader node module)
- [ffmpeg](https://www.ffmpeg.org/) (video + audio processing software) which is interfaced using the fluent-ffmpeg node module

YouTube "videos" are actually formed by their respective video and audio counterparts so these parts are individually downloaded by ytdl-core and are combined using ffmpeg.
As a result **ffmpeg.exe** needs to be downloaded externally from the ffmpeg website and added in a folder named "ffmpeg" in the backend directory (and electron directory if building the desktop app from source).

For sake of categorisation, the electron directory is basically a copy and paste of the backend along with a static build of the frontend and the main.js electron entry point file.   
I just thought it'd be nice to have every seperate component of the app in different folders :)

## Usage:
### NOTE: **_Videos are downloaded into the system's default "Downloads" folder._**  
### NOTE: **_2160p and 1440p videos have AV01 encoding instead of AVC1. These videos require the free AV01 codec extension on the Microsoft Store in order to view._**

It's pretty straightforward, just input the url and press the get resolutions button.

From there, you can see the available resolutions for the video (the app supports all resolutions up to and including 4k/2160p!).

Select a resolution and press download!


![image](https://github.com/user-attachments/assets/1b3eced1-23ab-4ed1-9fbf-0d290d6ed9f8)


## Build/Run:

### Desktop app (.exe installer)
1. Download the setup.exe file in the latest release.
2. Run it and it will download the app as a program onto the system.
3. Run the app on your computer.

### Desktop app (unpacked zip file)
1. Download the zipped "win-unpacked.rar" file in the latest release.
2. Extract it and go into the app folder.
3. Run `RYTDL.exe`  

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

### Desktop app (Electron)
1. Install node modules for the electron app:
```bash
cd electron
npm install
```
2. Install [ffmpeg](https://www.ffmpeg.org/) and place ffmpeg.exe into a ffmpeg folder in the electron folder.
3. Run the Electron app using `npx electron .` OR package it into an executable app with `npx electron-builder --win`
4. The interface should pop up in a desktop window if just running it using `npx electron .`, otherwise, a "build" folder containing the packaged files will appear.

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

- ### _Having the API and frontend both in the Electron app seems weird..._  
Yes, it's pretty scuffed. If you take a look in the `main.js` file in the Electron app you'll see that the backend is actually run as a seperate node process that is forked from the main Electron node process.
Optimally, the Electron app would have just been the frontend that made calls to the API that is externally hosted somewhere else but I really didn't want to host it somewhere.
I could have also had the backend and frontend run in Electron's main and renderer processes but I would have had to redesign the whole backend to use IPC communication instead of HTTP requests.




