import { supabase, type Post, type Category, type Comment, type Profile } from './supabase'

export const blogService = {
  // Category operations
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data as Category[]
  },

  async createCategory(category: Omit<Category, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single()
    
    if (error) throw error
    return data as Category
  },

  async updateCategory(id: string, category: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Category
  },

  async deleteCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Post operations
  async getPosts({ categoryId, searchQuery, published = true }: { 
    categoryId?: string, 
    searchQuery?: string,
    published?: boolean 
  } = {}) {
    let query = supabase
      .from('posts')
      .select(`
        *,
        category:categories(*),
        author:profiles(*)
      `)
      .eq('published', published)
      .order('created_at', { ascending: false })

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
    }

    const { data, error } = await query
    
    if (error) throw error
    return data as (Post & { category: Category, author: Profile })[]
  },

  async getPostBySlug(slug: string) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        category:categories(*),
        author:profiles(*)
      `)
      .eq('slug', slug)
      .single()
    
    if (error) throw error
    return data as (Post & { category: Category, author: Profile })
  },

  async createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('posts')
      .insert(post)
      .select()
      .single()
    
    if (error) throw error
    return data as Post
  },

  async updatePost(id: string, post: Partial<Post>) {
    const { data, error } = await supabase
      .from('posts')
      .update({ ...post, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Post
  },

  async deletePost(id: string) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Comment operations
  async getComments(postId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:profiles(*)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data as (Comment & { user: Profile })[]
  },

  async createComment(comment: Omit<Comment, 'id' | 'created_at'>) {
    // Check for duplicate comments by the same user on the same post
    const { data: existingComments } = await supabase
      .from('comments')
      .select('content')
      .eq('post_id', comment.post_id)
      .eq('user_id', comment.user_id)
      .eq('content', comment.content)

    if (existingComments && existingComments.length > 0) {
      throw new Error('Duplicate comment detected')
    }

    if (!comment.content.trim()) {
      throw new Error('Comment cannot be empty')
    }

    const { data, error } = await supabase
      .from('comments')
      .insert(comment)
      .select(`
        *,
        user:profiles(*)
      `)
      .single()
    
    if (error) throw error
    return data as (Comment & { user: Profile })
  },

  async updateComment(id: string, content: string) {
    if (!content.trim()) {
      throw new Error('Comment cannot be empty')
    }

    const { data, error } = await supabase
      .from('comments')
      .update({ content })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Comment
  },

  async deleteComment(id: string) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Profile operations
  async getCurrentProfile() {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (error) throw error
    return data as Profile
  },

  async updateProfile(profile: Partial<Profile>) {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id)
      .select()
      .single()
    
    if (error) throw error
    return data as Profile
  }
}