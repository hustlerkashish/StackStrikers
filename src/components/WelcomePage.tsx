import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, User } from "lucide-react";

interface WelcomePageProps {
  userEmail?: string;
  onComplete: (userData: { name: string; email: string }) => void;
}

export const WelcomePage = ({ userEmail = "", onComplete }: WelcomePageProps) => {
  const [fullName, setFullName] = useState("");

  const handleCreateAccount = () => {
    if (fullName.trim()) {
      onComplete({
        name: fullName,
        email: userEmail
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="text-3xl font-serif font-bold text-black">
            Medium
          </div>
        </div>

        {/* Book Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-gray-600" />
          </div>
        </div>

        {/* Welcome Message */}
        <h1 className="text-3xl font-serif text-gray-900 mb-4">
          Welcome to Medium!
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          We need a little more information to finish creating your account.
        </p>

        {/* Form */}
        <div className="space-y-6">
          {/* Full Name Input */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Your full name
            </label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Email Display */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Your email is
            </label>
            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
              {userEmail || "user@example.com"}
            </div>
          </div>

          {/* Create Account Button */}
          <Button
            onClick={handleCreateAccount}
            disabled={!fullName.trim()}
            className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create account
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            By creating an account, you agree to Medium's{" "}
            <a href="#" className="text-black underline">Terms of Service</a> and{" "}
            <a href="#" className="text-black underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};