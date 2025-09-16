# Flex Living Reviews Dashboard - Vercel Deployment Guide

## 🚀 Deployment Overview

This guide will help you deploy both the frontend and backend of the Flex Living Reviews Dashboard on Vercel.

## 📋 Prerequisites

- Vercel account (free tier available)
- GitHub repository with the code
- MongoDB Atlas account (for production database)

## 🔧 Backend Deployment

### Step 1: Prepare Backend Repository
1. Push the backend code to a GitHub repository
2. Ensure the following files are present:
   - `vercel.json`
   - `.vercelignore`
   - `package.json` with build scripts
   - `src/server.ts` (updated for Vercel)

### Step 2: Deploy Backend on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your backend repository
4. Configure the following settings:
   - **Framework Preset**: Other
   - **Root Directory**: `the-flex-backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Set Environment Variables
In Vercel dashboard, go to Settings > Environment Variables and add:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
HOSTAWAY_ACCOUNT_ID=your_hostaway_account_id
HOSTAWAY_API_KEY=your_hostaway_api_key
CORS_ORIGIN=https://flex-living-reviews.vercel.app
```

### Step 4: Deploy
Click "Deploy" and wait for the deployment to complete.

**Backend URL**: `https://the-flex-backend.vercel.app`

## 🎨 Frontend Deployment

### Step 1: Prepare Frontend Repository
1. Push the frontend code to a GitHub repository
2. Ensure the following files are present:
   - `vercel.json`
   - `.vercelignore`
   - `package.json` with build scripts

### Step 2: Deploy Frontend on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your frontend repository
4. Configure the following settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `flex-living-reviews`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### Step 3: Set Environment Variables
In Vercel dashboard, go to Settings > Environment Variables and add:

```
NEXT_PUBLIC_API_URL=https://the-flex-backend.vercel.app
```

### Step 4: Deploy
Click "Deploy" and wait for the deployment to complete.

**Frontend URL**: `https://flex-living-reviews.vercel.app`

## 🔗 URL Configuration

### Backend URLs
- **Production**: `https://the-flex-backend.vercel.app`
- **Health Check**: `https://the-flex-backend.vercel.app/health`
- **API Documentation**: `https://the-flex-backend.vercel.app/`

### Frontend URLs
- **Production**: `https://flex-living-reviews.vercel.app`
- **Dashboard**: `https://flex-living-reviews.vercel.app/dashboard`
- **Properties**: `https://flex-living-reviews.vercel.app/properties`
- **Reviews**: `https://flex-living-reviews.vercel.app/reviews`

## 🛠 Configuration Updates

### Backend CORS Configuration
The backend is configured to accept requests from:
- `http://localhost:3000` (local development)
- `https://flex-living-reviews.vercel.app` (production frontend)
- `https://the-flex-backend.vercel.app` (self-reference)

### Frontend API Configuration
The frontend uses the `NEXT_PUBLIC_API_URL` environment variable to determine the backend URL:
- **Local**: `http://localhost:3001`
- **Production**: `https://the-flex-backend.vercel.app`

## 🧪 Testing Deployment

### 1. Test Backend
```bash
curl https://the-flex-backend.vercel.app/health
```

Expected response:
```json
{
  "success": true,
  "message": "Flex Living Reviews API is running",
  "timestamp": "2025-09-16T21:30:00.000Z"
}
```

### 2. Test Frontend
1. Visit `https://flex-living-reviews.vercel.app`
2. Check if the dashboard loads
3. Verify API calls are working
4. Test all functionality

### 3. Test API Integration
```bash
curl https://the-flex-backend.vercel.app/api/reviews
curl https://the-flex-backend.vercel.app/api/properties
curl https://the-flex-backend.vercel.app/api/dashboard
```

## 🔄 Continuous Deployment

Both frontend and backend are configured for automatic deployment:
- **Trigger**: Push to main branch
- **Build**: Automatic build and deployment
- **Preview**: Pull requests get preview deployments

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check if backend CORS configuration includes frontend URL
   - Verify environment variables are set correctly

2. **API Connection Issues**
   - Check if `NEXT_PUBLIC_API_URL` is set correctly
   - Verify backend is deployed and accessible

3. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in package.json
   - Verify TypeScript compilation

4. **Environment Variables**
   - Ensure all required environment variables are set
   - Check variable names and values
   - Restart deployment after adding new variables

### Debug Commands

```bash
# Check backend health
curl https://the-flex-backend.vercel.app/health

# Check API endpoints
curl https://the-flex-backend.vercel.app/api/reviews
curl https://the-flex-backend.vercel.app/api/properties

# Check frontend
curl https://flex-living-reviews.vercel.app
```

## 📊 Monitoring

### Vercel Analytics
- View deployment logs
- Monitor performance
- Check error rates
- Track usage

### Backend Monitoring
- Health check endpoint
- Winston logging
- Error tracking
- Performance metrics

## 🚀 Production Checklist

- [ ] Backend deployed on Vercel
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] API URLs updated
- [ ] Health checks passing
- [ ] All functionality tested
- [ ] Performance optimized
- [ ] Error handling working
- [ ] Monitoring set up

## 📞 Support

For deployment issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints manually
4. Check CORS configuration
5. Review error messages

---

**Last Updated**: September 16, 2025  
**Status**: Ready for Production Deployment ✅
