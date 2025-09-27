import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import heroImage from "@/assets/blog-hero.jpg";

interface BlogHeroProps {
  onSearch: (query: string) => void;
}

export const BlogHero = ({ onSearch }: BlogHeroProps) => {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    onSearch(query);
  };

  return (
    <section className="relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 gradient-hero opacity-90" />
      
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <h1 className="blog-title text-white mb-6">
          Knowledge Hub
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto blog-content">
          Discover insights, tutorials, and stories from our community of learners and educators.
        </p>
        
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              name="search"
              placeholder="Search articles..."
              className="pl-10 pr-4 py-3 text-lg bg-white/95 border-0 focus:bg-white transition-all duration-300"
            />
          </div>
        </form>
        
        <Button variant="hero" size="lg" className="px-8 py-4 text-lg">
          Explore Articles
        </Button>
      </div>
    </section>
  );
};