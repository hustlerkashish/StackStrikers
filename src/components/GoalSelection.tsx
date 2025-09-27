import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, CheckCircle } from "lucide-react";

interface GoalSelectionProps {
  onComplete: (goal?: string) => void;
}

const goals = [
  "Learn something new",
  "Get inspired",
  "Stay informed about my industry",
  "Find new perspectives",
  "Improve my writing",
  "Connect with like-minded people",
  "Research for a project",
  "Kill time",
  "Other"
];

export const GoalSelection = ({ onComplete }: GoalSelectionProps) => {
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [wantsResearch, setWantsResearch] = useState(false);

  const handleContinue = () => {
    onComplete(selectedGoal);
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="text-2xl font-serif font-bold text-black mb-8">Medium</div>
          
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-gray-600" />
            </div>
          </div>

          <h1 className="text-2xl font-serif text-gray-900 mb-6">
            What brings you here today?
          </h1>
        </div>

        {/* Goal Selection */}
        <div className="space-y-6">
          <div className="text-left">
            <Select value={selectedGoal} onValueChange={setSelectedGoal}>
              <SelectTrigger className="w-full p-4 text-left border border-gray-300 rounded-md bg-white">
                <SelectValue placeholder="Select a goal" />
              </SelectTrigger>
              <SelectContent>
                {goals.map((goal) => (
                  <SelectItem key={goal} value={goal} className="py-3">
                    {goal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Research Participation Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-md text-left">
            <button
              onClick={() => setWantsResearch(!wantsResearch)}
              className={`flex-shrink-0 w-5 h-5 border-2 rounded transition-all ${
                wantsResearch 
                  ? 'bg-green-600 border-green-600 text-white' 
                  : 'border-gray-300 bg-white'
              }`}
            >
              {wantsResearch && <CheckCircle className="w-3 h-3" />}
            </button>
            <div className="text-sm">
              <p className="text-gray-900">
                I'd like to participate in future research sessions.
              </p>
              <p className="text-gray-600 mt-1">
                Help improve Medium by participating in occasional user research sessions.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-4">
            <Button
              onClick={handleContinue}
              disabled={!selectedGoal}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </Button>
            
            <button
              onClick={handleSkip}
              className="block w-full text-gray-600 hover:text-gray-800 font-medium py-2"
            >
              Skip
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-xs text-gray-500">
          <p>
            This information helps us personalize your Medium experience.
            You can update your preferences anytime in settings.
          </p>
        </div>
      </div>
    </div>
  );
};