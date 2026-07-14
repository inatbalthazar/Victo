require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  // ── Existing products (Thai) ──
  {
    sku: 'APP-COT-001',
    name: 'เสื้อยืดคอกลมผ้า Cotton 100% เกรดพรีเมียม',
    category: 'apparel',
    base_price: '120.00',
    description: 'เสื้อยืดเปล่าทรง Unisex เนื้อผ้านุ่ม ระบายอากาศได้ดี เหมาะสำหรับงานสกรีนและปักโลโก้ทีม',
    image: 'https://files.cdn.printful.com/m/comfortcolors_1717/medium/mens/front/positioning/05_cc1717_onman_front_base_whitebg.png',
    is_active: true
  },
  {
    sku: 'APP-POL-002',
    name: 'เสื้อโปโลผ้า Kanoko จั๊มพ์แขน',
    category: 'apparel',
    base_price: '250.00',
    description: 'เสื้อโปโลมีปก เนื้อผ้าอยู่ทรง ไม่ย้วยง่าย เหมาะสำหรับทำเสื้อฟอร์มพนักงานและงานอีเวนต์บริษัท',
    image: 'https://files.cdn.printful.com/products/71/5309_1581412541.jpg',
    is_active: true
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert all products
    const result = await Product.insertMany(products);
    console.log(`Seeded ${result.length} products`);

    // Print summary
    const categories = {};
    result.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    console.log('By category:', categories);

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
