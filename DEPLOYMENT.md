# Deployment Guide - RetroFuture Fashion

This guide covers multiple deployment options for the RetroFuture Fashion website.

## 🚀 Quick Start (Local Development)

```bash
# Clone and setup
git clone <repository-url>
cd retro-fashion-hub
npm install

# Start development servers
./start.sh
# OR
npm run dev:full
```

Visit: http://localhost:3000

## 🌐 Production Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

#### Frontend on Vercel
1. **Connect Repository**
   ```bash
   # Push to GitHub first
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
     ```

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

#### Backend on Railway
1. **Deploy Backend**
   - Go to [railway.app](https://railway.app)
   - Create new project from GitHub repo
   - Select the `server` folder as root

2. **Environment Variables**
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb://localhost:27017/retro-fashion
   JWT_SECRET=your_super_secret_jwt_key_here
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   REPLICATE_API_TOKEN=your_replicate_token
   OPENAI_API_KEY=your_openai_key
   PORT=5000
   ```

3. **Add MongoDB**
   - Add MongoDB plugin in Railway
   - Copy connection string to MONGODB_URI

### Option 2: Docker Deployment

#### Single Server Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Production Docker Setup
1. **Update Environment Variables**
   ```bash
   # Edit docker-compose.yml with your actual values
   nano docker-compose.yml
   ```

2. **SSL Configuration (Optional)**
   ```bash
   # Add SSL certificates to ./ssl/ directory
   mkdir ssl
   # Copy your SSL certificates
   ```

3. **Deploy**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

### Option 3: Traditional VPS Deployment

#### Server Requirements
- Ubuntu 20.04+ or similar
- Node.js 18+
- MongoDB 5.0+
- Nginx (optional)
- PM2 for process management

#### Setup Steps
1. **Server Preparation**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd retro-fashion-hub
   
   # Install dependencies
   npm install
   
   # Build frontend
   npm run build
   
   # Start MongoDB
   sudo systemctl start mongod
   sudo systemctl enable mongod
   
   # Start backend with PM2
   pm2 start server/index.js --name "retro-fashion-backend"
   
   # Start frontend with PM2
   pm2 start npm --name "retro-fashion-frontend" -- start
   
   # Save PM2 configuration
   pm2 save
   pm2 startup
   ```

3. **Nginx Configuration (Optional)**
   ```nginx
   # /etc/nginx/sites-available/retro-fashion
   server {
       listen 80;
       server_name your-domain.com;
       
       # Frontend
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       # Backend API
       location /api/ {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   # Enable site
   sudo ln -s /etc/nginx/sites-available/retro-fashion /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## 🔧 Environment Configuration

### Required Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### Backend (.env.local)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/retro-fashion

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Services
REPLICATE_API_TOKEN=your_replicate_token
OPENAI_API_KEY=your_openai_key

# Security
JWT_SECRET=your_super_secret_jwt_key_here

# Server
PORT=5000
NODE_ENV=production
```

### Getting API Keys

#### Cloudinary
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret

#### Replicate
1. Sign up at [replicate.com](https://replicate.com)
2. Go to Account Settings
3. Generate API Token

#### OpenAI
1. Sign up at [openai.com](https://openai.com)
2. Go to API Keys
3. Create new secret key

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Check frontend
curl http://localhost:3000

# Check backend
curl http://localhost:5000/api/health

# Check database
mongo --eval "db.adminCommand('ismaster')"
```

### Logs
```bash
# PM2 logs
pm2 logs

# Docker logs
docker-compose logs -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Backup
```bash
# MongoDB backup
mongodump --db retro-fashion --out /backup/$(date +%Y%m%d)

# Application backup
tar -czf retro-fashion-backup-$(date +%Y%m%d).tar.gz /path/to/retro-fashion-hub
```

## 🔒 Security Considerations

### SSL/HTTPS
```bash
# Using Certbot for free SSL
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Firewall
```bash
# UFW configuration
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### Environment Security
- Never commit `.env` files
- Use strong JWT secrets
- Rotate API keys regularly
- Use environment-specific configurations

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

#### Database Connection
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection string
mongo "your-mongodb-uri"
```

#### Port Conflicts
```bash
# Check what's using port 3000/5000
sudo lsof -i :3000
sudo lsof -i :5000

# Kill process if needed
sudo kill -9 <PID>
```

#### Memory Issues
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

## 📈 Performance Optimization

### Frontend
- Enable Next.js Image Optimization
- Use CDN for static assets
- Implement proper caching headers
- Optimize bundle size

### Backend
- Use MongoDB indexes
- Implement Redis caching
- Optimize image processing
- Use connection pooling

### Database
```javascript
// Add indexes for better performance
db.products.createIndex({ "name": "text", "description": "text" })
db.products.createIndex({ "category": 1, "featured": 1 })
db.users.createIndex({ "email": 1 })
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build application
      run: npm run build
      
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📞 Support

For deployment issues:
1. Check the logs first
2. Verify environment variables
3. Test API endpoints manually
4. Check database connectivity
5. Review firewall/security settings

---

**Happy Deploying! 🚀**