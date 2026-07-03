# MERN Capstone — E-Commerce Web Application (Week 4)

A full-stack e-commerce store built for the Week 4 capstone: product listing,
user authentication, shopping cart, order management, and an admin dashboard for
product control. React frontend, Express/Node backend, MongoDB database.

This project satisfies both **Major Project Option 1 (E-Commerce)** from `week 4.pdf`
and the **products + cart mini e-commerce app** from `practice set.pdf`.

---

## Features

- **Marketplace storefront** (Amazon/Flipkart-style) with real product photos
- **Product catalog** with search bar, category bar, ratings, discounts
- **Product detail pages** with Buy Now + Add to Cart
- **User authentication** — signup / login with JWT + bcrypt
- **Shopping cart** — add, update quantity, remove, persists across refreshes
- **Checkout & orders** — place orders, view your order history
- **Admin dashboard** — role-based; admins can create, edit, and delete products
- **Protected routes** on both frontend and backend

## Requirement mapping

### week 4.pdf (Capstone)
| Topic | Where |
|---|---|
| Advanced React components + API integration | `frontend/src/pages`, `context/`, Axios in `api/axios.js` |
| E-Commerce: products, auth, cart, orders | full stack |
| Admin dashboard for product control | `frontend/src/pages/Admin.jsx` + admin-gated backend routes |
| Deployment (Vercel / Render / Atlas) | `DEPLOYMENT.md` |
| Documentation | this README + `DEPLOYMENT.md` |

### practice set.pdf
| Question | Where |
|---|---|
| 1. Integrate React with Node backend | Axios client ↔ Express API |
| 2. Login/signup flow | `Login.jsx`, `Register.jsx`, `authController.js` |
| 3. Deploy frontend (Vercel) + backend (Render) | `DEPLOYMENT.md` |
| 4. Mini e-commerce app (products + cart) | whole app |
| 5. Submit final project with GitHub link | see "Submitting" below |

---

## Project structure

```
mern-week-4/
├── backend/     Express API (auth, products, orders, admin)
│   ├── seed.js  sample products + admin user
│   └── ...
└── frontend/    React storefront (Vite)
```

---

## Run it locally

You need **Node.js** and **MongoDB** (local, or a free MongoDB Atlas cluster).

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env        # Windows: copy .env.example .env
# edit .env: set MONGO_URI and JWT_SECRET
npm run seed                # adds sample products + an admin account
npm run dev
```
Runs at `http://localhost:5000`.

The seed creates an admin you can log in with:
- **email:** admin@shop.com
- **password:** admin123

### 2. Frontend (second terminal)

```bash
cd frontend
npm install
cp .env.example .env        # Windows: copy .env.example .env
# leave VITE_API_URL as http://localhost:5000 for local dev
npm run dev
```
Runs at `http://localhost:5173`. Open it, browse products, add to cart, register,
and check out. Log in as the admin to manage products.

---

## API endpoints

**Auth**
- `POST /api/auth/register` `{ name, email, password }`
- `POST /api/auth/login` `{ email, password }`
- `GET  /api/auth/profile` *(JWT)*

**Products**
- `GET    /api/products?search=&category=` (public)
- `GET    /api/products/:id` (public)
- `POST   /api/products` *(admin)*
- `PUT    /api/products/:id` *(admin)*
- `DELETE /api/products/:id` *(admin)*

**Orders**
- `POST /api/orders` `{ items: [{ product, quantity }] }` *(JWT)*
- `GET  /api/orders/mine` *(JWT)*
- `GET  /api/orders` *(admin)*

Import `backend/postman_collection.json` into Postman to test everything.

---

## Deployment

Full step-by-step in **`DEPLOYMENT.md`**: backend on Render, frontend on Vercel,
database on MongoDB Atlas. That gives you the public link to submit.

## Submitting

1. Push this project to GitHub (steps in `DEPLOYMENT.md`).
2. Deploy per `DEPLOYMENT.md`.
3. Submit your **deployed Vercel link** and your **GitHub repo link**.
