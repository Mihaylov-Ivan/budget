# Quick MongoDB Setup

## 1. Install Dependencies

```bash
npm install
```

## 2. Set up MongoDB

You have two options:

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Copy `env.example` to `.env` and update the `MONGODB_URL`

### Option B: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGODB_URL=mongodb://localhost:27017/budget`

## 3. Create .env file

```bash
cp env.example .env
```

Then edit `.env` with your actual MongoDB URI.

## 4. Run the seed script

```bash
npm run seed
```

This will:

- Connect to your MongoDB
- Create a test user
- Import all your existing data from `src/app/data.ts`
- Show you the User ID for future reference

## 5. Verify it worked

Check your MongoDB database - you should see a new `budgets` collection with your data!

## Next Steps

- The script creates a test user ID - save this for your app
- You can now build API routes to read/write this data
- Each row in your arrays now has a unique `_id` for easy editing
