const fs = require('node:fs');
const path = require('node:path');

const distDirectory = path.join(__dirname, 'project-dist');

async function makeDirectory(path) {
  await fs.promises.mkdir(path, {
    recursive: true,
  });
}

makeDirectory(distDirectory);

const indexFilePath = path.join(__dirname, 'project-dist', 'index.html');
const templateFilePath = path.join(__dirname, 'template.html');
const componentsFolderPath = path.join(__dirname, 'components');

async function createContentIndex() {
  const templateFileContent = await fs.promises.readFile(
    templateFilePath,
    'utf-8',
  );

  const components = await fs.promises.readdir(componentsFolderPath);

  let newTemplateFileContent = templateFileContent;

  for (const component of components) {
    const componentPath = path.join(componentsFolderPath, component);
    const componentContent = await fs.promises.readFile(componentPath, 'utf-8');
    newTemplateFileContent = newTemplateFileContent.replace(
      `{{${component.slice(0, component.indexOf('.'))}}}`,
      componentContent,
    );
  }

  const writeStream = fs.createWriteStream(indexFilePath);
  writeStream.write(newTemplateFileContent);
  writeStream.close();
}

createContentIndex();

const stylesFolderPath = path.join(__dirname, 'styles');
const bundleFilePath = path.join(distDirectory, 'style.css');

async function compileStyles() {
  const files = await fs.promises.readdir(stylesFolderPath);

  const styleFiles = files.filter((file) => path.parse(file).ext === '.css');

  const stylesArray = [];

  for (const file of styleFiles) {
    const filePath = path.join(stylesFolderPath, file);
    const styleContent = await fs.promises.readFile(filePath);
    stylesArray.push(styleContent);
  }

  await fs.promises.writeFile(bundleFilePath, stylesArray.join('\n'));
}

compileStyles();

const srcDirectoryAssets = path.join(__dirname, 'assets');
const destDirectoryAssets = path.join(__dirname, 'project-dist', 'assets');

makeDirectory(destDirectoryAssets);

async function copyDir(srcDir, destDir) {
  const files = await fs.promises.readdir(srcDir);
  const destFiles = await fs.promises.readdir(destDir);

  const filesToDelete = destFiles.filter((file) => !files.includes(file));
  filesToDelete.forEach((file) => {
    const filePathToDelete = path.join(destDir, file);
    fs.promises.unlink(filePathToDelete);
  });

  for (const file of files) {
    const srcFilePath = path.join(srcDir, file);
    const destFilePath = path.join(destDir, file);

    const stats = await fs.promises.stat(srcFilePath);

    if (stats.isDirectory()) {
      await makeDirectory(destFilePath);
      await copyDir(srcFilePath, destFilePath);
    } else {
      await fs.promises.copyFile(srcFilePath, destFilePath);
    }
  }
}

copyDir(srcDirectoryAssets, destDirectoryAssets);
