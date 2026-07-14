const API = '';
let currentUser = null;
let currentPage = 'login';
let products = [];
let orders = [];
let activeFilter = 'all';
let searchQuery = '';

const app = document.getElementById('app');

// T-shirt-only store: apparel is the primary category.
// Other categories (from legacy seeded data) fall back to their raw value.
const CATEGORY_LABELS = {
  apparel: 'เสื้อผ้า'
};
const STATUS_LABELS = {
  pending_review:'รอตรวจสอบ', processing:'กำลังดำเนินการ', printing_3d:'พิมพ์ 3D',
  shipped:'จัดส่งแล้ว', delivered:'จัดส่งสำเร็จ', cancelled:'ยกเลิก'
};

let authMode = 'login';

function formatPrice(p) { return parseFloat(p.$numberDecimal||p).toLocaleString(); }

function navigate(page) { currentPage = page; render(); }

function render() {
  if (!currentUser) {
    if (authMode === 'register') renderRegister();
    else renderLogin();
  }
  else if (currentPage === 'dashboard') renderDashboard();
  else if (currentPage === 'orders') renderOrders();
  else if (currentPage === 'products') renderProducts();
  else if (currentPage === 'users') renderUsers();
}

// ─── Login ───
function renderLogin() {
  app.innerHTML = `
    <div class="erp-login">
      <div class="erp-login-box">
        <div class="erp-login-brand">
          <span class="brand-mark">V</span>
          <span class="brand-name">VICTO</span>
        </div>
        <p class="sub">ระบบจัดการร้านค้า · ERP</p>
        <form id="loginForm">
          <div class="form-group"><label>อีเมล</label><input type="email" id="email" required></div>
          <div class="form-group"><label>รหัสผ่าน</label><input type="password" id="pwd" required></div>
          <button type="submit" class="btn btn-green" style="width:100%;justify-content:center;padding:14px">เข้าสู่ระบบ</button>
          <div id="errMsg" class="error-msg"></div>
          <p style="text-align:center;font-size:13px;margin-top:16px;cursor:pointer;color:var(--accent-2)" id="toRegister">ยังไม่มีบัญชี? สมัครสมาชิก</p>
        </form>
      </div>
    </div>`;
  document.getElementById('toRegister').addEventListener('click', () => {
    authMode = 'register';
    render();
  });
  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({email:document.getElementById('email').value, pwd:document.getElementById('pwd').value})
      });
      const d = await res.json();
      if (!res.ok) { document.getElementById('errMsg').textContent = d.error||'ล็อกอินไม่สำเร็จ'; return; }
      currentUser = d;
      localStorage.setItem('erp_user', JSON.stringify(d));
      navigate('dashboard');
    } catch { document.getElementById('errMsg').textContent = 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'; }
  });
}

// ─── Register ───
function renderRegister() {
  app.innerHTML = `
    <div class="erp-login">
      <div class="erp-login-box">
        <div class="erp-login-brand">
          <span class="brand-mark">V</span>
          <span class="brand-name">VICTO</span>
        </div>
        <p class="sub">สมัครสมาชิกใหม่</p>
        <form id="registerForm">
          <div class="form-group"><label>ชื่อผู้ใช้งาน</label><input type="text" id="regUsername" required></div>
          <div class="form-group"><label>อีเมล</label><input type="email" id="regEmail" required></div>
          <div class="form-group"><label>เบอร์โทรศัพท์</label><input type="tel" id="regPhone" required></div>
          <div class="form-group"><label>รหัสผ่าน</label><input type="password" id="regPwd" required></div>
          <button type="submit" class="btn btn-green" style="width:100%;justify-content:center;padding:14px">สมัครสมาชิก</button>
          <div id="errMsg" class="error-msg"></div>
          <p style="text-align:center;font-size:13px;margin-top:16px;cursor:pointer;color:var(--accent-2)" id="toLogin">มีบัญชีอยู่แล้ว? เข้าสู่ระบบ</p>
        </form>
      </div>
    </div>`;
  document.getElementById('toLogin').addEventListener('click', () => {
    authMode = 'login';
    render();
  });
  document.getElementById('registerForm').addEventListener('submit', async e => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          username: document.getElementById('regUsername').value,
          email: document.getElementById('regEmail').value,
          phone: document.getElementById('regPhone').value,
          pwd: document.getElementById('regPwd').value
        })
      });
      const d = await res.json();
      if (!res.ok) { document.getElementById('errMsg').textContent = d.error||'สมัครสมาชิกไม่สำเร็จ'; return; }
      currentUser = d;
      localStorage.setItem('erp_user', JSON.stringify(d));
      authMode = 'login';
      navigate('dashboard');
    } catch { document.getElementById('errMsg').textContent = 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'; }
  });
}

