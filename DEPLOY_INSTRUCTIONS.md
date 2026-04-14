# 🚀 Deployment Instructions

## Your Current Directory
```
E:\LinkedIn_Leaderboard\LinkedIn_Leaderboard
```

## Step 1: Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - LinkedIn Games Leaderboard"
```

## Step 2: Push to GitHub

### Option A: Create New Repository on GitHub
1. Go to [github.com](https://github.com) and create a new repository
2. Name it: `linkedin-leaderboard`
3. Don't initialize with README (we already have files)
4. Copy the repository URL (e.g., `https://github.com/yourusername/linkedin-leaderboard.git`)

### Option B: Use GitHub CLI (if installed)
```bash
gh repo create linkedin-leaderboard --public --source=. --remote=origin --push
```

### Option C: Manual Push
```bash
git remote add origin https://github.com/YOUR_USERNAME/linkedin-leaderboard.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Method 1: Vercel Website (Easiest)
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import your `linkedin-leaderboard` repository
5. Configure:
   - Framework Preset: Vite
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
6. Add Environment Variables:
   - Click "Environment Variables"
   - Add: `MONGODB_URI` = `mongodb+srv://Anbu:tQ5wNYbZjfk4rEuT@cluster0.6bzyp56.mongodb.net/?retryWrites=true&w=majority`
   - Add: `MONGODB_DB` = `Linkedin_Leaderboard`
7. Click "Deploy"

### Method 2: Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts and add environment variables when asked
```

## Step 4: Add Environment Variables (if not done during deploy)

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Environment Variables"
3. Add these:
   - `MONGODB_URI`: `mongodb+srv://Anbu:tQ5wNYbZjfk4rEuT@cluster0.6bzyp56.mongodb.net/?retryWrites=true&w=majority`
   - `MONGODB_DB`: `Linkedin_Leaderboard`
4. Select all environments (Production, Preview, Development)
5. Click "Save"
6. Redeploy if needed

## ✅ Done!

Your app will be live at: `https://your-project-name.vercel.app`

## Local Development

To test locally before deploying:
```bash
npm install
npm run dev
```

The app uses localStorage for local development, so you can test all features without MongoDB.

## Troubleshooting

### Git not recognized
Install Git from [git-scm.com](https://git-scm.com/download/win)

### npm not working
Make sure Node.js is installed from [nodejs.org](https://nodejs.org)

### Vercel deployment fails
- Check that environment variables are set correctly
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check Vercel function logs for errors
