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

const API_BASE_URL = 'http://localhost:5000/api';

class MongoDBAPIService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['authorization'] = `Bearer ${this.token}`;
    }

    console.log('Making request to:', url);
    console.log('Request options:', { method: options.method || 'GET', headers, body: options.body });

    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const error = await response.json();
      console.error('Request failed:', error);
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    this.setToken(response.token);
    return response;
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    this.setToken(response.token);
    return response;
  }

  // User operations
  async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
    try {
      return await this.request(`/users/${id}`);
    } catch (error) {
      return null;
    }
  }

  async updateUserProfile(userId: string, updates: UpdateProfileRequest): Promise<Omit<User, 'password'>> {
    return await this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Blog Post operations
  async getPosts(limit: number = 10, offset: number = 0, publishedOnly: boolean = true): Promise<BlogPost[]> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    return await this.request(`/posts?${params}`);
  }

  async getPostById(id: string): Promise<BlogPost | null> {
    try {
      return await this.request(`/posts/${id}`);
    } catch (error) {
      return null;
    }
  }

  async getPostsByUser(userId: string, publishedOnly: boolean = true): Promise<BlogPost[]> {
    const params = new URLSearchParams({
      authorId: userId,
      limit: '100',
      offset: '0',
    });

    if (publishedOnly) {
      params.append('published', 'true');
    }

    return await this.request(`/posts?${params}`);
  }

  async createPost(postData: CreatePostRequest, authorId: string): Promise<BlogPost> {
    return await this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updatePost(postId: string, updates: UpdatePostRequest): Promise<BlogPost> {
    return await this.request(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deletePost(postId: string): Promise<boolean> {
    await this.request(`/posts/${postId}`, {
      method: 'DELETE',
    });
    return true;
  }

  async toggleLike(userId: string, postId: string): Promise<boolean> {
    const response = await this.request(`/posts/${postId}/like`, {
      method: 'POST',
    });
    return response.liked;
  }

  async sharePost(userId: string, postId: string, platform: 'twitter' | 'facebook' | 'linkedin' | 'copy'): Promise<Share> {
    return await this.request(`/posts/${postId}/share`, {
      method: 'POST',
      body: JSON.stringify({ platform }),
    });
  }

  async searchPosts(query: string, limit = 10): Promise<BlogPost[]> {
    const params = new URLSearchParams({
      search: query,
      limit: limit.toString(),
    });

    return await this.request(`/posts?${params}`);
  }

  async getPostsByCategory(category: string, limit = 10): Promise<BlogPost[]> {
    const params = new URLSearchParams({
      category,
      limit: limit.toString(),
    });

    return await this.request(`/posts?${params}`);
  }

  // Comment operations
  async createComment(commentData: CreateCommentRequest, authorId: string): Promise<Comment> {
    return await this.request(`/posts/${commentData.postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return await this.request(`/comments/post/${postId}`);
  }

  async updateComment(commentId: string, updates: UpdateCommentRequest): Promise<Comment> {
    // This would need to be implemented in the backend
    throw new Error('Update comment not implemented in backend yet');
  }

  async deleteComment(commentId: string): Promise<boolean> {
    // This would need to be implemented in the backend
    throw new Error('Delete comment not implemented in backend yet');
  }

  // Follow operations
  async toggleFollow(followerId: string, followingId: string): Promise<boolean> {
    const response = await this.request(`/users/${followingId}/follow`, {
      method: 'POST',
    });
    return response.following;
  }

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    return await this.request('/users');
  }

  async deleteUser(userId: string): Promise<boolean> {
    await this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
    return true;
  }

  // Initialize demo data
  async initializeDemoData(): Promise<void> {
    try {
      await this.request('/init-demo', {
        method: 'POST',
      });
      console.log('Demo data initialized successfully!');
    } catch (error) {
      console.error('Failed to initialize demo data:', error);
    }
  }
}

export const mongoAPI = new MongoDBAPIService();