function logout() { currentUser=null; localStorage.removeItem('erp_user'); authMode='login'; navigate('login'); }

function renderNav() {
  return `
    <nav class="erp-nav">
      <div class="erp-nav-brand"><span class="brand-mark">V</span> VICTO<small>ERP</small></div>
      <div class="erp-nav-links">
        <button class="${currentPage==='dashboard'?'active':''}" onclick="navigate('dashboard')">ภาพรวม</button>
        <button class="${currentPage==='orders'?'active':''}" onclick="navigate('orders')">คำสั่งซื้อ</button>
        <button class="${currentPage==='products'?'active':''}" onclick="navigate('products')">สินค้า</button>
        <button class="${currentPage==='users'?'active':''}" onclick="navigate('users')">ผู้ใช้</button>
      </div>
      <div class="erp-nav-right">
        <span class="user-name"><i class="fas fa-user-circle"></i> ${currentUser.username}</span>
        <a href="index.html"><i class="fas fa-store"></i> หน้าร้าน</a>
        <button onclick="logout()"><i class="fas fa-sign-out-alt"></i> ออก</button>
      </div>
    </nav>`;
}

// ─── Dashboard ───
async function renderDashboard() {
  app.innerHTML = renderNav() + '<div class="erp-content loading">กำลังโหลด...</div>';
  try {
    const res = await fetch(`${API}/api/dashboard/stats`);
    const s = await res.json();
    app.innerHTML = renderNav() + `
      <div class="erp-content">
        <div class="page-header"><h2>ภาพรวมระบบ</h2><p>สถิติร้านค้า ณ ปัจจุบัน</p></div>
        <div class="stat-cards">
          <div class="stat-card"><div class="label">สินค้า</div><div class="value">${s.totalProducts}</div></div>
          <div class="stat-card"><div class="label">คำสั่งซื้อ</div><div class="value">${s.totalOrders}</div></div>
          <div class="stat-card"><div class="label">ลูกค้า</div><div class="value">${s.totalUsers}</div></div>
          <div class="stat-card revenue"><div class="label">รายได้</div><div class="value">฿${s.totalRevenue.toLocaleString()}</div></div>
        </div>
        <div class="page-header"><h2>สถานะคำสั่งซื้อ</h2></div>
        <div class="stat-cards">
          ${Object.entries(STATUS_LABELS).map(([k,v]) => `
            <div class="stat-card"><div class="label">${v}</div><div class="value">${s.ordersByStatus[k]||0}</div></div>
          `).join('')}
        </div>
      </div>`;
  } catch(e) { app.innerHTML = renderNav() + '<div class="erp-content empty-state">เกิดข้อผิดพลาด</div>'; }
}

// ─── Orders ───
async function renderOrders() {
  app.innerHTML = renderNav() + '<div class="erp-content loading">กำลังโหลด...</div>';
  try {
    const res = await fetch(`${API}/api/orders`);
    orders = await res.json();
    app.innerHTML = renderNav() + `
      <div class="erp-content">
        <div class="page-header"><h2>คำสั่งซื้อ</h2><p>จัดการคำสั่งซื้อทั้งหมด</p></div>
        <div class="toolbar">
          <input class="search-input" placeholder="ค้นหาเลขที่ / ชื่อลูกค้า..." oninput="filterOrdersTable()">
          <button class="btn btn-green" onclick="exportCSV()">Export CSV</button>
        </div>
        <div class="table-wrap"><div class="table-scroll"><table>
          <thead><tr><th>เลขที่</th><th>ลูกค้า</th><th>สถานะ</th><th>ยอดสุทธิ</th><th>ชำระเงิน</th><th>วันที่</th><th>จัดการ</th></tr></thead>
          <tbody id="orderTbody"></tbody>
        </table></div></div>
      </div>`;
    renderOrderRows(orders);
  } catch(e) { app.innerHTML = renderNav() + '<div class="erp-content empty-state">เกิดข้อผิดพลาด</div>'; }
}

