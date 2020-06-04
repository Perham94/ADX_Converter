const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const fileupload = require('express-fileupload');
const app = express();
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
let  port = process.env.PORT;
var fs = require('fs');
var dir = './tmp';

ffmpeg.setFfmpegPath(ffmpegPath);

app.use(fileupload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}))






app.get('/',(req,res) => {
    res.sendFile(__dirname + '/index.html');
    
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
   


  


      


})




app.post('/adxtowav',(req,res) => {
    res.contentType('audio/wav');
    res.attachment((req.files.adx.name + '.wav').replace(".adx",""));
    req.files.adx.mv('tmp/' + req.files.adx.name,function(err){
        if(err){
             res.sendStatus(500);
             return;
        }
        console.log("upload the file sucessfully");
    });


    ffmpeg("tmp/" + req.files.adx.name)
    .toFormat("wav")
    .on('end',function(){
        console.log("done");
        
    })
    .on('error', function(error){
        console.log("error has occured" + error.message);
    })
    .pipe(res,{end:true})
   


})



app.post('/wavtoadx',(req,res) => {
    res.contentType('audio/adx');
    res.attachment((req.files.wav.name + '.adx').replace(".wav",""));
    req.files.adx.mv('tmp/' + req.files.wav.name,function(err){
        if(err){
             res.sendStatus(500);
             return;
        }
        console.log("upload the file sucessfully");
    });


    ffmpeg("tmp/" + req.files.wav.name)
    .toFormat("wav")
    .on('end',function(){
        console.log("done");
        
    })
    .on('error', function(error){
        console.log("error has occured" + error.message);
    })
    .pipe(res,{end:true})
    
    


})






app.listen(port,() =>{
    console.log("" + port)
})