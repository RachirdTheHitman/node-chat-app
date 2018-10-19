const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
// const bodyParser = require('body-parser');

const {generateMessage} = require('./utils/message');
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

  socket.emit('welcomeMessage', generateMessage('admin', 'welcome to the chat app'));

  socket.broadcast.emit('newUserJoin', generateMessage('admin', 'new user joined'));

  socket.on('createMessage', (message) => {
    console.log('createMessge', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
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
