const fsPromises = require('node:fs/promises');
const fs = require('node:fs');
const path = require('node:path');

const folderPath = path.join(__dirname, 'secret-folder');

async function readFolderContents(folderPath) {
  const files = await fsPromises.readdir(folderPath, {
    withFileTypes: true,
  });

  console.log('Files in the folder:');

  const filteredFolders = files.filter((file) => file.isFile() === true);
  filteredFolders.forEach((file) => {
    fs.stat(`${file.path}\\${file.name}`, (err, stats) => {
      console.log(
        `${file.name.substring(0, file.name.indexOf('.'))} - ${path
          .extname(file.name)
          .slice(1)} - ${stats.size / 1000}kb`,
      );
    });
  });
}

readFolderContents(folderPath);
