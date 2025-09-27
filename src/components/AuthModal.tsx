import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Mail, Github, Chrome, Apple, BookOpen } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (method: string) => void;
}

export const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");

  const handleSocialLogin = (provider: string) => {
    onLogin(provider);
  };

  const handleEmailLogin = () => {
    if (email) {
      onLogin("email");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white rounded-xl">
        <DialogHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-amber-100 rounded-full">
              <BookOpen className="w-8 h-8 text-amber-700" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-serif text-gray-800">
            {isSignUp ? "Join Medium" : "Welcome back"}
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            {isSignUp 
              ? "Create an account to start reading and writing stories"
              : "Sign in to continue your journey"
            }
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Social Login Options */}
          <div className="space-y-3">
            <Button
              onClick={() => handleSocialLogin("google")}
              variant="outline"
              className="w-full flex items-center gap-3 py-3 border-gray-300 hover:bg-gray-50"
            >
              <Chrome className="w-5 h-5" />
              Continue with Google
            </Button>
            
            <Button
              onClick={() => handleSocialLogin("github")}
              variant="outline"
              className="w-full flex items-center gap-3 py-3 border-gray-300 hover:bg-gray-50"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </Button>
            
            <Button
              onClick={() => handleSocialLogin("apple")}
              variant="outline"
              className="w-full flex items-center gap-3 py-3 border-gray-300 hover:bg-gray-50"
            >
              <Apple className="w-5 h-5" />
              Continue with Apple
            </Button>
          </div>

          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex justify-center items-center">
              <span className="bg-white px-3 text-sm text-gray-500">or</span>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 py-3 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>
            
            <Button
              onClick={handleEmailLogin}
              className="w-full bg-black hover:bg-gray-800 text-white py-3"
              disabled={!email}
            >
              Continue with Email
            </Button>
          </div>

          {/* Toggle Sign In/Up */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>

          {/* Terms */}
          <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-100">
            By continuing, you agree to Medium's{" "}
            <a href="#" className="underline hover:text-gray-700">Terms of Service</a> and{" "}
            <a href="#" className="underline hover:text-gray-700">Privacy Policy</a>.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};