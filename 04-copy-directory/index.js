const fs = require('fs').promises;

async function copyDir(directory) {
  try {
    await makeDir(directory);
  } catch {
    await fs.rm(__dirname + directory, {
      force: true,
      recursive: true
    });
    await makeDir(directory);
  }
  try {
    const files = await fs.readdir(__dirname + '/files');
    if (files.length == 0) {
      console.log('No files inside. Only created the folder.');
    }
    for (let i = 0; i < files.length; i++) {
      await fs.copyFile(__dirname + `/files/${files[i]}`, __dirname + `/files-copy/${files[i]}`);
    }
    console.log('Files successfully copied.');
  } catch {
    console.log('Error!');
  }
}

async function makeDir(direc) {
  await fs.mkdir(__dirname + direc);
}
copyDir('/files-copy');