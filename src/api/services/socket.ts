export {};
const socketio = require('socket.io');

exports.setup = (server: any) => {
  socketio(server).on('connect', (client: any) => {
    console.log('--- socket.io connection ready');

    client.on('customMessage', (msg: any) => {
      console.log('on message - ', msg);

      client.emit('customReply', { test: 789 });
    });
  });
};
