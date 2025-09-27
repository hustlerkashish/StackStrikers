# IndoGyaan - Knowledge Platform

A modern knowledge sharing platform that bridges ancient Indian wisdom with contemporary learning. Built with React, TypeScript, and IndexedDB for client-side data persistence.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure login/signup with JWT tokens
- **Blog Management**: Create, edit, delete, and publish articles
- **Social Features**: Like, comment, share, and follow users
- **Profile Management**: Update profile, avatar, and bio
- **Admin Panel**: Comprehensive admin dashboard for user and content management

### Navigation Structure
- **Home**: Main blog feed with articles and categories
- **Library**: Curated collection of articles with advanced filtering
- **Stories**: Personal experiences and transformative journeys
- **Stats**: Platform analytics and community insights
- **Following**: Connect with writers and discover new content
- **Profile**: Personal profile and account management

### Design System
- **Color Palette**: Deep Saffron (#FF9933), Indigo Blue (#1A237E), Ivory White (#FAF9F6), Lotus Pink (#E91E63)
- **Responsive Design**: Mobile-first approach with modern UI components
- **Accessibility**: WCAG compliant with keyboard navigation support

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StackStrikers
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

## 👥 Demo Users

The platform comes with pre-configured demo users for testing:

### Admin User
- **Email**: `admin@indogyaan.com`
- **Password**: `admin123`
- **Role**: Administrator
- **Access**: Full admin panel access

### Regular Users
- **Email**: `guru@indogyaan.com` | **Password**: `guru123` | **Name**: Guru Sharma
- **Email**: `ananya@indogyaan.com` | **Password**: `ananya123` | **Name**: Dr. Ananya Singh
- **Email**: `rajesh@indogyaan.com` | **Password**: `rajesh123` | **Name**: Rajesh Kumar
- **Email**: `priya@indogyaan.com` | **Password**: `priya123` | **Name**: Priya Patel

## 🔐 Admin Panel Access

### Direct Admin Login
1. Navigate to `/admin-panel` in your browser
2. Login with admin credentials:
   - **Email**: `admin@indogyaan.com`
   - **Password**: `admin123`

### Admin Features
- **User Management**: View, delete users
- **Content Management**: Manage all blog posts
- **Analytics**: Platform statistics and insights
- **Moderation**: Review and moderate content

### Admin Panel URL
```
http://localhost:8080/admin-panel
```

## 📊 Database Structure

### IndexedDB Collections
- **Users**: User profiles, authentication, roles
- **Posts**: Blog articles with metadata
- **Comments**: User comments on posts
- **Likes**: User likes on posts and comments
- **Follows**: User following relationships
- **Shares**: Post sharing tracking

### Data Persistence
- **Client-side**: IndexedDB for browser storage
- **Automatic Sync**: Data persists across browser sessions
- **Demo Data**: Pre-populated with sample content

## 🛠️ Technical Stack

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Modern component library

### State Management
- **React Context**: Authentication and app state
- **React Query**: Server state management
- **IndexedDB**: Client-side data persistence

### Authentication
- **JWT Tokens**: Secure authentication
- **Crypto-js**: Password hashing
- **Jose**: JWT token handling

## 📱 Features Overview

### User Experience
- **Landing Page**: Beautiful welcome page with platform introduction
- **Responsive Design**: Works on all device sizes
- **Dark/Light Mode**: Theme switching capability
- **Search & Filter**: Advanced content discovery
- **Social Interaction**: Like, comment, share, follow

### Content Management
- **Rich Text Editor**: Markdown support for articles
- **Image Upload**: Avatar and article image support
- **Category System**: Organized content categorization
- **Draft System**: Save articles as drafts
- **Publishing Workflow**: Publish/unpublish articles

### Social Features
- **User Profiles**: Detailed user information
- **Following System**: Follow/unfollow users
- **Engagement**: Like and comment on content
- **Sharing**: Share articles across platforms
- **Notifications**: Activity updates (future feature)

## 🎨 Design System

### Color Palette
```css
--deep-saffron: #FF9933    /* Primary - Knowledge, Energy */
--indigo-blue: #1A237E     /* Secondary - Depth, Tradition */
--ivory-white: #FAF9F6     /* Background - Purity, Simplicity */
--lotus-pink: #E91E63       /* Accent - Subtle highlights */
```

### Typography
- **Headings**: Bold, modern sans-serif
- **Body**: Readable, accessible font stack
- **Code**: Monospace for technical content

### Components
- **Cards**: Consistent content containers
- **Buttons**: Primary, secondary, and ghost variants
- **Forms**: Accessible form components
- **Navigation**: Responsive navigation system

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── contexts/           # React contexts
├── lib/                # Utility functions
├── types/              # TypeScript definitions
├── hooks/              # Custom React hooks
└── assets/             # Static assets
```

### Key Files
- `src/App.tsx`: Main application component
- `src/lib/database.ts`: Database operations
- `src/lib/indexeddb.ts`: IndexedDB service
- `src/contexts/AuthContext.tsx`: Authentication context
- `src/components/Navigation.tsx`: Main navigation

### Adding New Features
1. Create components in `src/components/`
2. Add pages in `src/pages/`
3. Update routing in `src/App.tsx`
4. Add types in `src/types/`
5. Update database schema if needed

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deployment Options
- **Vercel**: Easy deployment with Vercel CLI
- **Netlify**: Drag and drop deployment
- **GitHub Pages**: Static site hosting
- **AWS S3**: Scalable cloud hosting

## 📈 Performance

### Optimization Features
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Responsive images
- **Caching**: Efficient data caching
- **Bundle Size**: Optimized build output

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile
- **Accessibility**: Screen reader support

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Testing**: Unit and integration tests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Common Issues
1. **Database not loading**: Clear browser storage and refresh
2. **Authentication errors**: Check JWT token validity
3. **Build errors**: Ensure all dependencies are installed

### Getting Help
- **Documentation**: Check this README
- **Issues**: Create a GitHub issue
- **Community**: Join our discussion forum

## 🔮 Future Roadmap

### Planned Features
- **Real-time Chat**: Live messaging between users
- **Video Content**: Video article support
- **Mobile App**: React Native mobile application
- **API Integration**: External content sources
- **Advanced Analytics**: Detailed user insights
- **Multi-language**: Internationalization support

### Technical Improvements
- **Server-side Rendering**: Next.js migration
- **Database Migration**: PostgreSQL integration
- **Microservices**: Scalable architecture
- **AI Integration**: Content recommendations
- **Blockchain**: Decentralized content verification

---

**IndoGyaan** - Where Ancient Wisdom Meets Modern Technology

*Built with ❤️ for the knowledge community*