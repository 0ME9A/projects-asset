const fs = require('fs');
const path = require('path');

const docsDirectory = path.join(__dirname, 'blogs/docs');
const jsonFilePath = path.join(__dirname, 'docs-map.json');

if (!fs.existsSync(docsDirectory)) {
  fs.mkdirSync(docsDirectory, { recursive: true });
}

const mdxFiles = fs.readdirSync(docsDirectory);

if (mdxFiles.length > 0) {
  const existingDocs = fs.existsSync(jsonFilePath) ? require(jsonFilePath) : [];
  const updatedDocs = [];

  mdxFiles.forEach((fileName) => {
    if (fileName.endsWith('.mdx')) {
      const docName = fileName.replace('.mdx', '');
      const existingDoc = existingDocs.find((doc) => doc.main === docName);

      if (existingDoc) {
        // Update existing documentation only if the file has changed
        const fileStats = fs.statSync(path.join(docsDirectory, fileName));
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
} else {
  console.log('No MDX files found in the "docs" directory.');
}
