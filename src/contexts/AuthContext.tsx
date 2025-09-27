import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, SignupRequest, UpdateProfileRequest } from '@/types/database';
import { 
  loginUser, 
  createUser, 
  getUserById, 
  updateUserProfile
} from '@/lib/database';
import { mongoAPI } from '@/lib/mongodb-api';

interface AuthContextType {
  user: Omit<User, 'password'> | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (userData: SignupRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: UpdateProfileRequest) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      console.log('Checking auth with token:', storedToken ? 'Token exists' : 'No token');
      
      if (storedToken) {
        try {
          // Set token in API service
          mongoAPI.setToken(storedToken);
          
          // Try to get user data to validate token
          const response = await fetch('http://localhost:5000/api/users/me', {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });
          
          console.log('Auth check response status:', response.status);
          
          if (response.ok) {
            const userData = await response.json();
            console.log('User data loaded:', userData);
            setUser(userData);
            setToken(storedToken);
          } else {
            console.log('Token invalid, removing from storage');
            localStorage.removeItem('token');
            mongoAPI.setToken(null);
          }
        } catch (error) {
          console.error('Auth check error:', error);
          localStorage.removeItem('token');
          mongoAPI.setToken(null);
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      console.log('Attempting login for:', credentials.email);
      console.log('Login credentials:', credentials);
      const response = await loginUser(credentials);
      console.log('Login successful, user:', response.user);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      mongoAPI.setToken(response.token);
      console.log('Token stored in localStorage');
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error details:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupRequest) => {
    try {
      setIsLoading(true);
      const response = await createUser(userData);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      mongoAPI.setToken(response.token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    mongoAPI.setToken(null);
  };

  const updateProfile = async (updates: UpdateProfileRequest) => {
    if (!user) throw new Error('Not authenticated');
    
    try {
      setIsLoading(true);
      const updatedUser = await updateUserProfile(user.id, updates);
      setUser(updatedUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    signup,
    logout,
    updateProfile,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
