// setup mstime to measure API response time
const mstime = require('mstime');
mstime.plugins([{ plugin: require('mstime/dist/cjs/plugins/msPluginTrimMean') }]);
mstime.start('app-start');

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
  key: fs.readFileSync('./src/config/https/localhost-key.pem'),
  cert: fs.readFileSync('./src/config/https/localhost.pem')
};
const server = spdy.createServer(options, app);

if (socketEnabled) {
  socket.setup(server);
}

server.listen(port, () => {
  console.info(`--- 🌟  Started (${env}) --- https://localhost:${port}`);
  console.log(`${mstime.end('app-start').last} ms`);
});

if (env === 'development') {
  // initialize test data once (admin@example.com)
  require('./api/utils/InitData');
}

// - For PROD only - needs Internet for Twitter APIs
if (env !== 'development') {
  console.log('- TwitterUtils');
  const { authTwitter, repeatPostFetching } = require('./api/utils/TwitterUtils');
  authTwitter();
  repeatPostFetching();
}

/**
 * Exports express
 * @public
 */
module.exports = app;
