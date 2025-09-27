import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import { BlogCard } from '@/components/BlogCard';
import { BlogHero } from '@/components/BlogHero';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  BookOpen, 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  TrendingUp,
  Star,
  Plus,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import { getPosts, getPostsByCategory, searchPosts } from '@/lib/database';
import { BlogPost } from '@/types/database';

const BlogPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    'Philosophy',
    'Technology', 
    'Culture',
    'Spirituality',
    'Education',
    'Art',
    'Science',
    'General'
  ];

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const allPosts = await getPosts(50, 0, true);
        console.log('Loaded posts:', allPosts);
        console.log('First post ID:', allPosts[0]?.id);
        setPosts(allPosts);
        setFilteredPosts(allPosts);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    const filterPosts = async () => {
      try {
        let filtered = Array.isArray(posts) ? [...posts] : [];

        // Filter by category
        if (selectedCategory) {
          filtered = await getPostsByCategory(selectedCategory, 50);
        }

        // Filter by search query
        if (searchQuery.trim()) {
          filtered = await searchPosts(searchQuery, 50);
        }

        setFilteredPosts(filtered);
      } catch (error) {
        console.error('Failed to filter posts:', error);
        setFilteredPosts(posts);
      }
    };

    filterPosts();
  }, [posts, selectedCategory, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-indo-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indo-primary/10 via-indo-secondary/5 to-indo-accent/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="indo-text-gradient">Knowledge</span> Hub
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover, share, and grow with our community of knowledge seekers and contributors
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, topics, or authors..."
                  className="pl-12 pr-4 py-4 text-lg border-2 border-indo-primary/20 focus:border-indo-primary rounded-xl"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-indo-secondary">{posts.length}</div>
                <div className="text-sm text-gray-600">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indo-primary">50+</div>
                <div className="text-sm text-gray-600">Authors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indo-accent">1K+</div>
                <div className="text-sm text-gray-600">Readers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indo-secondary">100+</div>
                <div className="text-sm text-gray-600">Topics</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Filter and View Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <CategoryFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="flex items-center gap-2"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-indo-primary/10 text-indo-primary">
              {filteredPosts.length} articles
            </Badge>
            {selectedCategory && (
              <Badge variant="outline" className="border-indo-secondary text-indo-secondary">
                {selectedCategory}
              </Badge>
            )}
          </div>
        </div>

        {/* Posts Grid/List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indo-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-indo-secondary">Loading articles...</p>
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? `No results for "${searchQuery}"` : 'No articles available yet'}
            </p>
            {user && (
              <Button className="indo-button-primary">
                <Plus className="w-4 h-4 mr-2" />
                Write Your First Article
              </Button>
            )}
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} viewMode={viewMode} />
            ))}
          </div>
        )}

        {/* Featured Categories */}
        {!searchQuery && !selectedCategory && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8 indo-text-gradient">
              Explore by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => {
                const postsInCategory = Array.isArray(posts) ? posts.filter(post => post.category === category).length : 0;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="p-6 bg-white border border-indo-primary/20 rounded-xl hover:bg-indo-primary/5 hover:border-indo-primary/40 transition-all duration-200 text-center group"
                  >
                    <h3 className="font-semibold text-indo-secondary mb-2 group-hover:text-indo-primary transition-colors">
                      {category}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {postsInCategory} {postsInCategory === 1 ? 'article' : 'articles'}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Trending Topics */}
        {!searchQuery && !selectedCategory && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8 indo-text-gradient">
              Trending Topics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Ancient Wisdom', 'Modern Technology', 'Spiritual Growth', 'Digital Learning'].map((topic, index) => (
                <Card key={topic} className="indo-card hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indo-primary/10 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-indo-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{topic}</CardTitle>
                        <p className="text-sm text-gray-600">#{index + 1} trending</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Explore the intersection of traditional knowledge and modern innovation.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {Math.floor(Math.random() * 100) + 50} followers
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {Math.floor(Math.random() * 20) + 10} articles
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default BlogPage;
