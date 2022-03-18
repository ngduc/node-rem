## DOCUMENTATION

## DEVELOPMENT

### Docker (optional)
- Built on lightweight docker image "node:8-alpine" (see Dockerfile).
- Command lines to launch docker images:
  - `yarn docker:dev` launch project in DEV mode.
  - more... (see package.json)

### Requirements
Platforms:
  - Mainly tested on MacOS, node 14.7.x.
  - Also tested on Windows 10 (Powershell) with MongoDB, latest nodejs.

Require:
  - MongoDB - e.g. install: `docker run -p 27017:27017 -v ~/mongo_data:/data/db mvertes/alpine-mongo`

Good to have:
  - A client tool to manage data like Robo 3T.
  - VSCode Rest Client extension to run examples in "rest-client-examples.rest".

### Environments
- Env vars are declared in ".env" file (npm: dotenv-safe).
- They are loaded into "config/vars" and exported to be used across the app.

### Initialize DB Data
- When launching in development mode, it will check if the default user1 not existed (New DB) to generate some dev data.
- Example: [../src/api/utils/InitData.ts](../src/api/utils/InitData.ts)

### Express
- config/express.ts is where we set up the Express server.

### SSL Self-signed Cert (for HTTPS localhost)
- Source: https://goo.gl/Ztv8tt
- Use crt & key files in "index.ts"
- Generate cert files locally:
```
openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

## FEATURES

### Add a new Model
- Model has Mongoose schema & default functions like: transform, list.
  - "transform" method: to sanitize mongoose results with ALLOWED_FIELDS (so we don't expose unneeded fields)
  - "list" function: to list data with pagination support (URL parameters).
- Always export Model with Model.ALLOWED_FIELDS
- Example: [...src/api/models/userNote.model.ts](../src/api/models/userNote.model.ts)

### Add a new API Route
- Steps to create a new route:
  - src/api/routes/your-new-route.route.ts
  - src/api/controllers/route-controller.ts
  - src/api/routes/v1/index.ts - add your route here.
- Example: [../src/api/routes/v1/user.route.ts](../src/api/routes/v1/user.route.ts) (CRUD routes for user endpoints).

### API Controller
- An API Route is assigned with an API Controller to handle that route.
- Example of user controller that runs user.model's functions:
  - [../src/api/controllers/user.controller.ts](../src/api/controllers/user.controller.ts)
  - [../src/api/models/user.model.ts](../src/api/models/user.model.ts) (see "transform" and "list" functions)

### API - URL Parameters
- a Model has "ALLOWED_FIELDS" array to allow those fields in API response.
  - Additionally, you can add "&fields=" as an URL param to include just a few fields. (to reduce response size)
- API list endpoints also support URL params for pagination
  - Example 1: GET http://localhost:3009/api/v1/users?fields=id,email&email=*user1* (get id & email only in response)
  - Example 2: GET http://localhost:3009/api/v1/users?page=1&perPage=20 (query & pagination)
  - Example 3: GET http://localhost:3009/api/v1/users/5c7f85009d65d4210efffa42/notes?note=*partialtext*

### Registration / Authentication
- auth.controller.ts
  - for registration, it goes to: exports.register.
  - for authentication (login/logout), it goes to: exports.login, logout.
  - when logging in, an "accessToken" is generated and saved (generateTokenResponse()) to "refreshtokens" table in DB.
  - to get the logged in user object, use ```const { user } = req.route.meta;```

- Register: POST http://localhost:3009/api/v1/auth/register
  - payload: { "email": "newuser@example.com", "password": "1user1", "name": "John" }
- Login: POST http://localhost:3009/api/v1/auth/login
  - payload: { "email": "admin1@example.com", "password": "1admin1" }
- Logout: POST http://localhost:3009/api/v1/auth/logout
  - payload: { "userId": "..." }
- Subsequent API calls will need "Authorization" header set to "Bearer ...accessToken..."

### Authorization / Permission Validation
- auth.ts - handleJWT: validate: only the same logged in userId can call REST endpoints /userId/...

### API - Upload File /upload/file
- Using "multer" to parse form (file) data & store files to "/uploads"
- Example: POST http://localhost:3009/api/v1/upload/file
  - set Authorization: Bearer TOKEN, Content-Type: application/x-www-form-urlencoded
  - set form-data, field "file" and select a file to upload.
  - uploaded files will be stored in "/uploads" directory.
- Example: [../src/api/routes/v1/upload.route.ts](../src/api/routes/v1/upload.route.ts)

### API - Forgot Password /forgot-password
- a POST handler to generate a one-time temporary password, then email it to an existing user.
- Example: [../src/api/controllers/auth.controller.ts](../src/api/controllers/auth.controller.ts)

### Slack
- Obtain your Slack Incoming Webhook (tie to a channel) from your Slack account & put it in .env file.
- Example: [../src/api/controllers/auth.controller.ts](../src/api/controllers/auth.controller.ts) (send slack a message after user registered (POST v1/auth/register))

### Send Email
- Using "nodemailer" to send email
- Using "handlebars" to get email templates: welcomeEmail({ name: 'John Doe', email: 'emailexample@gmail.com' })
- Obtain your Mailgun API Key & Email Domain (use sandbox domain name for testing) & put it in .env file.
- Example: [../src/api/controllers/auth.controller.ts](../src/api/controllers/auth.controller.ts) (send email after user registered (POST v1/auth/register))

## UI Example

- UI Example location: /ui
- Using CRA (create-react-app).
  - Typescript, React-router, Axios, PostCSS, Tailwind. Components: Home, ItemView, Login.

## Deployment

With Vercel:
- Node-rem has vercel.json config file. You can build BE & FE, then run "npx vercel" to deploy it with your Vercel account
- Try this repo: https://github.com/ngduc/vercel-express