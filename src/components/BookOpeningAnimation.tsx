import { useState, useEffect } from "react";

interface BookOpeningAnimationProps {
  onComplete: () => void;
  duration?: number;
}

const BLOG_WORDS = [
  "Ancient Wisdom",
  "Modern Insights", 
  "Cultural Stories",
  "Life Philosophy",
  "Spiritual Growth",
  "Traditional Values",
  "Contemporary Views",
  "Knowledge Sharing",
  "Indian Heritage",
  "Global Perspectives",
  "Thoughtful Essays",
  "Wisdom Traditions",
  "Personal Growth",
  "Cultural Bridge",
  "Timeless Lessons"
];

export const BookOpeningAnimation = ({ onComplete, duration = 6000 }: BookOpeningAnimationProps) => {
  const [animationPhase, setAnimationPhase] = useState<'closed' | 'opening' | 'releasing' | 'complete'>('closed');
  const [showTitle, setShowTitle] = useState(false);
  const [floatingWords, setFloatingWords] = useState<Array<{id: number, text: string, delay: number, x: number, y: number, rotation: number, fadeOut?: number}>>([]);

  useEffect(() => {
    const startOpening = setTimeout(() => {
      setAnimationPhase('opening');
    }, 1000);

    const startReleasing = setTimeout(() => {
      setAnimationPhase('releasing');
      
      // Generate fewer words with better spacing and staggered appearance
      const selectedWords = BLOG_WORDS.slice(0, 8); // Only show 8 blog topics instead of 15
      const words = selectedWords.map((word, index) => ({
        id: index,
        text: word,
        delay: index * 400, // Slower, more spaced out appearance
        x: (Math.random() - 0.5) * 600, // Smaller spread area
        y: (Math.random() - 0.5) * 400,
        rotation: (Math.random() - 0.5) * 20, // Less rotation
        fadeOut: index < 4 ? 4000 + (index * 500) : 0 // First 4 words fade out after some time
      }));
      setFloatingWords(words);
    }, 2500);

    const showTitleTimer = setTimeout(() => {
      setShowTitle(true);
    }, 3500);

    const completeTimer = setTimeout(() => {
      setAnimationPhase('complete');
      setTimeout(onComplete, 800);
    }, duration);

    return () => {
      clearTimeout(startOpening);
      clearTimeout(startReleasing);
      clearTimeout(showTitleTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, duration]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Magical particles background */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => ( // Reduced from 25 to 12 particles
          <div
            key={i}
            className={`absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-3000 ${
              animationPhase !== 'closed' ? 'animate-pulse opacity-40' : 'opacity-0' // Reduced opacity
            }`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 200}ms`, // Slower appearance
              animationDuration: `${3 + Math.random() * 2}s` // Slower animation
            }}
          />
        ))}
      </div>

      {/* Main content container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        
        {/* Book container with realistic perspective */}
        <div className="relative mb-16" style={{ perspective: '1200px', perspectiveOrigin: 'center center' }}>
          <div 
            className="relative w-96 h-64 mx-auto"
            style={{ 
              transform: 'rotateX(5deg) rotateY(0deg)',
              transformStyle: 'preserve-3d'
            }}
          >
            
            {/* Book Base/Spine - Always visible */}
            <div 
              className="absolute left-1/2 top-0 w-6 h-64 z-30 transform -translate-x-1/2"
              style={{
                background: 'linear-gradient(180deg, #1e40af 0%, #1e3a8a 50%, #1e293b 100%)',
                borderRadius: '3px',
                boxShadow: '0 4px 20px rgba(30, 41, 59, 0.6)',
              }}
            >
              <div className="absolute inset-1 bg-gradient-to-b from-blue-700/30 to-transparent rounded"></div>
            </div>

            {/* Left Page (Cover) */}
            <div 
              className="absolute left-0 w-48 h-64 origin-right z-20 transition-all duration-2500 ease-out"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 30%, #3b82f6 100%)',
                borderRadius: '8px 2px 2px 8px',
                transformStyle: 'preserve-3d',
                transform: animationPhase === 'closed' 
                  ? 'rotateY(0deg) rotateX(0deg)' 
                  : 'rotateY(-165deg) rotateX(2deg)',
                boxShadow: animationPhase === 'closed'
                  ? '8px 8px 25px rgba(30, 41, 59, 0.4)'
                  : '15px 15px 35px rgba(30, 41, 59, 0.6)',
              }}
            >
              {/* Book Cover Content - Fixed to not reverse */}
              <div className="absolute inset-6 border border-blue-200/40 rounded flex flex-col items-center justify-center text-blue-100">
                <div 
                  className="text-center"
                  style={{
                    transform: animationPhase === 'closed' ? 'rotateY(0deg)' : 'rotateY(165deg)'
                  }}
                >
                  <div className="text-2xl font-serif font-bold mb-3">INDO</div>
                  <div className="w-16 h-0.5 bg-blue-200/60 mb-3 mx-auto"></div>
                  <div className="text-lg font-medium mb-1">GYAAN</div>
                  <div className="text-sm opacity-80">BLOG</div>
                </div>
                
                {/* Corner decorations */}
                <div className="absolute top-3 left-3 w-3 h-3 border-l border-t border-blue-200/50"></div>
                <div className="absolute top-3 right-3 w-3 h-3 border-r border-t border-blue-200/50"></div>
                <div className="absolute bottom-3 left-3 w-3 h-3 border-l border-b border-blue-200/50"></div>
                <div className="absolute bottom-3 right-3 w-3 h-3 border-r border-b border-blue-200/50"></div>
              </div>
            </div>

            {/* Right Page (First inside page) */}
            <div 
              className="absolute right-0 w-48 h-64 origin-left z-10 transition-all duration-2500 ease-out"
              style={{
                background: 'linear-gradient(225deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
                borderRadius: '2px 8px 8px 2px',
                transformStyle: 'preserve-3d',
                transform: animationPhase === 'closed' 
                  ? 'rotateY(0deg) rotateX(0deg)' 
                  : 'rotateY(165deg) rotateX(-2deg)',
                boxShadow: animationPhase === 'closed'
                  ? '-8px 8px 25px rgba(30, 41, 59, 0.3)'
                  : '-15px 15px 35px rgba(30, 41, 59, 0.5)',
              }}
            >
              {/* Page Content - Lines of text */}
              <div className="absolute inset-8">
                {[...Array(18)].map((_, i) => (
                  <div 
                    key={i} 
                    className="mb-3 bg-slate-600/30 rounded-sm transition-all duration-1000"
                    style={{ 
                      height: '2px',
                      width: i === 0 ? '85%' : i < 3 ? '80%' : `${60 + Math.random() * 25}%`,
                      animationDelay: animationPhase === 'opening' ? `${i * 80}ms` : '0ms',
                      opacity: animationPhase === 'opening' ? 0.4 : 0.2
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Magical glow effect around book */}
            <div 
              className={`absolute inset-0 transition-opacity duration-2000 ${
                animationPhase !== 'closed' ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ 
                background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
                transform: 'scale(1.8)',
                filter: 'blur(15px)'
              }}
            />
          </div>

          {/* Floating Story Words - Escape from the book! */}
          <div className="absolute inset-0 pointer-events-none">
            {floatingWords.map((word) => (
              <div
                key={word.id}
                className={`absolute text-lg font-serif font-medium text-slate-700 transition-all duration-2000 ${
                  animationPhase === 'releasing' || animationPhase === 'complete'
                    ? 'opacity-90' 
                    : 'opacity-0'
                }`}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: animationPhase === 'releasing' || animationPhase === 'complete'
                    ? `translate(-50%, -50%) translate(${word.x}px, ${word.y}px) rotate(${word.rotation}deg)`
                    : 'translate(-50%, -50%)',
                  transitionDelay: `${word.delay}ms`,
                  fontSize: `${18 + Math.random() * 6}px`, // Slightly larger and more varied
                  textShadow: '2px 2px 4px rgba(0,0,0,0.15)',
                  zIndex: 40,
                  animation: animationPhase === 'releasing' || animationPhase === 'complete' 
                    ? 'float 6s ease-in-out infinite' 
                    : 'none',
                  animationDelay: `${word.delay + 800}ms`,
                  // Add fade out effect for early words
                  opacity: word.fadeOut && Date.now() % 10000 > word.fadeOut ? '0.3' : undefined
                }}
              >
                {word.text}
              </div>
            ))}
          </div>

          {/* Swirling magical effects */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => ( // Reduced from 12 to 6 swirl effects
              <div
                key={i}
                className={`absolute w-2 h-2 rounded-full transition-all duration-2000 ${
                  animationPhase === 'releasing' || animationPhase === 'complete'
                    ? 'animate-spin opacity-50' // Reduced opacity
                    : 'opacity-0'
                }`}
                style={{
                  left: '50%',
                  top: '50%',
                  background: `linear-gradient(45deg, #3b82f6, #1d4ed8)`,
                  transform: `translate(-50%, -50%) translate(${Math.cos(i * 0.8) * (100 + i * 20)}px, ${Math.sin(i * 0.8) * (100 + i * 20)}px)`, // Better spacing
                  animationDelay: `${i * 300}ms`, // Slower stagger
                  animationDuration: `${3 + Math.random()}s`, // Slower rotation
                  filter: 'blur(1px)' // Slightly more blur
                }}
              />
            ))}
          </div>
        </div>

        {/* Title Section - Perfect Center Alignment */}
        <div className="text-center max-w-2xl mx-auto px-6">
          <h1 className={`text-4xl md:text-6xl font-serif font-bold bg-gradient-to-r from-slate-700 via-blue-700 to-indigo-800 bg-clip-text text-transparent mb-6 transition-all duration-1000 ${
            showTitle ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}>
            Welcome to IndoGyaan
          </h1>
          <p className={`text-xl md:text-2xl text-slate-700 leading-relaxed transition-all duration-1000 delay-500 ${
            showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Where knowledge meets wisdom through insightful blogs
          </p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center gap-4">
          <div className="w-80 h-2 bg-slate-200/50 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 rounded-full transition-all ease-out"
              style={{ 
                width: animationPhase === 'closed' 
                  ? '15%' 
                  : animationPhase === 'opening' 
                    ? '45%' 
                    : animationPhase === 'releasing'
                      ? '85%'
                      : '100%',
                transitionDuration: '1200ms'
              }}
            />
          </div>
          
          <p className="text-slate-700 text-sm font-medium tracking-wide text-center">
            {animationPhase === 'closed' 
              ? 'Preparing your IndoGyaan experience...' 
              : animationPhase === 'opening' 
                ? 'Loading knowledge & wisdom...' 
                : animationPhase === 'releasing'
                  ? 'Discovering amazing insights...'
                  : 'Welcome to IndoGyaan Blog!'}
          </p>
        </div>
      </div>
    </div>
  );
};
