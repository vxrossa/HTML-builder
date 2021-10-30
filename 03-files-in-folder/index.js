const fs = require('fs').promises;
const process = require('process');
const path = require('path');


async function readDirectory(dir){
  const file = await fs.readdir(dir, {
    withFileTypes: true,
  });
  console.log(file);
  for (let i = 0; i < file.length; i++){
    const name = file[i].name.substring(0,file[i].name.indexOf('.'))
    const ext = path.extname(file[i].name).substring(1);
    if(ext.length > 0 && file[i].isFile()){
      console.log(name + ' ' + ext);
    } else {
      console.log('FOLDER');
    }

    /*const name = elem.substring(0,elem.indexOf('.'));
    const ext = path.extname(elem).substring(1);*/
    // process.stdout.write(`${name} - ${ext} - 0kb \n`);

  }
}

readDirectory(__dirname + '\\secret-folder');
