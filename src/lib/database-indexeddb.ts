import CryptoJS from 'crypto-js';
import { SignJWT, jwtVerify } from 'jose';
import { db } from './indexeddb';
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

const JWT_SECRET = new TextEncoder().encode('your-secret-key-change-in-production');

// Authentication functions
export const hashPassword = async (password: string): Promise<string> => {
  return CryptoJS.SHA256(password).toString();
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return CryptoJS.SHA256(password).toString() === hash;
};

export const generateToken = async (userId: string): Promise<string> => {
  const jwt = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
  return jwt;
};

export const verifyToken = async (token: string): Promise<{ userId: string } | null> => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string };
  } catch {
    return null;
  }
};

// User functions
export const createUser = async (userData: SignupRequest): Promise<AuthResponse> => {
  const existingUser = await db.findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(userData.password);
  const user = await db.createUser({
    email: userData.email,
    password: hashedPassword,
    name: userData.name,
    bio: '',
    avatar: ''
  });

  const token = await generateToken(user.id);
  
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
      followers: user.followers,
      following: user.following,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    },
    token
  };
};

export const loginUser = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const user = await db.findUserByEmail(credentials.email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await comparePassword(credentials.password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  const token = await generateToken(user.id);
  
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
      followers: user.followers,
      following: user.following,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    },
    token
  };
};

export const getUserById = async (id: string): Promise<Omit<User, 'password'> | null> => {
  const user = await db.findUserById(id);
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    bio: user.bio,
    avatar: user.avatar,
    followers: user.followers,
    following: user.following,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

export const updateUserProfile = async (userId: string, updates: UpdateProfileRequest): Promise<Omit<User, 'password'>> => {
  const updatedUser = await db.updateUser(userId, updates);
  if (!updatedUser) {
    throw new Error('User not found');
  }

  return {
    id: updatedUser.id,
    email: updatedUser.email,
    name: updatedUser.name,
    bio: updatedUser.bio,
    avatar: updatedUser.avatar,
    followers: updatedUser.followers,
    following: updatedUser.following,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt
  };
};

// Blog post functions
export const createPost = async (authorId: string, postData: CreatePostRequest): Promise<BlogPost> => {
  const author = await db.findUserById(authorId);
  if (!author) {
    throw new Error('User not found');
  }

  const post = await db.createPost({
    title: postData.title,
    content: postData.content,
    excerpt: postData.excerpt,
    authorId,
    author: {
      id: author.id,
      name: author.name,
      avatar: author.avatar
    },
    category: postData.category,
    imageUrl: postData.imageUrl,
    isPublished: postData.isPublished ?? true
  });

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    authorId: post.authorId,
    author: post.author,
    category: post.category,
    imageUrl: post.imageUrl,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    likes: post.likes,
    shares: post.shares,
    commentCount: post.commentCount,
    isPublished: post.isPublished
  };
};

export const getPosts = async (limit = 10, offset = 0, publishedOnly = true): Promise<BlogPost[]> => {
  const posts = await db.getPosts(limit, offset, publishedOnly);
  return posts.map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    authorId: post.authorId,
    author: post.author,
    category: post.category,
    imageUrl: post.imageUrl,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    likes: post.likes,
    shares: post.shares,
    commentCount: post.commentCount,
    isPublished: post.isPublished
  }));
};

export const getPostById = async (id: string): Promise<BlogPost | null> => {
  const post = await db.getPostById(id);
  if (!post) return null;

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    authorId: post.authorId,
    author: post.author,
    category: post.category,
    imageUrl: post.imageUrl,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    likes: post.likes,
    shares: post.shares,
    commentCount: post.commentCount,
    isPublished: post.isPublished
  };
};

export const getPostsByUser = async (userId: string, publishedOnly = true): Promise<BlogPost[]> => {
  const posts = await db.getPostsByUser(userId, publishedOnly);
  return posts.map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    authorId: post.authorId,
    author: post.author,
    category: post.category,
    imageUrl: post.imageUrl,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    likes: post.likes,
    shares: post.shares,
    commentCount: post.commentCount,
    isPublished: post.isPublished
  }));
};

