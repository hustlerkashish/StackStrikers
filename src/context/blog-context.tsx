import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { blogService } from '../lib/blog-service'
import type { Post, Category, Comment } from '../lib/supabase'
import { useToast } from '../hooks/use-toast'

type BlogContextType = {
  posts: Post[]
  categories: Category[]
  loading: boolean
  error: Error | null
  fetchPosts: (options?: { categoryId?: string; searchQuery?: string }) => Promise<void>
  fetchCategories: () => Promise<void>
  createPost: (post: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => Promise<Post>
  updatePost: (id: string, post: Partial<Post>) => Promise<Post>
  deletePost: (id: string) => Promise<void>
  createComment: (comment: Omit<Comment, 'id' | 'created_at'>) => Promise<Comment>
  deleteComment: (id: string) => Promise<void>
}

const BlogContext = createContext<BlogContextType | null>(null)

export function BlogProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const fetchPosts = useCallback(async (options?: { categoryId?: string; searchQuery?: string }) => {
    try {
      setLoading(true)
      const data = await blogService.getPosts(options)
      setPosts(data)
    } catch (err) {
      setError(err as Error)
      toast({
        variant: 'destructive',
        title: 'Error fetching posts',
        description: (err as Error).message
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      const data = await blogService.getCategories()
      setCategories(data)
    } catch (err) {
      setError(err as Error)
      toast({
        variant: 'destructive',
        title: 'Error fetching categories',
        description: (err as Error).message
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const createPost = useCallback(async (post: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newPost = await blogService.createPost(post)
      setPosts(prev => [newPost, ...prev])
      toast({
        title: 'Post created',
        description: 'Your post has been created successfully.'
      })
      return newPost
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error creating post',
        description: (err as Error).message
      })
      throw err
    }
  }, [toast])

  const updatePost = useCallback(async (id: string, post: Partial<Post>) => {
    try {
      const updatedPost = await blogService.updatePost(id, post)
      setPosts(prev => prev.map(p => p.id === id ? updatedPost : p))
      toast({
        title: 'Post updated',
        description: 'Your post has been updated successfully.'
      })
      return updatedPost
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error updating post',
        description: (err as Error).message
      })
      throw err
    }
  }, [toast])

  const deletePost = useCallback(async (id: string) => {
    try {
      await blogService.deletePost(id)
      setPosts(prev => prev.filter(p => p.id !== id))
      toast({
        title: 'Post deleted',
        description: 'Your post has been deleted successfully.'
      })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error deleting post',
        description: (err as Error).message
      })
      throw err
    }
  }, [toast])

  const createComment = useCallback(async (comment: Omit<Comment, 'id' | 'created_at'>) => {
    try {
      const newComment = await blogService.createComment(comment)
      toast({
        title: 'Comment added',
        description: 'Your comment has been added successfully.'
      })
      return newComment
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error adding comment',
        description: (err as Error).message
      })
      throw err
    }
  }, [toast])

  const deleteComment = useCallback(async (id: string) => {
    try {
      await blogService.deleteComment(id)
      toast({
        title: 'Comment deleted',
        description: 'Your comment has been deleted successfully.'
      })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error deleting comment',
        description: (err as Error).message
      })
      throw err
    }
  }, [toast])

  return (
    <BlogContext.Provider
      value={{
        posts,
        categories,
        loading,
        error,
        fetchPosts,
        fetchCategories,
        createPost,
        updatePost,
        deletePost,
        createComment,
        deleteComment,
      }}
    >
      {children}
    </BlogContext.Provider>
  )
}

export function useBlog() {
  const context = useContext(BlogContext)
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider')
  }
  return context
}