const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

const assetsDir = path.join(__dirname, '../web/assets');

const files = [
  'mockup-tee_front.png',
  'mockup-tee_back.png',
  'mockup-sweatshirt-front.png',
  'mockup-sweatshirt-back.png',
  'mockup-hoodie-front.png',
  'mockup-hoodie-back.png'
];

async function processFile(filename) {
  const filepath = path.join(assetsDir, filename);
  if (!fs.existsSync(filepath)) {
    console.log(`File not found: ${filename}`);
    return;
  }

  console.log(`Processing: ${filename}`);
  const image = await Jimp.read(filepath);
  
  // Get background color from top-left pixel (0, 0) directly from raw bitmap buffer
  const rBg = image.bitmap.data[0];
  const gBg = image.bitmap.data[1];
  const bBg = image.bitmap.data[2];

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];

    const dist = Math.sqrt((r - rBg) ** 2 + (g - gBg) ** 2 + (b - bBg) ** 2);

    // Wide distance threshold to clear out shadows and vignetting in the background
    if (dist < 55) {
      this.bitmap.data[idx + 3] = 0; // fully transparent background
    } else if (dist < 75) {
      // Smooth fade transition
      const alpha = Math.round((dist - 55) / 20 * 255);
      this.bitmap.data[idx + 3] = alpha;
    } else {
      // It is the shirt! Enhance contrast by applying a gamma curve (gamma = 1.25)
      // This deepens the fabric folds/shadows, making colors look much richer and deeper
      const rVal = this.bitmap.data[idx + 0];
      const gVal = this.bitmap.data[idx + 1];
      const bVal = this.bitmap.data[idx + 2];

      this.bitmap.data[idx + 0] = Math.max(0, Math.min(255, Math.pow(rVal / 255, 1.25) * 255));
      this.bitmap.data[idx + 1] = Math.max(0, Math.min(255, Math.pow(gVal / 255, 1.25) * 255));
      this.bitmap.data[idx + 2] = Math.max(0, Math.min(255, Math.pow(bVal / 255, 1.25) * 255));
    }
  });

  await image.write(filepath);
  console.log(`Successfully converted ${filename} to transparent PNG!`);
}

async function run() {
  for (const f of files) {
    await processFile(f);
  }
}

run().catch(console.error);
