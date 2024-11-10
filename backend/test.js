const ffmpeg = require('fluent-ffmpeg');
const ytdl = require("@distube/ytdl-core");
const fs = require('fs');

const videoWriteStream = fs.createWriteStream("video.mp4");
const audioWriteStream = fs.createWriteStream("audio.mp4");

async function downloadAndCombine() {
  try {
    const vidId = ytdl.getURLVideoID("https://youtu.be/f9cViIsTarw?si=Hf9hTvloe4-5blbP");
    const info = await ytdl.getInfo(vidId);

    const videoFormat = ytdl.chooseFormat(info.formats, { quality: '398' });
    const audioFormat = ytdl.chooseFormat(info.formats, { quality: '140' });

    const videoStream = ytdl("https://youtu.be/f9cViIsTarw?si=Hf9hTvloe4-5blbP", { format: videoFormat });
    const audioStream = ytdl("https://youtu.be/f9cViIsTarw?si=Hf9hTvloe4-5blbP", { format: audioFormat });

    videoStream.pipe(videoWriteStream);
    audioStream.pipe(audioWriteStream);

    let videoClosed = false;
    let audioClosed = false;

    videoWriteStream.on('close', () => {
      videoClosed = true;
      if (audioClosed) combineStreams();
    });

    audioWriteStream.on('close', () => {
      audioClosed = true;
      if (videoClosed) combineStreams();
    });

    function combineStreams() {
      console.log("Both streams are finished. Starting ffmpeg...");
      ffmpeg()
        .addInput("video.mp4")
        .addInput("audio.mp4")
        .outputOptions(['-c:v copy', '-c:a copy'])
        .saveToFile("final.mp4")
        .on('end', () => console.log("Video and audio merged successfully!"))
        .on('error', (err) => console.error("Error merging video and audio:", err));
    }

  } catch (error) {
    console.error("Error downloading video information:", error);
  }
}

downloadAndCombine();
