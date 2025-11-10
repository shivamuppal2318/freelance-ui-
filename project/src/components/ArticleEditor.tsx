import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Save } from 'lucide-react';

type ArticleEditorProps = {
  articleId: string | null;
  onBack: () => void;
};

export default function ArticleEditor({ articleId, onBack }: ArticleEditorProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (articleId) {
      loadArticle();
    }
  }, [articleId]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setTitle(data.title);
        setExcerpt(data.excerpt || '');
        setContent(data.content);
        setCoverImageUrl(data.cover_image_url || '');
      }
    } catch (error) {
      console.error('Error loading article:', error);
      alert('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required');
      return;
    }

    setSaving(true);
    try {
      const articleData = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        cover_image_url: coverImageUrl.trim() || null,
        author_id: user?.id,
        updated_at: new Date().toISOString(),
      };

      if (articleId) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', articleId);

        if (error) throw error;
        alert('Article updated successfully!');
      } else {
        const { error } = await supabase.from('articles').insert([articleData]);

        if (error) throw error;
        alert('Article created successfully!');
        onBack();
      }
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400 font-normal">Loading article...</div>;
  }

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center bg-[#0078D7] text-white px-4 py-2 font-normal hover:brightness-110 active:brightness-90 transition-all transform hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Articles
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center bg-[#107C10] text-white px-6 py-2 font-normal hover:brightness-110 active:brightness-90 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Saving...' : 'Save Article'}
        </button>
      </div>

      <div className="bg-[#2D2D2D] p-8 space-y-6">
        <div>
          <label className="block text-sm font-normal text-white mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-[#3D3D3D] border border-gray-600 text-white font-normal focus:outline-none focus:border-[#0078D7]"
            placeholder="Enter article title"
          />
        </div>

        <div>
          <label className="block text-sm font-normal text-white mb-2">
            Cover Image URL
          </label>
          <input
            type="url"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            className="w-full px-4 py-2 bg-[#3D3D3D] border border-gray-600 text-white font-normal focus:outline-none focus:border-[#0078D7]"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-normal text-white mb-2">
            Excerpt
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-4 py-2 bg-[#3D3D3D] border border-gray-600 text-white font-normal focus:outline-none focus:border-[#0078D7] resize-none"
            placeholder="Brief summary of your article"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-normal text-white mb-2">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 bg-[#3D3D3D] border border-gray-600 text-white font-normal focus:outline-none focus:border-[#0078D7] resize-none font-mono text-sm"
            placeholder="Write your article content here..."
            rows={20}
          />
        </div>
      </div>
    </div>
  );
}