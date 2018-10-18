const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
// const bodyParser = require('body-parser');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');


  // socket.on('createEmail', (newEmail) => {
  //   console.log('createEmail', newEmail);
  // });

  socket.emit('welcomeMessage', {
    from: 'admin',
    text: 'welcome to the chat app',
    createdAt: new Date().getTime()
  });

  socket.broadcast.emit('newUserJoin', {
    from: 'admin',
    text: 'new user joined!',
    createdAt: new Date().getTime()
  });

  socket.on('createMessage', (message) => {
    console.log('createMessge', message);
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
    // socket.broadcast.emit('newMessage', {
    //   from: mesasge.from,
    //   text: mesage.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(port, () => {                  //app.listen will run http.createServer method behind scenes
  console.log(`Started at port ${port}`);
});
