const fsp = require('fs').promises;
const fs = require('fs');
const path = require('path');

// async function buildStyles(dir){
//   let copyText = '';
//   const regExp = /.css$/i;
//   let files = await (await fsp.readdir(dir)).filter(style => regExp.test(style));
//   console.log(files);

//   files.forEach(file => {
//     const readStream = fs.createReadStream(__dirname + `/styles/${file}`);
//     readStream.on('data', part => {
//       copyText += part;
//       const writeStream = fs.createWriteStream(__dirname + '/project-dist/bundle.css',{
//         flags: 'a',
//       });
//       writeStream.write(copyText);
//     });
//   });
// }

async function buildStyles(dir){
  let copyText = '';
  const files = await fsp.readdir(dir,{
    withFileTypes: true,
  });
  files.forEach(file => {
    if(file.isFile() && path.extname(file.name) == '.css'){
      const readStream = fs.createReadStream(__dirname + `/styles/${file.name}`);
      readStream.on('data', part => {
        copyText += part;
        const writeStream = fs.createWriteStream(__dirname + '/project-dist/bundle.css',{
          flags: 'a',
        });
        writeStream.write(copyText);
      });
    }
  });
}

buildStyles(__dirname + '/styles');