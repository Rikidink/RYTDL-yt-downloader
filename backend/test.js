const ffmpeg = require('fluent-ffmpeg');
const ytdl = require("@distube/ytdl-core");
const fs = require('fs');



const testYt = async () => {
    try {
        const url = "https://youtu.be/f9cViIsTarw?si=TcaSBs6IVdsNjzpA";
        const vidId = ytdl.getURLVideoID(url);
        const info = await ytdl.getInfo(vidId);
        
        const formatList = info.formats;
        console.log(formatList[0]);
        
        for (let i = 0; i < formatList.length; i++) {
            let e = formatList[i];
            if (e.container) {
                console.log(`iTag: ${e.itag} | quality: ${e.qualityLabel} | container: ${e.container} | codecs: ${e.codecs}`);
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}

testYt();

