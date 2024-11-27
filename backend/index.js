require('dotenv').config();
const express = require('express');
const ytdl = require("@distube/ytdl-core");
const path = require('path');
const os = require('os');

const { mergeVideoAudio, downloadYtVideo, cleanUp } = require('./util.js');


const app = express();

app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("Server listening on PORT:", PORT);
});


// GET request to get available resolutions for a video
// returns an object with qualities (1080p, 720p, etc) as keys
// and itags as values
app.get('/api/resolutions', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({error: "Invalid URL"});
    }

    try {
        const info = await ytdl.getInfo(url);
        // console.log(info);

        const resolutions = new Map(
            info.formats
            .filter(format => format.hasVideo)
            // .map(format => [format.qualityLabel, format.qualityLabel])
            .map(format => [format.qualityLabel, format.itag])
        );

        console.log(resolutions);

        const mapToObject = Object.fromEntries(resolutions);

        return res.json(mapToObject);

    }
    catch (err) {
        return res.status(500).json({error: `Error getting resolutions: ${err}`});
    }

})

// POST request to download a video to a specified location on system
app.post('/api/download', async (req, res) => {
    const url = req.body.url;
    const iTag = req.body.itag;

    if (!url) {
        return res.status(400).json({error: "Invalid URL"});
    }

    try {

        // const vidId = ytdl.getURLVideoID(url);
        const info = await ytdl.getInfo(url);
        const videoTitle = info.videoDetails.title.replace(/[<>:"/\\|?*]/g, ' ');
        console.log(videoTitle);
 
        // we want av01 video codec btw, they all start with 39*
        const videoFormat = ytdl.chooseFormat(info.formats, { quality: iTag });
        const audioFormat = ytdl.chooseFormat(info.formats, { quality: '140' });
    
        // Download both streams concurrently
        await Promise.all([
          downloadYtVideo(url, videoFormat, "video.mp4"),
          downloadYtVideo(url, audioFormat, "audio.mp3")
        ]);
    
        console.log("Both streams downloaded. Starting ffmpeg...");
    
        // const outputFileName = path.join(__dirname, `${videoTitle}.mp4`)
        const downloadsFolder = path.join(os.homedir(), 'Downloads');
        const outputFileName = path.join(downloadsFolder, `${videoTitle}.mp4`)

        console.log("Outputting to: ", outputFileName);
        await mergeVideoAudio("video.mp4", "audio.mp3", outputFileName);

        console.log("Cleaning up files...");

        return res.status(200).json({ message: "Sucessfully downloaded!" });

    }
    catch (err) {
        return res.status(500).json({error: `Error processing request ${err}`});
    }
    finally {
        cleanUp();
    }


});



