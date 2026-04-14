# LinkedIn Games Leaderboard 🎮

A modern, award-winning UI for tracking LinkedIn game scores with real-time leaderboard updates.

## Features

- 🎯 Track 8 daily LinkedIn games (Zip, Queens, Sudoku, Pinpoint, Patches, Tango, Crossclimb, Hard Word)
- 👥 Monitor scores for 3 players (Kirukku, Srinathi, Vivaaek)
- 🏆 Dynamic leaderboard with fun rankings (Pro Player, Casual Gamer, Noob)
- ✏️ Edit and update scores anytime
- 💾 Persistent storage with MongoDB
- 🚀 Deployed on Vercel

## Setup Instructions

### 1. Install Dependencies

```bash
cd LinkedIn_Leaderboard
npm install
```

### 2. Set Up MongoDB

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://Anbu:tQ5wNYbZjfk4rEuT@cluster0.6bzyp56.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=Linkedin_Leaderboard
```

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173`

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `MONGODB_URI` and `MONGODB_DB`

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables during import:
   - `MONGODB_URI`: `mongodb+srv://Anbu:tQ5wNYbZjfk4rEuT@cluster0.6bzyp56.mongodb.net/?retryWrites=true&w=majority`
   - `MONGODB_DB`: `Linkedin_Leaderboard`

## Environment Variables Required

You need to set these in Vercel:

- `MONGODB_URI` - `mongodb+srv://Anbu:tQ5wNYbZjfk4rEuT@cluster0.6bzyp56.mongodb.net/?retryWrites=true&w=majority`
- `MONGODB_DB` - `Linkedin_Leaderboard`

## Usage

1. Click "Add Today's Games" to generate 8 rows for the current date
2. Click "Edit" on any row to update scores
3. Enter points for each player
4. Click "Save" to persist changes
5. Visit the Leaderboard page to see rankings

## Tech Stack

- React 18
- Vite
- React Router
- MongoDB
- Vercel Serverless Functions
- Modern CSS with gradients and animations

## Project Structure

```
LinkedIn_Leaderboard/
├── api/                    # Vercel serverless functions
│   ├── rows.js            # Handle game rows CRUD
│   └── leaderboard.js     # Calculate and return leaderboard
├── src/
│   ├── pages/
│   │   ├── Home.jsx       # Main scores page
│   │   └── Leaderboard.jsx # Rankings page
│   ├── App.jsx
│   └── main.jsx
├── vercel.json            # Vercel configuration
└── package.json
```

## API Endpoints

- `GET /api/rows` - Fetch all game rows
- `POST /api/rows` - Create or update a row
- `GET /api/leaderboard` - Get current rankings
