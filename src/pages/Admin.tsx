import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Shield, User, Lock, ArrowRight } from "lucide-react";

export default function Admin() {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(credentials);
      if (user?.role === 'admin') {
        navigate('/admin-panel');
      } else {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // If user is already logged in and is admin, redirect to admin panel
  if (user?.role === 'admin') {
    navigate('/admin-panel');
    return null;
  }

  return (
    <div className="min-h-screen bg-indo-background">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="indo-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-indo-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-indo-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-indo-secondary">
                Admin Access
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Enter your admin credentials to access the admin panel
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    placeholder="admin@indogyaan.com"
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    placeholder="Enter your password"
                    required
                    className="w-full"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full indo-button-primary"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Access Admin Panel
                </Button>
              </form>
              
              <div className="mt-6 p-4 bg-indo-primary/5 rounded-lg">
                <h3 className="font-semibold text-indo-secondary mb-2">Demo Admin Credentials:</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Email:</strong> admin@indogyaan.com</p>
                  <p><strong>Password:</strong> admin123</p>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <Link to="/blog" className="text-indo-primary hover:text-indo-secondary flex items-center justify-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Back to Blog
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}