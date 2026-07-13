/* ============================================
   CUSTOM SHIRT DESIGNER - Interactive Logic
   ============================================ */

// State
const state = {
  style: 'tee',
  shirtColor: '#2d3436',
  textColor: '#ffffff',
  teamName: 'TEAM NAME',
  playerName: 'PLAYER',
  number: 10,
  logo: null,
  side: 'front',
  pricePerShirt: 120,
};

// ---- Side toggle ----
function showSide(side) {
  state.side = side;
  document.getElementById('jerseyFront').style.display = side === 'front' ? 'flex' : 'none';
  document.getElementById('jerseyBack').style.display = side === 'back' ? 'flex' : 'none';
  document.querySelectorAll('.preview-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
}

// ---- Style selection ----
function selectStyle(style, btn) {
  state.style = style;
  document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const collar = document.getElementById('jerseyCollar');
  const heroCollar = document.querySelector('.hero-jersey-collar');

  switch (style) {
    case 'polo':
      collar.style.height = '22px';
      collar.style.borderRadius = '0 0 8px 8px';
      if (heroCollar) { heroCollar.style.height = '22px'; heroCollar.style.borderRadius = '0 0 8px 8px'; }
      break;
    case 'tank':
      collar.style.height = '12px';
      collar.style.borderRadius = '0 0 20px 20px';
      if (heroCollar) { heroCollar.style.height = '12px'; heroCollar.style.borderRadius = '0 0 20px 20px'; }
      document.querySelector('.jersey-sleeve-l').style.display = 'none';
      document.querySelector('.jersey-sleeve-r').style.display = 'none';
      if (document.querySelector('.hero-jersey-sleeve-l')) document.querySelector('.hero-jersey-sleeve-l').style.display = 'none';
      if (document.querySelector('.hero-jersey-sleeve-r')) document.querySelector('.hero-jersey-sleeve-r').style.display = 'none';
      return;
    case 'longsleeve':
      collar.style.height = '16px';
      collar.style.borderRadius = '0 0 24px 24px';
      if (heroCollar) { heroCollar.style.height = '16px'; heroCollar.style.borderRadius = '0 0 24px 24px'; }
      document.querySelector('.jersey-sleeve-l').style.height = '140px';
      document.querySelector('.jersey-sleeve-r').style.height = '140px';
      if (document.querySelector('.hero-jersey-sleeve-l')) document.querySelector('.hero-jersey-sleeve-l').style.height = '140px';
      if (document.querySelector('.hero-jersey-sleeve-r')) document.querySelector('.hero-jersey-sleeve-r').style.height = '140px';
      return;
    default: // tee
      collar.style.height = '18px';
      collar.style.borderRadius = '0 0 28px 28px';
      if (heroCollar) { heroCollar.style.height = '18px'; heroCollar.style.borderRadius = '0 0 28px 28px'; }
      document.querySelector('.jersey-sleeve-l').style.display = '';
      document.querySelector('.jersey-sleeve-r').style.display = '';
      document.querySelector('.jersey-sleeve-l').style.height = '';
      document.querySelector('.jersey-sleeve-r').style.height = '';
      if (document.querySelector('.hero-jersey-sleeve-l')) { document.querySelector('.hero-jersey-sleeve-l').style.display = ''; document.querySelector('.hero-jersey-sleeve-l').style.height = ''; }
      if (document.querySelector('.hero-jersey-sleeve-r')) { document.querySelector('.hero-jersey-sleeve-r').style.display = ''; document.querySelector('.hero-jersey-sleeve-r').style.height = ''; }
  }
}

// ---- Color selection ----
function selectColor(color, textColor, btn) {
  state.shirtColor = color;
  state.textColor = textColor;

  const jersey = document.getElementById('jerseyBody');
  jersey.style.backgroundColor = color;
  document.getElementById('jerseyCollar').style.backgroundColor = color;

  document.querySelectorAll('#colorOptions .color-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Update text colors for default white/dark
  updatePreview();

  // Update hero preview
  const heroBody = document.querySelector('.hero-jersey-body');
  if (heroBody) heroBody.style.backgroundColor = color;
  const heroCollar = document.querySelector('.hero-jersey-collar');
  if (heroCollar) heroCollar.style.backgroundColor = color;
}

// ---- Text color ----
function selectTextColor(color, btn) {
  state.textColor = color;
  document.querySelectorAll('.text-color').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updatePreview();
}

// ---- Update preview ----
function updatePreview() {
  state.teamName = document.getElementById('teamNameInput').value || 'TEAM NAME';
  state.playerName = document.getElementById('playerNameInput').value || 'PLAYER';

  document.getElementById('jerseyTeamName').textContent = state.teamName;
  document.getElementById('jerseyTeamName').style.color = state.textColor;
  document.getElementById('jerseyPlayerName').textContent = state.playerName;
  document.getElementById('jerseyPlayerName').style.color = state.textColor;

  // Number
  const num = document.getElementById('numberInput').value || 0;
  state.number = parseInt(num);
  document.getElementById('jerseyNumber').textContent = state.number;
  document.getElementById('jerseyNumber').style.color = state.textColor;

  // Logo area border color
  const logoArea = document.getElementById('jerseyLogoArea');
  logoArea.style.borderColor = state.textColor + '44';

  updatePrice();
}

// ---- Number controls ----
function changeNumber(delta) {
  const input = document.getElementById('numberInput');
  let val = parseInt(input.value) || 0;
  val = Math.max(0, Math.min(99, val + delta));
  input.value = val;
  updatePreview();
}

// ---- Logo upload ----
function handleLogoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    alert('ไฟล์ใหญ่เกิน 5MB');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (ev) {
    state.logo = ev.target.result;
    const logoArea = document.getElementById('jerseyLogoArea');
    logoArea.innerHTML = '<img src="' + ev.target.result + '" alt="logo">';
    logoArea.style.border = 'none';

    document.getElementById('logoPreview').src = ev.target.result;
    document.getElementById('logoPreview').style.display = 'block';
    document.getElementById('uploadPlaceholder').style.display = 'none';
    document.getElementById('removeLogoBtn').style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function removeLogo() {
  state.logo = null;
  document.getElementById('jerseyLogoArea').innerHTML = '';
  document.getElementById('jerseyLogoArea').style.border = '';
  document.getElementById('logoPreview').style.display = 'none';
  document.getElementById('uploadPlaceholder').style.display = '';
  document.getElementById('removeLogoBtn').style.display = 'none';
  document.getElementById('logoUpload').value = '';
}

// ---- Price calculation ----
function updatePrice() {
  const sizes = document.querySelectorAll('#sizeOptions input:checked');
  const sizeCount = sizes.length || 1;
  const qtyPerSize = parseInt(document.getElementById('qtyPerSize').value) || 1;
  const total = state.pricePerShirt * sizeCount * qtyPerSize;

  document.getElementById('unitPrice').textContent = '฿' + state.pricePerShirt;
  document.getElementById('sizeCount').textContent = sizeCount + ' ไซส์';
  document.getElementById('qtyDisplay').textContent = qtyPerSize + ' ชิ้น';
  document.getElementById('totalPrice').textContent = '฿' + total.toLocaleString();
}

// Listen to size checkboxes
document.querySelectorAll('#sizeOptions input').forEach(cb => {
  cb.addEventListener('change', updatePrice);
});

// ---- Submit order ----
function submitOrder() {
  const sizes = Array.from(document.querySelectorAll('#sizeOptions input:checked')).map(cb => cb.value);
  const qtyPerSize = parseInt(document.getElementById('qtyPerSize').value) || 1;

  if (sizes.length === 0) {
    alert('กรุณาเลือกไซส์อย่างน้อย 1 ไซส์');
    return;
  }

  const order = {
    style: state.style,
    shirtColor: state.shirtColor,
    textColor: state.textColor,
    teamName: state.teamName,
    playerName: state.playerName,
    number: state.number,
    logo: state.logo ? '(มีโลโก้)' : '(ไม่มีโลโก้)',
    sizes: sizes,
    qtyPerSize: qtyPerSize,
    total: state.pricePerShirt * sizes.length * qtyPerSize,
  };

  console.log('Order:', order);

  alert(
    'สรุปคำสั่งทำเสื้อ:\n\n' +
    'แบบเสื้อ: ' + order.style + '\n' +
    'สีเสื้อ: ' + order.shirtColor + '\n' +
    'ชื่อทีม: ' + order.teamName + '\n' +
    'ชื่อผู้เล่น: ' + order.playerName + '\n' +
    'เบอร์: ' + order.number + '\n' +
    'โลโก้: ' + order.logo + '\n' +
    'ไซส์: ' + order.sizes.join(', ') + '\n' +
    'จำนวน/ไซส์: ' + order.qtyPerSize + ' ชิ้น\n' +
    'ราคารวม: ฿' + order.total.toLocaleString() + '\n\n' +
    '(ฟีเจอร์นี้จะเชื่อมต่อกับระบบ orders ในขั้นตอนถัดไป)'
  );
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', function () {
  updatePreview();
  updatePrice();
});
