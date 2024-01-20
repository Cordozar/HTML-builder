const fsPromises = require('node:fs/promises');
const path = require('node:path');

const stylesFolderPath = path.join(__dirname, 'styles');
const distFolderPath = path.join(__dirname, 'project-dist');
const bundleFilePath = path.join(distFolderPath, 'bundle.css');

async function compileStyles() {
  const files = await fsPromises.readdir(stylesFolderPath);

  const styleFiles = files.filter((file) => path.parse(file).ext === '.css');

  const stylesArray = [];

  for (const file of styleFiles) {
    const filePath = path.join(stylesFolderPath, file);
    const styleContent = await fsPromises.readFile(filePath);
    stylesArray.push(styleContent);
  }

  await fsPromises.writeFile(bundleFilePath, stylesArray.join('\n'));
}

compileStyles();
