export {};
const socketio = require('socket.io');

exports.setup = (server: any) => {
  socketio(server).on('connection', (client: any) => {
    console.log('--- socket.io connection ready');

    client.on('message', (msg: any) => {
      console.log('on message - ', msg);
    });
  });
};
