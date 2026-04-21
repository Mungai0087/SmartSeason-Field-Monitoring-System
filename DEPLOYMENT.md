# SmartSeason Deployment Guide# Deployment Guide







































































































































































































































































































































































































































































For advanced deployment strategies, see your cloud provider's documentation.---- [ ] Security audit complete- [ ] Load testing passed- [ ] Monitoring enabled- [ ] Backups configured- [ ] SSL certificate installed- [ ] Database migrated- [ ] Environment variables set**Deployment Checklist**---| 502 Bad Gateway | Backend might be down || Blank page | Check build directory exists || CORS error | Check CORS_ORIGIN environment variable || Database error | Verify DATABASE_URL is set || Deploy fails | Check logs: `heroku logs --tail` ||-------|----------|| Issue | Solution |## Support & Troubleshooting---```          heroku_email: ${{secrets.HEROKU_EMAIL}}          heroku_app_name: smartseason-app          heroku_api_key: ${{secrets.HEROKU_API_KEY}}        with:      - uses: akhileshns/heroku-deploy@v3.13.15      - run: npm run build      - uses: actions/checkout@v2    steps:    runs-on: ubuntu-latest    needs: test  deploy:        - run: npm test      - run: npm install      - uses: actions/setup-node@v2      - uses: actions/checkout@v2    steps:    runs-on: ubuntu-latest  test:jobs:    branches: [main]  push:on:name: Deploy```yaml### GitHub Actions Example## CI/CD Pipeline---   ```   0 2 * * * pg_dump smartseason > /backup/db-$(date +\%Y\%m\%d).sql   # Daily backups   ```bash3. **Database Backup**   ```   npm start   npm install   git checkout production-v1.0.0   ```bash2. **Quick Rollback**   ```   git push --tags   git tag production-v1.0.0   ```bash1. **Keep Previous Build**## Rollback Plan---- API response caching- CDN for static assets- Redis for session storage### Caching- Sharding for large datasets- Read replicas for queries- Replication (master-slave)### Database Scaling- Shared database connection pool- Stateless backend (sessions in database or Redis)- Use load balancer (AWS ELB, Nginx)### Horizontal Scaling## Scaling Considerations---   ```   }       }           proxy_pass http://localhost:5000;       location / {              ssl_certificate_key /etc/letsencrypt/live/smartseason.com/privkey.pem;       ssl_certificate /etc/letsencrypt/live/smartseason.com/fullchain.pem;              server_name smartseason.com;       listen 443 ssl;   server {   ```nginx3. **configure Nginx**   ```   sudo certbot certonly --nginx -d smartseason.com   ```bash2. **Generate Certificate**   ```   sudo apt-get install certbot python3-certbot-nginx   ```bash1. **Install Certbot**### Using Let's Encrypt with Nginx## SSL/HTTPS Setup---- [ ] Error logging (don't expose stack traces)- [ ] Database backups- [ ] Regular security updates- [ ] Use security headers (Helmet.js)- [ ] Validate all inputs- [ ] Add CSRF protection- [ ] Implement rate limiting- [ ] Use environment variables for secrets- [ ] Set CORS_ORIGIN to your domain- [ ] Use HTTPS in production- [ ] Change JWT_SECRET in .env## Security Checklist---   ```   psql -U postgres -d smartseason < backup.sql   # Import to PostgreSQL      sqlite3 smartseason.db ".dump" > backup.sql   # Export from SQLite   ```bash3. **Data Migration**   ```   -- ... (similar for other tables)   );     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP     role VARCHAR(50) NOT NULL,     password VARCHAR(255) NOT NULL,     email VARCHAR(255) UNIQUE NOT NULL,     name VARCHAR(255) NOT NULL,     id SERIAL PRIMARY KEY,   CREATE TABLE users (   ```sql2. **Schema Creation**   ```   });     connectionString: process.env.DATABASE_URL   const pool = new Pool({   const { Pool } = require('pg');   // backend/src/utils/database.js   ```javascript1. **Update Connection**## Database Migration (SQLite to PostgreSQL)---```import * as Sentry from "@sentry/react";// Setup in index.jsnpm install @sentry/react# Install Sentry for error tracking```bash### Frontend Monitoring```const logger = require('winston');# Setup in app.jsnpm install winston express-request-logger# Install monitoring tools```bash### Backend Monitoring## Monitoring & Logging---- Service workers for offline support- CSS minification- Image optimization- Lazy load routes- Code splitting (React.lazy)### Frontend- Add rate limiting- Enable gzip compression- Use connection pooling- Implement database indexes- Add caching (Redis)### Backend## Performance Optimization---   - Error pages: Route to index.html (for SPA)   - Default cache behavior: index.html   - Origin: S3 bucket3. **Setup CloudFront Distribution**   ```   aws s3 sync build/ s3://your-bucket/   ```bash2. **Upload to S3**   ```   npm run build   cd frontend   ```bash1. **Build**### Frontend (S3 + CloudFront)   ```   pm2 save   pm2 startup   pm2 start npm --name "smartseason" -- start   npm install -g pm2   ```bash5. **Setup PM2 for Process Management**   - Run migrations   - Update connection string in app   - Create PostgreSQL database4. **Use RDS for Database**   ```   npm start   npm install   cd SmartSeason/backend   git clone <repo>   ```bash3. **Deploy Application**   ```   sudo apt-get install -y nodejs   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -   ```bash2. **Install Node.js**   - Security group: allow ports 22, 5000   - t3.micro (free tier eligible)   - Ubuntu 20.04 LTS1. **Launch EC2 Instance**### Backend (EC2 + RDS)## AWS Deployment---   ```   docker-compose up   ```bash4. **Run with Docker Compose**   ```     postgres_data:   volumes:            - POSTGRES_PASSWORD=password         - POSTGRES_DB=smartseason       environment:         - postgres_data:/var/lib/postgresql/data       volumes:       image: postgres:13     postgres:              - backend       depends_on:         - REACT_APP_API_URL=http://backend:5000/api       environment:         - "80:80"       ports:       build: ./frontend     frontend:              - postgres       depends_on:         - NODE_ENV=production         - JWT_SECRET=your-secret       environment:         - "5000:5000"       ports:       build: ./backend     backend:   services:   version: '3.8'   ```yaml3. **Docker Compose**   ```   EXPOSE 80   COPY --from=build /app/build /usr/share/nginx/html   FROM nginx:alpine      RUN npm run build   COPY . .   RUN npm install   COPY package*.json ./   WORKDIR /app   FROM node:16-alpine as build   ```dockerfile2. **Create Frontend Dockerfile**   ```   CMD ["npm", "start"]   EXPOSE 5000   COPY . .   RUN npm install   COPY package*.json ./   WORKDIR /app   FROM node:16-alpine   ```dockerfile1. **Create Backend Dockerfile**### Docker Setup## Docker Deployment---   ```   }     ]       { "src": "/(.*)", "dest": "/index.html" }       { "src": "/api/(.*)", "dest": "../backend/$1" },     "routes": [     ],       { "src": "package.json", "use": "@vercel/static-build", "config": { "distDir": "build" } }     "builds": [   {   ```json4. **Vercel Config** (vercel.json):   ```   REACT_APP_API_URL=https://smartseason-api.herokuapp.com/api   ```3. **Environment Variables**   ```   vercel   npm install -g vercel   ```bash2. **Deploy to Vercel**   ```   # Creates build/ directory   npm run build   cd frontend   ```bash1. **Build Frontend**### Frontend Deployment (Vercel Example)   - Run migrations   - Update `backend/src/utils/database.js` for PostgreSQL   - Use PostgreSQL (recommended for production)4. **Database**   ```   heroku config:set NODE_ENV=production   heroku config:set JWT_SECRET=your-secret-key   ```bash3. **Environment Variables**   ```   git push heroku main   heroku create smartseason-api   heroku login   ```bash2. **Deploy to Heroku**   ```   echo "web: npm start" > Procfile   # Add Procfile   cd backend   ```bash1. **Prepare Code**### Backend Deployment (Heroku Example)## Production Deployment---   ```   # Runs on http://localhost:3000   npm start   npm install   cd frontend   ```bash3. **Start Frontend**   ```   # Runs on http://localhost:5000   npm start   npm install   cd backend   ```bash2. **Start Backend**   ```   setup.bat         # Windows   ./setup.sh        # macOS/Linux   # Or use setup script      npm install   cd SmartSeason   # Root directory   ```bash1. **Install Dependencies**### Development Environment- ~200MB disk space- Modern web browser- npm or yarn- Node.js v14 or higher### Requirements## Local Development Setup
## Local Development Deployment

