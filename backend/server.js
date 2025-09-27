const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = 'mongodb://localhost:27017/IndoGyaan';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  bio: String,
  avatar: String,
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Blog Post Schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  author: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    avatar: String
  },
  category: { type: String, required: true },
  imageUrl: String,
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  shares: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 }
});

// Comment Schema
const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  author: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    avatar: String
  },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// Like Schema
const likeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  createdAt: { type: Date, default: Date.now }
});

// Follow Schema
const followSchema = new mongoose.Schema({
  followerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  followingId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Share Schema
const shareSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  platform: { type: String, enum: ['twitter', 'facebook', 'linkedin', 'copy'], required: true },
  createdAt: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Like = mongoose.model('Like', likeSchema);
const Follow = mongoose.model('Follow', followSchema);
const Share = mongoose.model('Share', shareSchema);

// JWT Secret
const JWT_SECRET = 'your-secret-key-change-in-production';

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      followers: [],
      following: [],
      role: 'user'
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Routes
app.get('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, bio, avatar, updatedAt: new Date() },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post Routes
app.get('/api/posts', async (req, res) => {
  try {
    const { limit = 10, offset = 0, category, search, authorId, published } = req.query;
    
    let query = {};
    
    if (published !== 'false') {
      query.isPublished = true;
    }
    
    if (category) {
      query.category = new RegExp(category, 'i');
    }
    
    if (authorId) {
      query.authorId = authorId;
    }
    
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { content: new RegExp(search, 'i') },
        { excerpt: new RegExp(search, 'i') }
      ];
    }

    const posts = await Post.find(query)
      .populate('authorId', 'name avatar')
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('authorId', 'name avatar');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts', authenticateToken, async (req, res) => {
  try {
    const { title, content, excerpt, category, imageUrl, isPublished } = req.body;
    
    const post = new Post({
      title,
      content,
      excerpt,
      authorId: req.user.userId,
      author: {
        id: req.user.userId,
        name: req.user.name,
        avatar: req.user.avatar
      },
      category,
      imageUrl,
      isPublished: isPublished || false
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/posts/:id', authenticateToken, async (req, res) => {
  try {
    const { title, content, excerpt, category, imageUrl, isPublished } = req.body;
    
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        content, 
        excerpt, 
        category, 
        imageUrl, 
        isPublished,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('authorId', 'name avatar');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/posts/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Delete associated comments and likes
    await Comment.deleteMany({ postId: req.params.id });
    await Like.deleteMany({ postId: req.params.id });
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Comment Routes
app.get('/api/posts/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id })
      .populate('authorId', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/comments/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate('authorId', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { content, parentId } = req.body;
    
    const comment = new Comment({
      content,
      authorId: req.user.userId,
      author: {
        id: req.user.userId,
        name: req.user.name,
        avatar: req.user.avatar
      },
      postId: req.params.id,
      parentId
    });

    await comment.save();
    
    // Update comment count
    await Post.findByIdAndUpdate(req.params.id, { $inc: { commentCount: 1 } });
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/comments', authenticateToken, async (req, res) => {
  try {
    const { content, postId, parentId } = req.body;
    const userId = req.user.userId;

    const comment = new Comment({
      content,
      authorId: userId,
      author: {
        id: userId,
        name: req.user.name,
        avatar: req.user.avatar
      },
      postId,
      parentId
    });

    await comment.save();
    
    // Update comment count
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like Routes
app.post('/api/posts/:id/like', authenticateToken, async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user.userId;

    // Check if already liked
    const existingLike = await Like.findOne({ userId, postId });
    
    if (existingLike) {
      // Unlike
      await Like.findByIdAndDelete(existingLike._id);
      await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
      res.json({ liked: false });
    } else {
      // Like
      const like = new Like({ userId, postId });
      await like.save();
      await Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } });
      res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Share Routes
app.post('/api/posts/:id/share', authenticateToken, async (req, res) => {
  try {
    const { platform } = req.body;
    const { id: postId } = req.params;
    const userId = req.user.userId;

    const share = new Share({ userId, postId, platform });
    await share.save();
    
    // Update share count
    await Post.findByIdAndUpdate(postId, { $inc: { shares: 1 } });
    
    res.json(share);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Follow Routes
app.post('/api/users/:id/follow', authenticateToken, async (req, res) => {
  try {
    const { id: followingId } = req.params;
    const followerId = req.user.userId;

    if (followerId === followingId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({ followerId, followingId });
    
    if (existingFollow) {
      // Unfollow
      await Follow.findByIdAndDelete(existingFollow._id);
      await User.findByIdAndUpdate(followerId, { $pull: { following: followingId } });
      await User.findByIdAndUpdate(followingId, { $pull: { followers: followerId } });
      res.json({ following: false });
    } else {
      // Follow
      const follow = new Follow({ followerId, followingId });
      await follow.save();
      await User.findByIdAndUpdate(followerId, { $addToSet: { following: followingId } });
      await User.findByIdAndUpdate(followingId, { $addToSet: { followers: followerId } });
      res.json({ following: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize Demo Data
app.post('/api/init-demo', async (req, res) => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Like.deleteMany({});
    await Follow.deleteMany({});
    await Share.deleteMany({});

    // Create demo users
    const demoUsers = [
      {
        name: 'Admin User',
        email: 'admin@indogyaan.com',
        password: await bcrypt.hash('admin123', 10),
        bio: 'Administrator of IndoGyaan platform',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        role: 'admin'
      },
      {
        name: 'Guru Sharma',
        email: 'guru@indogyaan.com',
        password: await bcrypt.hash('guru123', 10),
        bio: 'Traditional knowledge keeper and modern educator',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        role: 'user'
      },
      {
        name: 'Dr. Ananya Singh',
        email: 'ananya@indogyaan.com',
        password: await bcrypt.hash('ananya123', 10),
        bio: 'Spiritual teacher and mindfulness expert',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        role: 'user'
      },
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@indogyaan.com',
        password: await bcrypt.hash('rajesh123', 10),
        bio: 'Technology meets tradition',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        role: 'user'
      },
      {
        name: 'Priya Patel',
        email: 'priya@indogyaan.com',
        password: await bcrypt.hash('priya123', 10),
        bio: 'Yoga instructor and wellness coach',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        role: 'user'
      }
    ];

    const users = await User.insertMany(demoUsers);

    // Create demo posts
    const demoPosts = [
      {
        title: 'ज्ञान का Digital युग: Ancient Wisdom in Modern Times',
        content: '# ज्ञान का Digital युग: Ancient Wisdom in Modern Times\n\nIn our fast-paced digital world, the ancient Indian concept of ज्ञान (knowledge) remains more relevant than ever...',
        excerpt: 'Explore how ancient Indian wisdom can guide us through modern digital challenges and create meaningful learning experiences.',
        authorId: users[1]._id,
        author: {
          id: users[1]._id,
          name: users[1].name,
          avatar: users[1].avatar
        },
        category: 'Philosophy',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
        isPublished: true
      },
      {
        title: 'Building Modern Web Applications with Traditional Principles',
        content: '# Building Modern Web Applications with Traditional Principles\n\nHow ancient Indian principles of design and architecture can inform modern web development practices...',
        excerpt: 'Discover how ancient Indian principles of design, architecture, and collaboration can enhance modern web development practices.',
        authorId: users[2]._id,
        author: {
          id: users[2]._id,
          name: users[2].name,
          avatar: users[2].avatar
        },
        category: 'Technology',
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
        isPublished: true
      }
    ];

    await Post.insertMany(demoPosts);

    res.json({ message: 'Demo data initialized successfully!', users: users.length, posts: demoPosts.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Additional endpoints for search and category
app.get('/api/posts/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;
    
    const posts = await Post.find({ 
      category: new RegExp(category, 'i'),
      isPublished: true 
    })
      .populate('authorId', 'name avatar')
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit));

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/posts/search', async (req, res) => {
  try {
    const { q: query, limit = 10 } = req.query;
    
    if (!query) {
      return res.json([]);
    }
    
    const posts = await Post.find({
      $or: [
        { title: new RegExp(query, 'i') },
        { content: new RegExp(query, 'i') },
        { excerpt: new RegExp(query, 'i') }
      ],
      isPublished: true
    })
      .populate('authorId', 'name avatar')
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit));

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB URI: ${MONGODB_URI}`);
});
