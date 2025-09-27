import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Navigation } from "@/components/Navigation";
import { BlogPost } from "@/components/BlogCard";
import { mockPosts, categories, addPost, updatePost, deletePost } from "@/data/mockData";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface PostForm {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  imageUrl: string;
}

export default function Admin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<PostForm>({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    imageUrl: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    setPosts([...mockPosts]);
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      author: "",
      category: "",
      imageUrl: ""
    });
    setEditingPost(null);
  };

  const handleOpenDialog = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        category: post.category,
        imageUrl: post.imageUrl || ""
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim() || 
        !formData.author.trim() || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingPost) {
        // Update existing post
        const updatedPost = updatePost(editingPost.id, {
          title: formData.title.trim(),
          excerpt: formData.excerpt.trim(),
          content: formData.content.trim(),
          author: formData.author.trim(),
          category: formData.category,
          imageUrl: formData.imageUrl.trim() || undefined
        });
        
        if (updatedPost) {
          setPosts(prev => prev.map(p => p.id === editingPost.id ? updatedPost : p));
          toast({
            title: "Post Updated",
            description: "Blog post has been updated successfully",
          });
        }
      } else {
        // Create new post
        const newPost = addPost({
          title: formData.title.trim(),
          excerpt: formData.excerpt.trim(),
          content: formData.content.trim(),
          author: formData.author.trim(),
          category: formData.category,
          imageUrl: formData.imageUrl.trim() || undefined
        });
        
        setPosts(prev => [newPost, ...prev]);
        toast({
          title: "Post Created",
          description: "New blog post has been created successfully",
        });
      }
      
      handleCloseDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      if (deletePost(postId)) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        toast({
          title: "Post Deleted",
          description: "Blog post has been deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete post. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="blog-title text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-2">Manage your blog posts and content</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => handleOpenDialog()}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Post
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                      placeholder="Enter post title..."
                      required
                      maxLength={200}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Excerpt *</label>
                    <Textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({...prev, excerpt: e.target.value}))}
                      placeholder="Brief description of the post..."
                      required
                      maxLength={500}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Author *</label>
                      <Input
                        value={formData.author}
                        onChange={(e) => setFormData(prev => ({...prev, author: e.target.value}))}
                        placeholder="Author name..."
                        required
                        maxLength={100}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Category *</label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Image URL</label>
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData(prev => ({...prev, imageUrl: e.target.value}))}
                      placeholder="https://example.com/image.jpg"
                      type="url"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Content *</label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({...prev, content: e.target.value}))}
                      placeholder="Write your post content here..."
                      required
                      rows={12}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      You can use markdown-style headers: # H1, ## H2, ### H3
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={handleCloseDialog}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingPost ? "Update Post" : "Create Post"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="text-2xl font-bold text-primary">{posts.length}</div>
              <div className="text-sm text-muted-foreground">Total Posts</div>
            </Card>
            
            <Card className="p-6">
              <div className="text-2xl font-bold text-primary">
                {posts.reduce((sum, post) => sum + post.commentCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Comments</div>
            </Card>
            
            <Card className="p-6">
              <div className="text-2xl font-bold text-primary">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </Card>
          </div>

          {/* Posts List */}
          <Card className="p-6">
            <h2 className="section-title mb-4">Manage Posts</h2>
            
            {posts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No posts yet. Create your first blog post!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-card-hover transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        By {post.author} • {post.category} • {new Date(post.publishedAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{post.commentCount} comments</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link to={`/post/${post.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleOpenDialog(post)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}