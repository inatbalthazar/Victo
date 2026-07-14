/* =================================================================
   VICTO — T-shirt Designer (custom-shirt.js)
   Vanilla ES6+ · drag / resize / rotate design layers · live preview
   ================================================================= */
(function () {
  'use strict';

  /* ============ CONFIG ============ */
  const SHIRT_COLORS = [
    { hex: '#1f2937', name: 'กรมท่า',  light: false },
    { hex: '#000000', name: 'ดำ',      light: false },
    { hex: '#ffffff', name: 'ขาว',    light: true  },
    { hex: '#9ca3af', name: 'เทา',    light: true  },
    { hex: '#dc2626', name: 'แดง',    light: false },
    { hex: '#2563eb', name: 'น้ำเงิน', light: false },
    { hex: '#059669', name: 'เขียว',  light: false },
    { hex: '#ea580c', name: 'ส้ม',    light: false },
    { hex: '#7c3aed', name: 'ม่วง',   light: false },
    { hex: '#db2777', name: 'ชมพู',   light: false },
    { hex: '#0891b2', name: 'ฟ้า',    light: false },
    { hex: '#facc15', name: 'เหลือง', light: true  },
  ];

  const TEXT_COLORS = ['#ffffff', '#000000', '#facc15', '#dc2626', '#2de2e6', '#34e0a1'];

  const FONTS = [
    { family: "'Bebas Neue', sans-serif",      label: 'Bebas'  },
    { family: "'Anton', sans-serif",            label: 'Anton'  },
    { family: "'Archivo Black', sans-serif",    label: 'Archivo' },
    { family: "'Pacifico', cursive",            label: 'Pacifico' },
    { family: "'Inter', sans-serif",            label: 'Inter'  },
    { family: "'JetBrains Mono', monospace",    label: 'Mono'   },
  ];

  const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

  const STYLES = {
    tee:  { name: 'คอกลม',   body: 'M140 60 L100 80 L60 150 L100 170 L100 380 L300 380 L300 170 L340 150 L300 80 L260 60 L240 90 C220 108 180 108 160 90 Z', collar: 'M160 90 C180 108 220 108 240 90' },
    polo: { name: 'โปโล',   body: 'M140 60 L100 80 L60 150 L100 170 L100 380 L300 380 L300 170 L340 150 L300 80 L260 60 L240 90 C220 108 180 108 160 90 Z', collar: 'M155 88 L160 110 L240 110 L245 88' },
    tank: { name: 'สายเดี่ยว', body: 'M165 70 L120 90 L70 160 L110 175 L110 380 L290 380 L290 175 L330 160 L280 90 L235 70 L220 95 C205 110 195 110 180 95 Z', collar: 'M180 95 C195 110 205 110 220 95' },
    long: { name: 'แขนยาว',  body: 'M140 60 L95 80 L40 150 L60 240 L100 230 L100 380 L300 380 L300 230 L340 240 L360 150 L305 80 L260 60 L240 90 C220 108 180 108 160 90 Z', collar: 'M160 90 C180 108 220 108 240 90' },
  };

  const UNIT_PRICE = 120;

  /* ============ STATE ============ */
  const state = {
    style: 'tee',
    color: SHIRT_COLORS[0],
    side: 'front',
    layers: [],            // { id, type:'text'|'img', x, y, scale, rotation, ...payload }
    selectedId: null,
    textFont: FONTS[0].family,
    textColor: '#ffffff',
    sizes: { M: true, L: true },
    qty: 10,
  };
  let zCounter = 1;

  /* ============ DOM ============ */
  const $ = (s) => document.querySelector(s);
  const shirtFrontPath = $('#shirtFrontPath');
  const shirtCollar = $('#shirtCollar');
  const printArea = $('#printArea');
  const designLayer = $('#designLayer');
  const layerList = $('#layerList');
  const printHint = $('#printHint');

  /* ============ HELPERS ============ */
  const fmt = (n) => '฿' + Number(n).toLocaleString();
  const uid = () => 'L' + (++zCounter) + '_' + Math.random().toString(36).slice(2, 6);
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  /* ============ RENDER: shirt ============ */
  function renderShirt() {
    const def = STYLES[state.style];
    shirtFrontPath.setAttribute('d', def.body);
    shirtCollar.setAttribute('d', def.collar);
    shirtFrontPath.setAttribute('fill', state.color.hex);
    $('#infoStyle').textContent = def.name;
    $('#infoSwatch').style.background = state.color.hex;
  }

  /* ============ RENDER: layers ============ */
  function renderLayers() {
    designLayer.innerHTML = '';
    // sort by z (array order = paint order)
    state.layers.forEach((L) => {
      const el = document.createElement(L.type === 'text' ? 'div' : 'img');
      el.className = 'delem' + (L.id === state.selectedId ? ' selected' : '');
      el.dataset.id = L.id;

      if (L.type === 'text') {
        el.classList.add('delem-text');
        el.textContent = L.text;
        el.style.fontFamily = L.font;
        el.style.color = L.color;
        el.style.fontSize = L.baseSize + 'px';
      } else {
        el.classList.add('delem-img');
        el.src = L.src;
        el.draggable = false;
      }

      el.style.left = L.x + '%';
      el.style.top = L.y + '%';
      el.style.transform = `translate(-50%, -50%) scale(${L.scale}) rotate(${L.rotation}deg)`;
      el.style.zIndex = L.z;

      // handles
      const handle = document.createElement('div');
      handle.className = 'delem-handle';
      handle.dataset.action = 'resize';
      el.appendChild(handle);
      const rot = document.createElement('div');
      rot.className = 'delem-rotate';
      rot.dataset.action = 'rotate';
      el.appendChild(rot);

      designLayer.appendChild(el);
      attachDrag(el);
    });

    printArea.classList.toggle('has-layers', state.layers.length > 0);
    $('#infoLayers').textContent = state.layers.length;
    renderLayerList();
    updateSelectedTools();
  }

  function renderLayerList() {
    if (!state.layers.length) {
      layerList.innerHTML = '<div class="layer-empty">ยังไม่มีเลเยอร์ — เริ่มจากการเพิ่มข้อความหรืออัปโหลดรูป</div>';
      return;
    }
    layerList.innerHTML = '';
    // show top-most first
    [...state.layers].reverse().forEach((L) => {
      const row = document.createElement('div');
      row.className = 'layer-row' + (L.id === state.selectedId ? ' selected' : '');
      row.dataset.id = L.id;
      const thumb = document.createElement('div');
      thumb.className = 'layer-thumb';
      if (L.type === 'img') {
        const im = document.createElement('img');
        im.src = L.src; thumb.appendChild(im);
      } else {
        const ic = document.createElement('i');
        ic.className = 'fas fa-font'; thumb.appendChild(ic);
      }
      const name = document.createElement('div');
      name.className = 'layer-name';
      name.textContent = L.type === 'text' ? L.text : 'อาร์ตเวิร์ก';
      const del = document.createElement('button');
      del.className = 'layer-del';
      del.innerHTML = '<i class="fas fa-trash"></i>';
      del.addEventListener('click', (e) => { e.stopPropagation(); removeLayer(L.id); });
      row.append(thumb, name, del);
      row.addEventListener('click', () => selectLayer(L.id));
      layerList.appendChild(row);
    });
  }

  function updateSelectedTools() {
    $('#selectedTools').hidden = !state.selectedId;
  }

  /* ============ LAYER OPS ============ */
  function addTextLayer(text) {
    if (!text || !text.trim()) return;
    const L = {
      id: uid(), type: 'text', text: text.trim(),
      font: state.textFont, color: state.textColor,
      baseSize: 26, scale: 1, rotation: 0,
      x: 50, y: 45, z: ++zCounter,
    };
    state.layers.push(L);
    state.selectedId = L.id;
    renderLayers();
  }

  function addImageLayer(src) {
    const L = {
      id: uid(), type: 'img', src,
      scale: 1, rotation: 0,
      x: 50, y: 45, z: ++zCounter,
    };
    state.layers.push(L);
    state.selectedId = L.id;
    renderLayers();
  }

  function selectLayer(id) {
    state.selectedId = id;
    renderLayers();
  }

  function removeLayer(id) {
    state.layers = state.layers.filter((L) => L.id !== id);
    if (state.selectedId === id) state.selectedId = null;
    renderLayers();
  }

  function bringForward(id) {
    const i = state.layers.findIndex((L) => L.id === id);
    if (i < 0 || i === state.layers.length - 1) return;
    const [m] = state.layers.splice(i, 1);
    state.layers.push(m);
    m.z = ++zCounter;
    renderLayers();
  }
  function sendBackward(id) {
    const i = state.layers.findIndex((L) => L.id === id);
    if (i <= 0) return;
    const [m] = state.layers.splice(i, 1);
    state.layers.unshift(m);
    renderLayers();
  }

  /* ============ DRAG / RESIZE / ROTATE ============ */
  function attachDrag(el) {
    const id = el.dataset.id;
    let action = null;     // 'move' | 'resize' | 'rotate'
    let startX, startY, startBBox;
    let layer;

    el.addEventListener('pointerdown', (e) => {
      if (e.target.dataset.action === 'resize') action = 'resize';
      else if (e.target.dataset.action === 'rotate') action = 'rotate';
      else action = 'move';

      layer = state.layers.find((L) => L.id === id);
      if (!layer) return;
      e.preventDefault();
      e.stopPropagation();
      selectLayer(id);
      el.classList.add('dragging');

      startX = e.clientX;
      startY = e.clientY;
      const printRect = printArea.getBoundingClientRect();
      startBBox = { ...layer, pxW: printRect.width, pxH: printRect.height };

      el.setPointerCapture(e.pointerId);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp, { once: true });
    });

    function onMove(e) {
      if (!layer) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (action === 'move') {
        // convert px delta to % of print area
        const dxPct = (dx / startBBox.pxW) * 100;
        const dyPct = (dy / startBBox.pxH) * 100;
        layer.x = clamp(startBBox.x + dxPct, 5, 95);
        layer.y = clamp(startBBox.y + dyPct, 8, 92);
      } else if (action === 'resize') {
        const dist = Math.hypot(dx, dy) * (dx + dy > 0 ? 1 : -1);
        const next = clamp(startBBox.scale + dist / 120, 0.3, 4);
        layer.scale = next;
      } else if (action === 'rotate') {
        const cx = startBBox.x / 100 * startBBox.pxW + printArea.getBoundingClientRect().left;
        const cy = startBBox.y / 100 * startBBox.pxH + printArea.getBoundingClientRect().top;
        const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
        layer.rotation = angle + 90;
      }
      // apply transform live
      el.style.left = layer.x + '%';
      el.style.top = layer.y + '%';
      el.style.transform = `translate(-50%, -50%) scale(${layer.scale}) rotate(${layer.rotation}deg)`;
    }
    function onUp() {
      action = null;
      el.classList.remove('dragging');
      window.removeEventListener('pointermove', onMove);
      renderLayerList();
    }
  }

  /* ============ DESELECT ON EMPTY CLICK ============ */
  printArea.addEventListener('pointerdown', (e) => {
    if (e.target === printArea || e.target === printHint || e.target === designLayer) {
      state.selectedId = null;
      renderLayers();
    }
  });
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedId &&
        !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      removeLayer(state.selectedId);
    }
    if (e.key === 'Escape') { state.selectedId = null; renderLayers(); }
  });

  /* ============ SWATCHES ============ */
  function buildSwatches() {
    const grid = $('#swatchGrid');
    grid.innerHTML = '';
    SHIRT_COLORS.forEach((c) => {
      const b = document.createElement('button');
      b.className = 'swatch' + (c.light ? ' light' : '') + (c.hex === state.color.hex ? ' active' : '');
      b.style.background = c.hex;
      b.title = c.name;
      b.setAttribute('aria-label', 'สีเสื้อ ' + c.name);
      b.addEventListener('click', () => {
        state.color = c;
        renderShirt();
        buildSwatches();
      });
      grid.appendChild(b);
    });
  }

  function buildTextColors() {
    const grid = $('#textColorGrid');
    grid.innerHTML = '';
    TEXT_COLORS.forEach((hex) => {
      const b = document.createElement('button');
      b.className = 'swatch' + (hex === '#ffffff' ? ' light' : '') + (hex === state.textColor ? ' active' : '');
      b.style.background = hex;
      b.title = hex;
      b.addEventListener('click', () => {
        state.textColor = hex;
        buildTextColors();
        // if a text layer is selected, apply to it
        const sel = state.layers.find((L) => L.id === state.selectedId && L.type === 'text');
        if (sel) { sel.color = hex; renderLayers(); }
      });
      grid.appendChild(b);
    });
  }

  function buildFonts() {
    const grid = $('#fontGrid');
    grid.innerHTML = '';
    FONTS.forEach((f) => {
      const b = document.createElement('button');
      b.className = 'font-card' + (f.family === state.textFont ? ' active' : '');
      b.style.fontFamily = f.family;
      b.textContent = f.label;
      b.title = f.label;
      b.addEventListener('click', () => {
        state.textFont = f.family;
        buildFonts();
        const sel = state.layers.find((L) => L.id === state.selectedId && L.type === 'text');
        if (sel) { sel.font = f.family; renderLayers(); }
      });
      grid.appendChild(b);
    });
  }

  function buildSizes() {
    const grid = $('#sizeGrid');
    grid.innerHTML = '';
    SIZES.forEach((s) => {
      const b = document.createElement('button');
      b.className = 'size-chip' + (state.sizes[s] ? ' active' : '');
      b.textContent = s;
      b.addEventListener('click', () => {
        state.sizes[s] = !state.sizes[s];
        buildSizes();
        updatePrice();
      });
      grid.appendChild(b);
    });
  }

  /* ============ PRICE ============ */
  function updatePrice() {
    const sizeCount = Object.values(state.sizes).filter(Boolean).length;
    const total = UNIT_PRICE * sizeCount * state.qty;
    $('#unitPrice').textContent = fmt(UNIT_PRICE);
    $('#sizeCount').textContent = sizeCount + ' ไซส์';
    $('#qtyDisplay').textContent = state.qty + ' ตัว';
    $('#totalPrice').textContent = fmt(total);
  }

  /* ============ TABS ============ */
  function initTabs() {
    document.querySelectorAll('.tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t === tab));
        document.querySelectorAll('.tab-pane').forEach((p) => p.classList.toggle('active', p.dataset.pane === target));
      });
    });
  }

  /* ============ STYLE / SIDE ============ */
  function initStyleButtons() {
    document.querySelectorAll('.style-card').forEach((c) => {
      c.addEventListener('click', () => {
        document.querySelectorAll('.style-card').forEach((x) => x.classList.remove('active'));
        c.classList.add('active');
        state.style = c.dataset.style;
        renderShirt();
      });
    });
    document.querySelectorAll('.side-btn').forEach((b) => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.side-btn').forEach((x) => x.classList.remove('active'));
        b.classList.add('active');
        state.side = b.dataset.side;
        // visual: flip shadow side slightly (cosmetic — both sides share torso path)
        shirtFrontPath.style.transform = state.side === 'back' ? 'scaleX(-1)' : '';
      });
    });
  }

  /* ============ QUANTITY ============ */
  function initQty() {
    const input = $('#qtyInput');
    $('#qtyMinus').addEventListener('click', () => { input.value = Math.max(1, (parseInt(input.value) || 1) - 1); state.qty = parseInt(input.value); updatePrice(); });
    $('#qtyPlus').addEventListener('click', () => { input.value = Math.min(9999, (parseInt(input.value) || 1) + 1); state.qty = parseInt(input.value); updatePrice(); });
    input.addEventListener('input', () => { state.qty = clamp(parseInt(input.value) || 1, 1, 9999); updatePrice(); });
  }

  /* ============ TEXT ADD ============ */
  function initTextAdd() {
    $('#addTextBtn').addEventListener('click', () => {
      const v = $('#textInput').value;
      if (!v || !v.trim()) { $('#textInput').focus(); return; }
      addTextLayer(v);
      $('#textInput').value = '';
      // switch to artwork tab so user sees the layer
      document.querySelector('.tab[data-tab="art"]').click();
    });
    $('#textInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); $('#addTextBtn').click(); }
    });
  }

  /* ============ UPLOAD ============ */
  function initUpload() {
    const zone = $('#uploadZone');
    const input = $('#artUpload');
    zone.addEventListener('click', () => input.click());
    zone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
    input.addEventListener('change', (e) => handleFile(e.target.files[0]));
    // drag & drop
    ['dragover', 'dragenter'].forEach((ev) => zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.add('dragover'); }));
    ['dragleave', 'drop'].forEach((ev) => zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.remove('dragover'); }));
    zone.addEventListener('drop', (e) => { handleFile(e.dataTransfer.files[0]); });
  }
  function handleFile(file) {
    if (!file) return;
    if (!/^image\//.test(file.type)) { alert('กรุณาเลือกไฟล์รูปภาพ'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('ไฟล์ใหญ่เกิน 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      addImageLayer(e.target.result);
      document.querySelector('.tab[data-tab="art"]').click();
    };
    reader.readAsDataURL(file);
  }

  /* ============ QUICK TOOLS ============ */
  function initTools() {
    $('#toolScaleUp').addEventListener('click', () => tweak((L) => L.scale = clamp(L.scale + 0.1, 0.3, 4)));
    $('#toolScaleDown').addEventListener('click', () => tweak((L) => L.scale = clamp(L.scale - 0.1, 0.3, 4)));
    $('#toolRotateL').addEventListener('click', () => tweak((L) => L.rotation -= 15));
    $('#toolRotateR').addEventListener('click', () => tweak((L) => L.rotation += 15));
    $('#toolFront').addEventListener('click', () => { if (state.selectedId) bringForward(state.selectedId); });
    $('#toolBack').addEventListener('click', () => { if (state.selectedId) sendBackward(state.selectedId); });
    $('#toolDelete').addEventListener('click', () => { if (state.selectedId) removeLayer(state.selectedId); });
  }
  function tweak(fn) {
    const L = state.layers.find((x) => x.id === state.selectedId);
    if (!L) return;
    fn(L);
    renderLayers();
  }

  /* ============ ORDER ============ */
  function initOrder() {
    $('#orderBtn').addEventListener('click', () => {
      const sizeList = Object.keys(state.sizes).filter((k) => state.sizes[k]);
      if (!sizeList.length) { alert('กรุณาเลือกไซส์อย่างน้อย 1 ไซส์'); document.querySelector('.tab[data-tab="order"]').click(); return; }
      const total = UNIT_PRICE * sizeList.length * state.qty;
      const txtLayers = state.layers.filter((L) => L.type === 'text').map((L) => `"${L.text}"`).join(', ');
      const imgCount = state.layers.filter((L) => L.type === 'img').length;

      const summary =
        'สรุปคำสั่งทำเสื้อ\n' +
        '───────────────────\n' +
        'แบบเสื้อ: ' + STYLES[state.style].name + '\n' +
        'สีเสื้อ: ' + state.color.name + ' (' + state.color.hex + ')\n' +
        'ด้านที่ออกแบบ: ' + (state.side === 'front' ? 'ด้านหน้า' : 'ด้านหลัง') + '\n' +
        'ข้อความ: ' + (txtLayers || '—') + '\n' +
        'อาร์ตเวิร์ก: ' + (imgCount ? imgCount + ' รูป' : 'ไม่มี') + '\n' +
        'ไซส์: ' + sizeList.join(', ') + '\n' +
        'จำนวน/ไซส์: ' + state.qty + ' ตัว\n' +
        'รวมทั้งหมด: ' + (sizeList.length * state.qty) + ' ตัว\n' +
        'ราคารวม: ' + fmt(total) + '\n' +
        '───────────────────\n' +
        '(ฟีเจอร์นี้จะบันทึกเข้าระบบ orders ในขั้นตอนถัดไป)';
      alert(summary);
    });
  }

  /* ============ FAQ (page-local) ============ */
  function initFaq() {
    document.querySelectorAll('.faq-item').forEach((item) => {
      const btn = item.querySelector('.faq-q');
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach((o) => o.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ============ REVEAL (shared) ============ */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-visible')); return; }
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); o.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    els.forEach((e) => obs.observe(e));
  }

  /* ============ INIT ============ */
  function init() {
    renderShirt();
    buildSwatches();
    buildTextColors();
    buildFonts();
    buildSizes();
    updatePrice();
    initTabs();
    initStyleButtons();
    initQty();
    initTextAdd();
    initUpload();
    initTools();
    initOrder();
    initFaq();
    initReveal();
    renderLayers();
  }
  document.addEventListener('DOMContentLoaded', init);
})();
