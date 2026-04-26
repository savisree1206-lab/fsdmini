# 🚀 Deployment Guide for TravelLink

I have prepared your project for deployment. Follow these steps to get your full-stack application live on **Render** (recommended for its free tier and ease of use).

## 1. Project Preparation
I have already made the following changes to make your code deployment-ready:
- **Dynamic API URL**: Created `src/apiConfig.js` which automatically switches between `localhost` and your production backend URL.
- **Render Blueprint**: Created `render.yaml` in the root directory. This file allows Render to automatically detect and configure both your frontend and backend.

## 2. MongoDB Atlas Setup (Required)
Since you are currently using a local MongoDB, you need a cloud database:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a new Cluster and a Database User.
3. In "Network Access", allow access from `0.0.0.0/0` (Render needs this).
4. Get your **Connection String** (it looks like `mongodb+srv://<user>:<password>@cluster.mongodb.net/travellink`).

## 3. Deploying to Render
1. Go to [Render](https://render.com/) and log in with your GitHub account.
2. Click **New +** > **Blueprint**.
3. Select your `fsdmini` repository.
4. Render will read the `render.yaml` file I created.
5. **Environment Variables**:
   - For `fsdmini-backend`, you will need to provide the `MONGO_URI` (your MongoDB Atlas string).
   - The `JWT_SECRET` will be automatically generated.
   - The frontend's `VITE_API_URL` will be automatically linked to the backend's URL.
6. Click **Apply**.

## 4. Final Verification
Once the deployment is finished:
1. Render will provide a URL for your **Frontend** (e.g., `https://fsdmini-frontend.onrender.com`).
2. Open that URL, and your app should be fully functional!

> [!TIP]
> If you encounter any issues with the frontend not connecting to the backend, double-check the `VITE_API_URL` environment variable in the Render dashboard.