### Prerequisites
- Node.js v14+ with npm
- Windows, macOS, or Linux

### Step 1: Clone/Download the Project
```bash
# If using git
git clone <repo-url>
cd SmartSeason

# Or download and extract ZIP
```

### Step 2: Run Setup Script

**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Step 3: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Expected: `SmartSeason server running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Expected: Browser opens to `http://localhost:3000`

### Step 4: Access the Application
- Open http://localhost:3000 in your browser
- Login with demo credentials

---

## Production Deployment

### Backend (Express Server)

#### Option A: Heroku

1. **Create Heroku App**
   ```bash
   heroku create smartseason-api
   heroku addons:create heroku-postgresql:hobby-dev
   ```

2. **Update Database**
   - Change backend/.env to use PostgreSQL
   - Update .env with Database URL from Heroku

3. **Deploy**
   ```bash
   git push heroku main
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your-production-secret
   ```

#### Option B: AWS EC2

1. **Launch EC2 Instance**
   - OS: Ubuntu 20.04 LTS
   - Security: Allow ports 80, 443, 5000

2. **Install Dependencies**
   ```bash
   sudo apt-get update
   sudo apt-get install nodejs npm postgresql
   ```

3. **Clone Repository**
   ```bash
   git clone <repo-url>
   cd SmartSeason/backend
   npm install
   ```

