const fs = require('fs');
const path = require('path');

const docsDirectory = path.join(__dirname, 'docs');
const jsonFilePath = path.join(__dirname, 'docs-map.json');

if (!fs.existsSync(docsDirectory)) {
  fs.mkdirSync(docsDirectory, { recursive: true });
}

const subDirectories = fs.readdirSync(docsDirectory).filter((subDir) => {
  return fs.statSync(path.join(docsDirectory, subDir)).isDirectory();
});

if (subDirectories.length > 0) {
  const existingDocs = fs.existsSync(jsonFilePath) ? require(jsonFilePath) : [];
  const updatedDocs = [];

  subDirectories.forEach((subDir) => {
    const subDirPath = path.join(docsDirectory, subDir);
    const mdxFiles = fs.readdirSync(subDirPath);

    mdxFiles.forEach((fileName) => {
      if (fileName.endsWith('.mdx')) {
        const docName = fileName.replace('.mdx', '');
        const existingDoc = existingDocs.find((doc) => doc.main === subDir);

        if (existingDoc) {
          // Update existing documentation only if the file has changed
          const fileStats = fs.statSync(path.join(subDirPath, fileName));
          if (fileStats.mtime > new Date(existingDoc.updated)) {
            existingDoc.updated = fileStats.mtime.toISOString();
          }
          if (!existingDoc.sub.includes(docName)) {
            existingDoc.sub.push(docName);
          }
          updatedDocs.push(existingDoc);
        } else {
          // Create new documentation entry
          updatedDocs.push({
            main: subDir,
            sub: [docName],
            date: new Date().toISOString(),
            updated: new Date().toISOString(),
          });
        }
      }
    });
  });

  // Write the updated JSON back to the file
  fs.writeFileSync(jsonFilePath, JSON.stringify(updatedDocs, null, 2));
} else {
  console.log('No MDX files found in the "docs" directory.');
}
