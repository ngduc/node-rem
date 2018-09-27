// ***
// NOTE: MUST RUN THIS IN "node_modules", OTHERWISE, SYMLINKS WILL NOT WORK !!!
// ***

var fs = require('fs');
const execSync = require('child_process').execSync;

const arr = ['api', 'config'];
for (let i = 0; i < arr.length; i += 1) {
  const srcpath = '../src/' + arr[i];
  const dstpath = arr[i];

  try {
    fs.symlinkSync(srcpath, dstpath, 'dir');
  } catch (ex) {}
}
