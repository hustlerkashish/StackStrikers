import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Heart, 
  MessageCircle, 
  Share2,
  Star,
  Calendar,
  Award,
  Target,
  Zap
} from 'lucide-react';
import { getPosts } from '@/lib/database';
import { BlogPost } from '@/types/database';

const Stats = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const allPosts = await getPosts(100, 0, true);
        setPosts(allPosts);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Calculate stats
  const totalPosts = posts.length;
  const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.commentCount, 0);
  const totalShares = posts.reduce((sum, post) => sum + post.shares, 0);
  
  // Get unique authors
  const uniqueAuthors = new Set(posts.map(post => post.author.id)).size;
  
  // Most popular post
  const mostPopularPost = posts.reduce((prev, current) => 
    (current.likes.length + current.shares) > (prev.likes.length + prev.shares) ? current : prev
  , posts[0] || { title: 'No posts yet', likes: [], shares: 0 });
  
  // Category distribution
  const categoryStats = posts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-indo-background">
      <Navigation />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-indo-secondary/10 to-indo-primary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="indo-text-gradient">Platform Statistics</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Insights and analytics about our knowledge community
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indo-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-indo-secondary">Loading statistics...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overview Stats */}
            <section>
              <h2 className="text-2xl font-bold mb-6 indo-text-gradient">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="indo-card">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="w-8 h-8 text-indo-primary mx-auto mb-3" />
                    <div className="text-3xl font-bold text-indo-secondary mb-2">{totalPosts}</div>
                    <div className="text-sm text-gray-600">Total Articles</div>
                  </CardContent>
                </Card>
                
                <Card className="indo-card">
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 text-indo-secondary mx-auto mb-3" />
                    <div className="text-3xl font-bold text-indo-secondary mb-2">{uniqueAuthors}</div>
                    <div className="text-sm text-gray-600">Active Authors</div>
                  </CardContent>
                </Card>
                
                <Card className="indo-card">
                  <CardContent className="p-6 text-center">
                    <Heart className="w-8 h-8 text-indo-accent mx-auto mb-3" />
                    <div className="text-3xl font-bold text-indo-secondary mb-2">{totalLikes}</div>
                    <div className="text-sm text-gray-600">Total Likes</div>
                  </CardContent>
                </Card>
                
                <Card className="indo-card">
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="w-8 h-8 text-indo-primary mx-auto mb-3" />
                    <div className="text-3xl font-bold text-indo-secondary mb-2">{totalComments}</div>
                    <div className="text-sm text-gray-600">Comments</div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Engagement Stats */}
            <section>
              <h2 className="text-2xl font-bold mb-6 indo-text-gradient">Engagement</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="indo-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-indo-primary/10 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-indo-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Average Engagement</h3>
                        <p className="text-sm text-gray-600">Per article</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-indo-secondary">
                      {totalPosts > 0 ? Math.round((totalLikes + totalComments + totalShares) / totalPosts) : 0}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="indo-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-indo-secondary/10 rounded-lg flex items-center justify-center">
                        <Share2 className="w-5 h-5 text-indo-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Total Shares</h3>
                        <p className="text-sm text-gray-600">Across all articles</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-indo-secondary">{totalShares}</div>
                  </CardContent>
                </Card>
                
                <Card className="indo-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-indo-accent/10 rounded-lg flex items-center justify-center">
                        <Star className="w-5 h-5 text-indo-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Most Popular</h3>
                        <p className="text-sm text-gray-600">Article</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-indo-secondary truncate">
                      {mostPopularPost.title}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Category Distribution */}
            <section>
              <h2 className="text-2xl font-bold mb-6 indo-text-gradient">Content Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topCategories.map(([category, count], index) => (
                  <Card key={category} className="indo-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">{category}</h3>
                        <Badge variant="outline" className="border-indo-primary text-indo-primary">
                          #{index + 1}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-indo-secondary mb-2">{count}</div>
                      <div className="text-sm text-gray-600">articles</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div 
                          className="bg-indo-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(count / totalPosts) * 100}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Recent Activity */}
            <section>
              <h2 className="text-2xl font-bold mb-6 indo-text-gradient">Recent Activity</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="indo-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indo-primary" />
                      This Week
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-indo-primary rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New articles published</p>
                          <p className="text-xs text-gray-600">3 articles this week</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-indo-secondary rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Community engagement</p>
                          <p className="text-xs text-gray-600">45 new comments</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-indo-accent rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New followers</p>
                          <p className="text-xs text-gray-600">12 new connections</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="indo-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-indo-primary" />
                      Top Performers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {posts.slice(0, 3).map((post, index) => (
                        <div key={post.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indo-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-indo-primary">#{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium truncate">{post.title}</p>
                            <p className="text-xs text-gray-600">{post.likes.length} likes</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Goals and Targets */}
            <section>
              <h2 className="text-2xl font-bold mb-6 indo-text-gradient">Community Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="indo-card">
                  <CardContent className="p-6 text-center">
                    <Target className="w-8 h-8 text-indo-primary mx-auto mb-3" />
                    <div className="text-2xl font-bold text-indo-secondary mb-2">100</div>
                    <div className="text-sm text-gray-600">Articles Goal</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div 
                        className="bg-indo-primary h-2 rounded-full"
                        style={{ width: `${Math.min((totalPosts / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{totalPosts}/100</div>
                  </CardContent>
                </Card>
                
                <Card className="indo-card">
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 text-indo-secondary mx-auto mb-3" />
                    <div className="text-2xl font-bold text-indo-secondary mb-2">50</div>
                    <div className="text-sm text-gray-600">Authors Goal</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div 
                        className="bg-indo-secondary h-2 rounded-full"
                        style={{ width: `${Math.min((uniqueAuthors / 50) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{uniqueAuthors}/50</div>
                  </CardContent>
                </Card>
                
                <Card className="indo-card">
                  <CardContent className="p-6 text-center">
                    <Heart className="w-8 h-8 text-indo-accent mx-auto mb-3" />
                    <div className="text-2xl font-bold text-indo-secondary mb-2">1K</div>
                    <div className="text-sm text-gray-600">Likes Goal</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div 
                        className="bg-indo-accent h-2 rounded-full"
                        style={{ width: `${Math.min((totalLikes / 1000) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{totalLikes}/1K</div>
                  </CardContent>
                </Card>
                
                <Card className="indo-card">
                  <CardContent className="p-6 text-center">
                    <Zap className="w-8 h-8 text-indo-primary mx-auto mb-3" />
                    <div className="text-2xl font-bold text-indo-secondary mb-2">500</div>
                    <div className="text-sm text-gray-600">Comments Goal</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div 
                        className="bg-indo-primary h-2 rounded-full"
                        style={{ width: `${Math.min((totalComments / 500) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{totalComments}/500</div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Stats;
