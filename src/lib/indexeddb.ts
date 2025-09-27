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

// IndexedDB Database Setup
const DB_NAME = 'IndoGyaanDB';
const DB_VERSION = 1;

interface DBCollections {
  users: User[];
  posts: BlogPost[];
  comments: Comment[];
  likes: Like[];
  follows: Follow[];
  shares: Share[];
}

class IndexedDBService {
  private db: IDBDatabase | null = null;
  private collections: DBCollections = {
    users: [],
    posts: [],
    comments: [],
    likes: [],
    follows: [],
    shares: []
  };

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        this.loadData();
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
        }
        
        if (!db.objectStoreNames.contains('posts')) {
          const postStore = db.createObjectStore('posts', { keyPath: 'id' });
          postStore.createIndex('authorId', 'authorId');
          postStore.createIndex('category', 'category');
          postStore.createIndex('isPublished', 'isPublished');
        }
        
        if (!db.objectStoreNames.contains('comments')) {
          const commentStore = db.createObjectStore('comments', { keyPath: 'id' });
          commentStore.createIndex('postId', 'postId');
          commentStore.createIndex('authorId', 'authorId');
        }
        
        if (!db.objectStoreNames.contains('likes')) {
          const likeStore = db.createObjectStore('likes', { keyPath: 'id' });
          likeStore.createIndex('userId', 'userId');
          likeStore.createIndex('postId', 'postId');
          likeStore.createIndex('commentId', 'commentId');
        }
        
        if (!db.objectStoreNames.contains('follows')) {
          const followStore = db.createObjectStore('follows', { keyPath: 'id' });
          followStore.createIndex('followerId', 'followerId');
          followStore.createIndex('followingId', 'followingId');
        }
        
        if (!db.objectStoreNames.contains('shares')) {
          const shareStore = db.createObjectStore('shares', { keyPath: 'id' });
          shareStore.createIndex('userId', 'userId');
          shareStore.createIndex('postId', 'postId');
        }
      };
    });
  }

  private async loadData(): Promise<void> {
    if (!this.db) return;

    const collections = ['users', 'posts', 'comments', 'likes', 'follows', 'shares'] as const;
    
    for (const collection of collections) {
      const transaction = this.db.transaction([collection], 'readonly');
      const store = transaction.objectStore(collection);
      const request = store.getAll();
      
      request.onsuccess = () => {
        (this.collections as any)[collection] = request.result || [];
      };
    }
  }

  private async saveToDB(collection: keyof DBCollections, data: any[]): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([collection], 'readwrite');
      const store = transaction.objectStore(collection);
      
      // Clear existing data
      store.clear();
      
      // Add new data
      data.forEach(item => {
        store.add(item);
      });
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
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

    this.collections.users.push(user);
    await this.saveToDB('users', this.collections.users);
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.collections.users.find(u => u.email === email) || null;
  }

  async findUserById(id: string): Promise<User | null> {
    return this.collections.users.find(u => u.id === id) || null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = this.collections.users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    this.collections.users[userIndex] = {
      ...this.collections.users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.saveToDB('users', this.collections.users);
    return this.collections.users[userIndex];
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

    this.collections.posts.push(post);
    await this.saveToDB('posts', this.collections.posts);
    return post;
  }

  async getPosts(limit = 10, offset = 0, publishedOnly = true): Promise<BlogPost[]> {
    let posts = this.collections.posts;
    
    if (publishedOnly) {
      posts = posts.filter(p => p.isPublished);
    }
    
    return posts
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(offset, offset + limit);
  }

  async getPostById(id: string): Promise<BlogPost | null> {
    return this.collections.posts.find(p => p.id === id) || null;
  }

  async getPostsByUser(userId: string, publishedOnly = true): Promise<BlogPost[]> {
    let posts = this.collections.posts.filter(p => p.authorId === userId);
    
    if (publishedOnly) {
      posts = posts.filter(p => p.isPublished);
    }
    
    return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
    const postIndex = this.collections.posts.findIndex(p => p.id === id);
    if (postIndex === -1) return null;

    this.collections.posts[postIndex] = {
      ...this.collections.posts[postIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.saveToDB('posts', this.collections.posts);
    return this.collections.posts[postIndex];
  }

  async deletePost(id: string): Promise<boolean> {
    const postIndex = this.collections.posts.findIndex(p => p.id === id);
    if (postIndex === -1) return false;

    this.collections.posts.splice(postIndex, 1);
    
    // Delete associated comments and likes
    this.collections.comments = this.collections.comments.filter(c => c.postId !== id);
    this.collections.likes = this.collections.likes.filter(l => l.postId !== id);
    
    await Promise.all([
      this.saveToDB('posts', this.collections.posts),
      this.saveToDB('comments', this.collections.comments),
      this.saveToDB('likes', this.collections.likes)
    ]);
    
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

    this.collections.comments.push(comment);
    
    // Update comment count
    const postIndex = this.collections.posts.findIndex(p => p.id === commentData.postId);
    if (postIndex !== -1) {
      this.collections.posts[postIndex].commentCount += 1;
    }
    
    await Promise.all([
      this.saveToDB('comments', this.collections.comments),
      this.saveToDB('posts', this.collections.posts)
    ]);
    
    return comment;
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return this.collections.comments
      .filter(c => c.postId === postId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateComment(id: string, updates: Partial<Comment>): Promise<Comment | null> {
    const commentIndex = this.collections.comments.findIndex(c => c.id === id);
    if (commentIndex === -1) return null;

    this.collections.comments[commentIndex] = {
      ...this.collections.comments[commentIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.saveToDB('comments', this.collections.comments);
    return this.collections.comments[commentIndex];
  }

  async deleteComment(id: string): Promise<boolean> {
    const commentIndex = this.collections.comments.findIndex(c => c.id === id);
    if (commentIndex === -1) return false;

    const comment = this.collections.comments[commentIndex];
    this.collections.comments.splice(commentIndex, 1);
    
    // Update comment count
    const postIndex = this.collections.posts.findIndex(p => p.id === comment.postId);
    if (postIndex !== -1) {
      this.collections.posts[postIndex].commentCount -= 1;
    }
    
    // Delete associated likes
    this.collections.likes = this.collections.likes.filter(l => l.commentId !== id);
    
    await Promise.all([
      this.saveToDB('comments', this.collections.comments),
      this.saveToDB('posts', this.collections.posts),
      this.saveToDB('likes', this.collections.likes)
    ]);
    
    return true;
  }

  // Like operations
  async toggleLike(userId: string, postId?: string, commentId?: string): Promise<boolean> {
    const existingLike = this.collections.likes.find(l => 
      l.userId === userId && 
      (postId ? l.postId === postId : l.commentId === commentId)
    );

    if (existingLike) {
      // Unlike
      const likeIndex = this.collections.likes.findIndex(l => l.id === existingLike.id);
      this.collections.likes.splice(likeIndex, 1);
      
      if (postId) {
        const postIndex = this.collections.posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          this.collections.posts[postIndex].likes = this.collections.posts[postIndex].likes.filter(id => id !== userId);
        }
      } else if (commentId) {
        const commentIndex = this.collections.comments.findIndex(c => c.id === commentId);
        if (commentIndex !== -1) {
          this.collections.comments[commentIndex].likes = this.collections.comments[commentIndex].likes.filter(id => id !== userId);
        }
      }
      
      await this.saveToDB('likes', this.collections.likes);
      if (postId) await this.saveToDB('posts', this.collections.posts);
      if (commentId) await this.saveToDB('comments', this.collections.comments);
      
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

      this.collections.likes.push(like);
      
      if (postId) {
        const postIndex = this.collections.posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          this.collections.posts[postIndex].likes.push(userId);
        }
      } else if (commentId) {
        const commentIndex = this.collections.comments.findIndex(c => c.id === commentId);
        if (commentIndex !== -1) {
          this.collections.comments[commentIndex].likes.push(userId);
        }
      }
      
      await this.saveToDB('likes', this.collections.likes);
      if (postId) await this.saveToDB('posts', this.collections.posts);
      if (commentId) await this.saveToDB('comments', this.collections.comments);
      
      return true; // Liked
    }
  }

  // Follow operations
  async toggleFollow(followerId: string, followingId: string): Promise<boolean> {
    const existingFollow = this.collections.follows.find(f => 
      f.followerId === followerId && f.followingId === followingId
    );

    if (existingFollow) {
      // Unfollow
      const followIndex = this.collections.follows.findIndex(f => f.id === existingFollow.id);
      this.collections.follows.splice(followIndex, 1);
      
      // Update user relationships
      const followerIndex = this.collections.users.findIndex(u => u.id === followerId);
      const followingIndex = this.collections.users.findIndex(u => u.id === followingId);
      
      if (followerIndex !== -1) {
        this.collections.users[followerIndex].following = this.collections.users[followerIndex].following.filter(id => id !== followingId);
      }
      if (followingIndex !== -1) {
        this.collections.users[followingIndex].followers = this.collections.users[followingIndex].followers.filter(id => id !== followerId);
      }
      
      await Promise.all([
        this.saveToDB('follows', this.collections.follows),
        this.saveToDB('users', this.collections.users)
      ]);
      
      return false; // Unfollowed
    } else {
      // Follow
      const follow: Follow = {
        id: this.generateId(),
        followerId,
        followingId,
        createdAt: new Date().toISOString()
      };

      this.collections.follows.push(follow);
      
      // Update user relationships
      const followerIndex = this.collections.users.findIndex(u => u.id === followerId);
      const followingIndex = this.collections.users.findIndex(u => u.id === followingId);
      
      if (followerIndex !== -1) {
        this.collections.users[followerIndex].following.push(followingId);
      }
      if (followingIndex !== -1) {
        this.collections.users[followingIndex].followers.push(followerId);
      }
      
      await Promise.all([
        this.saveToDB('follows', this.collections.follows),
        this.saveToDB('users', this.collections.users)
      ]);
      
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

    this.collections.shares.push(share);
    
    // Update share count
    const postIndex = this.collections.posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
      this.collections.posts[postIndex].shares += 1;
    }
    
    await Promise.all([
      this.saveToDB('shares', this.collections.shares),
      this.saveToDB('posts', this.collections.posts)
    ]);
    
    return share;
  }

  // Search operations
  async searchPosts(query: string, limit = 10): Promise<BlogPost[]> {
    const searchTerm = query.toLowerCase();
    return this.collections.posts
      .filter(p => p.isPublished && (
        p.title.toLowerCase().includes(searchTerm) ||
        p.content.toLowerCase().includes(searchTerm) ||
        p.excerpt.toLowerCase().includes(searchTerm)
      ))
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }

  async getPostsByCategory(category: string, limit = 10): Promise<BlogPost[]> {
    return this.collections.posts
      .filter(p => p.isPublished && p.category.toLowerCase().includes(category.toLowerCase()))
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }

  // Initialize demo data
  async initializeDemoData(): Promise<void> {
    // Check if data already exists
    if (this.collections.users.length > 0) return;

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
      },
      {
        id: 'ananya-user-1',
        email: 'ananya@indogyaan.com',
        password: await this.hashPassword('ananya123'),
        name: 'Dr. Ananya Singh',
        bio: 'Spiritual teacher and mindfulness expert',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        followers: [],
        following: [],
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'rajesh-user-1',
        email: 'rajesh@indogyaan.com',
        password: await this.hashPassword('rajesh123'),
        name: 'Rajesh Kumar',
        bio: 'Technology meets tradition',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        followers: [],
        following: [],
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'priya-user-1',
        email: 'priya@indogyaan.com',
        password: await this.hashPassword('priya123'),
        name: 'Priya Patel',
        bio: 'Yoga instructor and wellness coach',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        followers: [],
        following: [],
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    this.collections.users = demoUsers;
    await this.saveToDB('users', this.collections.users);

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
      },
      {
        id: 'post-3',
        title: 'The Art of Mindful Living in a Digital World',
        content: `# The Art of Mindful Living in a Digital World

In our hyperconnected society, the ancient practice of mindfulness offers a path to inner peace and clarity.

## Understanding Mindfulness

Mindfulness is the practice of being fully present in the moment, aware of where we are and what we're doing.

### Digital Mindfulness Practices
- **Tech-Free Hours**: Designated times without devices
- **Mindful Scrolling**: Conscious consumption of digital content
- **Digital Detox**: Regular breaks from technology

## The Science Behind Mindfulness

Research shows that mindfulness can:
- Reduce stress and anxiety
- Improve focus and concentration
- Enhance emotional regulation
- Boost immune system function

## Practical Applications

### Morning Routine
1. Wake up without immediately checking phone
2. Practice 10 minutes of meditation
3. Set intentions for the day
4. Mindful breakfast

### Work Integration
- Take mindful breaks every hour
- Practice deep breathing during meetings
- Use technology with intention
- Create digital boundaries

## Conclusion

Mindfulness isn't about escaping technology but using it wisely.`,
        excerpt: 'Discover how ancient mindfulness practices can help us navigate the modern digital world with greater awareness and peace.',
        authorId: 'ananya-user-1',
        author: {
          id: 'ananya-user-1',
          name: 'Dr. Ananya Singh',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
        },
        category: 'Spirituality',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
        isPublished: true,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        likes: ['demo-user-1', 'guru-user-1'],
        shares: 5,
        commentCount: 3
      },
      {
        id: 'post-4',
        title: 'Sustainable Technology: Lessons from Ancient Wisdom',
        content: `# Sustainable Technology: Lessons from Ancient Wisdom

How ancient Indian principles of sustainability can guide modern technological development.

## The Concept of अहिंसा (Non-violence)

Non-violence extends beyond human interaction to our relationship with nature.

### Environmental Applications
- **Green Computing**: Energy-efficient algorithms
- **Sustainable Design**: Long-lasting, repairable products
- **Circular Economy**: Waste reduction and recycling

## The Principle of संतुलन (Balance)

Ancient texts emphasize the importance of balance in all aspects of life.

### Technology Balance
- **Work-Life Integration**: Healthy technology boundaries
- **Digital Minimalism**: Using technology with purpose
- **Human-Centered Design**: Technology that serves humanity

## The Wisdom of सहयोग (Cooperation)

Collaboration and community are central to sustainable development.

### Modern Applications
- **Open Source**: Collaborative software development
- **Community Platforms**: Shared knowledge and resources
- **Collective Intelligence**: Harnessing group wisdom

## Conclusion

By applying ancient wisdom to modern technology, we can create a more sustainable and harmonious future.`,
        excerpt: 'Explore how ancient Indian principles of sustainability and balance can inform modern technological development.',
        authorId: 'rajesh-user-1',
        author: {
          id: 'rajesh-user-1',
          name: 'Rajesh Kumar',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        category: 'Technology',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
        isPublished: true,
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        likes: ['demo-user-1', 'ananya-user-1'],
        shares: 8,
        commentCount: 7
      },
      {
        id: 'post-5',
        title: 'Yoga Philosophy for Modern Wellness',
        content: `# Yoga Philosophy for Modern Wellness

Beyond physical postures, yoga offers a complete philosophy for holistic living.

## The Eight Limbs of Yoga

### 1. यम (Ethical Guidelines)
- **अहिंसा**: Non-violence in thought, word, and action
- **सत्य**: Truthfulness in all interactions
- **अस्तेय**: Non-stealing, including time and energy
- **ब्रह्मचर्य**: Moderation in all pursuits
- **अपरिग्रह**: Non-possessiveness

### 2. नियम (Personal Observances)
- **शौच**: Cleanliness of body and mind
- **संतोष**: Contentment with what is
- **तपस**: Self-discipline and austerity
- **स्वाध्याय**: Self-study and reflection
- **ईश्वर प्रणिधान**: Surrender to higher purpose

## Modern Applications

### Workplace Wellness
- **Mindful Meetings**: Present-moment awareness
- **Compassionate Communication**: Kind and honest dialogue
- **Work-Life Balance**: Healthy boundaries
- **Stress Management**: Breathing and meditation techniques

### Personal Development
- **Self-Awareness**: Understanding your patterns
- **Emotional Regulation**: Managing reactions
- **Spiritual Growth**: Connecting with purpose
- **Physical Health**: Holistic well-being

## Conclusion

Yoga philosophy provides timeless wisdom for navigating modern challenges with grace and wisdom.`,
        excerpt: 'Discover how the ancient philosophy of yoga can enhance your modern wellness journey.',
        authorId: 'priya-user-1',
        author: {
          id: 'priya-user-1',
          name: 'Priya Patel',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
        },
        category: 'Spirituality',
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop',
        isPublished: true,
        publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        likes: ['demo-user-1', 'guru-user-1', 'ananya-user-1'],
        shares: 12,
        commentCount: 9
      }
    ];

    this.collections.posts = demoPosts;
    await this.saveToDB('posts', this.collections.posts);

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
export const db = new IndexedDBService();
