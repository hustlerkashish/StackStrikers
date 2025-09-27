import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Navigation } from "@/components/Navigation";
import { BlogPost } from "@/components/BlogCard";
import { getPostsByUser, updatePost, deletePost, createPost } from "@/lib/database";
import { Plus, Edit, Trash2, Eye, Save, X, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface PostForm {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  isPublished: boolean;
}

const categories = [
  "Ancient Wisdom",
  "Modern Technology", 
  "Spiritual Growth",
  "Digital Learning",
  "Cultural Heritage",
  "Philosophy",
  "Wellness",
  "Innovation"
];

export default function MyPosts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<PostForm>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    imageUrl: '',
    isPublished: true
  });

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user]);

  const loadPosts = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const userPosts = await getPostsByUser(user.id, false); // Get all posts including drafts
      setPosts(userPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your posts. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createPost({
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        imageUrl: formData.imageUrl,
        isPublished: formData.isPublished
      }, user.id);

      toast({
        title: 'Success',
        description: 'Post created successfully!',
      });

      setIsCreateModalOpen(false);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        imageUrl: '',
        isPublished: true
      });
      loadPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      await updatePost(editingPost.id, {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        imageUrl: formData.imageUrl,
        isPublished: formData.isPublished
      });

      toast({
        title: 'Success',
        description: 'Post updated successfully!',
      });

      setIsEditModalOpen(false);
      setEditingPost(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        imageUrl: '',
        isPublished: true
      });
      loadPosts();
    } catch (error) {
      console.error('Failed to update post:', error);
      toast({
        title: 'Error',
        description: 'Failed to update post. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await deletePost(postId);
        toast({
          title: 'Success',
          description: 'Post deleted successfully!',
        });
        loadPosts();
      } catch (error) {
        console.error('Failed to delete post:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete post. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      imageUrl: post.imageUrl || '',
      isPublished: post.isPublished
    });
    setIsEditModalOpen(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-indo-background">
        <Navigation />
        <main className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your posts</h1>
          <Link to="/blog">
            <Button className="indo-button-primary">Go to Blog</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indo-background">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-indo-secondary mb-2">My Posts</h1>
            <p className="text-gray-600">Manage your blog posts and drafts</p>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="indo-button-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter post title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Excerpt</label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Enter post excerpt"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter post content (Markdown supported)"
                    rows={10}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="Enter image URL"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="isPublished" className="text-sm font-medium">
                    Publish immediately
                  </label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="indo-button-primary">
                    <Save className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indo-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <Card className="indo-card">
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-4">Start writing your first blog post!</p>
              <Button onClick={() => setIsCreateModalOpen(true)} className="indo-button-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="indo-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-indo-secondary">{post.title}</h3>
                        {!post.isPublished && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Category: {post.category}</span>
                        <span>Published: {new Date(post.publishedAt).toLocaleDateString()}</span>
                        <span>Likes: {post.likes?.length || 0}</span>
                        <span>Comments: {post.commentCount || 0}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/post/${post.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(post)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter post title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Excerpt</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Enter post excerpt"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter post content (Markdown supported)"
                  rows={10}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Enter image URL"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublishedEdit"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="isPublishedEdit" className="text-sm font-medium">
                  Publish immediately
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="indo-button-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Update Post
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
