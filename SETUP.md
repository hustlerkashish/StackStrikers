# IndoGyaan Setup Guide

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (local installation or MongoDB Atlas)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up MongoDB:**
   
   **Option A: Local MongoDB**
   - Install MongoDB locally
   - Start MongoDB service
   - Default connection: `mongodb://localhost:27017`
   
   **Option B: MongoDB Atlas (Cloud)**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string
   - Update the connection in `src/config/database.ts`

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Default Admin Access

The system creates a default admin user:
- **Email:** admin@indogyaan.com
- **Password:** admin123
- **Admin Panel:** http://localhost:8081/admin-panel

## Demo Users

The system also creates demo users:
- **Email:** demo@indogyaan.com
- **Password:** password
- **Email:** guru@indogyaan.com
- **Password:** guru123

## Features

### 🎨 **IndoGyaan Branding**
- Deep Saffron (#FF9933) - Knowledge, energy
- Indigo Blue (#1A237E) - Depth, tradition, intellect
- Ivory White (#FAF9F6) - Purity, simplicity
- Lotus Pink (#E91E63) - Subtle accents

### 📚 **Knowledge Platform**
- Beautiful landing page with Indian cultural elements
- User authentication (signup/login)
- Blog post creation and management
- Social features (like, comment, share)
- User profiles with avatar uploads
- Admin panel for platform management

### 🔐 **Admin Panel**
- Access via `/admin-panel` URL
- User management
- Post management
- Platform statistics
- Content moderation

### 🌐 **Routes**
- `/` - Landing page
- `/blog` - Blog platform
- `/post/:id` - Individual blog post
- `/admin` - User's post management
- `/admin-panel` - Admin panel (admin only)
- `/profile` - User profile

## MongoDB Collections

The system creates the following collections:
- `users` - User accounts and profiles
- `posts` - Blog posts and articles
- `comments` - Post comments
- `likes` - Post and comment likes
- `follows` - User follow relationships
- `shares` - Post sharing data

## Customization

### Database Configuration
Update `src/config/database.ts` to change MongoDB connection settings.

### Styling
Modify `src/index.css` to customize the IndoGyaan color scheme and styling.

### Content
Update `src/lib/models.ts` in the `initializeDemoData()` function to customize demo content.

## Troubleshooting

### MongoDB Connection Issues
1. Ensure MongoDB is running
2. Check connection string in `src/config/database.ts`
3. Verify network access if using MongoDB Atlas

### Build Issues
1. Clear node_modules: `rm -rf node_modules`
2. Reinstall: `npm install`
3. Check for TypeScript errors: `npm run build`

## Production Deployment

1. Set environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `MONGODB_DB` - Your database name

2. Build the application:
   ```bash
   npm run build
   ```

3. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)

## Support

For issues and questions, please check the console for error messages and ensure all dependencies are properly installed.
