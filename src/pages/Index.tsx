import { BlogHero } from "@/components/BlogHero";
import { Navigation } from "@/components/Navigation";

interface IndexProps {
  onGetStarted?: () => void;
}

const Index = ({ onGetStarted }: IndexProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section - Clean Get Started Page */}
      <BlogHero onSearch={() => {}} onGetStarted={onGetStarted} />
      
      {/* Optional: Simple footer or additional CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif text-gray-900 mb-6">
            Ready to embark on your journey of knowledge and wisdom?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join IndoGyaan community where traditional wisdom meets modern insights. Discover, learn, and share meaningful perspectives on life, culture, and beyond.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg rounded-full font-medium transition-all duration-300 inline-flex items-center gap-2"
          >
            Get Started
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Index;
