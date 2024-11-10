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
        res.setHeader("Content-Disposition", 'attachment; filename="final.mp4"');
        res.setHeader("Content-Type", "video/mp4");

        // const videoPath = path.resolve(__dirname, 'video.mp4');
        // const outputPath = path.resolve(__dirname, 'video_with_silence.mp4');

        const vidId = ytdl.getURLVideoID("https://youtu.be/f9cViIsTarw?si=Hf9hTvloe4-5blbP");
        const info = await ytdl.getInfo(vidId);
    
        const videoFormat = ytdl.chooseFormat(info.formats, { quality: '398' });
        const audioFormat = ytdl.chooseFormat(info.formats, { quality: '140' });
    
        // Download both streams concurrently
        await Promise.all([
          downloadStream("https://youtu.be/f9cViIsTarw?si=Hf9hTvloe4-5blbP", videoFormat, "video.mp4"),
          downloadStream("https://youtu.be/f9cViIsTarw?si=Hf9hTvloe4-5blbP", audioFormat, "audio.mp3")
        ]);
    
        console.log("Both streams downloaded. Starting ffmpeg...");
    
        // Combine video and audio using ffmpeg
        ffmpeg()
          .addInput("video.mp4")
          .addInput("audio.mp3")
          // some guy in the github issue gave the last option in the outputOptions idk what it is but makes it work
          // https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/967
          .outputOptions(['-c:v copy', '-c:a aac', '-movflags frag_keyframe+empty_moov']) 
          .format('mp4')
          .pipe(res, { end: true })
          .on('end', () => console.log("Video and audio merged successfully!"))
          .on('error', (err) => console.error("Error merging video and audio:", err));

        //   return res.status(200).json({ message: "Sucessfully downloaded!" });

          

    }
    catch (err) {
        return res.status(500).json({error: `Error processing request ${err}`});
    }


});

function downloadStream(url, format, output) {
    return new Promise((resolve, reject) => {
      const stream = ytdl(url, { format }).pipe(fs.createWriteStream(output));
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
  }

