const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

const assetsDir = path.join(__dirname, '../web/assets');

const files = [
  { src: 'mockup-tee_front.png', dest: 'mockup-tee_front_black.png' },
  { src: 'mockup-tee_back.png', dest: 'mockup-tee_back_black.png' },
  { src: 'mockup-sweatshirt-front.png', dest: 'mockup-sweatshirt-front_black.png' },
  { src: 'mockup-sweatshirt-back.png', dest: 'mockup-sweatshirt-back_black.png' },
  { src: 'mockup-hoodie-front.png', dest: 'mockup-hoodie-front_black.png' },
  { src: 'mockup-hoodie-back.png', dest: 'mockup-hoodie-back_black.png' }
];

async function processFile({ src, dest }) {
  const srcPath = path.join(assetsDir, src);
  const destPath = path.join(assetsDir, dest);
  if (!fs.existsSync(srcPath)) {
    console.log(`Source file not found: ${src}`);
    return;
  }

  console.log(`Generating black mockup: ${dest} from ${src}`);
  const image = await Jimp.read(srcPath);

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    const a = this.bitmap.data[idx + 3];

    if (a > 0) {
      // Calculate brightness
      const v = (r + g + b) / 3;
      let vNew = 0;
      
      if (v < 130) {
        // Deep shadow transition (map 0-130 to 2-14)
        vNew = Math.round(2 + (v / 130) * 12);
      } else {
        // Midtone and Highlights transition (map 130-255 to 14-85 for rich deep black shadows and subtle highlights)
        const ratio = (v - 130) / 125;
        vNew = Math.round(14 + Math.pow(ratio, 1.6) * 71);
      }

      this.bitmap.data[idx + 0] = Math.max(0, Math.min(255, vNew));
      this.bitmap.data[idx + 1] = Math.max(0, Math.min(255, vNew));
      this.bitmap.data[idx + 2] = Math.max(0, Math.min(255, vNew));
    }
  });

  await image.write(destPath);
  console.log(`Successfully created ${dest}!`);
}

async function run() {
  for (const item of files) {
    await processFile(item);
  }
}

run().catch(console.error);
