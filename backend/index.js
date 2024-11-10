require('dotenv').config();
const express = require('express');
const ytdl = require("@distube/ytdl-core");
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');


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
        // res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');
        // res.setHeader("Content-Type", "video/mp4");

        // const videoPath = path.resolve(__dirname, 'video.mp4');
        // const outputPath = path.resolve(__dirname, 'video_with_silence.mp4');


        const videoWriteStream = fs.createWriteStream("video.mp4");
        const audioWriteStream = fs.createWriteStream("audio.mp4");
        // const finalStream = fs.createWriteStream("final.mp4");

        const vidId = ytdl.getURLVideoID("https://youtu.be/f9cViIsTarw?si=Hf9hTvloe4-5blbP");
        const info = await ytdl.getInfo(vidId);
        const formats = info.formats


        // NOTE: USE ITAG 137, ITS H264 CODEC (AVC1)
        const videoFormat = ytdl.chooseFormat(info.formats, { quality: '398' });
        // console.log('Format found!', format);

        const videoStream = ytdl("https://youtu.be/f9cViIsTarw?si=Hf9hTvloe4-5blbP", { format: videoFormat});

        const audioFormat = ytdl.chooseFormat(info.formats, { quality: '140' });
        // console.log('Format found!', format);

        const audioStream = ytdl("https://youtu.be/f9cViIsTarw?si=Hf9hTvloe4-5blbP", { format: audioFormat});

        // stream.pipe(res);

        videoStream.pipe(videoWriteStream);
        audioStream.pipe(audioWriteStream);
        
        
        ffmpeg()
        .addInput("video.mp4")
        .addInput("audio.mp4")
        .outputOptions(['-c:v copy', '-c:a copy'])
        .saveToFile("final.mp4", { end: true});



        // for (let i = 0; i <= formats.length; i++) {
        //     console.log(formats[i].itag, formats[i].qualityLabel, formats[i].hasVideo, formats[i].hasAudio, formats[i].container, formats[i].codecs)
        // }
        // console.log(formats[0]);

    }
    catch (err) {
        return res.status(500).json({error: `Error processing request ${err}`});
    }


});

