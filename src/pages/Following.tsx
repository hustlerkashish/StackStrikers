import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon, Plus, Check, Loader2 } from 'lucide-react';
import { getAllUsers, toggleFollow } from '@/lib/database';
import { User } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

const Following = () => {
  const { user, isLoading: authLoading, updateProfile } = useAuth();
  const { toast } = useToast();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const users = await getAllUsers();
        setAllUsers(users.filter(u => u.id !== user?.id)); // Exclude current user
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast({
          title: 'Error',
          description: 'Failed to load users. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (!authLoading && user) {
      fetchUsers();
    }
  }, [user, authLoading, toast]);

  const handleToggleFollow = async (followingId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to follow users.',
        variant: 'destructive',
      });
      return;
    }
    try {
      const isFollowing = await toggleFollow(user.id, followingId);
      toast({
        title: isFollowing ? 'Followed!' : 'Unfollowed!',
        description: isFollowing ? 'You are now following this user.' : 'You have unfollowed this user.',
      });
      // Manually update local state for immediate UI feedback
      setAllUsers(prevUsers =>
        prevUsers.map(u => {
          if (u.id === followingId) {
            return {
              ...u,
              followers: isFollowing
                ? [...u.followers, user.id]
                : u.followers.filter(id => id !== user.id),
            };
          }
          return u;
        })
      );
      // Also update the current user's following list in AuthContext
      if (updateProfile) {
        await updateProfile({
          following: isFollowing
            ? [...(user.following || []), followingId]
            : (user.following || []).filter(id => id !== followingId),
        });
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error);
      toast({
        title: 'Error',
        description: 'Failed to update follow status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const followedUsers = allUsers.filter(u => user?.following?.includes(u.id));
  const suggestedUsers = allUsers.filter(u => !user?.following?.includes(u.id));

  if (isLoading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-indo-background">
        <Loader2 className="h-10 w-10 animate-spin text-indo-primary" />
        <span className="ml-4 text-lg text-indo-secondary">Loading Following...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-indo-background">
        <Navigation />
        <main className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold mb-8 indo-text-gradient">Connect with Writers</h1>
          <p className="text-lg text-gray-700 mb-8">Please log in to view and manage your followed writers and discover new ones.</p>
          <Button className="indo-button-primary">Sign In</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indo-background">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 indo-text-gradient">Your Following Feed</h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Stay updated with the latest from writers and publications you follow.
          </p>
        </section>

        {followedUsers.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-indo-secondary mb-8">Writers You Follow</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {followedUsers.map(followedUser => (
                <Card key={followedUser.id} className="indo-card flex items-center p-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={followedUser.avatar} />
                    <AvatarFallback>{followedUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-indo-secondary">{followedUser.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-1">{followedUser.bio || 'No bio available.'}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{followedUser.followers?.length || 0} followers</span>
                      <span>{followedUser.following?.length || 0} following</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-indo-accent text-indo-accent hover:bg-indo-accent hover:text-white ml-4"
                    onClick={() => handleToggleFollow(followedUser.id)}
                  >
                    <Check className="w-4 h-4 mr-2" /> Following
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-3xl font-bold text-indo-secondary mb-8">Discover New Writers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedUsers.length === 0 ? (
              <p className="text-center text-gray-600 text-lg col-span-full">No new writers to suggest at the moment.</p>
            ) : (
              suggestedUsers.map(suggestedUser => (
                <Card key={suggestedUser.id} className="indo-card flex items-center p-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={suggestedUser.avatar} />
                    <AvatarFallback>{suggestedUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-indo-secondary">{suggestedUser.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-1">{suggestedUser.bio || 'No bio available.'}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{suggestedUser.followers?.length || 0} followers</span>
                      <span>{suggestedUser.following?.length || 0} following</span>
                    </div>
                  </div>
                  <Button
                    className="indo-button-primary ml-4"
                    onClick={() => handleToggleFollow(suggestedUser.id)}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Follow
                  </Button>
                </Card>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Following;