const fs = require('fs');
const path = require('path');

const jsonFilePath = path.join(__dirname, 'docs-map.json');
const mdxFiles = fs.readdirSync(path.join(__dirname, 'blogs/docs'));

const existingDocs = fs.existsSync(jsonFilePath) ? require(jsonFilePath) : [];
const updatedDocs = [];

mdxFiles.forEach((fileName) => {
  if (fileName.endsWith('.mdx')) {
    const docName = fileName.replace('.mdx', '');
    const existingDoc = existingDocs.find((doc) => doc.main === docName);

    if (existingDoc) {
      // Update existing documentation only if the file has changed
      const fileStats = fs.statSync(path.join(__dirname, 'blogs/docs', fileName));
      if (fileStats.mtime > new Date(existingDoc.updated)) {
        existingDoc.updated = fileStats.mtime.toISOString();
      }
      updatedDocs.push(existingDoc);
    } else {
      // Create new documentation entry
      updatedDocs.push({
        main: docName,
        updated: new Date().toISOString(),
      });
    }
  }
});

// Write the updated JSON back to the file
fs.writeFileSync(jsonFilePath, JSON.stringify(updatedDocs, null, 2));
