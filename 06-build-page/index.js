const fsp = require('fs').promises;
const fs = require('fs');

const outputDir = __dirname + '/project-dist';
console.log(outputDir);

async function makeDir(dir){
  try{
    await fsp.mkdir(__dirname + dir);
  }
  catch{
    console.log('Error creating dist folder.')
  }
}

async function buildHTML(dir){

}

async function buildCSS(dir){
  let cssText = '';
}

async function getAssets(dir){
  const files = await fsp.readdir(__dirname + dir, {
    withFileTypes: true,
  });
  console.log(files);
  for (let elem of files){
    if(elem.isDirectory()){
      console.log(elem.name);
      try{
        fsp.mkdir(__dirname + `/project-dist/${elem.name}`);
      }
      catch{
        console.log('Error copying files');
      }
      try{
        const filesinside = await fsp.readdir(__dirname + dir + `/${elem.name}`);
        console.log(filesinside);
        filesinside.forEach(fileInside => {
          console.log(fileInside);
          fsp.copyFile(__dirname + dir + `/${elem.name}/${fileInside}`,__dirname + `/project-dist/${elem.name}/${fileInside}`);
        });
      }
      catch{
        console.log('error');
      }
    }
    else{
      console.log('file!');
    }
  }
}
makeDir('/project-dist');
// buildHTML('/components');
// buildCSS('/styles');
getAssets('/assets');