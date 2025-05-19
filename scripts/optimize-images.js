const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'public/assets');
const outputDir = path.join(__dirname, 'public/assets/optimized');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error('Error reading input directory:', err);
    return;
  }

  files.forEach((file) => {
    const inputFile = path.join(inputDir, file);
    const outputFile = path.join(outputDir, `${path.parse(file).name}.webp`);

    sharp(inputFile)
      .webp({ quality: 75 })
      .toFile(outputFile)
      .then(() => {
        console.warn(`Optimized: ${file} -> ${outputFile}`);
      })
      .catch((error) => {
        console.error(`Error optimizing ${file}:`, error);
      });
  });
});
