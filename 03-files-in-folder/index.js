const fs = require('fs').promises;
const files = require('fs');
const path = require('path');


async function readDirectory(dir){
  const file = await fs.readdir(dir, {
    withFileTypes: true,
  });
  for (let i = 0; i < file.length; i++){
    await files.stat(dir + '/' + file[i].name, (err,stats ) => {
      const size = Math.ceil(stats.size / 1024); // in kb
      const name = file[i].name.substring(0,file[i].name.indexOf('.'));
      const ext = path.extname(file[i].name).substring(1);
      if(ext.length > 0 && file[i].isFile()){
        console.log(`${name} - ${ext} - ${size}kb`);
      } else {
        console.log('FOLDER');
      }
    })
  }
}

readDirectory(__dirname + '/secret-folder');

