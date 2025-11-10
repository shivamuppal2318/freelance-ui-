import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Author = {
  id: string;
  display_name: string;
  bio: string;
  avatar_url?: string;
  created_at: string;
};

export type Article = {
  id: string;
  author_id: string;
  title: string;
  content: string;
  excerpt: string;
  cover_image_url?: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
};

export type Ebook = {
  id: string;
  author_id: string;
  amazon_asin?: string;
  title: string;
  author_name: string;
  description: string;
  cover_image_url?: string;
  amazon_url: string;
  isbn?: string;
  publication_date?: string;
  imported_at: string;
  created_at: string;
};
