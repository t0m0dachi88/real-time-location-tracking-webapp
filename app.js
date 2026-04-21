const express = require('express');
const app = express();
const port = 3000;    
const socketIo = require('socket.io');
const http = require('http');
const path = require('path');
const server = http.createServer(app)
const io = socketIo(server);

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log("a user connected");

    socket.on('send-location', (data) => {
        io.emit('receive-location', {id: socket.id, ...data });
    });

    socket.on('disconnect', () => {
        io.emit('user-disconnected', socket.id);
        console.log("a user disconnected");
    });
});

app.get('/', (req, res) => {
  res.render('index');
});

server.listen(port,  () => {  console.log(`Example app listening at http://localhost:${port}`);
});
