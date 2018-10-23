const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
// const bodyParser = require('body-parser');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');


  // socket.on('createEmail', (newEmail) => {
  //   console.log('createEmail', newEmail);
  // });
  //
  // socket.emit('createMessage', generateMessage('Admin', 'welcome to the chat app'));
  //
  // socket.broadcast.emit('newUserJoin', generateMessage('Admin', 'new user joined'));

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }

    socket.join(params.room);
    // console.log(socket.id);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    //socket.leave('the office fans');

    // io.emit -> io.to('the office fans').emit
    // socket.broadcast.emit -> socket.broadcast.to('the offica fans').emit
    // socket.emit
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    // console.log('createMessge', message);
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));  // sending message to every connected browser
    }

    callback();
    // socket.broadcast.emit('newMessage', {
    //   from: mesasge.from,
    //   text: mesage.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    // console.log('User was disconnected');
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
  });
});

server.listen(port, () => {                  //app.listen will run http.createServer method behind scenes
  console.log(`Started at port ${port}`);
});
