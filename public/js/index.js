var socket = io();          //   start up a request to connect to server

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('createMessage', function (message) {
  console.log('newMessage', message.from);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li);
});

socket.on('createMessage', function (message) {
  console.log(message);
});

socket.on('newUserJoin', function (message) {
  console.log(message);;
});

// socket.emit('createMessage', {
//   from: 'Frank',
//   text: 'Hi'
// }, function (data) {
//   console.log('Got it ', data);
// });

jQuery('#message-from').on('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function() {

  });
});
