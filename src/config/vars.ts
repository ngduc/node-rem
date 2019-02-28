export {};
const path = require('path');

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
  allowEmptyValues: true
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  socketEnabled: ['1', 'true', 'yes'].indexOf(process.env.SOCKET_ENABLED || '') >= 0,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION_MINUTES: process.env.JWT_EXPIRATION_MINUTES,
  UPLOAD_LIMIT: 5, // MB
  SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
  EMAIL_TEMPLATE_BASE: './src/templates/emails/',
  EMAIL_FROM_SUPPORT: process.env.EMAIL_FROM_SUPPORT,
  EMAIL_MAILGUN_API_KEY: process.env.EMAIL_MAILGUN_API_KEY,
  EMAIL_MAILGUN_DOMAIN: process.env.EMAIL_MAILGUN_DOMAIN,
  mongo: {
    uri: process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TESTS : process.env.MONGO_URI
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
};
