import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  FileText, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Bookmark, 
  Clock,
  TrendingUp,
  Star,
  Tag,
  Heart,
  MessageCircle,
  Share2,
  Plus
} from 'lucide-react';
import { getPosts, getPostsByCategory, searchPosts } from '@/lib/database';
import { BlogPost } from '@/types/database';

const Stories = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');

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
        const allPosts = await getPosts(100, 0, true);
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
          filtered = await getPostsByCategory(selectedCategory, 100);
        }

        // Filter by search query
        if (searchQuery.trim()) {
          filtered = await searchPosts(searchQuery, 100);
        }

        // Sort posts
        filtered = sortPosts(filtered, sortBy);

        setFilteredPosts(filtered);
      } catch (error) {
        console.error('Failed to filter posts:', error);
        setFilteredPosts(posts);
      }
    };

    filterPosts();
  }, [posts, selectedCategory, searchQuery, sortBy]);

  const sortPosts = (posts: BlogPost[], sortBy: string) => {
    return [...posts].sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.likes.length + b.shares) - (a.likes.length + a.shares);
        case 'trending':
          return b.commentCount - a.commentCount;
        case 'recent':
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });
  };

  return (
    <div className="min-h-screen bg-indo-background">
      <Navigation />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-indo-accent/10 to-indo-primary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="indo-text-gradient">Stories & Experiences</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover personal journeys, insights, and transformative experiences
            </p>
            
            {/* Search and Filters */}
            <div className="max-w-2xl mx-auto">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stories, experiences, or authors..."
                  className="pl-12 pr-4 py-3 text-lg border-2 border-indo-primary/20 focus:border-indo-primary rounded-xl"
                />
              </div>
              
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    className={selectedCategory === category ? "indo-button-primary" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Sort by:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'indo-button-primary' : ''}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'indo-button-primary' : ''}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-indo-primary/10 text-indo-primary">
              {filteredPosts.length} stories
            </Badge>
            {selectedCategory && (
              <Badge variant="outline" className="border-indo-secondary text-indo-secondary">
                {selectedCategory}
              </Badge>
            )}
          </div>
        </div>

        {/* Posts */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indo-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-indo-secondary">Loading stories...</p>
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No stories found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? `No results for "${searchQuery}"` : 'No stories available yet'}
            </p>
            {user && (
              <Button className="indo-button-primary">
                <Plus className="w-4 h-4 mr-2" />
                Share Your Story
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
              <Card key={post.id} className="indo-card hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 line-clamp-2">{post.title}</CardTitle>
                      <p className="text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-2">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{post.author.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
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
                    
                    <Badge variant="outline" className="border-indo-primary text-indo-primary">
                      <Tag className="w-3 h-3 mr-1" />
                      {post.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Featured Story Types */}
        {!searchQuery && !selectedCategory && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8 indo-text-gradient">
              Story Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Personal Journeys', description: 'Life experiences and transformations', count: 25, icon: '🌟' },
                { title: 'Spiritual Insights', description: 'Inner wisdom and enlightenment', count: 18, icon: '🧘' },
                { title: 'Learning Stories', description: 'Educational experiences and growth', count: 32, icon: '📚' },
                { title: 'Cultural Tales', description: 'Traditions and heritage stories', count: 15, icon: '🏛️' }
              ].map((category, index) => (
                <Card key={index} className="indo-card hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardHeader>
                    <div className="text-center">
                      <div className="text-4xl mb-3">{category.icon}</div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <span className="text-sm text-gray-500">{category.count} stories</span>
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

export default Stories;
