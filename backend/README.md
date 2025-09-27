# IndoGyaan Backend API

MongoDB backend for IndoGyaan platform.

## Setup Instructions

### 1. Install MongoDB
Download and install MongoDB from: https://www.mongodb.com/try/download/community

### 2. Start MongoDB
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Start Backend Server
```bash
npm run dev
```

### 5. Initialize Demo Data
```bash
curl -X POST http://localhost:5000/api/init-demo
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post

### Comments
- `GET /api/posts/:id/comments` - Get post comments
- `POST /api/posts/:id/comments` - Add comment

### Social Features
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/share` - Share post
- `POST /api/users/:id/follow` - Follow/unfollow user

## Demo Users
- admin@indogyaan.com / admin123
- guru@indogyaan.com / guru123
- ananya@indogyaan.com / ananya123
- rajesh@indogyaan.com / rajesh123
- priya@indogyaan.com / priya123
