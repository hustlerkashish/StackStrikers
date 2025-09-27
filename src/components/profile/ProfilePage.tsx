import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, User, Mail, Calendar, Users, UserPlus } from 'lucide-react';
import { EditProfileModal } from './EditProfileModal';
import { useToast } from '@/hooks/use-toast';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Please log in to view your profile</h1>
        </div>
      </div>
    );
  }

  // Ensure user has required properties
  const safeUser = {
    ...user,
    followers: user.followers || [],
    following: user.following || [],
    bio: user.bio || '',
    avatar: user.avatar || '',
    createdAt: user.createdAt || new Date().toISOString()
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={safeUser.avatar} alt={safeUser.name} />
                <AvatarFallback className="text-2xl">
                  {safeUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{safeUser.name}</h1>
                    <p className="text-gray-600 mt-1">{safeUser.email}</p>
                    {safeUser.bio && (
                      <p className="text-gray-700 mt-2">{safeUser.bio}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="flex items-center gap-2"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-6 mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{safeUser.followers.length} followers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    <span>{safeUser.following.length} following</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(safeUser.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="likes">Liked Posts</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Posts</CardTitle>
                <CardDescription>
                  Posts you've created and published
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <p>No posts yet. Start writing your first blog post!</p>
                  <Button className="mt-4" onClick={() => {/* Navigate to create post */}}>
                    Create Your First Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="likes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Liked Posts</CardTitle>
                <CardDescription>
                  Posts you've liked and want to read again
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <p>No liked posts yet. Start exploring and liking posts!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="following" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Following</CardTitle>
                <CardDescription>
                  People you're following
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <p>You're not following anyone yet. Start following interesting authors!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};
