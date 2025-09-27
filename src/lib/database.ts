import { mongoAPI as db } from './mongodb-api';
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

// Authentication functions
export const loginUser = async (credentials: LoginRequest): Promise<AuthResponse> => {
  return await db.login(credentials);
};

export const createUser = async (userData: SignupRequest): Promise<AuthResponse> => {
  return await db.signup(userData);
};

export const getUserById = async (id: string): Promise<Omit<User, 'password'> | null> => {
  return await db.getUserById(id);
};

export const updateUserProfile = async (userId: string, updates: UpdateProfileRequest): Promise<Omit<User, 'password'>> => {
  return await db.updateUserProfile(userId, updates);
};

export const toggleFollow = async (followerId: string, followingId: string): Promise<boolean> => {
  return await db.toggleFollow(followerId, followingId);
};

export const getAllUsers = async (): Promise<Omit<User, 'password'>[]> => {
  return await db.getAllUsers();
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  return await db.deleteUser(userId);
};

// Blog Post functions
export const createPost = async (postData: CreatePostRequest, authorId: string): Promise<BlogPost> => {
  return await db.createPost(postData, authorId);
};

export const getPosts = async (limit: number, offset: number, publishedOnly: boolean = true): Promise<BlogPost[]> => {
  return await db.getPosts(limit, offset, publishedOnly);
};

export const getPostById = async (id: string): Promise<BlogPost | null> => {
  return await db.getPostById(id);
};

export const getPostsByUser = async (userId: string, publishedOnly: boolean = true): Promise<BlogPost[]> => {
  return await db.getPostsByUser(userId, publishedOnly);
};

export const updatePost = async (postId: string, updates: UpdatePostRequest): Promise<BlogPost> => {
  return await db.updatePost(postId, updates);
};

export const deletePost = async (postId: string): Promise<boolean> => {
  return await db.deletePost(postId);
};

export const toggleLike = async (userId: string, postId: string): Promise<boolean> => {
  return await db.toggleLike(userId, postId);
};

export const sharePost = async (userId: string, postId: string, platform: 'twitter' | 'facebook' | 'linkedin' | 'copy'): Promise<Share> => {
  return await db.sharePost(userId, postId, platform);
};

export const searchPosts = async (query: string, limit = 10): Promise<BlogPost[]> => {
  return await db.searchPosts(query, limit);
};

export const getPostsByCategory = async (category: string, limit = 10): Promise<BlogPost[]> => {
  return await db.getPostsByCategory(category, limit);
};

// Comment functions
export const createComment = async (commentData: CreateCommentRequest, authorId: string): Promise<Comment> => {
  return await db.createComment(commentData, authorId);
};

export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  return await db.getCommentsByPostId(postId);
};

export const updateComment = async (commentId: string, updates: UpdateCommentRequest): Promise<Comment> => {
  return await db.updateComment(commentId, updates);
};

export const deleteComment = async (commentId: string): Promise<boolean> => {
  return await db.deleteComment(commentId);
};

// Initialize demo data
export const initializeDatabase = async () => {
  await db.initializeDemoData();
};