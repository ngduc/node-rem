# Node REM

NodeJS Rest Express MongoDB

[![Build Status](https://travis-ci.org/ngduc/node-rem.svg?branch=master)](https://travis-ci.org/ngduc/node-rem)

🌟 It rains ~~cats and dogs~~ features:

```
  Typescript      Express 4.15       CORS     Helmet    DotEnv   joi (validation)   forever
  Mongoose 4.9    Passport  JWT      Await
  Tslint          Apidoc    Docker   Husky    Morgan    Travis   Docker
  Tests
            Mocha  Chai     Sinon    istanbul
  MORE:
            HTTPS           HTTP2 (spdy)      Socketio 2.1    VSCode Debug
            Dependabot      Codacy
      API
            API response    (data, meta: limit, offset, sort)    transform res
            apiJson         Page Query        Stack trace in Response
```

If you don't want Typescript, use this branch: `node-rem-without-typescript`

### 📦 Installation

Clone this project:
```
git clone https://github.com/ngduc/node-rem.git your-app
cd your-app
rm -rf .git
yarn
```
Update `package.json` and `.env` file with your information.

### 🔧 Commands

Require: `MongoDB` and `NodeJS v8.12.0 +`

```
yarn dev      launch DEV mode
yarn start    launch PROD mode
yarn stop

yarn test     Run tests
```

### 📖 Features

Your simple `API Route Handler` will have a nice syntax like this: (packed with ~~vitamins~~ cool stuffs)
```js
exports.list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = (await User.list(req.query)).transform();
    apiJson({ req, res, data, model: User });
  } catch (e) {
    next(e);
  }
};
```

API Response is similar to [JSON API](http://jsonapi.org/examples/#pagination) standard:

```json
GET https://localhost:3009/v1/users?role=admin&page=1&perPage=20
GET https://localhost:3009/v1/users?role=admin&limit=5&offset=0&sort=email:desc,createdAt
{
    "meta": {
        "limit": 5,
        "offset": 0,
        "sort": {
            "email": -1,
            "createdAt": 1
        },
        "totalCount": 4
    },
    "data": [
        {
            "id": "5bad07cdc099dfbe49ef69d7",
            "name": "John Doe",
            "email": "john.doe@gmail.com",
            "role": "admin",
            "createdAt": "2018-09-27T16:39:41.498Z"
        },
        // ...
    ]
}
```
Example of generated API Docs (using `apidoc`) - https://node-rem.netlify.com

### 📖 Documentation

- [Build System](https://github.com/ngduc/node-rem/blob/master/src_docs/build.md)
- [Dependencies Notes](https://github.com/ngduc/node-rem/blob/master/src_docs/dependencies.md)
- [Change Log](https://github.com/ngduc/node-rem/blob/master/CHANGELOG.md)

### 🙌 Thanks

All contributions are welcome!

[danielfsousa/express-rest-es2017-boilerplate](https://github.com/danielfsousa/express-rest-es2017-boilerplate)
