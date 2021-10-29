const fs = require('fs');

const { stdout } = require('process');

const stream = fs.createReadStream(__dirname + '\\text.txt',);
stream.setEncoding('utf-8');

stream.on('data', part => {
  stdout.write(part);
});
