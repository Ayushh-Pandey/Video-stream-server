const express = require("express");
const fs  = require("fs");
const path = require("path");
const app  = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get("/video",(req,res)=>{
    const range = req.headers.range;
    if(!range){
        res.status(400).send("Require Range header");
    }

    const videoPath = path.join(__dirname, "..", "GoPro HERO5 + Karma_ The Launch in 4K.mp4");
    const videoSize = fs.statSync(videoPath).size;

    //Parse Range
    //Example: "bytes=32324"
    const CHUNK_SIZE = 10**6 ;//1MB
    const start = Number(range.replace(/\D/g,""));
    const end = Math.min(start + CHUNK_SIZE, videoSize-1);

    const contentLength = end-start+1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    res.writeHead(206,headers);

    const videoStream = fs.createReadStream(videoPath,{start,end});

    videoStream.pipe(res);
});

app.listen(PORT,()=>{
    console.log(`server is live on http://localhost:${PORT}`);
});