import { 
  User, 
  BlogPost, 
  Comment, 
  Like, 
  Follow, 
  Share,
  AuthResponse,
  LoginRequest,
  SignupRequest,
  UpdateProfileRequest,
  CreatePostRequest,
  UpdatePostRequest,
  CreateCommentRequest,
  UpdateCommentRequest
} from '@/types/database';

// MongoDB Atlas connection string
const MONGODB_URI = 'mongodb://localhost:27017/IndoGyaan';

// Simple in-memory database for now (will be replaced with actual MongoDB calls)
class MongoDBClient {
  private users: User[] = [];
  private posts: BlogPost[] = [];
  private comments: Comment[] = [];
  private likes: Like[] = [];
  private follows: Follow[] = [];
  private shares: Share[] = [];

  async init(): Promise<void> {
    console.log('Initializing MongoDB client...');
    // In a real implementation, this would connect to MongoDB
    // For now, we'll use in-memory storage
    await this.initializeDemoData();
  }

  // User operations
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'followers' | 'following' | 'role'>): Promise<User> {
    const user: User = {
      id: this.generateId(),
      ...userData,
      followers: [],
      following: [],
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.users.push(user);
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }

  async findUserById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.users[userIndex];
  }

  // Blog post operations
  async createPost(postData: Omit<BlogPost, 'id' | 'publishedAt' | 'updatedAt' | 'likes' | 'shares' | 'commentCount'>): Promise<BlogPost> {
    const post: BlogPost = {
      id: this.generateId(),
      ...postData,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: [],
      shares: 0,
      commentCount: 0
    };

    this.posts.push(post);
    return post;
  }

  async getPosts(limit = 10, offset = 0, publishedOnly = true): Promise<BlogPost[]> {
    let posts = this.posts;
    
    if (publishedOnly) {
      posts = posts.filter(p => p.isPublished);
    }
    
    return posts
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(offset, offset + limit);
  }

  async getPostById(id: string): Promise<BlogPost | null> {
    return this.posts.find(p => p.id === id) || null;
  }

  async getPostsByUser(userId: string, publishedOnly = true): Promise<BlogPost[]> {
    let posts = this.posts.filter(p => p.authorId === userId);
    
    if (publishedOnly) {
      posts = posts.filter(p => p.isPublished);
    }
    
    return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
    const postIndex = this.posts.findIndex(p => p.id === id);
    if (postIndex === -1) return null;

    this.posts[postIndex] = {
      ...this.posts[postIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.posts[postIndex];
  }

  async deletePost(id: string): Promise<boolean> {
    const postIndex = this.posts.findIndex(p => p.id === id);
    if (postIndex === -1) return false;

    this.posts.splice(postIndex, 1);
    
    // Delete associated comments and likes
    this.comments = this.comments.filter(c => c.postId !== id);
    this.likes = this.likes.filter(l => l.postId !== id);
    
    return true;
  }

  // Comment operations
  async createComment(commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'likes'>): Promise<Comment> {
    const comment: Comment = {
      id: this.generateId(),
      ...commentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: []
    };

    this.comments.push(comment);
    
    // Update comment count
    const postIndex = this.posts.findIndex(p => p.id === commentData.postId);
    if (postIndex !== -1) {
      this.posts[postIndex].commentCount += 1;
    }
    
    return comment;
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return this.comments
      .filter(c => c.postId === postId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateComment(id: string, updates: Partial<Comment>): Promise<Comment | null> {
    const commentIndex = this.comments.findIndex(c => c.id === id);
    if (commentIndex === -1) return null;

    this.comments[commentIndex] = {
      ...this.comments[commentIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.comments[commentIndex];
  }

  async deleteComment(id: string): Promise<boolean> {
    const commentIndex = this.comments.findIndex(c => c.id === id);
    if (commentIndex === -1) return false;

    const comment = this.comments[commentIndex];
    this.comments.splice(commentIndex, 1);
    
    // Update comment count
    const postIndex = this.posts.findIndex(p => p.id === comment.postId);
    if (postIndex !== -1) {
      this.posts[postIndex].commentCount -= 1;
    }
    
    // Delete associated likes
    this.likes = this.likes.filter(l => l.commentId !== id);
    
    return true;
  }

  // Like operations
  async toggleLike(userId: string, postId?: string, commentId?: string): Promise<boolean> {
    const existingLike = this.likes.find(l => 
      l.userId === userId && 
      (postId ? l.postId === postId : l.commentId === commentId)
    );

    if (existingLike) {
      // Unlike
      const likeIndex = this.likes.findIndex(l => l.id === existingLike.id);
      this.likes.splice(likeIndex, 1);
      
      if (postId) {
        const postIndex = this.posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          this.posts[postIndex].likes = this.posts[postIndex].likes.filter(id => id !== userId);
        }
      } else if (commentId) {
        const commentIndex = this.comments.findIndex(c => c.id === commentId);
        if (commentIndex !== -1) {
          this.comments[commentIndex].likes = this.comments[commentIndex].likes.filter(id => id !== userId);
        }
      }
      
      return false; // Unliked
    } else {
      // Like
      const like: Like = {
        id: this.generateId(),
        userId,
        postId,
        commentId,
        createdAt: new Date().toISOString()
      };

      this.likes.push(like);
      
      if (postId) {
        const postIndex = this.posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          this.posts[postIndex].likes.push(userId);
        }
      } else if (commentId) {
        const commentIndex = this.comments.findIndex(c => c.id === commentId);
        if (commentIndex !== -1) {
          this.comments[commentIndex].likes.push(userId);
        }
      }
      
      return true; // Liked
    }
  }

  // Follow operations
  async toggleFollow(followerId: string, followingId: string): Promise<boolean> {
    const existingFollow = this.follows.find(f => 
      f.followerId === followerId && f.followingId === followingId
    );

    if (existingFollow) {
      // Unfollow
      const followIndex = this.follows.findIndex(f => f.id === existingFollow.id);
      this.follows.splice(followIndex, 1);
      
      // Update user relationships
      const followerIndex = this.users.findIndex(u => u.id === followerId);
      const followingIndex = this.users.findIndex(u => u.id === followingId);
      
      if (followerIndex !== -1) {
        this.users[followerIndex].following = this.users[followerIndex].following.filter(id => id !== followingId);
      }
      if (followingIndex !== -1) {
        this.users[followingIndex].followers = this.users[followingIndex].followers.filter(id => id !== followerId);
      }
      
      return false; // Unfollowed
    } else {
      // Follow
      const follow: Follow = {
        id: this.generateId(),
        followerId,
        followingId,
        createdAt: new Date().toISOString()
      };

      this.follows.push(follow);
      
      // Update user relationships
      const followerIndex = this.users.findIndex(u => u.id === followerId);
      const followingIndex = this.users.findIndex(u => u.id === followingId);
      
      if (followerIndex !== -1) {
        this.users[followerIndex].following.push(followingId);
      }
      if (followingIndex !== -1) {
        this.users[followingIndex].followers.push(followerId);
      }
      
      return true; // Followed
    }
  }

  // Share operations
  async sharePost(userId: string, postId: string, platform: 'twitter' | 'facebook' | 'linkedin' | 'copy'): Promise<Share> {
    const share: Share = {
      id: this.generateId(),
      userId,
      postId,
      platform,
      createdAt: new Date().toISOString()
    };

    this.shares.push(share);
    
    // Update share count
    const postIndex = this.posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
      this.posts[postIndex].shares += 1;
    }
    
    return share;
  }

  // Search operations
  async searchPosts(query: string, limit = 10): Promise<BlogPost[]> {
    const searchTerm = query.toLowerCase();
    return this.posts
      .filter(p => p.isPublished && (
        p.title.toLowerCase().includes(searchTerm) ||
        p.content.toLowerCase().includes(searchTerm) ||
        p.excerpt.toLowerCase().includes(searchTerm)
      ))
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }

  async getPostsByCategory(category: string, limit = 10): Promise<BlogPost[]> {
    return this.posts
      .filter(p => p.isPublished && p.category.toLowerCase().includes(category.toLowerCase()))
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }

  // Initialize demo data
  async initializeDemoData(): Promise<void> {
    // Check if data already exists
    if (this.users.length > 0) return;

    console.log('Initializing demo data...');

    // Create demo users
    const demoUsers: User[] = [
      {
        id: 'admin-user-1',
        email: 'admin@indogyaan.com',
        password: await this.hashPassword('admin123'),
        name: 'Admin User',
        bio: 'Administrator of IndoGyaan platform',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        followers: [],
        following: [],
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'demo-user-1',
        email: 'demo@indogyaan.com',
        password: await this.hashPassword('password'),
        name: 'Demo User',
        bio: 'A passionate learner sharing knowledge through IndoGyaan',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        followers: [],
        following: [],
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'guru-user-1',
        email: 'guru@indogyaan.com',
        password: await this.hashPassword('guru123'),
        name: 'Guru Sharma',
        bio: 'Traditional knowledge keeper and modern educator',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        followers: [],
        following: [],
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    this.users = demoUsers;

    // Create demo blog posts
    const demoPosts: BlogPost[] = [
      {
        id: 'post-1',
        title: 'ज्ञान का Digital युग: Ancient Wisdom in Modern Times',
        content: `# ज्ञान का Digital युग: Ancient Wisdom in Modern Times

In our fast-paced digital world, the ancient Indian concept of ज्ञान (knowledge) remains more relevant than ever. This article explores how traditional wisdom can guide us through modern challenges.

## What is ज्ञान (Gyaan)?

ज्ञान, or knowledge, in Indian philosophy is not just information but a deep understanding that transforms the seeker. It's the difference between knowing about something and truly understanding it.

## The Three Types of Knowledge

### 1. श्रुति (Shruti) - Heard Knowledge
Knowledge passed down through generations, like the Vedas and Upanishads.

### 2. स्मृति (Smriti) - Remembered Knowledge  
Knowledge that comes from experience and reflection.

### 3. अनुभव (Anubhav) - Experiential Knowledge
Knowledge gained through direct experience and practice.

## Applying Ancient Wisdom Today

### The Concept of सीखना (Learning)
- **Continuous Learning**: Like a river that never stops flowing
- **Humility**: Recognizing that there's always more to learn
- **Sharing**: Knowledge grows when shared

### Digital Age Applications
- **Mindful Technology Use**: Using technology as a tool, not a crutch
- **Community Learning**: Building knowledge communities online
- **Preserving Traditions**: Digitizing ancient texts and practices

## Modern Tools for Ancient Wisdom

### 1. Digital Libraries
Creating accessible repositories of traditional knowledge.

### 2. Online Learning Platforms
Making ancient wisdom available to global audiences.

### 3. Community Forums
Connecting seekers and teachers across the world.

## Conclusion

The digital age offers unprecedented opportunities to preserve, share, and expand upon ancient wisdom. By combining traditional knowledge with modern technology, we can create a more enlightened and connected world.

*"सर्वं ज्ञानं मयि विद्यते" - All knowledge exists within me*`,
        excerpt: 'Explore how ancient Indian wisdom can guide us through modern digital challenges and create meaningful learning experiences.',
        authorId: 'demo-user-1',
        author: {
          id: 'demo-user-1',
          name: 'Demo User',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        category: 'Philosophy',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
        isPublished: true,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: [],
        shares: 0,
        commentCount: 0
      },
      {
        id: 'post-2',
        title: 'Building Modern Web Applications with Traditional Principles',
        content: `# Building Modern Web Applications with Traditional Principles

How ancient Indian principles of design and architecture can inform modern web development practices.

## The Concept of सुंदरता (Beauty)

In Indian aesthetics, beauty is not just visual appeal but harmony between form and function.

### Web Design Applications
- **Balance**: Creating visual equilibrium in layouts
- **Proportion**: Using the golden ratio in design
- **Rhythm**: Creating flow through consistent patterns

## The Principle of योग (Union)

Yoga means union - bringing together different elements in harmony.

### Modern Applications
- **Component Architecture**: Building reusable, harmonious components
- **API Integration**: Connecting different services seamlessly
- **User Experience**: Creating unified, cohesive experiences

## The Art of ध्यान (Focus)

Meditation teaches us the power of focused attention.

### Development Practices
- **Single Responsibility**: Each function should have one clear purpose
- **Mindful Coding**: Writing code with intention and awareness
- **Deep Work**: Creating distraction-free development environments

## The Wisdom of सहयोग (Collaboration)

Ancient texts emphasize the importance of community and collaboration.

### Team Development
- **Code Reviews**: Learning from each other's perspectives
- **Pair Programming**: Collaborative problem-solving
- **Knowledge Sharing**: Building collective wisdom

## Conclusion

By applying traditional principles to modern development, we can create more meaningful, sustainable, and beautiful digital experiences.

*"योगः कर्मसु कौशलम्" - Excellence in action is yoga*`,
        excerpt: 'Discover how ancient Indian principles of design, architecture, and collaboration can enhance modern web development practices.',
        authorId: 'guru-user-1',
        author: {
          id: 'guru-user-1',
          name: 'Guru Sharma',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
        },
        category: 'Technology',
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
        isPublished: true,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: [],
        shares: 0,
        commentCount: 0
      }
    ];

    this.posts = demoPosts;

    console.log('Demo data initialized successfully!');
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private async hashPassword(password: string): Promise<string> {
    // Simple hash for demo purposes - in production, use a proper hashing library
    return btoa(password);
  }
}

// Export singleton instance
export const db = new MongoDBClient();
