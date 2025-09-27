import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DatabaseInitializer } from "@/components/DatabaseInitializer";
import { LandingPage } from "@/components/LandingPage";
import Index from "./pages/Index";
import BlogPage from "./pages/BlogPage";
import Library from "./pages/Library";
import Stories from "./pages/Stories";
import Stats from "./pages/Stats";
import Following from "./pages/Following";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin";
import AdminPanel from "./pages/AdminPanel";
import MyPosts from "./pages/MyPosts";
import { ProfilePage } from "./components/profile/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DatabaseInitializer>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/library" element={<Library />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/following" element={<Following />} />
            <Route path="/post/:id" element={<BlogPost />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
            <Route path="/my-posts" element={<MyPosts />} />
            <Route path="/profile" element={<ProfilePage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </DatabaseInitializer>
  </QueryClientProvider>
);

export default App;
