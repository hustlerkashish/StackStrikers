import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import all the new components
import { BookOpeningAnimation } from "@/components/BookOpeningAnimation";
import { AuthModal } from "@/components/AuthModal";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { WelcomePage } from "@/components/WelcomePage";
import { InterestSelection } from "@/components/InterestSelection";
import { GoalSelection } from "@/components/GoalSelection";
import { UserDashboard } from "@/components/UserDashboard";

// Original pages
import Index from "./pages/Index";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

type AppFlow = 
  | "initial_animation" 
  | "main_page" 
  | "auth_modal" 
  | "loading" 
  | "welcome" 
  | "interests" 
  | "goals" 
  | "dashboard";

interface UserData {
  name: string;
  email: string;
  interests: string[];
  goal?: string;
}

const App = () => {
  const [currentFlow, setCurrentFlow] = useState<AppFlow>("initial_animation");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    interests: [],
    goal: ""
  });
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  // Handle the initial book opening animation
  const handleAnimationComplete = () => {
    setCurrentFlow("main_page");
  };

  // Handle authentication flow
  const handleAuthStart = () => {
    setShowAuthModal(true);
  };

  const handleLogin = (method: string) => {
    setShowAuthModal(false);
    setCurrentFlow("loading");
    setLoadingMessage("Preparing your account...");
    
    // Simulate login process
    setTimeout(() => {
      setUserData(prev => ({
        ...prev,
        email: method === "email" ? "user@example.com" : `user@${method}.com`
      }));
      setCurrentFlow("welcome");
    }, 2000);
  };

  // Handle welcome page completion
  const handleWelcomeComplete = (data: { name: string; email: string }) => {
    setUserData(prev => ({ ...prev, ...data }));
    setCurrentFlow("loading");
    setLoadingMessage("Setting up your experience...");
    
    setTimeout(() => {
      setCurrentFlow("interests");
    }, 1500);
  };

  // Handle interest selection
  const handleInterestsComplete = (interests: string[]) => {
    setUserData(prev => ({ ...prev, interests }));
    setCurrentFlow("loading");
    setLoadingMessage("Personalizing your feed...");
    
    setTimeout(() => {
      setCurrentFlow("goals");
    }, 1500);
  };

  // Handle goal selection
  const handleGoalsComplete = (goal?: string) => {
    setUserData(prev => ({ ...prev, goal }));
    setCurrentFlow("loading");
    setLoadingMessage("Almost ready...");
    
    setTimeout(() => {
      setCurrentFlow("dashboard");
    }, 2000);
  };

  // Render the appropriate component based on current flow
  const renderCurrentFlow = () => {
    switch (currentFlow) {
      case "initial_animation":
        return <BookOpeningAnimation onComplete={handleAnimationComplete} />;
      
      case "main_page":
        return (
          <>
            <Index onGetStarted={handleAuthStart} />
            <AuthModal 
              isOpen={showAuthModal} 
              onClose={() => setShowAuthModal(false)}
              onLogin={handleLogin}
            />
          </>
        );
      
      case "loading":
        return <LoadingAnimation message={loadingMessage} />;
      
      case "welcome":
        return (
          <WelcomePage 
            userEmail={userData.email}
            onComplete={handleWelcomeComplete}
          />
        );
      
      case "interests":
        return <InterestSelection onComplete={handleInterestsComplete} />;
      
      case "goals":
        return <GoalSelection onComplete={handleGoalsComplete} />;
      
      case "dashboard":
        return <UserDashboard userData={userData} />;
      
      default:
        return <Index onGetStarted={handleAuthStart} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={renderCurrentFlow()} />
            <Route path="/post/:id" element={<BlogPost />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
