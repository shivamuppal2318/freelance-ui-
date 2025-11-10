/*
  # Publishing Platform Schema

  1. New Tables
    - `authors`
      - `id` (uuid, primary key, references auth.users)
      - `display_name` (text)
      - `bio` (text)
      - `avatar_url` (text)
      - `created_at` (timestamptz)
    
    - `articles`
      - `id` (uuid, primary key)
      - `author_id` (uuid, foreign key to authors)
      - `title` (text)
      - `content` (text)
      - `excerpt` (text)
      - `cover_image_url` (text)
      - `published` (boolean)
      - `published_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `ebooks`
      - `id` (uuid, primary key)
      - `author_id` (uuid, foreign key to authors)
      - `amazon_asin` (text, unique)
      - `title` (text)
      - `author_name` (text)
      - `description` (text)
      - `cover_image_url` (text)
      - `amazon_url` (text)
      - `isbn` (text)
      - `publication_date` (text)
      - `imported_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Authors can read all published content
    - Authors can manage their own content
    - Public users can read published articles and ebooks
*/

-- Authors table
CREATE TABLE IF NOT EXISTS authors (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  bio text DEFAULT '',
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view author profiles"
  ON authors FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authors can update own profile"
  ON authors FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Authors can insert own profile"
  ON authors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  excerpt text DEFAULT '',
  cover_image_url text,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published articles"
  ON articles FOR SELECT
  TO authenticated, anon
  USING (published = true);

CREATE POLICY "Authors can view own articles"
  ON articles FOR SELECT
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can insert own articles"
  ON articles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own articles"
  ON articles FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete own articles"
  ON articles FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Ebooks table
CREATE TABLE IF NOT EXISTS ebooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  amazon_asin text UNIQUE,
  title text NOT NULL,
  author_name text NOT NULL,
  description text DEFAULT '',
  cover_image_url text,
  amazon_url text NOT NULL,
  isbn text,
  publication_date text,
  imported_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ebooks"
  ON ebooks FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authors can view own ebooks"
  ON ebooks FOR SELECT
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can insert own ebooks"
  ON ebooks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own ebooks"
  ON ebooks FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete own ebooks"
  ON ebooks FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
CREATE INDEX IF NOT EXISTS idx_ebooks_author_id ON ebooks(author_id);
CREATE INDEX IF NOT EXISTS idx_ebooks_asin ON ebooks(amazon_asin);