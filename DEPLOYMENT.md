# Quick Deployment Guide 🚀

## Step 1: Set Up MongoDB (5 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Replace `<password>` with your actual password

## Step 2: Deploy to Vercel (2 minutes)

### Method A: Using Vercel Website (Easiest)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables:
   - Name: `MONGODB_URI`
   - Value: `mongodb+srv://Anbu:tQ5wNYbZjfk4rEuT@cluster0.6bzyp56.mongodb.net/?retryWrites=true&w=majority`
   - Name: `MONGODB_DB`
   - Value: `Linkedin_Leaderboard`
6. Click "Deploy"

### Method B: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   cd LinkedIn_Leaderboard
   vercel
   ```

4. Add environment variables when prompted or add them later in the Vercel dashboard

## Step 3: Add Environment Variables in Vercel

If you didn't add them during deployment:

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Environment Variables"
3. Add these variables:
   - `MONGODB_URI` = `mongodb+srv://Anbu:tQ5wNYbZjfk4rEuT@cluster0.6bzyp56.mongodb.net/?retryWrites=true&w=majority`
   - `MONGODB_DB` = `Linkedin_Leaderboard`
4. Redeploy if needed

## That's It! 🎉

Your app is now live. Visit the URL provided by Vercel.

## Troubleshooting

### "Database error" message
- Check that your MongoDB connection string is correct
- Ensure your MongoDB user has read/write permissions
- Verify your IP is whitelisted in MongoDB Atlas (or allow access from anywhere: 0.0.0.0/0)

### API not working
- Make sure environment variables are set in Vercel
- Check the Vercel function logs for errors
- Redeploy after adding environment variables

### Need to whitelist IPs in MongoDB
1. Go to MongoDB Atlas
2. Click "Network Access"
3. Click "Add IP Address"
4. Click "Allow Access from Anywhere" (0.0.0.0/0)
5. Click "Confirm"
