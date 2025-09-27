import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  avatar: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
    },
  });

  const watchedAvatar = watch('avatar');

  React.useEffect(() => {
    if (watchedAvatar && watchedAvatar !== user?.avatar) {
      setAvatarPreview(watchedAvatar);
    } else {
      setAvatarPreview(null);
    }
  }, [watchedAvatar, user?.avatar]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      await updateProfile({
        name: data.name,
        bio: data.bio || undefined,
        avatar: data.avatar || undefined,
      });
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'An error occurred while updating your profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setAvatarPreview(null);
    onClose();
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    // Reset the avatar field
    reset({ ...watch(), avatar: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Avatar Section */}
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-full w-full object-cover"
                    />
                  ) : user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Current avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-lg">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                {avatarPreview && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={handleRemoveAvatar}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              <div className="flex-1">
                <Input
                  placeholder="Enter image URL"
                  {...register('avatar')}
                  disabled={isLoading}
                />
                {errors.avatar && (
                  <Alert variant="destructive" className="mt-1">
                    <AlertDescription>{errors.avatar.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              {...register('name')}
              disabled={isLoading}
            />
            {errors.name && (
              <Alert variant="destructive">
                <AlertDescription>{errors.name.message}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Bio Field */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              rows={3}
              {...register('bio')}
              disabled={isLoading}
            />
            {errors.bio && (
              <Alert variant="destructive">
                <AlertDescription>{errors.bio.message}</AlertDescription>
              </Alert>
            )}
            <p className="text-sm text-gray-500">
              {watch('bio')?.length || 0}/500 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
