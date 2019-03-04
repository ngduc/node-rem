## [0.7.0] - 2019-03-04

### Added
- initData.ts - initialize dev data (admin user & some data)
- userNote model - a simple example of model
- listUserNotes - a simple example to query & return data
### Changed
- BREAKING: renamed ALLOW_FIELDS to ALLOWED_FIELDS

## [0.6.6] - 2019-02-28

### Added
- support for "&fields" param in Model.transform(req) to include specific fields in API response
- added Utils.getQuery to get safe query fields from req.query
- added ModelUtils transformData and listData
- added MsgUtils slackWebhook to send message using Slack Incoming Webhook
- added MsgUtils sendEmail (using nodemailer & mailgun)
- added MsgUtils email template function, e.g. sendEmail(welcomeEmail({ name, email }))
- added multer to handle file upload
- added "features.md" to explain features in details
- added /forgot-password route & controller
### Fixed
- fixed yarn lint
- fixed lint errors
- fixed to run on Windows 10 (Powershell)

## [0.4.7] - 2019-02-21

### Changed
- upgraded mocha, joi to latest, removed pinned versions.
- upgraded other dependencies

## [0.4.5] - 2018-10-05

### Added
- use [mstime](https://github.com/ngduc/mstime) to measure API run time.
- measure API response time & show it in response "meta"
### Changed
- BREAKING: refactor apiJson's "listModel" to "model"

## [0.3.0] - 2018-10-02

### Changed
- BREAKING: refactor code to use this syntax: import { User } from 'api/models';
