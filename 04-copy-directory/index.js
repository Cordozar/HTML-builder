const fsPromises = require('node:fs/promises');
const path = require('node:path');

const srcDirectory = path.join(__dirname, 'files');
const destDirectory = path.join(__dirname, 'files-copy');

async function makeDestDirectory() {
  await fsPromises.mkdir(destDirectory, {
    recursive: true,
  });
}

makeDestDirectory();

async function copyDir(srcDir, destDir) {
  const files = await fsPromises.readdir(srcDir);
  const destFiles = await fsPromises.readdir(destDir);

  const filesToDelete = destFiles.filter((file) => !files.includes(file));
  filesToDelete.forEach((file) => {
    const filePathToDelete = path.join(destDir, file);
    fsPromises.unlink(filePathToDelete);
  });

  files.forEach((file) => {
    const srcFilePath = path.join(srcDir, file);
    const destFilePath = path.join(destDir, file);

    fsPromises.copyFile(srcFilePath, destFilePath);
  });
}

copyDir(srcDirectory, destDirectory);
