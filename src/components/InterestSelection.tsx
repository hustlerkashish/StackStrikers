import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";

interface InterestSelectionProps {
  onComplete: (interests: string[]) => void;
}

const availableInterests = [
  "Technology", "Programming", "Design", "Artificial Intelligence", "Data Science",
  "Web Development", "Mobile Development", "Blockchain", "Cryptocurrency", "Startup",
  "Business", "Marketing", "Psychology", "Self Improvement", "Productivity",
  "Health", "Fitness", "Travel", "Photography", "Writing", "Literature",
  "Science", "Physics", "Biology", "Chemistry", "Mathematics", "Engineering",
  "Finance", "Economics", "Politics", "History", "Philosophy", "Art",
  "Music", "Movies", "Gaming", "Sports", "Food", "Cooking", "Fashion",
  "Environment", "Climate Change", "Sustainability", "Education", "Learning"
];

export const InterestSelection = ({ onComplete }: InterestSelectionProps) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleContinue = () => {
    onComplete(selectedInterests);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="text-2xl font-serif font-bold text-black">Medium</div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-gray-600" />
            </div>
          </div>

          <h1 className="text-3xl font-serif text-gray-900 mb-4">
            What brings you here today?
          </h1>
          
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Choose topics that interest you to personalize your Medium experience. 
            You can always change these later.
          </p>
        </div>

        {/* Interest Grid */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableInterests.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                  selectedInterests.includes(interest)
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 hover:border-gray-300 bg-white text-gray-900'
                }`}
              >
                <span className="font-medium text-sm">{interest}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Count */}
        {selectedInterests.length > 0 && (
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              {selectedInterests.length} topic{selectedInterests.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handleContinue}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-medium"
            disabled={selectedInterests.length === 0}
          >
            Continue ({selectedInterests.length})
          </Button>
          
          <button
            onClick={() => onComplete([])}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Skip for now
          </button>
        </div>

        {/* Selected Interests Preview */}
        {selectedInterests.length > 0 && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Selected topics:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedInterests.map((interest) => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};