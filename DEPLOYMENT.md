# Deployment Guide

This guide will help you deploy the Chinese Learning Flip Card application to production.

## Prerequisites

- GitHub account with code pushed to repository
- Vercel account (free tier)
- Railway account (free tier with $5 credit)

## Step 1: Deploy Backend to Railway

### 1.1 Create Railway Account
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Verify your email

### 1.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Connect your GitHub account if needed
4. Select `chinese-learning-flip-card-for-bae` repository
5. Choose the `backend` folder (or deploy root and set root directory later)

### 1.3 Add PostgreSQL Database
1. In your Railway project, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will create a PostgreSQL database automatically
4. **Copy the DATABASE_URL** from the PostgreSQL service variables (you'll need this)

### 1.4 Configure Backend Service
1. Click on your backend service
2. Go to "Variables" tab
3. Add these environment variables:
   ```
   DATABASE_URL=<from PostgreSQL service, or use ${{Postgres.DATABASE_URL}}>
   JWT_SECRET=<generate a random secret string, e.g., openssl rand -hex 32>
   PORT=3000
   NODE_ENV=production
   FRONTEND_URL=<will be your Vercel URL, update after Step 2>
   ```
4. Set "Root Directory" to `backend` (if deploying from repo root)

### 1.5 Build Settings
Railway should auto-detect NestJS, but verify:
- Build Command: `npm run build`
- Start Command: `npm run start:prod`
- Root Directory: `backend` (if deploying from repo root)

### 1.6 Deploy
1. Railway will automatically deploy on every push to your main branch
2. Wait for deployment to complete
3. **Copy your backend URL** (e.g., `https://your-app.railway.app`)
4. Go to PostgreSQL service and run seed manually if needed (or add seed to startup)

### 1.7 Seed Database (Optional)
You can seed the database by:
1. Going to your backend service in Railway
2. Opening a shell/terminal
3. Running: `npm run seed`

Or create a one-time deployment script that runs seed on first deploy.

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your GitHub project

### 2.2 Import Project
1. Click "Add New..." → "Project"
2. Select `chinese-learning-flip-card-for-bae` repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

### 2.3 Environment Variables
1. Go to "Environment Variables"
2. Add:
   ```
   VITE_API_URL=<your Railway backend URL from Step 1.6>
   ```
   Example: `VITE_API_URL=https://your-app.railway.app`

### 2.4 Deploy
1. Click "Deploy"
2. Wait for build to complete
3. **Copy your frontend URL** (e.g., `https://your-app.vercel.app`)

## Step 3: Update Backend CORS

### 3.1 Update FRONTEND_URL in Railway
1. Go back to Railway backend service
2. Update the `FRONTEND_URL` variable:
   ```
   FRONTEND_URL=<your Vercel frontend URL>
   ```
3. Railway will automatically redeploy

## Step 4: Test Deployment

1. Visit your Vercel frontend URL
2. Register a new account (first user becomes admin)
3. Test flip cards, adding cards, admin panel
4. Verify everything works!

## Step 5: Update Seed Script for Production (Optional)

If you want to auto-seed on deployment, you can modify the startup to run seed on first deploy.

## Troubleshooting

### Backend Issues
- Check Railway logs for errors
- Verify DATABASE_URL is correct
- Ensure JWT_SECRET is set
- Check PORT is set to 3000 (Railway auto-assigns, but we specify it)

### Frontend Issues
- Check Vercel build logs
- Verify VITE_API_URL is correct
- Check browser console for CORS errors

### Database Issues
- Verify PostgreSQL service is running
- Check DATABASE_URL connection string
- Ensure database migrations ran (synchronize is off in production)

## Environment Variables Summary

### Railway (Backend)
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<random-secret>
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

### Vercel (Frontend)
```
VITE_API_URL=https://your-app.railway.app
```

## Auto-Deployments

Both platforms support auto-deployment:
- **Railway**: Auto-deploys on push to main branch
- **Vercel**: Auto-deploys on push to main branch

Just push to GitHub and both will redeploy automatically!

