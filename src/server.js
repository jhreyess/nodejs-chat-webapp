const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//settings
app.set('port', process.env.PORT || 8000);

//web sockets
require('./sockets.js')(io);

//static files
app.use(express.static(path.join(__dirname, 'public')));

//starting the server
server.listen(app.get('port'), (error)=>{
    if(error){
        console.log(error);
    }else{
        console.log(`[server] Server running at port:${app.get('port')}`);
    }
});


/* SIN EXPRESS ------------------------------------------------------
const http = require('http');
const fs = require('fs'); //File system module
const url = require('url');
const path = require('path');
const lookup = require('mime-types').lookup; //npm i mime-types
const port = 8080;
const hostname = '127.0.0.1';

//Static Files handling with pure node js
const server = http.createServer(function(req, res){ //Create server
    let dir = req.url;
    if(req.url == '/'){
        dir = "index.html";
    }
    let file = path.join(__dirname, "public", dir);
    console.log(file);
    let mime = lookup(file);
    fs.readFile(file, function(error, data){
        if(error){
            res.writeHead(404); //If file is not found
            res.end("Invalid request!");
        }else{
            res.writeHead(200, {'Content-Type':mime});
            res.write(data); //Info found in the html
        }
        res.end();
    });
});

server.listen(port, hostname,function(error){
    if(error){
        console.log('Something went wrong', error);
    }else{
        console.log(`[server] Node.js web server at ${hostname} : ${port} is running...`);
    }
});

--------------------------------------------------------------------- */