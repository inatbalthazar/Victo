# Rework Plan: VICTO → T-Shirt Print-on-Demand Store

## Goal
Transform VICTO from a multi-product custom-shop into a **T-shirt-only Print-on-Demand** store with a beautiful, easy-to-use UI inspired by `create.glitchwear.store`. Keep the VICTO brand identity (name + Thai copy), but adopt a **modern glassmorphism theme** with Inter + JetBrains Mono fonts and custom animations. Three pages:

1. **`index.html`** — Landing page (what you get / what you can do + designer CTA)
2. **`custom-shirt.html`** — Full glitchwear-style designer tool (the only design tool)
3. **`erp.html`** — Restyled admin ERP (same features, new theme)

---

## A. Design System — New shared CSS

**New file: `apps/web/css/tokens.css`** — design tokens consumed by all pages.
- **Fonts**: Inter (400–900) for body/UI, JetBrains Mono for labels/mono/numbers. Loaded from Google Fonts.
- **Color tokens** (CSS custom properties on `:root`): a light, premium palette with a vibrant accent — e.g. `--bg`, `--surface`, `--glass`, `--text`, `--text-muted`, `--accent` (electric indigo/violet), `--accent-2` (cyan), `--border`, `--shadow`. Dark surfaces with soft gradients + glassmorphism (`backdrop-filter: blur()` + translucent fills + hairline borders).
- **Radii**: `--radius-sm/md/lg/xl`, `--radius-pill`. **Spacing scale**, **font-size scale**, **transition curves**.
- **Shared primitives**: `.btn`, `.btn-primary`, `.btn-ghost`, `.container`, `.glass-card`, `.chip`, `.eyebrow` (small uppercase mono label), utility classes.
- **Custom animations**: `fade-up`, `float`, `shimmer`, `glow-pulse`, gradient-shift — defined as `@keyframes` + reusable utility classes with `prefers-reduced-motion` guard.
- **Scrollbar + selection styling.**

> Pages link `tokens.css` **before** their page-specific CSS so page CSS can use the variables and override only what's needed.

---

## B. `index.html` — Landing page (full rewrite)

Remove the entire DB-product-catalog approach. New structure (Thai copy, VICTO brand):

1. **Sticky glass navbar** — VICTO logo, nav links (หน้าแรก / ออกแบบเสื้อ / ผลงาน / คำถาม), "เข้าสู่ระบบ" (→erp.html), primary CTA "เริ่มออกแบบ" (→custom-shirt.html).
2. **Hero** — split layout: left = headline ("ออกแบบเสื้อทีมของคุณเอง / พิมพ์ตามสั่ง ไม่มีขั้นต่ำ"), subcopy, dual CTA (เริ่มออกแบบ / ดูตัวอย่าง), trust chips (ไม่มีขั้นต่ำ · พิมพ์คุณภาพสูง · ส่งภายใน 3 วัน). Right = animated T-shirt mockup (reuse `hero-shirt.svg` with float/glow animation) over a glass card + floating sparkle badges.
3. **"สิ่งที่คุณจะได้รับ" (What you get)** — 3 glass cards: เสื้อคุณภาพพรีเมียม, สกรีน/ปัก/DTF คุณภาพระดับภาพถ่าย, จัดส่งถึงมือใน 3 วัน.
4. **"สิ่งที่คุณทำได้" (What you can do)** — 3–4 feature cards: อัปโหลดอาร์ตเวิร์ก, เพิ่มข้อความและฟอนต์, เลือกสี/แบบ/ไซส์, พรีวิวสดแบบเรียลไทม์. Each with icon + short copy. CTA at bottom → designer.
5. **"วิธีสั่งทำ" (How it works)** — 3 numbered steps (ออกแบบ → สั่งซื้อ → รับสินค้า).
6. **Gallery** — 4 example shirt mockups (CSS-drawn jerseys like the existing gallery items, recolored to new palette).
7. **Testimonials** — keep 3 testimonials, restyle into glass cards.
8. **FAQ** — 4 accordion items (reuse existing copy, fix any mixed-language typos).
9. **Final CTA band** — glass panel with big "เริ่มออกแบบเสื้อของคุณ" button.
10. **Footer** — VICTO footer, simplified (T-shirt only; no trophy/medal/etc. links).

**`js/store.js` rewrite**: no product grid, no filters, no modal. Reduced to: mobile nav toggle, smooth-scroll anchor nav + active-link highlight on scroll, FAQ accordion, scroll-reveal (IntersectionObserver) for `fade-up` animations, hero mockup float. **Removes** `CATEGORY_LABELS`, `CATEGORY_EMOJI`, product fetching, slider, filter, modal code.

**`css/store.css` rewrite**: restyle all sections using tokens; remove all `.card-thumb.<cat>`, `.category-tag.<cat>`, `.modal-*`, category-specific gradients. Keep nothing trophy/medal/wristband/badge.

---

## C. `custom-shirt.html` — Full designer rework (glitchwear-style)