export const updatePost = async (postId: string, userId: string, updates: Partial<CreatePostRequest>): Promise<BlogPost | null> => {
  const post = await db.getPostById(postId);
  if (!post || post.authorId !== userId) {
    throw new Error('Post not found or unauthorized');
  }

  const updatedPost = await db.updatePost(postId, updates);
  if (!updatedPost) return null;

  return {
    id: updatedPost.id,
    title: updatedPost.title,
    content: updatedPost.content,
    excerpt: updatedPost.excerpt,
    authorId: updatedPost.authorId,
    author: updatedPost.author,
    category: updatedPost.category,
    imageUrl: updatedPost.imageUrl,
    publishedAt: updatedPost.publishedAt,
    updatedAt: updatedPost.updatedAt,
    likes: updatedPost.likes,
    shares: updatedPost.shares,
    commentCount: updatedPost.commentCount,
    isPublished: updatedPost.isPublished
  };
};

export const deletePost = async (postId: string, userId: string): Promise<boolean> => {
  const post = await db.getPostById(postId);
  if (!post || post.authorId !== userId) {
    throw new Error('Post not found or unauthorized');
  }

  return await db.deletePost(postId);
};

// Comment functions
export const createComment = async (authorId: string, commentData: CreateCommentRequest): Promise<Comment> => {
  const author = await db.findUserById(authorId);
  if (!author) {
    throw new Error('User not found');
  }

  const comment = await db.createComment({
    content: commentData.content,
    authorId,
    author: {
      id: author.id,
      name: author.name,
      avatar: author.avatar
    },
    postId: commentData.postId,
    parentId: commentData.parentId
  });

  return {
    id: comment.id,
    content: comment.content,
    authorId: comment.authorId,
    author: comment.author,
    postId: comment.postId,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    likes: comment.likes,
    parentId: comment.parentId
  };
};

export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  const comments = await db.getCommentsByPostId(postId);
  return comments.map(comment => ({
    id: comment.id,
    content: comment.content,
    authorId: comment.authorId,
    author: comment.author,
    postId: comment.postId,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    likes: comment.likes,
    parentId: comment.parentId
  }));
};

export const updateComment = async (commentId: string, userId: string, updates: UpdateCommentRequest): Promise<Comment | null> => {
  const updatedComment = await db.updateComment(commentId, updates);
  if (!updatedComment) {
    throw new Error('Comment not found or unauthorized');
  }

  return {
    id: updatedComment.id,
    content: updatedComment.content,
    authorId: updatedComment.authorId,
    author: updatedComment.author,
    postId: updatedComment.postId,
    createdAt: updatedComment.createdAt,
    updatedAt: updatedComment.updatedAt,
    likes: updatedComment.likes,
    parentId: updatedComment.parentId
  };
};

export const deleteComment = async (commentId: string, userId: string): Promise<boolean> => {
  return await db.deleteComment(commentId);
};

// Like functions
export const toggleLike = async (userId: string, postId?: string, commentId?: string): Promise<boolean> => {
  return await db.toggleLike(userId, postId, commentId);
};

// Follow functions
export const toggleFollow = async (followerId: string, followingId: string): Promise<boolean> => {
  return await db.toggleFollow(followerId, followingId);
};

// Share functions
export const sharePost = async (userId: string, postId: string, platform: 'twitter' | 'facebook' | 'linkedin' | 'copy'): Promise<Share> => {
  const share = await db.sharePost(userId, postId, platform);
  return {
    id: share.id,
    userId: share.userId,
    postId: share.postId,
    platform: share.platform,
    createdAt: share.createdAt
  };
};

// Search functions
export const searchPosts = async (query: string, limit = 10): Promise<BlogPost[]> => {
  const posts = await db.searchPosts(query, limit);
  return posts.map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    authorId: post.authorId,
    author: post.author,
    category: post.category,
    imageUrl: post.imageUrl,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    likes: post.likes,
    shares: post.shares,
    commentCount: post.commentCount,
    isPublished: post.isPublished
  }));
};

export const getPostsByCategory = async (category: string, limit = 10): Promise<BlogPost[]> => {
  const posts = await db.getPostsByCategory(category, limit);
  return posts.map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    authorId: post.authorId,
    author: post.author,
    category: post.category,
    imageUrl: post.imageUrl,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    likes: post.likes,
    shares: post.shares,
    commentCount: post.commentCount,
    isPublished: post.isPublished
  }));
};

// Initialize demo data
export const initializeDatabase = async () => {
  await db.init();
  await db.initializeDemoData();
};
