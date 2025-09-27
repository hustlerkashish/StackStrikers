import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createPost } from '@/lib/database';
import { CreatePostRequest } from '@/types/database';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  isPublished: z.boolean(),
});

type PostFormData = z.infer<typeof postSchema>;

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

const categories = [
  'React',
  'TypeScript',
  'JavaScript',
  'CSS',
  'Web Design',
  'Node.js',
  'Python',
  'General',
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
  isOpen, 
  onClose, 
  onPostCreated 
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      isPublished: true,
    },
  });

  const watchedContent = watch('content');
  const watchedTitle = watch('title');

  const onSubmit = async (data: PostFormData) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create a post.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      const postData: CreatePostRequest = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        category: data.category,
        imageUrl: data.imageUrl || undefined,
        isPublished: data.isPublished,
      };

      await createPost(user.id, postData);
      
      toast({
        title: 'Post created!',
        description: data.isPublished 
          ? 'Your post has been published successfully.' 
          : 'Your post has been saved as a draft.',
      });
      
      reset();
      onClose();
      onPostCreated?.();
    } catch (error) {
      toast({
        title: 'Failed to create post',
        description: error instanceof Error ? error.message : 'An error occurred while creating your post',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setShowPreview(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Edit
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="isPublished" className="text-sm">
                Publish immediately
              </Label>
              <Switch
                id="isPublished"
                checked={watch('isPublished')}
                onCheckedChange={(checked) => setValue('isPublished', checked)}
                disabled={isLoading}
              />
            </div>
          </div>

          {!showPreview ? (
            <>
              {/* Title Field */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter your post title"
                  {...register('title')}
                  disabled={isLoading}
                />
                {errors.title && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.title.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Excerpt Field */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Write a brief description of your post..."
                  rows={2}
                  {...register('excerpt')}
                  disabled={isLoading}
                />
                {errors.excerpt && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.excerpt.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Category Field */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.category.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Image URL Field */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Featured Image URL (optional)</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  {...register('imageUrl')}
                  disabled={isLoading}
                />
                {errors.imageUrl && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.imageUrl.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Content Field */}
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your post content here... (Markdown supported)"
                  rows={12}
                  {...register('content')}
                  disabled={isLoading}
                />
                {errors.content && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.content.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </>
          ) : (
            /* Preview Section */
            <div className="space-y-4">
              <div className="border rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-2">{watchedTitle || 'Untitled'}</h1>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap">{watchedContent}</div>
                </div>
              </div>
            </div>
          )}

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
              <Save className="mr-2 h-4 w-4" />
              {watch('isPublished') ? 'Publish Post' : 'Save as Draft'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
