# Vercel Frontend Setup Guide

## Quick Steps

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with GitHub
3. **Import Project**:
   - Click "Add New..." → "Project"
   - Select `chinese-learning-flip-card-for-bae` repository
   - Click "Import"

4. **Configure Project**:
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `frontend` (IMPORTANT!)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

5. **Environment Variables**:
   - Click "Environment Variables"
   - Add new variable:
     - **Name**: `VITE_API_URL`
     - **Value**: `https://chinese-learning-flip-card-for-bae-production.up.railway.app`
     - **Environment**: Production, Preview, Development (select all)

6. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Copy your Vercel URL (e.g., `https://chinese-learning-flip-card-for-bae.vercel.app`)

7. **Update Railway CORS**:
   - Go back to Railway
   - Backend service → Variables
   - Update `FRONTEND_URL` with your Vercel URL
   - Railway will auto-redeploy

## That's it! Your app should be live! 🎉

