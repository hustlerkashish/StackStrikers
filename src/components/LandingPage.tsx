import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, PenTool, Sparkles, ArrowRight, Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { useState } from 'react';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-indo-primary" />,
      title: "ज्ञान का भंडार",
      subtitle: "Knowledge Repository",
      description: "Discover ancient wisdom and modern insights in one place"
    },
    {
      icon: <Users className="h-8 w-8 text-indo-secondary" />,
      title: "सामुदायिक शिक्षा",
      subtitle: "Community Learning",
      description: "Connect with fellow learners and share your knowledge"
    },
    {
      icon: <PenTool className="h-8 w-8 text-indo-accent" />,
      title: "अपनी कहानी लिखें",
      subtitle: "Write Your Story",
      description: "Express your thoughts and contribute to the collective wisdom"
    }
  ];

  const stats = [
    { number: "10K+", label: "Knowledge Articles" },
    { number: "5K+", label: "Active Learners" },
    { number: "100+", label: "Expert Contributors" },
    { number: "50+", label: "Languages Supported" }
  ];

  return (
    <>
      <div 
        className="indo-hero" 
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(251, 248, 245, 0.88) 100%),
            url('https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1996&q=80')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          position: 'relative'
        }}
      >
        {/* Navigation */}
        <nav className="bg-white/98 border-b border-indo-primary/20 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indo-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold indo-text-gradient">IndoGyaan</span>
              </div>
              
              <div className="flex items-center gap-4">
                {user ? (
                  <Link to="/blog">
                    <Button className="indo-button-primary">
                      Go to Platform
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsAuthModalOpen(true)}
                      className="text-indo-secondary hover:text-indo-primary"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => setIsAuthModalOpen(true)}
                      className="indo-button-primary"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 relative z-20">
              <div className="space-y-4">
                <Badge className="bg-indo-primary/10 text-indo-primary border-indo-primary/20">
                  <Sparkles className="w-4 h-4 mr-2" />
                  ज्ञान का नया युग - New Era of Knowledge
                </Badge>
                
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="indo-text-gradient">ज्ञान</span> का<br />
                  <span className="text-indo-secondary">Digital Temple</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Where ancient wisdom meets modern technology. Share, learn, and grow in our 
                  vibrant community of knowledge seekers and contributors.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="indo-button-primary text-lg px-8 py-4"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link to="/blog">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="indo-button-secondary text-lg px-8 py-4"
                >
                  Explore Knowledge
                </Button>
              </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-indo-secondary">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Elements */}
            <div className="relative">
              <div className="indo-card rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 indo-lotus-pattern opacity-20"></div>
                <div className="relative z-10">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-indo-primary rounded-full mx-auto flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-indo-secondary">Knowledge Hub</h3>
                    <p className="text-gray-600">
                      Discover articles, stories, and insights from our community
                    </p>
                    <div className="flex justify-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-indo-primary fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-indo-secondary mb-4">
                Why Choose IndoGyaan?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience the perfect blend of traditional knowledge and modern technology
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="indo-card border-0 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="mb-6">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-indo-secondary mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-indo-primary mb-4 font-medium">
                      {feature.subtitle}
                    </p>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Quote className="w-12 h-12 text-indo-primary mx-auto mb-8" />
              <blockquote className="text-2xl font-medium text-indo-secondary mb-8">
                "IndoGyaan has transformed how I share and consume knowledge. 
                The platform beautifully bridges traditional wisdom with modern learning."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-indo-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-indo-secondary">Dr. Ananya Sharma</div>
                  <div className="text-gray-600">Knowledge Contributor</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-indo-secondary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Begin Your Knowledge Journey?
            </h2>
            <p className="text-xl text-indo-primary mb-8 max-w-2xl mx-auto">
              Join thousands of learners and contributors in our vibrant community
            </p>
            <Button 
              size="lg" 
              className="indo-button-primary text-lg px-8 py-4"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-indo-secondary text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-indo-primary rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">IndoGyaan</span>
                </div>
                <p className="text-indo-primary">
                  ज्ञान का Digital Temple
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Platform</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-indo-primary">About</a></li>
                  <li><a href="#" className="hover:text-indo-primary">Features</a></li>
                  <li><a href="#" className="hover:text-indo-primary">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Community</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-indo-primary">Guidelines</a></li>
                  <li><a href="#" className="hover:text-indo-primary">Support</a></li>
                  <li><a href="#" className="hover:text-indo-primary">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-indo-primary">Privacy</a></li>
                  <li><a href="#" className="hover:text-indo-primary">Terms</a></li>
                  <li><a href="#" className="hover:text-indo-primary">Cookies</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-indo-primary/20 mt-8 pt-8 text-center text-sm text-indo-primary">
              © 2024 IndoGyaan. All rights reserved. ज्ञान का सम्मान करें।
            </div>
          </div>
        </footer>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};