4. **Set Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

5. **Use PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start src/app.js --name "smartseason"
   pm2 startup
   pm2 save
   ```

6. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt-get install nginx
   # Configure nginx.conf to proxy to localhost:5000
   sudo systemctl restart nginx
   ```

#### Option C: Docker

**Create Dockerfile:**
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY src ./src

ENV PORT=5000
EXPOSE 5000

CMD ["node", "src/app.js"]
```

**Create docker-compose.yml:**
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=your-secret
      - DB_PATH=/data/smartseason.db
    volumes:
      - ./data:/data

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000/api
```

**Deploy:**
```bash
docker-compose up -d
```

### Frontend (React App)

#### Option A: Vercel

1. **Create account at vercel.com**

2. **Deploy**
   ```bash
   npm install -g vercel
   cd frontend
   vercel
   ```

3. **Configure Environment**
   ```
   REACT_APP_API_URL = https://your-backend-url/api
   ```

#### Option B: Netlify

1. **Build the app**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag `build` folder to Netlify UI
   - Set environment variable: `REACT_APP_API_URL`

#### Option C: AWS S3 + CloudFront

1. **Build the app**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload to S3**
   ```bash
   aws s3 sync build/ s3://your-bucket-name/
   ```

3. **Configure CloudFront**
   - Create distribution
   - Point to S3 bucket
   - Cache invalidation

### Database Migration

#### From SQLite to PostgreSQL

1. **Install PostgreSQL**
2. **Create Database**
   ```sql
   CREATE DATABASE smartseason;
   ```

3. **Update backend/.env**
   ```
   DB_URL=postgresql://user:password@localhost/smartseason
   ```

4. **Update database.js**
   - Replace sqlite3 with pg
   - Update connection and queries

5. **Run migrations**
   - Copy schema from database.js
   - Execute on PostgreSQL

---

## Environment Configuration

