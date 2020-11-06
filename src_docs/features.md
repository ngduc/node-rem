## DOCUMENTATION

## DEVELOPMENT

### Docker
- Built on lightweight docker image "node:8-alpine" (see Dockerfile)
- Command lines to launch docker images:
  - `yarn docker:dev` launch project in DEV mode
  - more... (see package.json)

### Platforms
- Mainly tested on MacOS, node 14.7.x, yarn
- Also tested on Windows 10 (Powershell) with MongoDB, latest nodejs, yarn

### Initialize DB Data
- When launching in development mode, it will check if admin user not existed (New DB) & generate it & some dev data.
- Example: [../src/api/utils/InitData.ts](../src/api/utils/InitData.ts)

### Environments
- Env vars are declared in ".env" file (npm: dotenv-safe)
- They are loaded into "config/vars" and exported to use across the app

### SSL Self-signed Cert (for HTTPS localhost)
- source: https://goo.gl/Ztv8tt
- use crt & key files in "index.ts"
```
openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

### Other Tools
- Use Postman to try out APIs
  - By default, APIs run on HTTPS localhost, so turn off "SSL Certificate Verification" in Postman Settings.

## FEATURES

### Add a new Model:
- Model has mongoose schema & default functions like: transform, list.
  - "transform" method: to sanitize mongoose results with ALLOWED_FIELDS (so we don't expose unneeded fields)
  - "list" function: to list data with pagination support (URL parameters).
- Always export Model with Model.ALLOWED_FIELDS
- Example: [...src/api/models/userNote.model.ts](../src/api/models/userNote.model.ts)

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

### API - URL Parameters
- a Model has "ALLOWED_FIELDS" array to allow those fields in API response.
  - Additionally, you can add "&fields=" as an URL param to include just a few fields. (to reduce response size)
- API list endpoints also support URL params for pagination
  - Example 1: GET https://localhost:3009/v1/users?limit=5&offset=0&sort=email:desc,createdAt
  - Example 2: GET https://localhost:3009/v1/users?page=1&perPage=20
  - Example 3: GET https://localhost:3009/v1/users/5c7f85009d65d4210efffa42/notes?note=*partialtext*

### Registration / Authentication
- auth.controller.ts
  - for registration, it goes to: exports.register
  - for authentication (login), it goes to: exports.login

- Example: POST https://localhost:3009/v1/auth/register
  - payload: { "email": "newuser@example.com", "password": "1user1", "name": "John" }
- Example: POST https://localhost:3009/v1/auth/login
  - payload: { "email": "admin1@example.com", "password": "1admin1" }
- Subsequent API calls will need "Authorization" header set to "Bearer ...accessToken..."

### API - Upload File /upload/file
- Using "multer" to parse form (file) data & store files to "/uploads"
- Example: POST https://localhost:3009/v1/upload/file
  - set Authorization: Bearer TOKEN, Content-Type: application/x-www-form-urlencoded
  - set form-data, field "file" and select a file to upload
  - uploaded file will be stored in "/uploads" directory
- Example: [../src/api/routes/v1/upload.route.ts](../src/api/routes/v1/upload.route.ts)

### API - Forgot Password /forgot-password
- a POST handler to generate a one-time temporary password, then email it to an existing user.
- Example: [../src/api/controllers/auth.controller.ts](../src/api/controllers/auth.controller.ts)

### Slack
- Obtain your Slack Incoming Webhook (tie to a channel) from your Slack account & put it in .env file
- Example: [../src/api/controllers/auth.controller.ts](../src/api/controllers/auth.controller.ts) (send slack a message after user registered (POST v1/auth/register))

### Send Email
- Using "nodemailer" to send email
- Using "handlebars" to get email templates: welcomeEmail({ name: 'John Doe', email: 'emailexample@gmail.com' })
- Obtain your Mailgun API Key & Email Domain (use sandbox domain name for testing) & put it in .env file
- Example: [../src/api/controllers/auth.controller.ts](../src/api/controllers/auth.controller.ts) (send email after user registered (POST v1/auth/register))
