export {};
const path = require('path');

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
  allowEmptyValues: true
});

const env = process.env; // this has ".env" keys & values
// let adminToken = '';

module.exports = {
  env: env.NODE_ENV,
  port: env.PORT,
  socketEnabled: ['1', 'true', 'yes'].indexOf(env.SOCKET_ENABLED || '') >= 0,
  slackEnabled: env.SLACK_WEBHOOK_URL ? true : false,
  emailEnabled: env.EMAIL_MAILGUN_API_KEY ? true : false,
  JWT_SECRET: env.JWT_SECRET,
  JWT_EXPIRATION_MINUTES: env.JWT_EXPIRATION_MINUTES,
  UPLOAD_LIMIT: 5, // MB
  SLACK_WEBHOOK_URL: env.SLACK_WEBHOOK_URL,
  EMAIL_TEMPLATE_BASE: './src/templates/emails/',
  EMAIL_FROM_SUPPORT: env.EMAIL_FROM_SUPPORT,
  EMAIL_MAILGUN_API_KEY: env.EMAIL_MAILGUN_API_KEY,
  EMAIL_MAILGUN_DOMAIN: env.EMAIL_MAILGUN_DOMAIN,
  SEC_ADMIN_EMAIL: env.SEC_ADMIN_EMAIL,
  // setAdminToken: (admToken: string) => (adminToken = admToken),
  isAdmin: (user: any) => user && user.email === env.SEC_ADMIN_EMAIL,
  mongo: {
    uri: env.NODE_ENV === 'test' ? env.MONGO_URI_TESTS : env.MONGO_URI
  },
  logs: env.NODE_ENV === 'production' ? 'combined' : 'dev'
};
