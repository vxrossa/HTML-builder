const fs = require('fs').promises;

async function copyDir(directory){
  try{
    await fs.mkdir(__dirname + directory);
  }
  catch{
    console.log('Error creating directory!');
  }
  try{
    const files = await fs.readdir(__dirname + '/files');
    if(files.length == 0){
      console.log('No files inside. Only created the folder.');
    }
    for(let i = 0; i < files.length; i++){
      await fs.copyFile(__dirname + `/files/${files[i]}`,__dirname + `/files-copy/${files[i]}`);
    }
    console.log('Files successfully copied.');
  }
  catch{
    console.log('Error!');
  }
}

copyDir('/files-copy');