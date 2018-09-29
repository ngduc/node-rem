// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./config/vars');

const https = require('https');
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
const server = https.createServer(options, app);

socket.setup(server);
server.listen(port, () => console.info(`🌟 Started (${env}) --- https://localhost:${port}`));

// HTTP
// app.listen(port, () => console.info(`server started on port ${port} (${env})`));

/**
 * Exports express
 * @public
 */
module.exports = app;
