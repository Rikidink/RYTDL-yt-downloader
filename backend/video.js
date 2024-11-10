const ytdl = require("@distube/ytdl-core");

const downloadVideo = async (url) => {
    try {
        ytdl(url).pipe(require("fs").createWriteStream("video.mp4"));

    }
    catch (err) {
        console.error("Error downloading video: ", err);
    }
}