const { constants } = require('buffer');
const { appendFile, writeFile } = require('fs').promises;
const fs = require('fs');
const process = require('process');
const readline = require('readline');

const input = process.stdin;
const output = process.stdout;

let writeStream = fs.createWriteStream(__dirname + '\\text.txt', {
  flags: 'a',
});

let rl = readline.createInterface(input, output);

async function writeToFile(entered){
  try {
    await writeStream.write(entered + '\n');
  }
  catch (err){
    throw new Error(err);
  }
}

rl.setPrompt('Please enter text or enter "exit" to exit program: ');
rl.prompt();

rl.on('line', (answer) => {
  if(answer == 'exit'){
    console.log('Process exited, data has been saved.')
    process.exit(0);
  }
  writeToFile(answer).then(console.log('Data written!'));
  rl.prompt();
})
