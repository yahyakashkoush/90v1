# Deployment Guide - RetroFuture Fashion Hub

## Overview
This guide covers deploying the RetroFuture Fashion Hub application to production with proper API integration, database connectivity, and image handling.

## Architecture
- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Node.js/Express API server
- **Database**: MongoDB
- **Image Storage**: Local uploads with optimization (can be upgraded to Cloudinary)
- **Deployment**: Vercel (Frontend) + Railway/Heroku (Backend)

## Pre-Deployment Checklist

### 1. Environment Configuration
Create production environment files:

```bash
# .env.production (for backend)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/retro-fashion
NODE_ENV=production
PORT=5000
JWT_SECRET=your-secure-jwt-secret
PRODUCTION_URL=https://your-api-domain.com

# .env.local (for frontend)
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NODE_ENV=production
```

### 2. Database Setup
1. Create MongoDB Atlas cluster
2. Set up database user with read/write permissions
3. Configure network access (allow all IPs: 0.0.0.0/0 for production)
4. Update connection string in environment variables

### 3. Backend Deployment (Railway/Heroku)

#### Option A: Railway Deployment
1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and initialize:
```bash
railway login
railway init
```

3. Deploy backend:
```bash
cd server
railway up
```

4. Set environment variables in Railway dashboard

#### Option B: Heroku Deployment
1. Install Heroku CLI
2. Create Heroku app:
```bash
heroku create your-app-name-api
```

3. Set environment variables:
```bash
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set NODE_ENV=production
```

4. Deploy:
```bash
git subtree push --prefix server heroku main
```

### 4. Frontend Deployment (Vercel)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy from root directory:
```bash
vercel --prod
```

3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
   - `NODE_ENV`: production

## Post-Deployment Configuration

### 1. CORS Setup
Update backend CORS configuration to allow your frontend domain:

```javascript
// server/index.js
app.use(cors({
  origin: [
    'https://your-frontend-domain.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

### 2. Database Initialization
The application will automatically create default products on first run. To manually seed data:

```bash
# Connect to your deployed backend
curl -X POST https://your-api-domain.com/api/admin/seed
```

### 3. Image Upload Configuration
For production, consider upgrading to Cloudinary:

1. Sign up for Cloudinary account
2. Add environment variables:
```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

3. Update image upload logic in `lib/api.ts`

## Monitoring and Maintenance

### 1. Health Checks
Monitor your application health:
- Backend: `https://your-api-domain.com/api/health`
- Frontend: Built-in Vercel monitoring

### 2. Error Tracking
Consider adding Sentry for error tracking:

```bash
npm install @sentry/node @sentry/nextjs
```

### 3. Performance Monitoring
- Use Vercel Analytics for frontend performance
- Monitor API response times and database queries

## Troubleshooting Common Issues

### 1. CORS Errors
- Ensure frontend domain is added to CORS whitelist
- Check that API URL is correctly set in frontend environment

### 2. Database Connection Issues
- Verify MongoDB connection string
- Check network access settings in MongoDB Atlas
- Ensure database user has proper permissions

### 3. Image Upload Problems
- Check file size limits (current: 10MB)
- Verify upload directory permissions
- Consider using Cloudinary for better reliability

### 4. API Integration Issues
- Verify environment variables are set correctly
- Check API endpoints are accessible
- Monitor network requests in browser dev tools

## Performance Optimization

### 1. Frontend Optimizations
- Enable Next.js image optimization
- Implement proper caching strategies
- Use CDN for static assets

### 2. Backend Optimizations
- Implement Redis caching for frequently accessed data
- Optimize database queries with proper indexing
- Use compression middleware

### 3. Database Optimizations
- Create indexes for frequently queried fields
- Implement pagination for large datasets
- Use aggregation pipelines for complex queries

## Security Considerations

### 1. Authentication
- Use strong JWT secrets
- Implement proper session management
- Add rate limiting to prevent abuse

### 2. Data Validation
- Validate all input data
- Sanitize user inputs
- Implement proper error handling

### 3. HTTPS
- Ensure all communications use HTTPS
- Set secure cookie flags
- Implement HSTS headers

## Backup and Recovery

### 1. Database Backups
- Set up automated MongoDB Atlas backups
- Test restore procedures regularly

### 2. Code Backups
- Use Git for version control
- Maintain staging environment for testing

## Support and Maintenance

### 1. Regular Updates
- Keep dependencies updated
- Monitor security vulnerabilities
- Test updates in staging environment

### 2. Monitoring
- Set up alerts for downtime
- Monitor error rates and performance metrics
- Regular health checks

## Contact and Support
For deployment issues or questions, refer to:
- Next.js documentation: https://nextjs.org/docs
- Vercel deployment guide: https://vercel.com/docs
- MongoDB Atlas documentation: https://docs.atlas.mongodb.com/
- Railway documentation: https://docs.railway.app/