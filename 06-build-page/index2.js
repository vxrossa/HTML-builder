const fs = require('fs/promises');
const fss = require('fs');
const path = require('path');

let filesList = [];
let dirList = [];

async function getAssets(dir){
  try{
    await fs.mkdir(path.join(__dirname,'project-dist'));
  }
  catch{
    console.log('error creating dist folder');
  }
  try{
    await fs.stat(path.join(__dirname,dir));
    const files = await fs.readdir(path.join(__dirname,dir), { withFileTypes: true});
    for (let i = 0; i < files.length; i++) {
      if(files[i].isDirectory()){
        await getAssets(path.join(dir,files[i].name));
        dirList.push(`${dir}/${files[i].name}`);
      }
      else if(files[i].isFile()){
        filesList.push(`${dir}/${files[i].name}`);
      }
    }
    await copyAssets('project-dist');
  }
  catch{
    console.log('error getting assets');
  }
  try{
    await buildHTML('components','template.html');
  }
  catch{
    console.log('error bundling html files');
  }
}

async function copyAssets(dir){
  for(let i = 0; i < dirList.length; i++){
    try{
      await fs.mkdir(path.join(__dirname,dir,dirList[i]),{ recursive: true });
      await fs.copyFile(
        path.join(__dirname,filesList[i]),
        path.join(__dirname,dir,filesList[i])
      );
    }
    catch{
      console.log('ERR');
    }
  }
}

async function buildHTML(dir,src){
  const components = await fs.readdir(path.join(__dirname,dir), { withFileTypes: true });
  console.log(components);

  let template = await fs.readFile(path.join(__dirname,src),'utf-8');
  try{
    for(let i = 0; i < components.length; i++){
      const readStream = fss.createReadStream(path.join(__dirname,dir,components[i].name));
      readStream.on('data',part => {
        template = template.replace(`{{${path.basename(components[i].name,'.html')}}}`,part);
        if(i == components.length - 1){
          console.log('end');
          const writeStream = fss.createWriteStream(path.join(
            __dirname,'project-dist','index.html'
          ), {flags: 'w'});
          writeStream.write(template);
        }
      });
    }
  }
  catch{
    console.log('ERR4')
  }
}

// async function buildHTML(){
//   const components = await fsp.readdir(__dirname + '/components', { withFileTypes: true });
//   let template = await fsp.readFile(__dirname + '/template.html', 'utf-8');
//   for(let i = 0; i < components.length; i++){
//     const readStream = fs.createReadStream(__dirname + `/components/${components[i].name}`);
//     readStream.on('data', part => {
//       template = template.replace(`{{${path.basename(components[i].name, '.html')}}}`,part.toString());
//       if(i == components.length - 1){
//         const writeStream = fs.createWriteStream(__dirname + '/project-dist/index.html',{ flags: 'w'});
//         writeStream.write(template);
//       }
//     });
//   }
// }

getAssets('assets');
