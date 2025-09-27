/**
 * @file CreatePostModal.tsx
 * @description A modal component for creating and previewing a new blog post.
 * Uses react-hook-form for state management and Zod for validation.
 */

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ReactMarkdown from 'react-markdown'; // Renders Markdown content

// UI Components (from a library like shadcn/ui)
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, Eye, EyeOff } from 'lucide-react'; // Icons

// Hooks and Services
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { mongoAPI } from '@/lib/mongodb-api'; // Use the centralized API service
import { CreatePostRequest } from '@/types/database';

// Define the validation schema for the form using Zod
const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters long'),
  content: z.string().min(20, 'Content must be at least 20 characters long'),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  isPublished: z.boolean(),
});

// Infer the TypeScript type from the Zod schema
type PostFormData = z.infer<typeof postSchema>;

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void; // Optional callback after a post is created
}

const categories = ['React', 'TypeScript', 'JavaScript', 'CSS', 'Node.js', 'Python', 'General'];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const { user } = useAuth(); // Get authenticated user from context
  const { toast } = useToast(); // Hook for showing notifications
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      category: '',
      imageUrl: '',
      isPublished: true,
    },
  });

  const watchedValues = watch(); // Watch all form fields to update the preview in real-time

  // --- Form Submission Handler ---
  const onSubmit = async (data: PostFormData) => {
    if (!user) {
      toast({ title: 'Authentication required', description: 'Please log in to create a post.', variant: 'destructive' });
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
      
      // Call the API service with the correct argument order
      await mongoAPI.createPost(postData, user.id); 

      toast({
        title: 'Post created successfully!',
        description: data.isPublished ? 'Your post has been published.' : 'Your post was saved as a draft.',
      });

      handleClose(true); // Close modal and signal success
      onPostCreated?.();  // Trigger refresh callback if provided
    } catch (error) {
      toast({
        title: 'Failed to create post',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Modal Close Handler ---
  const handleClose = (wasSuccessful = false) => {
    if (!wasSuccessful) {
      reset(); // Only reset form if canceling, not on success
    }
    setShowPreview(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Top actions: Preview Toggle and Publish Switch */}
          <div className="flex items-center justify-between">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? <><EyeOff className="h-4 w-4 mr-2" />Edit</> : <><Eye className="h-4 w-4 mr-2" />Preview</>}
            </Button>
            
            <Controller
              control={control}
              name="isPublished"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Label htmlFor="isPublished" className="text-sm">Publish immediately</Label>
                  <Switch id="isPublished" checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                </div>
              )}
            />
          </div>

          {/* Conditional rendering: Show Edit Form or Preview Pane */}
          {!showPreview ? (
            <div className="space-y-4">
              {/* Form Input Fields */}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Your amazing post title" {...register('title')} disabled={isLoading} />
                {errors.title && <Alert variant="destructive" className="mt-2"><AlertDescription>{errors.title.message}</AlertDescription></Alert>}
              </div>
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea id="excerpt" placeholder="A short, catchy summary of your post" rows={2} {...register('excerpt')} disabled={isLoading} />
                {errors.excerpt && <Alert variant="destructive" className="mt-2"><AlertDescription>{errors.excerpt.message}</AlertDescription></Alert>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && <Alert variant="destructive" className="mt-2"><AlertDescription>{errors.category.message}</AlertDescription></Alert>}
                </div>
                <div>
                  <Label htmlFor="imageUrl">Featured Image URL (optional)</Label>
                  <Input id="imageUrl" placeholder="https://example.com/image.jpg" {...register('imageUrl')} disabled={isLoading} />
                  {errors.imageUrl && <Alert variant="destructive" className="mt-2"><AlertDescription>{errors.imageUrl.message}</AlertDescription></Alert>}
                </div>
              </div>
              <div>
                <Label htmlFor="content">Content (Markdown supported)</Label>
                <Textarea id="content" placeholder="Write your content here..." rows={12} {...register('content')} disabled={isLoading} />
                {errors.content && <Alert variant="destructive" className="mt-2"><AlertDescription>{errors.content.message}</AlertDescription></Alert>}
              </div>
            </div>
          ) : (
            // Preview Pane with Markdown and Image rendering
            <div className="space-y-4 border rounded-lg p-6 max-h-[60vh] overflow-y-auto">
              {watchedValues.imageUrl && <img src={watchedValues.imageUrl} alt="Preview" className="w-full h-auto max-h-64 object-cover rounded-md mb-4" />}
              <h1 className="text-3xl font-bold break-words">{watchedValues.title || 'Untitled Post'}</h1>
              <p className="text-muted-foreground italic break-words">{watchedValues.excerpt || ''}</p>
              {/* The 'prose' class from @tailwindcss/typography styles the rendered HTML */}
              <div className="prose prose-lg dark:prose-invert max-w-none break-words">
                <ReactMarkdown>{watchedValues.content || 'Start writing to see a preview...'}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Form Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => handleClose()} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {watchedValues.isPublished ? 'Publish Post' : 'Save as Draft'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};