function renderOrderRows(data) {
  const tb = document.getElementById('orderTbody');
  if (!data.length) { tb.innerHTML = '<tr><td colspan="7" class="empty-state">ไม่พบคำสั่งซื้อ</td></tr>'; return; }
  tb.innerHTML = data.map(o => `
    <tr>
      <td><strong>${o.order_number}</strong></td>
      <td>${o.customer_snapshot.username}</td>
      <td><span class="badge ${o.order_status}">${STATUS_LABELS[o.order_status]||o.order_status}</span></td>
      <td>฿${formatPrice(o.financials.net_amount)}</td>
      <td><span class="badge ${o.financials.payment_status}">${o.financials.payment_status}</span></td>
      <td>${new Date(o.create_at).toLocaleDateString('th-TH')}</td>
      <td><button class="btn btn-gray" onclick='showOrderDetail("${o._id}")'>ดู</button></td>
    </tr>`).join('');
}

function filterOrdersTable() {
  const q = document.querySelector('.search-input').value.toLowerCase();
  renderOrderRows(orders.filter(o =>
    o.order_number.toLowerCase().includes(q) || o.customer_snapshot.username.toLowerCase().includes(q)
  ));
}

function showOrderDetail(id) {
  const o = orders.find(x => x._id === id);
  if (!o) return;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
  overlay.innerHTML = `
    <div class="modal-box">
      <button class="close-x" onclick="this.closest('.modal-overlay').remove()">&times;</button>
      <h3>${o.order_number}</h3>
      <p style="font-size:13px;color:#888;margin-bottom:12px">ลูกค้า: ${o.customer_snapshot.username} (${o.customer_snapshot.email})</p>
      <p style="font-size:13px;margin-bottom:4px">สถานะ: <span class="badge ${o.order_status}">${STATUS_LABELS[o.order_status]}</span></p>
      <p style="font-size:13px;margin-bottom:4px">ชำระเงิน: <span class="badge ${o.financials.payment_status}">${o.financials.payment_status}</span></p>
      <p style="font-size:13px;margin-bottom:12px">ยอดสุทธิ: ฿${formatPrice(o.financials.net_amount)}</p>
      <p style="font-size:13px;margin-bottom:12px">ที่อยู่จัดส่ง: ${o.shipping_address_snapshot.recipient_name} ${o.shipping_address_snapshot.address_line1} ${o.shipping_address_snapshot.province} ${o.shipping_address_snapshot.postal_code}</p>
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:12px">
        <thead><tr><th style="text-align:left;padding:6px">สินค้า</th><th style="padding:6px">จำนวน</th><th style="padding:6px">สถานะตรวจสอบ</th></tr></thead>
        <tbody>${o.items.map(i => `
          <tr style="border-bottom:1px solid #eee">
            <td style="padding:8px 6px">
              <strong>${i.product_name}</strong>
              ${i.customization ? `
                <div style="margin-top:6px;font-size:11px;color:#666;line-height:1.4">
                  ${i.customization.selected_size ? `<div><strong>ขนาด:</strong> ${i.customization.selected_size}</div>` : ''}
                  ${i.customization.custom_text && i.customization.custom_text !== 'None' ? `<div><strong>ข้อความ:</strong> ${i.customization.custom_text}</div>` : ''}
                  ${i.customization.additional_note ? `<div><strong>โน้ต:</strong> ${i.customization.additional_note}</div>` : ''}
                </div>
              ` : ''}
            </td>
            <td style="text-align:center;padding:8px 6px">${i.quantity}</td>
            <td style="text-align:center;padding:8px 6px">
              <span class="badge ${i.verify_status==='approved'?'delivered':i.verify_status==='pending'?'pending':'cancelled'}">${i.verify_status}</span>
            </td>
          </tr>
          ${i.customization && i.customization.uploaded_image_url ? `
            <tr>
              <td colspan="3" style="padding:10px 6px;background:#f9f9f9;text-align:center;border-bottom:1px solid #ddd">
                <div style="font-weight:bold;font-size:11px;margin-bottom:6px;color:#444">ลายสกรีนที่ลูกค้าออกแบบ (Design Preview):</div>
                <img src="${i.customization.uploaded_image_url}" style="max-height:180px;max-width:100%;object-fit:contain;border:1px solid #ccc;padding:4px;background:#fff;border-radius:4px" />
              </td>
            </tr>
          ` : ''}
        `).join('')}
        </tbody>
      </table>
    </div>`;
  document.body.appendChild(overlay);
}

