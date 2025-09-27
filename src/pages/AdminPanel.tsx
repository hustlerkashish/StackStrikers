import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllUsers, getPosts, deleteUser, deletePost } from '@/lib/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  FileText, 
  MessageCircle, 
  Heart, 
  Share2, 
  TrendingUp,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  totalShares: number;
}

interface User {
  _id: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  followers: string[];
  following: string[];
}

interface BlogPost {
  _id: string;
  title: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  publishedAt: Date;
  isPublished: boolean;
  likes: string[];
  shares: number;
  commentCount: number;
}

export default function AdminPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    totalLikes: 0,
    totalShares: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'posts'>('overview');

  // Database service is now imported as db

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      return;
    }
    
    loadAdminData();
  }, [user]);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      
      // Load all users and posts
      const allUsers = await getAllUsers();
      const allPosts = await getPosts(100, 0, false);
      
      setStats({
        totalUsers: allUsers.length,
        totalPosts: allPosts.length,
        totalComments: allPosts.reduce((sum, post) => sum + (post.commentCount || 0), 0),
        totalLikes: allPosts.reduce((sum, post) => sum + (post.likes?.length || 0), 0),
        totalShares: allPosts.reduce((sum, post) => sum + (post.shares || 0), 0)
      });
      
      setUsers(allUsers);
      setPosts(allPosts);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId);
        toast({
          title: 'User deleted',
          description: 'User has been deleted successfully.',
        });
        loadAdminData();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete user. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await deletePost(postId);
        toast({
          title: 'Post deleted',
          description: 'Post has been deleted successfully.',
        });
        loadAdminData();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete post. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-indo-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Alert variant="destructive">
              <AlertDescription>
                Access denied. Admin privileges required.
              </AlertDescription>
            </Alert>
            <Button asChild className="mt-4">
              <Link to="/">Go to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-indo-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indo-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-indo-secondary">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indo-background">
      {/* Header */}
      <div className="bg-indo-secondary text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-indo-primary mt-2">Manage your IndoGyaan platform</p>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" className="border-indo-primary text-indo-primary hover:bg-indo-primary hover:text-white">
                <Link to="/blog">View Blog</Link>
              </Button>
              <Button asChild className="indo-button-primary">
                <Link to="/">Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
            className={activeTab === 'overview' ? 'indo-button-primary' : ''}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
            className={activeTab === 'users' ? 'indo-button-primary' : ''}
          >
            <Users className="w-4 h-4 mr-2" />
            Users
          </Button>
          <Button
            variant={activeTab === 'posts' ? 'default' : 'outline'}
            onClick={() => setActiveTab('posts')}
            className={activeTab === 'posts' ? 'indo-button-primary' : ''}
          >
            <FileText className="w-4 h-4 mr-2" />
            Posts
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="indo-card">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-indo-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-indo-secondary">{stats.totalUsers}</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </CardContent>
              </Card>
              
              <Card className="indo-card">
                <CardContent className="p-6 text-center">
                  <FileText className="w-8 h-8 text-indo-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-indo-secondary">{stats.totalPosts}</div>
                  <div className="text-sm text-gray-600">Total Posts</div>
                </CardContent>
              </Card>
              
              <Card className="indo-card">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="w-8 h-8 text-indo-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-indo-secondary">{stats.totalComments}</div>
                  <div className="text-sm text-gray-600">Total Comments</div>
                </CardContent>
              </Card>
              
              <Card className="indo-card">
                <CardContent className="p-6 text-center">
                  <Heart className="w-8 h-8 text-indo-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-indo-secondary">{stats.totalLikes}</div>
                  <div className="text-sm text-gray-600">Total Likes</div>
                </CardContent>
              </Card>
              
              <Card className="indo-card">
                <CardContent className="p-6 text-center">
                  <Share2 className="w-8 h-8 text-indo-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-indo-secondary">{stats.totalShares}</div>
                  <div className="text-sm text-gray-600">Total Shares</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="indo-card">
              <CardHeader>
                <CardTitle className="text-indo-secondary">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-indo-primary rounded-full flex items-center justify-center">
                      <UserPlus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">New user registered</p>
                      <p className="text-sm text-gray-600">2 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-indo-secondary rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">New post published</p>
                      <p className="text-sm text-gray-600">1 hour ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-indo-accent rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">New comment added</p>
                      <p className="text-sm text-gray-600">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card className="indo-card">
            <CardHeader>
              <CardTitle className="text-indo-secondary">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indo-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-indo-secondary">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {user.followers.length} followers
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      {user.role !== 'admin' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <Card className="indo-card">
            <CardHeader>
              <CardTitle className="text-indo-secondary">Post Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-indo-secondary">{post.title}</h3>
                      <p className="text-sm text-gray-600">
                        By {post.author.name} • {post.category} • {new Date(post.publishedAt).toLocaleDateString()}
                        {!post.isPublished && <span className="ml-2 text-orange-600 font-medium">(Draft)</span>}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {post.likes.length}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {post.commentCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="w-4 h-4" />
                          {post.shares}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/post/${post._id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeletePost(post._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
