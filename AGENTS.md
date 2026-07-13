# AGENTS.md

## Project Overview

Greenfield MERN e-commerce app for custom-printed team shirts and trophies/awards. Thai-language project.

## Tech Stack

- **Frontend:** Plain HTML + DOM (no React/Vue)
- **Backend:** Node.js + Express
- **Database:** MongoDB (pre-existing, database name: `custom-shop`)

## Structure

```
apps/
  api/    # Express backend (.env for config)
  web/    # HTML/DOM frontend (empty - build from scratch)
```

## Database Schemas

Schemas and seed data live in a sibling folder, NOT in this repo:

```
C:\Workspace\week02\1st-meet-dbs\03_my-ecommerce-project\
```

Key files there: `er-diagram.md`, `05-09_mongodb-schema_*.json`, `*.mongodb.js` (seed queries).

### Collections

| Collection | Key enums |
|---|---|
| `users` | roles: `customer`, `admin`, `super_admin` |
| `products` | category: `apparel`, `trophy`, `medal`, `wristband`, `badge` |
| `orders` | order_status: `pending_review` → `processing` → `printing_3d` → `shipped` → `delivered` / `cancelled` |
| `orders.items` | verify_status: `pending`, `approved`, `rejected_illegal`, `rejected_low_quality` |
| `materials_inventory` | — |
| `product_materials` | BOM linking products → materials |

Orders embed: `customer_snapshot`, `shipping_address_snapshot`, `financials`, `items[]` (each with `customization` + `verify_history[]`).

## Setup

1. Copy DB schemas from the sibling folder above or use existing MongoDB data
2. Configure `apps/api/.env` with at minimum `MONGO_URI`
3. `npm init` in `apps/api`, install express + mongoose (or mongodb driver)
4. Serve frontend from `apps/web/` (static files or via Express)

## Required Features

- Login / auth
- Homepage/dashboard (art-toy store style)
- Search bar, category filter
- Excel export
- Responsive (mobile-friendly)

## Conventions

- README is in Thai; maintain Thai-language context where relevant
- Frontend is vanilla HTML/DOM — do not introduce a JS framework
- MongoDB relationships are logical references (no FK constraints) — app code must enforce referential integrity
