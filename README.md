# Node REM

NodeJS Rest Express MongoDB

### Installation

Clone this project:
```
git clone https://github.com/ngduc/node-rem.git your-app
cd your-app
rm -rf .git
```
Update `package.json` file with your information.

### Build

```
yarn dev      launch DEV mode
yarn start    launch PROD mode
yarn stop

yarn test     Run tests
```

### Features

Your simple `Route Handler` will look like this (packed with ~~vitamins~~ features):
```js
exports.list = async (req, res, next) => {
  try {
    const data = (await User.list(req.query)).transform();
    res.json(await Utils.buildResponse({ req, data, listEntity: User }));
  } catch (e) {
    next(e);
  }
};

Example: GET https://localhost:3009/v1/users?role=admin&limit=5&offset=0&sort=email:desc,createdAt

{
    "meta": {
        "limit": 5,
        "offset": 0,
        "sort": {
            "email": -1,
            "createdAt": 1
        },
        "totalCount": 4,
        "pageCount": null
    },
    "data": [
        {
            "id": "5bad07cdc099dfbe49ef69d7",
            "name": "John Doe",
            "email": "john.doe@gmail.com",
            "role": "admin",
            "createdAt": "2018-09-27T16:39:41.498Z"
        },
        ...
    ]
}
```

### Based on

[danielfsousa/express-rest-es2017-boilerplate](https://github.com/danielfsousa/express-rest-es2017-boilerplate)
