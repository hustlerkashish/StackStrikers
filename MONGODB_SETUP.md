# MongoDB Setup for IndoGyaan

## 🚀 **Complete Setup Instructions**

### **Step 1: Install MongoDB**
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install MongoDB on your system
3. Start MongoDB service:
   ```bash
   # Windows
   mongod
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

### **Step 2: Setup Backend**
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start backend server
npm run dev
```

### **Step 3: Initialize Demo Data**
```bash
# Initialize demo users and posts
curl -X POST http://localhost:5000/api/init-demo
```

### **Step 4: Update Frontend to Use MongoDB**
Replace the database service in your frontend:

1. **Update database.ts imports:**
```typescript
// Replace IndexedDB imports with MongoDB API
import { mongoAPI as db } from './mongodb-api';
```

2. **Update AuthContext to use MongoDB:**
```typescript
// In AuthContext.tsx, replace database imports
import { mongoAPI as db } from '@/lib/mongodb-api';
```

### **Step 5: Test the Setup**
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev`
3. Visit: `http://localhost:8081`
4. Login with demo users:
   - `admin@indogyaan.com` / `admin123`
   - `guru@indogyaan.com` / `guru123`

## 📊 **Database Structure**

### **Collections Created:**
- **users** - User profiles and authentication
- **posts** - Blog articles and content
- **comments** - User comments on posts
- **likes** - Like relationships
- **follows** - User following relationships
- **shares** - Post sharing tracking

### **Demo Data:**
- **5 Users** with different roles
- **5+ Blog Posts** with realistic content
- **Social Relationships** pre-configured

## 🔧 **API Endpoints**

### **Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### **Posts:**
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post

### **Social Features:**
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/share` - Share post
- `POST /api/users/:id/follow` - Follow/unfollow user

## ✅ **Verification**

1. **Backend Running:** `http://localhost:5000`
2. **Frontend Running:** `http://localhost:8081`
3. **MongoDB Connected:** Check backend console
4. **Demo Data:** Login with demo users

## 🎯 **Benefits of MongoDB Setup**

- **Real Database:** Persistent data storage
- **Scalable:** Can handle large amounts of data
- **Production Ready:** Real-world database solution
- **API Based:** Clean separation of frontend/backend
- **Authentication:** Secure JWT-based auth

Your IndoGyaan platform will now use MongoDB for all data storage! 🎉