**New `js/custom-shirt.js`** — a real POD designer:
- **Shirt product**: choose style (คอกลม / โปโล / สายเดี่ยว / แขนยาว) and color (10 swatches) — updates the realistic CSS/canvas shirt preview (body + collar + sleeves morph, as today, but polished).
- **Front/back toggle** — realistic preview.
- **Canvas design layer**: uploaded artwork and text are rendered as **draggable, resizable, rotatable elements** positioned over the shirt print area (pointer events: drag to move, corner handle to scale, rotation handle). Multiple elements supported; layers list; delete/select. (Pure DOM transforms — no external lib.)
- **Text tool**: content, font choice (4–6 web fonts), color, size — added as a layer.
- **Artwork upload**: image → FileReader → added as a layer (max 5MB, validated).
- **Live price**: base shirt price × quantity, +print fee logic; updates instantly as qty/sizes change.
- **Size + quantity**: size checkboxes (XS–3XL) + qty per size, same as now.
- **Add to cart / submit**: builds a design summary (style, color, text, artwork flag, sizes, qty, total) → still an `alert()`/summary confirmation for now (no backend order-create endpoint exists), but structured cleanly so it can later POST to `/api/orders`. A small in-page "cart" panel (localStorage) listing the configured design is a nice-to-have if time permits.

**New `css/custom-shirt.css`** — glassmorphism designer layout: sticky preview panel (left, large realistic tee on a glass stage with print-area guide), controls panel (right, tabbed: รูปแบบ / อาร์ตเวิร์ก / ข้อความ / สรุปคำสั่ง). Reuse the jersey CSS-drawing approach (already works well) but restyle with tokens. Add drag-handle, selection-ring, layer-chip styling.

Keep the marketing sections currently on this page (Hero, How-it-works, Printing methods, Gallery, FAQ) but restyle and keep them T-shirt-focused — OR trim to Hero + Designer + Printing + FAQ to keep the page focused. (Decision: keep Hero + Designer + Printing methods + FAQ; drop the duplicate Gallery/steps that also appear on index to avoid redundancy.)

---

## D. `erp.html` + `js/erp.js` — Restyle to new theme

Keep **all features** (login, dashboard stats, orders table + detail modal + CSV export, products table + CSV export, users table, localStorage session). Changes:
- **`css/erp.css` rewrite**: apply tokens — Inter/JetBrains Mono, glassmorphism cards & modals, new accent colors, rounded radii, refined tables, animations on stat cards. Remove neon cyberpunk look.
- **`js/erp.js`**: trim `CATEGORY_LABELS` to apparel only (`เสื้อผ้า`); other category keys fall back to raw value or "—". Keep `.badge` status styling (recolor in CSS). No logic changes beyond the label map.
- Login button in nav stays (→erp.html).

---

## E. Cleanup of removed products / categories

- **Delete assets** (6): `hero-trophy.svg`, `hero-medal.svg`, `icon-trophy.svg`, `icon-medal.svg`, `icon-wristband.svg`, `icon-badge.svg`. **Keep** (7): `logo.svg`, `logo-white.svg`, `favicon.svg`, `hero-shirt.svg`, `icon-apparel.svg`, `product-placeholder.svg`, `avatar-placeholder.svg`.
- Remove every trophy/medal/wristband/badge reference in `index.html`, `store.js`/`store.css`, `custom-shirt.*`, `erp.js` (label map only — leave `.badge` CSS class alone since it's a UI pill, not the category).
- **Backend untouched**: `seed.js` and the `products` collection still contain non-shirt products, but the customer-facing site no longer surfaces them. (ERP products table may still list them from DB — acceptable per "restyle ERP" scope; not required to filter. `materials_inventory`/`product_materials` collections aren't referenced by any current code.)

---

## F. Files changed

| File | Action |
|---|---|
| `apps/web/css/tokens.css` | **NEW** — shared design system |
| `apps/web/index.html` | Rewrite → landing page |
| `apps/web/css/store.css` | Rewrite → landing styles |
| `apps/web/js/store.js` | Rewrite → nav/scroll/FAQ/reveal only |
| `apps/web/custom-shirt.html` | Rewrite → glitchwear-style designer |
| `apps/web/css/custom-shirt.css` | Rewrite → designer styles |
| `apps/web/js/custom-shirt.js` | Rewrite → full designer logic w/ drag layers |
| `apps/web/erp.html` | Minor — add tokens.css link |
| `apps/web/css/erp.css` | Rewrite → restyle with tokens |
| `apps/web/js/erp.js` | Trim CATEGORY_LABELS to apparel |
| `apps/web/assets/*` | Delete 6 non-shirt SVGs |

No backend changes. No new dependencies (CDN: Google Fonts Inter + JetBrains Mono + Font Awesome; everything else vanilla).

---

## Execution order
1. `tokens.css` (foundation)
2. `index.html` + `store.css` + `store.js` (landing)
3. Delete 6 non-shirt assets
4. `custom-shirt.html` + `custom-shirt.css` + `custom-shirt.js` (designer)
5. `erp.html` + `erp.css` + `erp.js` (restyle + label trim)
6. Smoke test: start server, click through all 3 pages, verify no broken refs, no console errors, responsive on mobile width.