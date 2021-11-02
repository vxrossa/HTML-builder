const fsp = require('fs').promises;
const fs = require('fs');
const path = require('path');

const outputDir = __dirname + '/project-dist';
console.log(outputDir);

async function buildPage(dir){
  try{
    await fsp.stat(__dirname + dir);
    console.log('Dist folder found. Updating files.');
    try{
      await getAssets('/assets');
    }
    catch{
      console.log('ERROR MOVING ASSETS');
    }
  }
  catch(err){
    console.log('Dist folder initialized. Copying files.');
    await fsp.mkdir(__dirname + '/project-dist');
    try{
      await getAssets('/assets');
    }
    catch{
      console.log('ERROR MOVING ASSETS');
    }
  }
  // try{
  //   await fsp.mkdir(__dirname + dir);
  // }
  // catch{
  //   console.log('Error creating dist folder.')
  // }
}

async function buildHTML(dir){

}

async function buildCSS(dir){
  let cssText = '';
  const cssFiles = await fsp.readdir(__dirname + dir, { withFileTypes: true });
  cssFiles.forEach(file => {
    if(file.isFile() && path.extname(file.name) == '.css'){
      const readStream = fs.createReadStream(__dirname + `/styles/${file.name}`);
      readStream.on('data', part => {
        cssText += part;
        const writeStream = fs.createWriteStream(__dirname + `/project-dist/style.css`,{ flags: 'a' });
        writeStream.write(cssText);
      })
    }
  })
}

async function getAssets(dir){
  try{
    const files = await fsp.readdir(__dirname + dir, {
      withFileTypes: true,
    });
    for (let elem of files){
      if(elem.isDirectory()){
        try{
          await fsp.stat(__dirname + `/project-dist/${elem.name}`);
        }
        catch{
          await fsp.mkdir(__dirname + `/project-dist/${elem.name}`);
        }
        // try{
        //   fsp.mkdir(__dirname + `/project-dist/${elem.name}`);
        // }
        // catch{
        //   console.log('Error copying files');
        // }
        try{
          const filesinside = await fsp.readdir(__dirname + dir + `/${elem.name}`);
          filesinside.forEach(fileInside => {
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
  catch{
    console.log('Error reading directory.');
  }
  try{
    await buildCSS('/styles');
    console.log('Styles bundled');
  }
  catch{
    console.log('Error bundling styles');
  }
}
buildPage('/project-dist');
// buildHTML('/components');
// buildCSS('/styles');
// getAssets('/assets');