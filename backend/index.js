require('dotenv').config();
const express = require('express');
const ytdl = require("@distube/ytdl-core");
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const { mergeVideoAudio, downloadYtVideo } = require('./util.js');


const app = express();

app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server listening on PORT:", PORT);
});

app.post('/download', async (req, res) => {
    const url = req.body.url;

    if (!url) {
        return res.status(400).json({error: "Invalid URL"});
    }

    try {
        // res.setHeader("Content-Disposition", 'attachment; filename="final.mp4"');
        // res.setHeader("Content-Type", "video/mp4");

        // const videoPath = path.resolve(__dirname, 'video.mp4');
        // const outputPath = path.resolve(__dirname, 'video_with_silence.mp4');

        const vidId = ytdl.getURLVideoID(url);
        const info = await ytdl.getInfo(vidId);
    
        const videoFormat = ytdl.chooseFormat(info.formats, { quality: '398' });
        const audioFormat = ytdl.chooseFormat(info.formats, { quality: '140' });
    
        // Download both streams concurrently
        await Promise.all([
          downloadYtVideo(url, videoFormat, "video.mp4"),
          downloadYtVideo(url, audioFormat, "audio.mp3")
        ]);
    
        console.log("Both streams downloaded. Starting ffmpeg...");
    
        mergeVideoAudio("video.mp4", "audio.mp3", "C:/Users/ricky/Downloads/final.mp4")

        //   return res.status(200).json({ message: "Sucessfully downloaded!" });

          

    }
    catch (err) {
        return res.status(500).json({error: `Error processing request ${err}`});
    }


});



