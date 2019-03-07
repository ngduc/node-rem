// ***
// NOTE: MUST RUN THIS IN "node_modules", OTHERWISE, SYMLINKS WILL NOT WORK !!!
//
// - "$ yarn" command will run this automatically. (package.json - postinstall)
// - This script creates symlinks (e.g. "src/api" to "node_modules/api")
//   so we can do like this from anywhere: require("api/utils/Utils") without using "../.." paths.
// ***

/* eslint-disable */
const fs = require('fs');
// const execSync = require('child_process').execSync;

const arr = ['api', 'config']; // symlinks

for (let i = 0; i < arr.length; i += 1) {
  const srcpath = '../src/' + arr[i];
  const dstpath = arr[i];

  if (!fs.existsSync(dstpath)) {
    try {
      fs.symlinkSync(srcpath, dstpath, 'dir');
    } catch (ex) {
      console.error(`Creating symbolic link failed, consider Administrator mode on Windows: `);
      console.error(ex);
      break;
    }
  }
}
