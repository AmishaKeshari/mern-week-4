# Deployment Guide — E-Commerce Capstone

You need to deploy two things and connect them:
- **Backend (Express)** → Render (free)
- **Frontend (React/Vite)** → Vercel (free)
- **Database** → MongoDB Atlas (free) — you likely already have this from Week 3.

I can't deploy for you (it needs your own Render/Vercel/GitHub logins), but it's
free and takes about 20 minutes. Follow these exactly.

---

## Step 0 — Push to GitHub

```bash
cd mern-week-4
git init
git add .
git commit -m "MERN Week 4 e-commerce capstone"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mern-week-4.git
git push -u origin main
```
Your GitHub link is `https://github.com/YOUR_USERNAME/mern-week-4`.

---

## Step 1 — MongoDB Atlas

If you set this up in Week 3, reuse that connection string (just change the
database name at the end to `mern_week4`). Otherwise:
1. Create a free M0 cluster at mongodb.com/atlas.
2. Database Access → add a user + password.
3. Network Access → Allow access from anywhere (`0.0.0.0/0`).
4. Connect → Drivers → copy the string, e.g.
   `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/mern_week4`

---

## Step 2 — Backend on Render

1. render.com → sign in with GitHub → **New → Web Service** → pick your repo.
2. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Environment variables:
   - `MONGO_URI` = your Atlas string
   - `JWT_SECRET` = any long random string
   - `JWT_EXPIRES_IN` = `7d`
   - `CLIENT_URL` = (add after Step 3, then redeploy)
4. Deploy → you get `https://mern-week-4-backend.onrender.com`.
5. **Seed the deployed database:** in Render, open the service **Shell** tab and run
   `npm run seed` once. This adds sample products and the admin account
   (admin@shop.com / admin123).

> Free tier sleeps after inactivity; the first request may take ~30s to wake.

---

## Step 3 — Frontend on Vercel

1. vercel.com → sign in with GitHub → **Add New → Project** → import your repo.
2. Settings:
   - **Root Directory:** `frontend`
   - Framework preset: **Vite** (auto-detected)
3. Environment variable:
   - `VITE_API_URL` = your Render backend URL from Step 2
4. Deploy → you get `https://mern-week-4.vercel.app` — **this is your submission link.**

---

## Step 4 — Connect them

1. Copy your Vercel URL.
2. In Render, set `CLIENT_URL` to that Vercel URL and redeploy the backend
   (so CORS allows your frontend).

Open the Vercel link, register, browse, add to cart, and check out. Log in as the
admin to manage products.

---

## What to submit

- **Deployed link:** your Vercel URL
- **Code link:** your GitHub repo URL
