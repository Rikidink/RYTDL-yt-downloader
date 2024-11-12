const ffmpeg = require('fluent-ffmpeg');
const ytdl = require("@distube/ytdl-core");
const fs = require('fs');

// set paths for ffmpeg/ffprobe
ffmpeg.setFfmpegPath("ffmpeg/ffmpeg.exe");
ffmpeg.setFfprobePath("ffmpeg/ffprobe.exe");



// this downloads to browser but is a fragmented mp4...
// Combine video and audio using ffmpeg
// ffmpeg()
//   .addInput("video.mp4")
//   .addInput("audio.mp3")
//   // some guy in the github issue gave the last option in the outputOptions idk what it is but makes it work
//   // the option makes a fragmented MP4 file, which doesn't allow seeking in some media players (including windows)
//   // https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/967
//   .outputOptions(['-c:v copy', '-c:a aac', '-movflags frag_keyframe+empty_moov']) 
//   .format('mp4')
//   .pipe(res, { end: true })
//   .on('end', () => console.log("Video and audio merged successfully!"))
//   .on('error', (err) => console.error("Error merging video and audio:", err));


const mergeVideoAudio = (videoPath, audioPath, outputPath) => {
    ffmpeg()
    .addInput(videoPath)
    .addInput(audioPath)
    .outputOptions(['-c:v copy', '-c:a aac']) 
    .saveToFile(outputPath)
    .on('end', () => console.log("Video and audio merged successfully!"))
    .on('error', (err) => console.error("Error merging video and audio:", err));
}


// function downloadStream(url, format, output) {
//     return new Promise((resolve, reject) => {
//       const stream = ytdl(url, { format }).pipe(fs.createWriteStream(output));
//       stream.on('finish', resolve);
//       stream.on('error', reject);
//     });
// }

const downloadYtVideo = (url, format, output) => {
    return new Promise( (resolve, reject) => {
        const stream = ytdl(url, { format }).pipe(fs.createWriteStream(output));
        stream.on('finish', resolve);
        stream.on('error', reject);
    });
}



module.exports = { mergeVideoAudio, downloadYtVideo }


