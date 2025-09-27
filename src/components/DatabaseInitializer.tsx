import React, { useEffect, useState } from 'react';
import { initializeDatabase } from '@/lib/database';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Database, CheckCircle, XCircle } from 'lucide-react';

interface DatabaseInitializerProps {
  children: React.ReactNode;
}

export const DatabaseInitializer: React.FC<DatabaseInitializerProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        setIsLoading(true);
        await initializeDatabase();
        setIsInitialized(true);
      } catch (err) {
        console.error('Database initialization failed:', err);
        setError('Failed to connect to database. Please check your MongoDB connection.');
      } finally {
        setIsLoading(false);
      }
    };

    initDatabase();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-indo-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indo-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-indo-secondary mb-2">Initializing Database</h2>
          <p className="text-gray-600">Setting up your IndoGyaan platform...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-indo-background flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Button 
              onClick={() => window.location.reload()} 
              className="indo-button-primary"
            >
              Retry Connection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-indo-background flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              Database connection established. Initializing demo data...
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
