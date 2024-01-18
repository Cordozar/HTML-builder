const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const filePath = path.join(__dirname, 'text.txt');
console.log('Hello! Enter text. Type "exit" or press ctrl+c to stop.');

const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getTextInput() {
  rl.question('> ', (inputText) => {
    if (inputText.toLowerCase() === 'exit') {
      console.log('Goodbye!');
      rl.close();
      writeStream.close();
    } else {
      writeStream.write(inputText);
      getTextInput();
    }
  });
}

getTextInput();
