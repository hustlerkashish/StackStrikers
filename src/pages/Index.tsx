import { useState, useEffect } from "react";
import { BlogHero } from "@/components/BlogHero";
import { BlogCard, BlogPost } from "@/components/BlogCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { getPosts, searchPosts, getPostsByCategory } from "@/lib/database";
import { Search } from "lucide-react";

const Index = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
      <BlogHero onSearch={handleSearch} />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Search and Filter Section */}
        <section className="mb-12">
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="pl-10 pr-4 py-3"
              />
            </div>
          </div>
          
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        </section>

        {/* Results Summary */}
        <div className="mb-8">
          <h2 className="section-title text-foreground">
            {selectedCategory ? `${selectedCategory} Articles` : "Latest Articles"}
            <span className="text-muted-foreground font-normal ml-2">
              ({filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'})
            </span>
          </h2>
          {searchQuery && (
            <p className="text-muted-foreground mt-2">
              Showing results for "{searchQuery}"
            </p>
          )}
        </div>

        {/* Blog Posts Grid */}
        <section>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground animate-pulse" />
              </div>
              <h3 className="section-title text-foreground mb-2">Loading posts...</h3>
              <p className="text-muted-foreground">Please wait while we fetch the latest articles</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="section-title text-foreground mb-2">No posts found</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedCategory 
                  ? "Try adjusting your search or filter criteria"
                  : "No blog posts available yet"
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>

        {/* Featured Categories */}
        {!searchQuery && !selectedCategory && (
          <section className="mt-16">
            <h2 className="section-title text-center mb-8">Explore by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => {
                const postsInCategory = Array.isArray(posts) ? posts.filter(post => post.category === category).length : 0;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="p-4 bg-card border border-border rounded-lg hover:bg-card-hover transition-all duration-200 text-center group"
                  >
                    <h3 className="font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors">
                      {category}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {postsInCategory} {postsInCategory === 1 ? 'post' : 'posts'}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Index;
