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

  socket.emit('createMessage', generateMessage('Admin', 'welcome to the chat app'));

  socket.broadcast.emit('newUserJoin', generateMessage('Admin', 'new user joined'));

  socket.on('createMessage', (message, callback) => {
    console.log('createMessge', message);
    io.emit('newMessage', generateMessage(message.from, message.text));  // sending message to every connected browser
    callback('This is from the server.');
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
