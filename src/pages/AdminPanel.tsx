import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
// FIXED: Import the centralized API service
import { mongoAPI } from '@/lib/mongodb-api'; 
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, FileText, MessageCircle, Heart, Share2, UserPlus, Trash2, Eye, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

// --- Interfaces aligned with API response ---

interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  totalShares: number;
}

// UPDATED: Interfaces now expect dates as strings from the API
interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string; // Dates from JSON are strings
  followers: string[];
}

interface BlogPost {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
  };
  category: string;
  publishedAt: string; // Dates from JSON are strings
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

  // --- Data Fetching ---

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      
      // FIXED: Use the mongoAPI service to fetch data
      const allUsers = await mongoAPI.getAllUsers();
      // Fetch all posts, including drafts
      const allPosts = await mongoAPI.getPosts(100, 0, false);
      
      // Calculate statistics from the fetched data
      setStats({
        totalUsers: allUsers.length,
        totalPosts: allPosts.length,
        totalComments: allPosts.reduce((sum, post) => sum + (post.commentCount || 0), 0),
        totalLikes: allPosts.reduce((sum, post) => sum + (post.likes?.length || 0), 0),
        totalShares: allPosts.reduce((sum, post) => sum + (post.shares || 0), 0)
      });
      
      // Sort users and posts by creation date to show recent activity
      setUsers(allUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setPosts(allPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast({
        title: 'Error Loading Data',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  // --- Action Handlers ---

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        // FIXED: Use the mongoAPI service to delete the user
        await mongoAPI.deleteUser(userId);
        toast({ title: 'User Deleted', description: 'The user has been successfully removed.' });
        loadAdminData(); // Refresh data
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to delete user.', variant: 'destructive' });
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        // FIXED: Use the mongoAPI service to delete the post
        await mongoAPI.deletePost(postId);
        toast({ title: 'Post Deleted', description: 'The post has been successfully removed.' });
        loadAdminData(); // Refresh data
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to delete post.', variant: 'destructive' });
      }
    }
  };

  // --- Render Logic ---

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Alert variant="destructive"><AlertDescription>Access Denied. Admin privileges are required.</AlertDescription></Alert>
            <Button asChild className="mt-4"><Link to="/">Go to Home</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  const renderStatCard = (icon: React.ReactNode, value: number, label: string) => (
    <Card><CardContent className="p-6 text-center">{icon}<div className="text-2xl font-bold">{value}</div><div className="text-sm text-muted-foreground">{label}</div></CardContent></Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-gray-300 mt-1">Platform Management Dashboard</p>
          </div>
          <Button asChild><Link to="/blog">View Blog</Link></Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex border-b mb-8">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 -mb-px border-b-2 ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}><BarChart3 className="w-4 h-4 mr-2 inline" />Overview</button>
          <button onClick={() => setActiveTab('users')} className={`px-4 py-2 -mb-px border-b-2 ${activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}><Users className="w-4 h-4 mr-2 inline" />Users</button>
          <button onClick={() => setActiveTab('posts')} className={`px-4 py-2 -mb-px border-b-2 ${activeTab === 'posts' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}><FileText className="w-4 h-4 mr-2 inline" />Posts</button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {renderStatCard(<Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />, stats.totalUsers, 'Total Users')}
                {renderStatCard(<FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />, stats.totalPosts, 'Total Posts')}
                {renderStatCard(<MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />, stats.totalComments, 'Total Comments')}
                {renderStatCard(<Heart className="w-8 h-8 text-blue-500 mx-auto mb-2" />, stats.totalLikes, 'Total Likes')}
                {renderStatCard(<Share2 className="w-8 h-8 text-blue-500 mx-auto mb-2" />, stats.totalShares, 'Total Shares')}
              </div>
            </div>
            <div className="lg:col-span-1">
              <Card>
                <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <h4 className="font-semibold text-sm">New Users</h4>
                  {users.slice(0, 3).map(u => (
                    <div key={u.id} className="text-sm"><strong>{u.name}</strong> joined. <span className="text-gray-500">({new Date(u.createdAt).toLocaleDateString()})</span></div>
                  ))}
                  <h4 className="font-semibold text-sm mt-4">New Posts</h4>
                  {posts.slice(0, 3).map(p => (
                    <div key={p.id} className="text-sm"><strong>{p.author.name}</strong> published "<em>{p.title}</em>".</div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <Card>
            <CardHeader><CardTitle>User Management ({users.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{u.name}</h3>
                      <p className="text-sm text-gray-600">{u.email}</p>
                      <Badge variant={u.role === 'admin' ? 'default' : 'secondary'} className="mt-1">{u.role}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {u.role !== 'admin' && (
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(u.id)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'posts' && (
          <Card>
            <CardHeader><CardTitle>Post Management ({posts.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{post.title}</h3>
                      <p className="text-sm text-gray-600">By {post.author.name} • {new Date(post.publishedAt).toLocaleDateString()}{!post.isPublished && <Badge variant="outline" className="ml-2">Draft</Badge>}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild><Link to={`/post/${post.id}`}><Eye className="w-4 h-4" /></Link></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeletePost(post.id)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}