import { useState, useEffect } from "react";
import { Search, Edit, BookOpen, TrendingUp, User, Bell, Home, Library, Users, Settings, Star, Clock, ThumbsUp, MessageCircle, Bookmark, Share2, MoreHorizontal, X, Plus, Filter, Menu, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface UserData {
  name: string;
  email: string;
  interests: string[];
  goal?: string;
}

interface UserDashboardProps {
  userData: UserData;
}

interface Article {
  id: number;
  title: string;
  subtitle: string;
  author: string;
  authorAvatar: string;
  publication: string;
  readTime: string;
  publishedAt: string;
  claps: number;
  responses: number;
  tags: string[];
  image: string;
  featured?: boolean;
  isBookmarked?: boolean;
  isLiked?: boolean;
  content?: string;
}

// Mock data for articles - similar to Medium
const mockArticles: Article[] = [
  {
    id: 1,
    title: "Your ChatGPT History Just Went Public on Google. Here's What I Did in 10 Mins to Fix It.",
    subtitle: "Safety/Privacy Check Prompt Template Is Included",
    author: "Mohamed Bakry",
    authorAvatar: "/api/placeholder/32/32",
    publication: "How To Profit AI",
    readTime: "3 min read",
    publishedAt: "3d ago",
    claps: 109,
    responses: 32,
    tags: ["AI", "Privacy", "ChatGPT"],
    image: "/api/placeholder/200/120",
    featured: true,
    content: "In today's digital age, privacy has become a luxury that many of us unknowingly surrender. Recently, I discovered that my ChatGPT conversation history had become publicly indexed on Google..."
  },
  {
    id: 2,
    title: "I'll Instantly Know You Used Chat Gpt if I See This",
    subtitle: "Trust me you're not as slick as you think",
    author: "Ossai Chinedum",
    authorAvatar: "/api/placeholder/32/32",
    publication: "Long. Sweet. Valuable.",
    readTime: "4 min read",
    publishedAt: "May 16",
    claps: 24,
    responses: 143,
    tags: ["AI", "Writing", "ChatGPT"],
    image: "/api/placeholder/200/120",
    content: "As AI becomes more prevalent in our daily lives, many people are using ChatGPT to help with their writing. However, there are telltale signs that give it away..."
  },
  {
    id: 3,
    title: "The Four Stages of Life as Experienced Through Taiwanese Cuisine",
    subtitle: "From street food adventures to refined palates",
    author: "Joshua Samuel Brown",
    authorAvatar: "/api/placeholder/32/32",
    publication: "Rooted",
    readTime: "6 min read",
    publishedAt: "Sep 11",
    claps: 87,
    responses: 12,
    tags: ["Culture", "Food", "Life"],
    image: "/api/placeholder/200/120",
    content: "Food has always been more than sustenance; it's a lens through which we view our lives, our culture, and our evolution as human beings..."
  },
  {
    id: 4,
    title: "Ancient Wisdom Meets Modern Technology: Lessons from Indian Philosophy",
    subtitle: "How traditional Indian thoughts can guide our digital age",
    author: "Priya Sharma",
    authorAvatar: "/api/placeholder/32/32",
    publication: "IndoGyaan",
    readTime: "8 min read",
    publishedAt: "2d ago",
    claps: 156,
    responses: 28,
    tags: ["Philosophy", "Technology", "Culture"],
    image: "/api/placeholder/200/120",
    featured: true,
    content: "In an era where technology dominates our lives, ancient Indian philosophy offers timeless wisdom that can help us navigate the digital landscape with greater mindfulness and purpose..."
  },
  {
    id: 5,
    title: "The Art of Mindfulness in Indian Classical Music",
    subtitle: "Discovering meditation through ragas and rhythms",
    author: "Ravi Shankar Mishra",
    authorAvatar: "/api/placeholder/32/32",
    publication: "Cultural Bridge",
    readTime: "5 min read",
    publishedAt: "1d ago",
    claps: 73,
    responses: 9,
    tags: ["Music", "Mindfulness", "Culture"],
    image: "/api/placeholder/200/120",
    content: "Indian classical music is not just entertainment; it's a pathway to spiritual enlightenment and mindfulness that has been practiced for thousands of years..."
  }
];

const staffPicks = [
  {
    id: 1,
    title: "How this brand strategist uses IndoGyaan to explore ideas, repurpose content, and land clients",
    author: "Zulie @ IndoGyaan",
    readTime: "3d ago"
  },
  {
    id: 2,
    title: 'From "I Have To" to "I Get To": How One Word Change Rewires Your Brain',
    author: "Jud Brewer MD PhD",
    readTime: "6d ago"
  }
];

const recommendedTopics = [
  "Data Science", "Self Improvement", "Technology", "Relationships", 
  "Cryptocurrency", "Productivity", "Ancient Wisdom", "Indian Culture",
  "Philosophy", "Mindfulness", "Spirituality", "Modern Life"
];

const suggestedWriters = [
  { id: 1, name: "Dr. Rajesh Kumar", bio: "Philosophy & Ancient Wisdom", followers: "12.5K", avatar: "/api/placeholder/40/40", isFollowing: false },
  { id: 2, name: "Meera Patel", bio: "Cultural Studies & Heritage", followers: "8.3K", avatar: "/api/placeholder/40/40", isFollowing: false },
  { id: 3, name: "Arjun Singh", bio: "Technology & Innovation", followers: "15.2K", avatar: "/api/placeholder/40/40", isFollowing: true },
  { id: 4, name: "Kavya Nair", bio: "Mindfulness & Spirituality", followers: "9.7K", avatar: "/api/placeholder/40/40", isFollowing: false },
];

export const UserDashboard = ({ userData }: UserDashboardProps) => {
  // State management for all interactive features
  const [activeTab, setActiveTab] = useState("For you");
  const [followingNotice, setFollowingNotice] = useState(true);
  const [membershipBanner, setMembershipBanner] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(mockArticles);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isWriteDialogOpen, setIsWriteDialogOpen] = useState(false);
  const [newArticleTitle, setNewArticleTitle] = useState("");
  const [newArticleContent, setNewArticleContent] = useState("");
  const [followedTopics, setFollowedTopics] = useState<string[]>(userData.interests || []);
  const [writers, setWriters] = useState(suggestedWriters);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [activeNavItem, setActiveNavItem] = useState("Home");
  const [bookmarkedArticles, setBookmarkedArticles] = useState<number[]>([]);
  const [likedArticles, setLikedArticles] = useState<number[]>([]);
  const [showWritersSuggestions, setShowWritersSuggestions] = useState(false);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredArticles(filtered);
    }
  }, [searchQuery, articles]);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Article interactions
  const handleLike = (articleId: number) => {
    const updatedArticles = articles.map(article => {
      if (article.id === articleId) {
        const isLiked = likedArticles.includes(articleId);
        return {
          ...article,
          claps: isLiked ? article.claps - 1 : article.claps + 1
        };
      }
      return article;
    });
    setArticles(updatedArticles);
    
    if (likedArticles.includes(articleId)) {
      setLikedArticles(likedArticles.filter(id => id !== articleId));
      toast({ title: "Removed like", description: "Article removed from liked posts" });
    } else {
      setLikedArticles([...likedArticles, articleId]);
      toast({ title: "Article liked!", description: "Added to your liked posts" });
    }
  };

  const handleBookmark = (articleId: number) => {
    if (bookmarkedArticles.includes(articleId)) {
      setBookmarkedArticles(bookmarkedArticles.filter(id => id !== articleId));
      toast({ title: "Bookmark removed", description: "Article removed from your library" });
    } else {
      setBookmarkedArticles([...bookmarkedArticles, articleId]);
      toast({ title: "Article bookmarked!", description: "Added to your library" });
    }
  };

  const handleShare = (article: Article) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.subtitle,
        url: `${window.location.origin}/article/${article.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${article.title} - ${window.location.origin}/article/${article.id}`);
      toast({ title: "Link copied!", description: "Article link copied to clipboard" });
    }
  };

  const handleFollowWriter = (writerId: number) => {
    const updatedWriters = writers.map(writer => {
      if (writer.id === writerId) {
        const newFollowingState = !writer.isFollowing;
        toast({ 
          title: newFollowingState ? "Following!" : "Unfollowed", 
          description: newFollowingState ? `You're now following ${writer.name}` : `Unfollowed ${writer.name}` 
        });
        return { ...writer, isFollowing: newFollowingState };
      }
      return writer;
    });
    setWriters(updatedWriters);
  };

  const handleFollowTopic = (topic: string) => {
    if (followedTopics.includes(topic)) {
      setFollowedTopics(followedTopics.filter(t => t !== topic));
      toast({ title: "Unfollowed topic", description: `No longer following ${topic}` });
    } else {
      setFollowedTopics([...followedTopics, topic]);
      toast({ title: "Following topic!", description: `Now following ${topic}` });
    }
  };

  const handleCreateArticle = () => {
    if (newArticleTitle.trim() && newArticleContent.trim()) {
      const newArticle: Article = {
        id: articles.length + 1,
        title: newArticleTitle,
        subtitle: newArticleContent.substring(0, 100) + "...",
        author: userData.name,
        authorAvatar: "/api/placeholder/32/32",
        publication: "IndoGyaan",
        readTime: Math.ceil(newArticleContent.split(' ').length / 200) + " min read",
        publishedAt: "now",
        claps: 0,
        responses: 0,
        tags: ["Personal"],
        image: "/api/placeholder/200/120",
        content: newArticleContent
      };
      setArticles([newArticle, ...articles]);
      setNewArticleTitle("");
      setNewArticleContent("");
      setIsWriteDialogOpen(false);
      toast({ title: "Article published!", description: "Your article is now live on IndoGyaan" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearNotifications = () => {
    setNotifications(0);
    toast({ title: "Notifications cleared", description: "All notifications have been marked as read" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Left side - Logo and Search */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveNavItem("Home")}>
                <BookOpen className="h-8 w-8 text-gray-900" />
                <span className="text-2xl font-bold text-gray-900">IndoGyaan</span>
              </div>
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search IndoGyaan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-gray-50 border-none rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-4">
              <Dialog open={isWriteDialogOpen} onOpenChange={setIsWriteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                    <Edit className="w-4 h-4 mr-2" />
                    Write
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Write a new article</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Article title..."
                      value={newArticleTitle}
                      onChange={(e) => setNewArticleTitle(e.target.value)}
                      className="text-xl font-semibold border-none focus:ring-0 placeholder-gray-400"
                    />
                    <Textarea
                      placeholder="Tell your story..."
                      value={newArticleContent}
                      onChange={(e) => setNewArticleContent(e.target.value)}
                      className="min-h-[300px] resize-none border-none focus:ring-0"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsWriteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateArticle} disabled={!newArticleTitle.trim() || !newArticleContent.trim()}>
                        Publish
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <div className="relative">
                <Button variant="ghost" size="sm" onClick={clearNotifications} className="p-2">
                  <Bell className="w-5 h-5 text-gray-600" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </Button>
              </div>
              
              <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-blue-300">
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback className="bg-blue-500 text-white">{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex">
          {/* Left Sidebar */}
          <div className="hidden lg:block w-64 py-8 pr-8">
            <nav className="space-y-2">
              {[
                { icon: Home, label: "Home", key: "Home" },
                { icon: Library, label: "Library", key: "Library" },
                { icon: User, label: "Profile", key: "Profile" },
                { icon: Users, label: "Following", key: "Following" },
                { icon: TrendingUp, label: "Stats", key: "Stats" },
                { icon: Settings, label: "Settings", key: "Settings" }
              ].map(({ icon: Icon, label, key }) => (
                <a 
                  key={key}
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveNavItem(key);
                    toast({ title: `Navigating to ${label}`, description: `${label} section activated` });
                  }}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeNavItem === key
                      ? 'text-gray-900 bg-gray-100'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {label}
                </a>
              ))}
            </nav>

            {/* Find writers section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Find writers and publications to follow</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowWritersSuggestions(!showWritersSuggestions)}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                {showWritersSuggestions ? 'Hide suggestions' : 'See suggestions'}
              </Button>
              
              {showWritersSuggestions && (
                <div className="mt-4 space-y-3">
                  {writers.slice(0, 3).map((writer) => (
                    <div key={writer.id} className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={writer.avatar} />
                        <AvatarFallback>{writer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{writer.name}</p>
                        <p className="text-xs text-gray-500">{writer.bio}</p>
                      </div>
                      <Button
                        size="sm"
                        variant={writer.isFollowing ? "outline" : "default"}
                        onClick={() => handleFollowWriter(writer.id)}
                        className="text-xs"
                      >
                        {writer.isFollowing ? 'Following' : 'Follow'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 py-8">
            {/* Membership Banner */}
            {membershipBanner && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Get unlimited access to the best of IndoGyaan for less than $1/week.
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm" className="bg-white text-gray-900 border-gray-300 hover:bg-gray-50">
                    Become a member
                  </Button>
                  <button 
                    onClick={() => setMembershipBanner(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Following Notice */}
            {followingNotice && (
              <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-200">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-gray-700">
                    "Following" and your topics are now part of the new Following page, which you can find from the sidebar.
                  </p>
                  <button
                    onClick={() => setFollowingNotice(false)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline ml-4"
                  >
                    Okay, got it
                  </button>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex space-x-8 border-b border-gray-200 mb-8">
              {["For you", "Featured", "Following"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-medium transition-colors ${
                    activeTab === tab 
                      ? "text-gray-900 border-b-2 border-gray-900" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Results Info */}
            {searchQuery && (
              <div className="mb-6 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  Found {filteredArticles.length} articles for "{searchQuery}"
                  {filteredArticles.length === 0 && (
                    <span className="block mt-2 text-gray-500">
                      Try searching for different keywords or check out our recommended topics below.
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Articles Feed */}
            <div className="space-y-8">
              {filteredArticles.map((article) => (
                <article key={article.id} className="group cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors">
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={article.authorAvatar} />
                          <AvatarFallback>{article.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600">{article.author}</span>
                        <span className="text-sm text-gray-400">in</span>
                        <span className="text-sm text-gray-600 font-medium">{article.publication}</span>
                      </div>
                      
                      <h2 
                        className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 cursor-pointer"
                        onClick={() => setSelectedArticle(article)}
                      >
                        {article.title}
                      </h2>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {article.subtitle}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{article.publishedAt}</span>
                          <span>·</span>
                          <span>{article.readTime}</span>
                          <div className="flex space-x-1">
                            {article.tags.slice(0, 2).map((tag) => (
                              <Badge 
                                key={tag} 
                                variant="secondary" 
                                className="text-xs cursor-pointer hover:bg-gray-300"
                                onClick={() => setSearchQuery(tag)}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          {article.featured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(article.id);
                            }}
                            className={`flex items-center space-x-1 transition-colors ${
                              likedArticles.includes(article.id)
                                ? 'text-red-500'
                                : 'text-gray-400 hover:text-red-500'
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-sm">{article.claps}</span>
                          </button>
                          <div className="flex items-center space-x-1 text-gray-400">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">{article.responses}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookmark(article.id);
                            }}
                            className={`transition-colors ${
                              bookmarkedArticles.includes(article.id)
                                ? 'text-blue-500'
                                : 'text-gray-400 hover:text-blue-500'
                            }`}
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(article);
                            }}
                            className="text-gray-400 hover:text-green-500 transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-32 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt="" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                onClick={() => {
                  toast({ title: "Loading more articles...", description: "Fetching fresh content for you" });
                }}
                className="px-8"
              >
                Load more articles
              </Button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden xl:block w-80 py-8 pl-8">
            {/* Staff Picks */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Picks</h3>
              <div className="space-y-4">
                {staffPicks.map((pick) => (
                  <div key={pick.id} className="cursor-pointer group hover:bg-gray-50 p-3 rounded-lg transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">{pick.id}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 mb-1 line-clamp-2">
                          {pick.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>In</span>
                          <span className="font-medium">{pick.author}</span>
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span>{pick.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-sm text-green-600 hover:text-green-700 font-medium mt-4 transition-colors">
                See the full list
              </button>
            </div>

            {/* Recommended Topics */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended topics</h3>
              <div className="flex flex-wrap gap-2">
                {recommendedTopics.map((topic) => (
                  <Badge 
                    key={topic} 
                    variant={followedTopics.includes(topic) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleFollowTopic(topic)}
                  >
                    {followedTopics.includes(topic) && <Plus className="w-3 h-3 mr-1" />}
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Your Stats */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Articles Read</span>
                  <span className="font-semibold text-blue-600">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Authors Followed</span>
                  <span className="font-semibold text-green-600">
                    {writers.filter(w => w.isFollowing).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Articles Bookmarked</span>
                  <span className="font-semibold text-purple-600">{bookmarkedArticles.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Topics Followed</span>
                  <span className="font-semibold text-orange-600">{followedTopics.length}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Article Reading Modal */}
      <Dialog open={selectedArticle !== null} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedArticle && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={selectedArticle.authorAvatar} />
                  <AvatarFallback>{selectedArticle.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedArticle.author}</p>
                  <p className="text-sm text-gray-500">
                    {selectedArticle.publishedAt} · {selectedArticle.readTime}
                  </p>
                </div>
              </div>
              <h1 className="text-3xl font-bold">{selectedArticle.title}</h1>
              <h2 className="text-xl text-gray-600">{selectedArticle.subtitle}</h2>
              <img 
                src={selectedArticle.image} 
                alt="" 
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="prose prose-lg max-w-none">
                <p>{selectedArticle.content}</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
              <div className="flex items-center space-x-4 pt-4 border-t">
                <button
                  onClick={() => handleLike(selectedArticle.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                    likedArticles.includes(selectedArticle.id)
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{selectedArticle.claps}</span>
                </button>
                <button
                  onClick={() => handleBookmark(selectedArticle.id)}
                  className={`p-2 rounded-full transition-colors ${
                    bookmarkedArticles.includes(selectedArticle.id)
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare(selectedArticle)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors z-50"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};