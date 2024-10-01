const io = require('socket.io')(8900, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

let users = [];

function addUser(userId, socketId) {
  !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
}

function removeUser(socketId) {
  users = users.filter((user) => user.socketId !== socketId);
}

function getUserById(userId) {
  return users.find((user) => user.userId === userId);
}

io.on('connection', (socket) => {
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });

  socket.on('sendMessage', ({ senderId, otherUserId, messageText }) => {
    const user = getUserById(otherUserId);

    // Check if the recipient exists
    if (user) {
      io.to(user.socketId).emit('getMessage', {
        senderId,
        messageText,
      });
    } else {
      console.log(`User with ID ${otherUserId} not found or not connected.`);
    }
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});
