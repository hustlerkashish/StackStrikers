import { Button } from "@/components/ui/button";
import { PenTool, Search, Settings, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left side - Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-2xl font-serif font-bold text-black tracking-tight">
              Medium
            </Link>
          </div>
          
          {/* Center - Search (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text"
                placeholder="Search"
                className="w-full bg-gray-50 border-0 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-200"
              />
            </div>
          </div>
          
          {/* Right side - Actions */}
          <div className="flex items-center gap-4">
            <Link to="/admin" className="hidden md:flex">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-600 hover:text-black flex items-center gap-2 px-3"
              >
                <PenTool className="w-4 h-4" />
                Write
              </Button>
            </Link>
            
            <Link to="/">
              <Button 
                variant={isActive("/") ? "default" : "ghost"} 
                size="sm"
                className={`px-4 ${isActive("/") ? "bg-green-600 hover:bg-green-700" : "text-gray-600 hover:text-black"}`}
              >
                Home
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="sm"
              className="text-green-600 border-green-600 hover:bg-green-50 px-4"
            >
              Sign up
            </Button>
            
            <Button 
              size="sm"
              className="bg-green-600 hover:bg-green-700 px-4"
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};