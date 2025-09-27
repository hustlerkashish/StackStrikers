import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BookOpen, Settings, Home, User, LogOut, Plus, Edit3, Library, FileText, BarChart3, Users, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { CreatePostModal } from "@/components/blog/CreatePostModal";

export const Navigation = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <>
      <nav className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indo-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold indo-text-gradient">IndoGyaan</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <Link to="/blog">
                <Button 
                  variant={isActive("/blog") ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Button>
              </Link>
              
              <Link to="/library">
                <Button 
                  variant={isActive("/library") ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Library className="w-4 h-4" />
                  Library
                </Button>
              </Link>
              
              <Link to="/stories">
                <Button 
                  variant={isActive("/stories") ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Stories
                </Button>
              </Link>
              
              <Link to="/stats">
                <Button 
                  variant={isActive("/stats") ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Stats
                </Button>
              </Link>
              
              <Link to="/following">
                <Button 
                  variant={isActive("/following") ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Following
                </Button>
              </Link>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-1">
              <Link to="/blog">
                <Button 
                  variant={isActive("/blog") ? "default" : "ghost"} 
                  size="sm"
                  className="p-2"
                >
                  <Home className="w-4 h-4" />
                </Button>
              </Link>
              
              <Link to="/library">
                <Button 
                  variant={isActive("/library") ? "default" : "ghost"} 
                  size="sm"
                  className="p-2"
                >
                  <Library className="w-4 h-4" />
                </Button>
              </Link>
              
              <Link to="/stories">
                <Button 
                  variant={isActive("/stories") ? "default" : "ghost"} 
                  size="sm"
                  className="p-2"
                >
                  <FileText className="w-4 h-4" />
                </Button>
              </Link>
              
              <Link to="/stats">
                <Button 
                  variant={isActive("/stats") ? "default" : "ghost"} 
                  size="sm"
                  className="p-2"
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </Link>
              
              <Link to="/following">
                <Button 
                  variant={isActive("/following") ? "default" : "ghost"} 
                  size="sm"
                  className="p-2"
                >
                  <Users className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              
              {user ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCreatePostModalOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Post
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{user.name}</p>
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/my-posts" className="flex items-center gap-2">
                          <Edit3 className="h-4 w-4" />
                          My Posts
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onPostCreated={() => {
          // Refresh posts or navigate
        }}
      />
    </>
  );
};