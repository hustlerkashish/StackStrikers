import { useState, useEffect, useMemo, useCallback } from "react";
import { BlogHero } from "@/components/BlogHero";
import { BlogCard, type BlogPost } from "@/components/BlogCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useBlog } from "@/context/blog-context";
import { useToast } from "@/hooks/use-toast";
import type { Post } from "@/lib/supabase";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { posts, categories, loading, fetchPosts, fetchCategories } = useBlog();
  const { toast } = useToast();

  // Transform posts to include UI-specific fields
  const enhancedPosts = useMemo<BlogPost[]>(() => posts.map(post => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || "",
    content: post.content,
    author: post.author?.full_name || "Anonymous",
    category: post.category?.name || "Uncategorized",
    publishedAt: post.created_at,
    commentCount: 0, // This should be updated with actual comment count
  })), [posts]);

  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(enhancedPosts);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchCategories(),
          fetchPosts()
        ]);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load blog posts and categories.",
        });
      }
    };

    loadInitialData();
  }, [fetchCategories, fetchPosts, toast]);

  useEffect(() => {
    const filtered = enhancedPosts.filter(post => {
      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilteredPosts(filtered);
  }, [enhancedPosts, selectedCategory, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-background">
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
            categories={categories.map(cat => ({ id: cat.id, name: cat.name }))}
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
          {filteredPosts.length === 0 ? (
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
                const postsInCategory = posts.filter(post => post.category_id === category.id).length;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className="p-4 bg-card border border-border rounded-lg hover:bg-card-hover transition-all duration-200 text-center group"
                  >
                    <h3 className="font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors">
                      {category.name}
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
