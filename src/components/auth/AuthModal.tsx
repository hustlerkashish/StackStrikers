import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultMode = 'login' 
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);

  const handleSwitchToSignup = () => {
    setMode('signup');
  };

  const handleSwitchToLogin = () => {
    setMode('login');
  };

  const handleClose = () => {
    setMode(defaultMode);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center">
          {mode === 'login' ? (
            <LoginForm onSwitchToSignup={handleSwitchToSignup} />
          ) : (
            <SignupForm onSwitchToLogin={handleSwitchToLogin} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
