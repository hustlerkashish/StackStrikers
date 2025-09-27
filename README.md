# StackStrikers Blog Platform

A modern blogging platform built with React, TypeScript, and Supabase, featuring user authentication, admin controls, and a responsive design.

## Features

### Authentication & User Management
- User registration and login
- Profile management
- Admin role support
- Secure authentication using Supabase Auth

### Blog Posts
- Create, read, update, and delete blog posts
- Rich text content support
- Post categorization
- Search functionality
- Post excerpts and slugs
- Publishing control (draft/published states)

### Comments
- Comment on blog posts
- Delete own comments
- Duplicate comment prevention
- Comment moderation for admins
- Real-time updates

### Categories
- Organize posts by categories
- Filter posts by category
- Category management for admins

### Security Features
- Row Level Security (RLS) policies
- Role-based access control
- Protected admin routes
- Secure API endpoints

## Database Schema

### Categories Table
```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Posts Table
```sql
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Comments Table
```sql
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255),
  full_name VARCHAR(255),
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

## Security Policies

### Categories
- Everyone can view categories
- Only admins can create, update, or delete categories

### Posts
- Published posts are viewable by everyone
- Authors can see all their own posts (published or drafts)
- Authors can update and delete their own posts
- Admins have full access to all posts

### Comments
- Everyone can view comments
- Authenticated users can create comments
- Users can update and delete their own comments
- Admins can moderate all comments

### Profiles
- Basic profile information is publicly viewable
- Users can only update their own profiles
- Admin status is protected

## Environment Setup

1. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## API Services

### Blog Service
Location: `src/lib/blog-service.ts`

Key functionalities:
- Post CRUD operations
- Category management
- Comment handling
- Search and filtering
- Profile management

### Authentication
Location: `src/hooks/use-auth.ts`

Features:
- User registration
- Login/logout
- Profile management
- Admin role checking

### State Management
Location: `src/context/blog-context.tsx`

Provides:
- Centralized state management
- Real-time updates
- Error handling
- Loading states

## Component Structure

### Pages
- `Index.tsx`: Home page with post listing
- `BlogPost.tsx`: Single post view with comments
- `Admin.tsx`: Admin dashboard for post management
- `NotFound.tsx`: 404 page

### Components
- `BlogCard.tsx`: Post preview card
- `CategoryFilter.tsx`: Category filtering
- `CommentSystem.tsx`: Comment functionality
- `Navigation.tsx`: Main navigation
- Various UI components in `components/ui/`

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/hustlerkashish/StackStrikers.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see Environment Setup section)

4. Start the development server:
```bash
npm run dev
```

## Deployment

The application is built using Vite and can be deployed to any static hosting service:

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

## Future Enhancements

- Rich text editor for posts
- Image upload support
- Social sharing
- Newsletter integration
- Analytics dashboard
- Enhanced search with tags
- Comment threading
- User notifications

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