function exportCSV() {
  const headers = ['เลขที่','ลูกค้า','อีเมล','สถานะ','ยอดรวม','ค่าส่ง','ยอดสุทธิ','ชำระเงิน','วันที่'];
  const rows = orders.map(o => [
    o.order_number, o.customer_snapshot.username, o.customer_snapshot.email,
    STATUS_LABELS[o.order_status],
    formatPrice(o.financials.total_amount), formatPrice(o.financials.shipping_fee),
    formatPrice(o.financials.net_amount), o.financials.payment_status,
    new Date(o.create_at).toLocaleDateString('th-TH')
  ]);
  const csv = [headers,...rows].map(r=>r.join(',')).join('\n');
  const blob = new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `orders_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
}

// ─── Products ───
async function renderProducts() {
  app.innerHTML = renderNav() + '<div class="erp-content loading">กำลังโหลด...</div>';
  try {
    const res = await fetch(`${API}/api/products`);
    products = await res.json();
    app.innerHTML = renderNav() + `
      <div class="erp-content">
        <div class="page-header"><h2>สินค้า</h2><p>รายการสินค้าทั้งหมด</p></div>
        <div class="toolbar">
          <input class="search-input" placeholder="ค้นหาสินค้า..." oninput="filterProductsTable()">
          <button class="btn btn-gray" onclick="exportProductsCSV()">Export CSV</button>
        </div>
        <div class="table-wrap"><table>
          <thead><tr><th></th><th>SKU</th><th>ชื่อ</th><th>หมวดหมู่</th><th>ราคา</th><th>สถานะ</th></tr></thead>
          <tbody id="productTbody"></tbody>
        </table></div>
      </div>`;
    renderProductRows(products);
  } catch(e) { app.innerHTML = renderNav() + '<div class="erp-content empty-state">เกิดข้อผิดพลาด</div>'; }
}

function renderProductRows(data) {
  const tb = document.getElementById('productTbody');
  if (!data.length) { tb.innerHTML = '<tr><td colspan="6" class="empty-state">ไม่พบสินค้า</td></tr>'; return; }
  tb.innerHTML = data.map(p => `
    <tr>
      <td>${p.image ? `<img src="${p.image}" style="width:40px;height:40px;object-fit:cover;border-radius:4px;">` : `<img src="assets/product-placeholder.svg" style="width:40px;height:40px;object-fit:contain;border-radius:4px;">`}</td>
      <td><strong>${p.sku}</strong></td>
      <td>${p.name}</td>
      <td><span class="badge ${p.category}">${CATEGORY_LABELS[p.category]||p.category}</span></td>
      <td>฿${formatPrice(p.base_price)}</td>
      <td>${p.is_active ? '<span class="badge delivered">เปิดขาย</span>' : '<span class="badge cancelled">ปิดขาย</span>'}</td>
    </tr>`).join('');
}

function filterProductsTable() {
  const q = document.querySelector('.search-input').value.toLowerCase();
  renderProductRows(products.filter(p =>
    p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
  ));
}

function exportProductsCSV() {
  const headers = ['SKU','ชื่อ','หมวดหมู่','ราคา','สถานะ'];
  const rows = products.map(p => [
    p.sku, p.name, CATEGORY_LABELS[p.category]||p.category,
    formatPrice(p.base_price), p.is_active?'เปิดขาย':'ปิดขาย'
  ]);
  const csv = [headers,...rows].map(r=>r.join(',')).join('\n');
  const blob = new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `products_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
}

// ─── Users ───
async function renderUsers() {
  app.innerHTML = renderNav() + '<div class="erp-content loading">กำลังโหลด...</div>';
  try {
    const res = await fetch(`${API}/api/users`);
    const users = await res.json();
    app.innerHTML = renderNav() + `
      <div class="erp-content">
        <div class="page-header"><h2>ผู้ใช้งาน</h2><p>รายชื่อผู้ใช้ในระบบ</p></div>
        <div class="table-wrap"><table>
          <thead><tr><th>ชื่อผู้ใช้</th><th>อีเมล</th><th>เบอร์โทร</th><th>สิทธิ์</th></tr></thead>
          <tbody>${users.map(u => `
            <tr>
              <td><strong>${u.username}</strong></td>
              <td>${u.email}</td>
              <td>${u.phone}</td>
              <td>${u.roles.map(r => `<span class="badge ${r}">${r}</span>`).join(' ')}</td>
            </tr>`).join('')}
          </tbody>
        </table></div>
      </div>`;
  } catch(e) { app.innerHTML = renderNav() + '<div class="erp-content empty-state">เกิดข้อผิดพลาด</div>'; }
}

// ─── Init ───
const saved = localStorage.getItem('erp_user');
if (saved) { currentUser = JSON.parse(saved); navigate('dashboard'); }
else render();
