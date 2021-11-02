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
}

async function buildHTML(dir){
  const components = await fsp.readdir(__dirname + '/components', { withFileTypes: true });
  let template = await fsp.readFile(__dirname + '/template.html', 'utf-8');
  for(let i = 0; i < components.length; i++){
    const readStream = fs.createReadStream(__dirname + `/components/${components[i].name}`);
    readStream.on('data', part => {
      template = template.replace(`{{${path.basename(components[i].name, '.html')}}}`,part.toString());
      if(i == components.length - 1){
        const writeStream = fs.createWriteStream(__dirname + `/project-dist/index.html`,{ flags: 'w'});
        writeStream.write(template);
      }
    });
  }
}

async function buildCSS(dir){
  let cssText = '';
  const cssFiles = await fsp.readdir(__dirname + dir, { withFileTypes: true });
  cssFiles.forEach(file => {
    if(file.isFile() && path.extname(file.name) == '.css'){
      const readStream = fs.createReadStream(__dirname + `/styles/${file.name}`);
      readStream.on('data', part => {
        cssText += part;
        const writeStream = fs.createWriteStream(__dirname + `/project-dist/style.css`,{ flags: 'w' });
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
          await fsp.access(__dirname + `/project-dist/assets`);
        }
        catch(err){
          await fsp.mkdir(__dirname + '/project-dist/assets');
        }
        try{
          await fsp.access(__dirname + `/project-dist${dir}/${elem.name}`);
        }
        catch(err){
          await fsp.mkdir(__dirname + `/project-dist${dir}/${elem.name}`);
        }
        try{
          const filesinside = await fsp.readdir(__dirname + dir + `/${elem.name}`);
          filesinside.forEach(fileInside => {
            fsp.copyFile(__dirname + dir + `/${elem.name}/${fileInside}`,__dirname + `/project-dist/assets/${elem.name}/${fileInside}`);
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
    console.log('Error bundling styles.');
  }
  try{
    await buildHTML('/components');
    console.log('HTML components bundled.')
  }
  catch{
    console.log('Error bundling components.')
  }
}

buildPage('/project-dist');
