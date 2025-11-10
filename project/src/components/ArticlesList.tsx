import { useEffect, useState, useMemo } from 'react';
import { supabase, Article } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Edit, Trash2, Eye, EyeOff, Calendar, Clock, BookOpen } from 'lucide-react';

type ArticlesListProps = {
  onEdit: (id: string) => void;
};

export default function ArticlesList({ onEdit }: ArticlesListProps) {
  const { user, loading: authLoading } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const placeholderImages = useMemo(
    () => [
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1546074177-ffdda98d214f?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=400&h=200&fit=crop',
    ],
    []
  );

  const placeholderCards = useMemo(() => {
    const titles = [
      'Crafting Engaging Content',
      'The Future of Blogging',
      'Writing Tips for Beginners',
      'Building Your Audience',
      'Content Strategy Insights'
    ];
    
    const excerpts = [
      'Learn how to create content that resonates with your readers and keeps them coming back for more.',
      'Exploring the latest trends and technologies that are shaping the future of digital content.',
      'Practical advice for new writers looking to establish their voice and build their portfolio.',
      'Strategies for growing your readership and creating a loyal community around your content.',
      'How to develop a content strategy that aligns with your goals and reaches the right audience.'
    ];

    return Array.from({ length: 3 }, (_, i) => {
      const img = placeholderImages[i % placeholderImages.length];
      return {
        id: `placeholder-${i}`,
        cover_image_url: img,
        title: titles[i % titles.length],
        excerpt: excerpts[i % excerpts.length],
        published: Math.random() > 0.5,
        created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      };
    });
  }, [placeholderImages]);

  useEffect(() => {
    if (user) {
      loadArticles();
    }
  }, [user]);

  useEffect(() => {
    if (!user && !authLoading) {
      setTimeout(() => {
        const deletedIds: string[] = JSON.parse(localStorage.getItem('demoDeletedIds') || '[]');
        const demoHidden = localStorage.getItem('demoHidden') === 'true';
        if (demoHidden) {
          setArticles([]);
          setLoading(false);
          return;
        }

        const items = [...placeholderCards];
        for (let i = items.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [items[i], items[j]] = [items[j], items[i]];
        }

        const demoArticles: Article[] = items.map((c) => ({
          id: c.id, 
          author_id: 'demo',
          title: c.title,
          content: c.excerpt,
          excerpt: c.excerpt,
          cover_image_url: c.cover_image_url,
          published: c.published,
          published_at: c.published ? c.created_at : undefined,
          created_at: c.created_at,
          updated_at: c.created_at,
        }));

        const filtered = demoArticles.filter((a) => !deletedIds.includes(a.id));
        setArticles(filtered);
        setLoading(false);
      }, 600);
    }
  }, [user, authLoading, placeholderCards]);

  const loadArticles = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('author_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) return;

    setDeletingId(id);
    try {
      const target = articles.find(a => a.id === id);

      if (target?.author_id === 'demo') {
        const next = articles.filter((a) => a.id !== id);
        setArticles(next);
        const deletedIds: string[] = JSON.parse(localStorage.getItem('demoDeletedIds') || '[]');
        if (!deletedIds.includes(id)) {
          deletedIds.push(id);
          localStorage.setItem('demoDeletedIds', JSON.stringify(deletedIds));
        }
        if (next.filter((a) => a.author_id === 'demo').length === 0) {
          localStorage.setItem('demoHidden', 'true');
        }
        return;
      }
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
      setArticles(articles.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const togglePublish = async (article: Article) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({
          published: !article.published,
          published_at: !article.published ? new Date().toISOString() : undefined,
        })
        .eq('id', article.id);

      if (error) throw error;

      setArticles(articles.map(a => 
        a.id === article.id 
          ? { ...a, published: !a.published, published_at: !a.published ? new Date().toISOString() : undefined }
          : a
      ));
    } catch (error) {
      console.error('Error toggling publish:', error);
      alert('Failed to update article status');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-normal text-gray-300 mb-2">Loading Your Articles</h3>
          <p className="text-gray-500">We're getting your content ready...</p>
        </div>
        
        {placeholderCards.map((card) => (
          <div
            key={card.id}
            className="bg-[#2D2D2D] overflow-hidden transition-all duration-200"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-48 h-40 md:h-auto bg-gray-600 relative overflow-hidden">
                <img
                  src={card.cover_image_url}
                  alt="Loading cover"
                  className="w-full h-full object-cover opacity-50"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <div className="h-6 w-16 bg-gray-500 animate-pulse" />
                </div>
              </div>
              
              <div className="flex-1 p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-500 animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-500 animate-pulse w-full" />
                    <div className="h-4 bg-gray-500 animate-pulse w-5/6" />
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <div className="h-4 w-20 bg-gray-500 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <div className="h-4 w-16 bg-gray-500 animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <div className="h-8 w-20 bg-gray-500 animate-pulse" />
                    <div className="h-8 w-20 bg-gray-500 animate-pulse" />
                    <div className="h-8 w-20 bg-gray-500 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!user && !authLoading && articles.length === 0) {
    return (
      <div className="bg-[#2D2D2D] p-12 text-center">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-normal text-white mb-2">Create your first article</h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">Sign up to start writing and publishing. The demo articles were removed.</p>
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-3">
            <a href="/auth" className="inline-flex items-center gap-2 px-4 py-2 bg-[#0078D7] text-white font-normal hover:brightness-110 active:brightness-90 transition-all">
              Get started
            </a>
            <button
              onClick={() => { localStorage.removeItem('demoHidden'); localStorage.removeItem('demoDeletedIds'); location.reload(); }}
              className="text-sm text-[#0078D7] hover:underline font-normal"
            >
              Restore demo articles
            </button>
          </div>
          <span className="text-sm text-gray-500">After signing up, drafts and published posts will appear here.</span>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="bg-[#2D2D2D] p-12 text-center">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-normal text-white mb-2">No articles yet</h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Start your writing journey by creating your first article. Share your thoughts, stories, and ideas with the world.
        </p>
        <div className="text-sm text-gray-500">
          <p>Tip: Your articles will appear here once you create them</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 ">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-normal text-white">Your Articles</h2>
          <p className="text-gray-400 mt-1 font-normal">
            {articles.length} article{articles.length !== 1 ? 's' : ''} •{' '}
            {articles.filter(a => a.published).length} published
          </p>
        </div>
      </div>

      {articles.map((article) => (
        <div
          key={article.id}
          className="bg-[#2D2D2D] overflow-hidden transition-all duration-200 hover:brightness-110 active:brightness-90 group cursor-pointer"
          onClick={() => article.author_id !== 'demo' && onEdit(article.id)}
        >
          <div className="flex flex-col md:flex-row">
            {article.cover_image_url && (
              <div className="md:w-60 h-40 md:h-auto bg-gray-600 relative overflow-hidden">
                <img
                  src={article.cover_image_url}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-3 py-1 text-xs font-normal ${
                      article.published
                        ? 'bg-[#107C10] text-white'
                        : 'bg-[#767676] text-white'
                    }`}
                  >
                    {article.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex-1 p-6">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="text-2xl font-normal text-white mb-3 group-hover:text-[#0078D7] transition-colors">
                    {article.title}
                  </h3>
                  
                  {article.excerpt && (
                    <p className="text-gray-400 mb-4 line-clamp-2 leading-relaxed font-normal">
                      {article.excerpt}
                    </p>
                  )}
                  {article.author_id === 'demo' && (
                    <p className="text-xs text-[#0078D7] mb-4 font-normal">Demo preview. Sign up to create and manage real articles.</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 font-normal">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.created_at)}</span>
                    </div>
                    {article.published_at && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Published {formatDate(article.published_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-600">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        article.author_id !== 'demo' && togglePublish(article);
                      }}
                      disabled={deletingId === article.id || article.author_id === 'demo'}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-normal transition-all ${
                        article.published
                          ? 'bg-[#F7630C] text-white hover:brightness-110'
                          : 'bg-[#107C10] text-white hover:brightness-110'
                      } ${deletingId === article.id || article.author_id === 'demo' ? 'opacity-60 cursor-not-allowed' : ''}`}
                      title={article.author_id === 'demo' ? 'Sign up to publish' : (article.published ? 'Unpublish' : 'Publish')}
                    >
                      {article.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {article.published ? 'Unpublish' : 'Publish'}
                    </button>
                  </div>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        article.author_id !== 'demo' && onEdit(article.id);
                      }}
                      disabled={deletingId === article.id || article.author_id === 'demo'}
                      className="p-2 text-gray-400 hover:text-[#0078D7] hover:bg-[#0078D7]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title={article.author_id === 'demo' ? 'Sign up to edit' : 'Edit article'}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(article.id);
                      }}
                      disabled={deletingId === article.id}
                      className="p-2 text-gray-400 hover:text-[#E81123] hover:bg-[#E81123]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete article"
                    >
                      {deletingId === article.id ? (
                        <div className="w-5 h-5 border-2 border-[#E81123] border-t-transparent animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}