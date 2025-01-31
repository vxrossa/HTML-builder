const fs = require('fs/promises');
const fss = require('fs');
const path = require('path');

let filesList = [];
let dirList = [];

async function getAssets(dir) {
  try {
    const files = await fs.readdir(path.join(__dirname, dir), {
      withFileTypes: true
    });
    for (let i = 0; i < files.length; i++) {
      if (files[i].isDirectory()) {
        await getAssets(path.join(dir, files[i].name));
        dirList.push(`${dir}/${files[i].name}`);
      } else if (files[i].isFile()) {
        filesList.push(`${dir}/${files[i].name}`);
      }
    }
  } catch {
    console.log('Error reading assets');
  }
}

async function copyAssets(dir) {
  try {
    await createDist('project-dist');
  } catch {
    console.log('Dist folder found. Updating...');
  }
  try {
    await getAssets('assets');
    console.log('Assets folder successfully copied.');
  } catch {
    console.log('Error reading assets folder.');
  }
  for (let i = 0; i < dirList.length; i++) {
    try {
      await fs.mkdir(path.join(__dirname, dir, dirList[i]), {
        recursive: true
      });
    } catch {
      console.log('Error creating folders.');
    }
  }
  for (let i = 0; i < filesList.length; i++) {
    try {
      await fs.copyFile(
        path.join(__dirname, filesList[i]),
        path.join(__dirname, dir, filesList[i])
      );
    } catch {
      console.log('Error copying files to folders.');
    }
  }
  try{
    await buildCSS('styles','style.css');
  }
  catch{
    console.log('error building css');
  }
}

async function createDist(src) {
  try {
    await fs.mkdir(path.join(__dirname, src));
  } catch {
    await fs.rm(path.join(__dirname, 'project-dist'), {
      force: true,
      recursive: true,
    });
    await fs.mkdir(path.join(__dirname, src));
  }
}

async function buildHTML(dir, src) {
  const components = await fs.readdir(path.join(__dirname, dir), {
    withFileTypes: true
  });
  let template = await fs.readFile(path.join(__dirname, src), 'utf-8');
  try {
    for (let i = 0; i < components.length; i++) {
      if (components[i].isFile() && path.extname(components[i].name) == '.html') {
        const readStream = fss.createReadStream(path.join(__dirname, dir, components[i].name));
        readStream.on('data', part => {
          template = template.replace(`{{${path.basename(components[i].name,'.html')}}}`, part);
          const writeStream = fss.createWriteStream(path.join(
            __dirname, 'project-dist', 'index.html'
          ), {
            flags: 'w'
          });
          writeStream.write(template);
        });
      }
    }
    console.log('HTML components bundled.');
  } catch {
    console.log('Error bundling HTML.');
  }
}

async function buildCSS(dir, output) {
  let cssText = '';
  const cssFiles = await fs.readdir(path.join(__dirname, dir), {
    withFileTypes: true
  });
  cssFiles.forEach(file => {
    if (file.isFile() && path.extname(file.name) == '.css') {
      const readStream = fss.createReadStream(path.join(__dirname, dir, file.name));
      readStream.on('data', part => {
        cssText += part;
        const writeStream = fss.createWriteStream(path.join(__dirname, 'project-dist', output), {
          flags: 'w'
        });
        writeStream.write(cssText);
      });
    }
  });
  console.log('CSS styles bundled.');
}

copyAssets('project-dist');
buildHTML('components', 'template.html');
// buildCSS('styles', 'style.css');
