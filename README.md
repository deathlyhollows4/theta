# AI DSA Copilot

Production-grade MVP scaffold for a coding practice platform with AI-driven DSA feedback.

## Step 1 Completed
- Backend base setup with Express.
- MongoDB connection bootstrap with Mongoose.
- Security + parsing middlewares.
- Health check endpoint.
- Centralized error handling.

## Run backend
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Health URL: `GET http://localhost:5000/api/health`
