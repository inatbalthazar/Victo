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
    image: '',
    is_active: true
  },
  {
    sku: 'APP-POL-002',
    name: 'เสื้อโปโลผ้า Kanoko จั๊มพ์แขน',
    category: 'apparel',
    base_price: '250.00',
    description: 'เสื้อโปโลมีปก เนื้อผ้าอยู่ทรง ไม่ย้วยง่าย เหมาะสำหรับทำเสื้อฟอร์มพนักงานและงานอีเวนต์บริษัท',
    image: '',
    is_active: true
  },
  {
    sku: 'TRO-CRY-001',
    name: 'ถ้วยรางวัลคริสตัลโมเดลทรงดาวเกียรติยศ',
    category: 'trophy',
    base_price: '1500.00',
    description: 'ถ้วยรางวัลคริสตัลแท้เล่นแสงไฟ ฐานอะคริลิกดำหนา เหมาะสำหรับรางวัลพนักงานดีเด่นหรือการแข่งขันทางการ',
    image: '',
    is_active: true
  },
  {
    sku: 'TRO-PLA-002',
    name: 'โมเดลถ้วยรางวัลโมเดิร์น (3D Printing Custom)',
    category: 'trophy',
    base_price: '850.00',
    description: 'โมเดลฐานพลาสติกรูปทรงฟรีฟอร์ม เหมาะสำหรับขึ้นงานคัสตอมด้วยเครื่องพิมพ์สามมิติตามแบบลูกค้า',
    image: '',
    is_active: true
  },
  {
    sku: 'MED-GLD-001',
    name: 'เหรียญรางวัลโลหะซิงค์อัลลอย ชุบทองเงา',
    category: 'medal',
    base_price: '65.00',
    description: 'เหรียญรางวัลขนาดมาตรฐาน 6 ซม. พื้นผิวเรียบเงา พร้อมพื้นที่วงกลมสำหรับติดสติกเกอร์หรือหยอดเรซินโลโก้',
    image: '',
    is_active: true
  },
  {
    sku: 'MED-SLV-002',
    name: 'เหรียญรางวัลสปอร์ต ชุบเงินรมดำ',
    category: 'medal',
    base_price: '60.00',
    description: 'เหรียญรางวัลลวดลายไดคัทสำเร็จรูป สไตล์คลาสสิก แข็งแรงทนทาน ไม่เป็นสนิมง่าย',
    image: '',
    is_active: true
  },
  {
    sku: 'WRB-SIL-001',
    name: 'สายรัดข้อมือซิลิโคนปั๊มจม (Silicone Wristband)',
    category: 'wristband',
    base_price: '15.00',
    description: 'ริสต์แบนด์ซิลิโคนแท้ 100% ยืดหยุ่นสูง ทนน้ำทนความร้อน รองรับการปั๊มลึกลงเนื้อผิวตามฟอนต์ที่เลือก',
    image: '',
    is_active: true
  },
  {
    sku: 'WRB-GLW-002',
    name: 'สายรัดข้อมือซิลิโคนเรืองแสง (Glow in the Dark)',
    category: 'wristband',
    base_price: '25.00',
    description: 'ริสต์แบนด์เนื้อพิเศษสามารถเรืองแสงสีเขียว/ฟ้าได้ในที่มืด เหมาะสำหรับงานปาร์ตี้ คอนเสิร์ต และมินิมาราธอนกลางคืน',
    image: '',
    is_active: true
  },
  {
    sku: 'BDG-TIN-001',
    name: 'เข็มกลัดวงกลมฝาเหล็ก ขนาด 5.8 ซม.',
    category: 'badge',
    base_price: '12.00',
    description: 'เข็มกลัดด้านหลังเป็นพินโลหะ ด้านหน้าหุ้มพลาสติกใสกันน้ำ ลายพิมพ์สีสดคมชัด เหมาะสำหรับทำของแจกแฟนคลับ',
    image: '',
    is_active: true
  },
  {
    sku: 'BDG-MAG-002',
    name: 'เข็มกลัดแม่เหล็กสี่เหลี่ยมผืนผ้า',
    category: 'badge',
    base_price: '45.00',
    description: 'ป้ายชื่อเข็มกลัดแบบแถบแม่เหล็กแรงดึงดูดสูง ไม่ทำลายเนื้อผ้าเสื้อสูท เหมาะสำหรับงานป้ายชื่อผู้บริหารและพนักงานต้อนรับ',
    image: '',
    is_active: false
  },

  // ── Trophy Outlet Corporate Glass & Crystal ──
  {
    sku: 'CRY-KTCRY18',
    name: 'Cube Crystal',
    category: 'trophy',
    base_price: '1399.00',
    description: 'คริสตัลทรงลูกบาศก์ สมบูรณ์แบบสำหรับรางวัลหรือกระดาษทับ สามารถวางบนโต๊ะทำงานหรือชั้นวาง พร้อมสลักชื่อฟรี',
    image: 'https://cdn11.bigcommerce.com/s-tih4rs/images/stencil/500x659/products/2051/11491/CRYSTAL_CUBES-1__46968.1768677632.png?c=2',
    is_active: true
  },
  {
    sku: 'CRY-PTG-EMP',
    name: 'Employee Service Award',
    category: 'trophy',
    base_price: '4374.00',
    description: 'รางวัลบริการพนักงาน ทรงเพชรสง่างาม 2 ขนาด ฐานโรสewood พร้อมสลักชื่อฟรี เหมาะสำหรับงานมอบรางวัลพนักงานดีเด่น',
    image: 'https://cdn11.bigcommerce.com/s-tih4rs/images/stencil/500x659/products/3191/12993/EMPLOYEE_SERVICE_AWARD__49520.1782243290.png?c=2',
    is_active: true
  },
  {
    sku: 'CRY-KTCRY1819',
    name: 'Crystal Block on Black Crystal Base',
    category: 'trophy',
    base_price: '3499.00',
    description: 'บล็อกคริสตัลบนฐานคริสตัลสีดำ พร้อมสลักชื่อบนคริสตัลหรือแผ่นจารึกบนฐาน ออกแบบเรียบหรู สมศักดิ์ศรี',
    image: 'https://cdn11.bigcommerce.com/s-tih4rs/images/stencil/500x659/products/3057/12460/CRY1819__73459.1765821616.png?c=2',
    is_active: true
  },
  {
    sku: 'CRY-PTG7',
    name: 'Prestige Diamond Glass Award',
    category: 'trophy',
    base_price: '4374.00',
    description: 'รางวัลกระจกทรงเพชร Prestige 2 ขนาด ฐาน Rosewood Piano Finish สง่างาม เหมาะสำหรับมอบผู้บริหารและพนักงานดีเด่น',
    image: 'https://cdn11.bigcommerce.com/s-tih4rs/images/stencil/500x659/products/2061/11956/PTG71__77910.1766145573.png?c=2',
    is_active: true
  },
  {
    sku: 'CRY-CE551',
    name: 'Clipped Crystal Edge Glass Award',
    category: 'trophy',
    base_price: '3499.00',
    description: 'รางวัลกระจกคริสตัลขอบตัด ดีไซน์ทันสมัย แสงสะท้อนสวยงาม พร้อมสลักชื่อฟรี เหมาะสำหรับมอบรางวัลในองค์กร',
    image: 'https://cdn11.bigcommerce.com/s-tih4rs/images/stencil/500x659/products/2057/11496/CLIPPED_CRYSTAL_EDGE_GLASS_AWARDS-1__90991.1768649084.png?c=2',
    is_active: true
  },
  {
    sku: 'CRY-KTCE550',
    name: 'Crystal Edge Glass Award',
    category: 'trophy',
    base_price: '2799.00',
    description: 'รางวัลกระจกคริสตัลขอบ ราคาประหยัด คุณภาพดี พร้อมสลักชื่อฟรี เหมาะสำหรับรางวัลประจำเดือนหรือรางวัลชมเชย',
    image: 'https://cdn11.bigcommerce.com/s-tih4rs/images/stencil/500x659/products/2056/11955/CE5501-03__78793.1768720691.png?c=2',
    is_active: true
  },
  {
    sku: 'CRY-KTCRY181',
    name: 'Crystal Block',
    category: 'trophy',
    base_price: '1749.00',
    description: 'บล็อกคริสตัล 3 ขนาด ราคาประหยัด ใช้เป็นรางวัลหรือกระดาษทับ พร้อมสลักชื่อฟรี จัดส่งเร็ว',
    image: 'https://cdn11.bigcommerce.com/s-tih4rs/images/stencil/500x659/products/2055/11480/CRY181__67573.1768860920.jpg?c=2',
    is_active: true
  },
  {
    sku: 'CRY-KTCRY6924M',
    name: '5 Rising Diamond Crystal',
    category: 'trophy',
    base_price: '6999.00',
    description: 'คริสตัลทรง 5 ยอด Diamond ที่ไม่เหมือนใคร พร้อมสลักชื่อฟรี ไม่มีค่าใช้จ่ายเพิ่ม เหมาะสำหรับรางวัลเกียรติยศสูงสุด',
    image: 'https://cdn11.bigcommerce.com/s-tih4rs/images/stencil/500x659/products/2054/11479/KTCRY6924M__47886.1766142964.png?c=2',
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
