const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const fileupload = require('express-fileupload');
const app = express();

const port = process.env.PORT || 9000
ffmpeg.setFfmpegPath("./bin/ffmpeg.exe");

app.use(fileupload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}))






app.get('/',(req,res) => {
    res.sendFile(__dirname + '/index.html');

  

})



//post
app.post('/adxtowav',(req,res) => {
    res.contentType('audio/wav');
    res.attachment((req.files.adx.name + '.wav').replace(".adx",""));
    req.files.adx.mv('tmp/' + req.files.adx.name,function(err){
        if(err){
            return res.sendStatus(500).send(err);
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
    res.attachment((req.files.adx.name + '.adx').replace(".wav",""));
    req.files.wav.mv('tmp/' + req.files.wav.name,function(err){
        if(err){
            return res.sendStatus(500).send(err);
        }
        console.log("upload the file sucessfully");
    });

 

   res.send( ffmpeg("tmp/" + req.files.wav.name)
    .toFormat('adx')
    .on('end',function(){
        console.log("done");
        ffmpeg("tmp/" + req.files.wav.name).loop();
    })
    .on('error', function(error){
        console.log("error has occured" + error.message);
    })
    .pipe(res,{end:true}))

})





app.listen(port,() =>{
    console.log("" + port)
})