const ffmpeg = require('fluent-ffmpeg');
const ytdl = require("@distube/ytdl-core");
const fs = require('fs');

function downloadStream(url, format, output) {
  return new Promise((resolve, reject) => {
    const stream = ytdl(url, { format }).pipe(fs.createWriteStream(output));
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

async function downloadAndCombine() {
  try {
    const vidId = ytdl.getURLVideoID("https://youtu.be/f9cViIsTarw?si=Hf9hTvloe4-5blbP");
    const info = await ytdl.getInfo(vidId);

    const videoFormat = ytdl.chooseFormat(info.formats, { quality: '398' });
    const audioFormat = ytdl.chooseFormat(info.formats, { quality: '140' });

    // Download both streams concurrently
    await Promise.all([
      downloadStream("https://youtu.be/f9cViIsTarw?si=Hf9hTvloe4-5blbP", videoFormat, "video.mp4"),
      downloadStream("https://youtu.be/f9cViIsTarw?si=Hf9hTvloe4-5blbP", audioFormat, "audio.mp4")
    ]);

    console.log("Both streams downloaded. Starting ffmpeg...");

    // Combine video and audio using ffmpeg
    ffmpeg()
      .addInput("video.mp4")
      .addInput("audio.mp4")
      .outputOptions(['-c:v copy', '-c:a copy'])
      .saveToFile("final.mp4")
      .on('end', () => console.log("Video and audio merged successfully!"))
      .on('error', (err) => console.error("Error merging video and audio:", err));

  } catch (error) {
    console.error("Error during download or merge:", error);
  }
}

downloadAndCombine();
