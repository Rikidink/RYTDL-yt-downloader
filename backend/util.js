const ffmpeg = require('fluent-ffmpeg');
const ytdl = require("@distube/ytdl-core");
const path = require('path');
const fs = require('fs');

// set paths for ffmpeg/ffprobe
ffmpeg.setFfmpegPath(path.join(__dirname, "ffmpeg/ffmpeg.exe"));
ffmpeg.setFfprobePath(path.join(__dirname, "ffmpeg/ffprobe.exe"));


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
    return new Promise((resolve, reject) => {
        ffmpeg()
            .addInput(videoPath)
            .addInput(audioPath)
            .outputOptions(['-c:v copy', '-c:a copy']) 
            .saveToFile(outputPath)
            .on('end', () => {
                console.log("Video and audio merged successfully!");
                resolve();  // Resolve the promise when merging completes
            })
            .on('error', (err) => {
                console.error("Error merging video and audio:", err);
                reject(err);  // Reject the promise if an error occurs
            });
    });
};



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

// removes the seperate audio and video files in the folder
const cleanUp = () => {
    fs.unlink("video.mp4", (err) => {
        if (err) {
            console.error(`Error removing video file: ${err}`);
            return;
        }
        console.log("Video file cleaned up");
    });

    fs.unlink("audio.mp3", (err) => {
        if (err) {
            console.error(`Error removing video file: ${err}`);
            return;
        }
        console.log("Audio file cleaned up");
    });

    return
}


module.exports = { mergeVideoAudio, downloadYtVideo, cleanUp }


