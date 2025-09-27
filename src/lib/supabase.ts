import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types based on your database schema
export type Profile = {
  id: string
  email: string
  full_name: string
  is_admin: boolean
  created_at: string
}

export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}

export type Post = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  category_id: string
  author_id: string
  published: boolean
  created_at: string
  updated_at: string
  category?: Category
  author?: Profile
}

export type Comment = {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  user?: Profile
}