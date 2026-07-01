const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const logosDir = path.join(__dirname, '..', 'public', 'logos');
const outDir = logosDir; // overwrite next to originals

const targets = [
  { suffix: '-lg', width: 1920 },
  { suffix: '-md', width: 1280 },
  { suffix: '-sm', width: 800 },
];

(async () => {
  const files = fs.readdirSync(logosDir).filter(f => /\.(jpe?g|png)$/i.test(f));
  for (const file of files) {
    const filePath = path.join(logosDir, file);
    const name = path.parse(file).name;
    try {
      for (const t of targets) {
        const outBase = path.join(outDir, `${name}${t.suffix}`);
        await sharp(filePath)
          .resize({ width: t.width })
          .webp({ quality: 80 })
          .toFile(`${outBase}.webp`);
        await sharp(filePath)
          .resize({ width: t.width })
          .avif({ quality: 50 })
          .toFile(`${outBase}.avif`);
      }
      console.log(`Optimized ${file}`);
    } catch (err) {
      console.error(`Failed ${file}:`, err.message);
    }
  }
})();
