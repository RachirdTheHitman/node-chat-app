var socket = io();          //   start up a request to connect to server

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage', message);
});

socket.on('welcomeMessage', function (message) {
  console.log(message);
});

socket.on('newUserJoin', function (message) {
  console.log(message);;
});
