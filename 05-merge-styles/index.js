const fsp = require('fs').promises;
const fs = require('fs');
const path = require('path');

async function buildStyles(dir) {
  let copyText = '';
  const files = await fsp.readdir(dir, {
    withFileTypes: true,
  });
  try{
    files.forEach(file => {
      if (file.isFile() && path.extname(file.name) == '.css') {
        const readStream = fs.createReadStream(__dirname + `/styles/${file.name}`);
        readStream.on('data', part => {
          copyText += part;
          const writeStream = fs.createWriteStream(__dirname + '/project-dist/bundle.css', {
            flags: 'w',
          });
          writeStream.write(copyText);
        });
      }
    });
  console.log('CSS styles successfully bundled.');
  }
  catch{
    console.log('Error bundling styles.');
  }
}

buildStyles(__dirname + '/styles');