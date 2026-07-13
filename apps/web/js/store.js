const API = '';
let allProducts = [];
let activeFilter = 'all';
let searchQuery = '';
let currentSlide = 0;
let slideInterval;

const CATEGORY_LABELS = {
  apparel:'เสื้อทีม', trophy:'ถ้วยรางวัล', medal:'เหรียญรางวัล',
  wristband:'สายรัดข้อมือ', badge:'เข็มกลัด'
};
const CATEGORY_EMOJI = {
  apparel:'👕', trophy:'🏆', medal:'🏅', wristband:'⌚', badge:'📛'
};

function formatPrice(p) { return parseFloat(p.$numberDecimal||p).toLocaleString(); }

function productThumb(p) {
  if (p.image) {
    return `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">`;
  }
  return `<img src="assets/product-placeholder.svg" alt="ไม่มีรูป" style="width:100%;height:100%;object-fit:contain;">`;
}

function productModalImage(p) {
  if (p.image) {
    return `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:contain;background:#f8f8f8;">`;
  }
  return `<img src="assets/product-placeholder.svg" alt="ไม่มีรูป" style="width:80%;height:80%;object-fit:contain;">`;
}

async function init() {
  try {
    const res = await fetch(`${API}/api/products?active=true`);
    allProducts = await res.json();
    renderGrid();
  } catch(e) {
    document.getElementById('productGrid').innerHTML =
      '<div class="loading-text"><i class="fas fa-exclamation-circle"></i> ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้</div>';
  }
  startSlider();
}

// ── Slider ──
function startSlider() {
  slideInterval = setInterval(() => goSlide((currentSlide + 1) % 3), 5000);
}
function goSlide(n) {
  clearInterval(slideInterval);
  currentSlide = n;
  document.querySelectorAll('.slide').forEach((s,i) => s.classList.toggle('active', i===n));
  document.querySelectorAll('.slider-dot').forEach((d,i) => d.classList.toggle('active', i===n));
  startSlider();
}

// ── Mobile Nav ──
function toggleMobileNav() {
  document.querySelector('.nav-list').classList.toggle('open');
}

// ── Filter ──
function setFilter(cat) {
  activeFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.trim() === (cat === 'all' ? 'ทั้งหมด' : CATEGORY_LABELS[cat] || cat));
  });
  document.getElementById('sectionTitle').textContent =
    cat === 'all' ? 'สินค้าทั้งหมด' : CATEGORY_LABELS[cat] || cat;
  renderGrid();
  document.querySelector('.products-section').scrollIntoView({ behavior:'smooth' });
}

function handleSearch(val) {
  searchQuery = val.toLowerCase();
  document.getElementById('headerSearch').value = val;
  renderGrid();
}

// ── Render Grid ──
function renderGrid() {
  const grid = document.getElementById('productGrid');
  let filtered = allProducts;

  if (activeFilter !== 'all') {
    filtered = filtered.filter(p => p.category === activeFilter);
  }
  if (searchQuery) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchQuery) ||
      p.sku.toLowerCase().includes(searchQuery) ||
      (p.description && p.description.toLowerCase().includes(searchQuery))
    );
  }

  if (!filtered.length) {
    grid.innerHTML = '<div class="loading-text"><i class="fas fa-search"></i> ไม่พบสินค้า</div>';
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" onclick='openModal(${JSON.stringify(p).replace(/'/g,"&#39;")})'>
      <div class="card-thumb ${p.category}">
        ${productThumb(p)}
        <div class="card-badge">${CATEGORY_LABELS[p.category]||p.category}</div>
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <div class="card-sku">${p.sku}</div>
        <div class="card-desc">${p.description||''}</div>
        <div class="card-bottom">
          <div class="card-price">฿${formatPrice(p.base_price)} <small>/ ชิ้น</small></div>
          <button class="card-buy" onclick="event.stopPropagation(); alert('กรุณาติดต่อ 02-123-4567')">สั่งซื้อ</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ── Modal ──
function openModal(p) {
  const m = document.getElementById('productModal');
  const img = document.getElementById('modalImage');
  img.className = 'modal-image ' + p.category;
  img.innerHTML = productModalImage(p);
  document.getElementById('modalCategory').className = 'category-tag ' + p.category;
  document.getElementById('modalCategory').textContent = CATEGORY_LABELS[p.category]||p.category;
  document.getElementById('modalName').textContent = p.name;
  document.getElementById('modalSku').textContent = p.sku;
  document.getElementById('modalDesc').textContent = p.description||'';
  document.getElementById('modalPrice').textContent = '฿' + formatPrice(p.base_price);
  m.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('productModal')) {
    document.getElementById('productModal').style.display = 'none';
    document.body.style.overflow = '';
  }
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── Sticky Nav Shadow ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (nav) nav.style.boxShadow = window.scrollY > 100
    ? '0 4px 20px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.15)';
});

init();
