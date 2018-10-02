// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env, socketEnabled } = require('./config/vars');

// const https = require('https');
const spdy = require('spdy'); // for HTTP2
const fs = require('fs');
const app = require('./config/express');
const socket = require('api/services/socket');

const mongoose = require('./config/mongoose');

// open mongoose connection
mongoose.connect();

// HTTPS options
const options = {
  key: fs.readFileSync('./src/config/https/key.pem'),
  cert: fs.readFileSync('./src/config/https/cert.pem')
};
const server = spdy.createServer(options, app);

if (socketEnabled) {
  socket.setup(server);
}

server.listen(port, () => console.info(`--- 🌟  Started (${env}) --- https://localhost:${port}`));

/**
 * Exports express
 * @public
 */
module.exports = app;
