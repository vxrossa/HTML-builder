const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

let data = '';

const stream = fs.createReadStream(__dirname + '\\text.txt',);
stream.setEncoding('utf-8');

stream.on('data', part => {
  stdout.write(part);
});
