## DOCUMENTATION

## DEV

### Docker
- Built on lightweight docker image "node:8-alpine" (see Dockerfile)
- Command lines to launch docker images:
  - `yarn docker:dev` launch project in DEV mode
  - more... (see package.json)

## FEATURES

### Add a new API Route:
- Steps to create a new route:
  - src/api/routes/your-new-route.route.ts
  - src/api/controllers/route-controller.ts
  - src/api/routes/v1/index.ts - add your route
- Example: [../src/api/routes/v1/user.route.ts](../src/api/routes/v1/user.route.ts) (CRUD routes for user endpoints)

### API Controller
- An API Route is assigned with an API Controller to handle that route
- Example of user controller that runs user.model's functions:
  - [../src/api/controllers/user.controller.ts](../src/api/controllers/user.controller.ts)
  - [../src/api/models/user.model.ts](../src/api/models/user.model.ts) (see "transform" and "list" functions)

### Upload File
- Using "multer" to parse form (file) data & store files to "/uploads"
- Example: POST https://localhost:3009/v1/upload/file
  - set Authorization: Bearer TOKEN, Content-Type: application/x-www-form-urlencoded
  - set form-data, field "file" and select a file to upload
  - uploaded file will be stored in "/uploads" directory
- Example: [../src/api/routes/v1/upload.route.ts](../src/api/routes/v1/upload.route.ts)

### Send Email
- Obtain your Mailgun API Key & Email Domain (use sandbox domain name for testing) & put it in .env file
- Using nodemailer welcomeEmail({ name: 'John Doe', email: 'emailexample@gmail.com' })
- Example: [../src/api/controllers/auth.controller.ts](../src/api/controllers/auth.controller.ts) (send email after user registered (POST v1/auth/register))

### Slack
- Obtain your Slack Incoming Webhook (tie to a channel) from your Slack account & put it in .env file
- Example: [../src/api/controllers/auth.controller.ts](../src/api/controllers/auth.controller.ts) (send slack a message after user registered (POST v1/auth/register))
