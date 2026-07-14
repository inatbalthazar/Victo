const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

const assetsDir = path.join(__dirname, '../web/assets');

const files = [
  { src: 'mockup-tee_front.png', dest: 'mockup-tee_front_mask.png' },
  { src: 'mockup-tee_back.png', dest: 'mockup-tee_back_mask.png' },
  { src: 'mockup-sweatshirt-front.png', dest: 'mockup-sweatshirt-front_mask.png' },
  { src: 'mockup-sweatshirt-back.png', dest: 'mockup-sweatshirt-back_mask.png' },
  { src: 'mockup-hoodie-front.png', dest: 'mockup-hoodie-front_mask.png' },
  { src: 'mockup-hoodie-back.png', dest: 'mockup-hoodie-back_mask.png' }
];

async function processFile({ src, dest }) {
  const srcPath = path.join(assetsDir, src);
  const destPath = path.join(assetsDir, dest);
  if (!fs.existsSync(srcPath)) {
    console.log(`Source file not found: ${src}`);
    return;
  }

  console.log(`Generating solid silhouette mask: ${dest} from ${src}`);
  const image = await Jimp.read(srcPath);

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const a = this.bitmap.data[idx + 3];

    if (a > 10) {
      // Solid black silhouette inside the shirt shape
      this.bitmap.data[idx + 0] = 0;
      this.bitmap.data[idx + 1] = 0;
      this.bitmap.data[idx + 2] = 0;
      this.bitmap.data[idx + 3] = 255;
    } else {
      // Fully transparent outside the shirt shape
      this.bitmap.data[idx + 0] = 0;
      this.bitmap.data[idx + 1] = 0;
      this.bitmap.data[idx + 2] = 0;
      this.bitmap.data[idx + 3] = 0;
    }
  });

  await image.write(destPath);
  console.log(`Successfully created mask: ${dest}!`);
}

async function run() {
  for (const item of files) {
    await processFile(item);
  }
}

run().catch(console.error);
