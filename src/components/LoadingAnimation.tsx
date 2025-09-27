import { BookOpen } from "lucide-react";

interface LoadingAnimationProps {
  message?: string;
}

export const LoadingAnimation = ({ message = "Loading..." }: LoadingAnimationProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center">
        {/* Book Loading Animation */}
        <div className="relative mb-6">
          <div className="w-20 h-24 mx-auto">
            {/* Animated Pages */}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 bg-gradient-to-r from-amber-100 to-amber-50 border-2 border-amber-200 rounded-lg shadow-md animate-pulse"
                style={{
                  transform: `translateX(${i * 2}px) translateY(${i * -2}px)`,
                  zIndex: 10 - i,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '2s'
                }}
              >
                {/* Page Lines */}
                <div className="absolute inset-3 space-y-1">
                  {[...Array(6)].map((_, lineIndex) => (
                    <div 
                      key={lineIndex} 
                      className="h-0.5 bg-amber-300 rounded opacity-40"
                      style={{ width: `${80 - lineIndex * 10}%` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading Text */}
        <h3 className="text-lg font-serif text-gray-700 mb-2">{message}</h3>
        <p className="text-sm text-gray-500">Please wait while we prepare your experience...</p>
        
        {/* Dots Animation */}
        <div className="flex justify-center space-x-1 mt-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};