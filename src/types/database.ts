export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  bio?: string;
  avatar?: string;
  followers: string[];
  following: string[];
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  author: Author;
  category: string;
  imageUrl?: string;
  publishedAt: string;
  updatedAt: string;
  likes: string[];
  shares: number;
  commentCount: number;
  isPublished: boolean;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: Author;
  postId: string;
  createdAt: string;
  updatedAt: string;
  likes: string[];
  parentId?: string; // For nested comments
}

export interface Like {
  id: string;
  userId: string;
  postId?: string;
  commentId?: string;
  createdAt: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface Share {
  id: string;
  userId: string;
  postId: string;
  platform: 'twitter' | 'facebook' | 'linkedin' | 'copy';
  createdAt: string;
}

// API Response types
export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  avatar?: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  imageUrl?: string;
  isPublished?: boolean;
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: string;
}

export interface CreateCommentRequest {
  content: string;
  postId: string;
  parentId?: string;
}

export interface UpdateCommentRequest {
  id: string;
  content: string;
}
