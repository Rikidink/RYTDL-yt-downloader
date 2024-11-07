require('dotenv').config();
const express = require('express');
const ytdl = require("@distube/ytdl-core");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server listening on PORT:", PORT);
});