### Backend (.env)
```
PORT=5000
JWT_SECRET=your-very-secret-key-change-this
NODE_ENV=production
DB_PATH=./smartseason.db
# For PostgreSQL: DB_URL=postgresql://user:password@host/db
```

### Frontend (.env or .env.production)
```
REACT_APP_API_URL=https://api.smartseason.com/api
```

---

## SSL/TLS Certificate

### Using Let's Encrypt
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d your-domain.com
sudo certbot renew --dry-run
```

---

## Monitoring & Logging

### Backend Logging
```javascript
// Add to app.js
const fs = require('fs');
const logStream = fs.createWriteStream('./logs/access.log', { flags: 'a' });

app.use((req, res, next) => {
  const log = `${new Date().toISOString()} ${req.method} ${req.url}`;
  logStream.write(log + '\n');
  next();
});
```

### PM2 Monitoring
```bash
pm2 logs smartseason
pm2 monit
```

### Database Backups
```bash
# SQLite
cp smartseason.db smartseason.db.backup.$(date +%Y%m%d)

# PostgreSQL
pg_dump smartseason > backup_$(date +%Y%m%d).sql
```

---

## Performance Optimization

### Backend
- Add database connection pooling for PostgreSQL
- Implement caching (Redis) for dashboard stats
- Enable gzip compression
- Add rate limiting

### Frontend
- Code splitting with React.lazy()
- Image optimization
- Minification (automatic with npm build)
- CDN for static assets

### Database
- Add indexes on frequently queried columns
- Implement query caching
- Archive old update records

---

## Security Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Use HTTPS/SSL in production
- [ ] Set CORS to specific domain
- [ ] Add rate limiting
- [ ] Implement CSRF protection
- [ ] Add input sanitization
- [ ] Use environment variables for secrets
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Setup WAF (Web Application Firewall)

---

## Rollback Procedure

### Backend
```bash
# With PM2
pm2 stop smartseason
git checkout <previous-version>
npm install
npm start
pm2 start src/app.js
```

### Frontend
```bash
# With Vercel/Netlify
# Automatic rollback available in UI
# Or rebuild from previous commit
```

---

## Troubleshooting Deployment

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process: `lsof -i :5000` or `netstat -ano` |
| Database not found | Check DB_PATH, ensure write permissions |
| CORS errors | Update CORS config on backend |
| JWT token invalid | Check JWT_SECRET matches on frontend |
| Slow page load | Add database indexes, implement caching |
| 502 Bad Gateway | Backend is down, check logs |

---

## Performance Metrics

### Backend (Expected)
- Login: < 200ms
- Get Fields: < 500ms
- Create Field: < 300ms
- Update Field: < 250ms

### Frontend (Expected)
- Initial Load: < 2s
- Dashboard Render: < 1s
- Field Details: < 500ms

---

## Scaling Strategy

### Phase 1: Development
- SQLite database
- Single server
- Manual deployment

### Phase 2: Production (10-100 users)
- PostgreSQL database
- Single server with monitoring
- Automated backups
- CI/CD pipeline

### Phase 3: High Traffic (100+ users)
- Database replication/sharding
- Load balancer
- Microservices architecture
- Caching layer (Redis)
- Separate frontend CDN

---

## Continuous Integration/Deployment

### GitHub Actions Example

**File: .github/workflows/deploy.yml**
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Test Backend
      run: |
        cd backend
        npm install
        npm test
    
    - name: Build Frontend
      run: |
        cd frontend
        npm install
        npm run build
    
    - name: Deploy
      run: |
        # Your deployment script here
```

---

## Support & Contact

For deployment issues:
1. Check logs: `pm2 logs smartseason`
2. Review error messages in UI
3. Check database connection string
4. Verify environment variables
5. Review API documentation in API.md

---

**Deployment Checklist:**
- [ ] Environment variables configured
- [ ] Database setup/migration complete
- [ ] SSL certificate installed
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] Tested login/create/update flow
- [ ] Performance acceptable
- [ ] Security review complete
