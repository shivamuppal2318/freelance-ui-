import { useEffect, useState } from 'react';
import { supabase, Article, Ebook, Author } from '../lib/supabase';
import { BookOpen, Calendar, User, ArrowLeft,  } from 'lucide-react';

type ArticleWithAuthor = Article & { author: Author };

export default function PublicView() {
  const [articles, setArticles] = useState<ArticleWithAuthor[]>([]);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ArticleWithAuthor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublicContent();
  }, []);

  const loadPublicContent = async () => {
    try {
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select(`
          *,
          author:authors(*)
        `)
        .eq('published', true)
        .order('published_at', { ascending: false })
        .limit(10);

      if (articlesError) throw articlesError;

      const { data: ebooksData, error: ebooksError } = await supabase
        .from('ebooks')
        .select('*')
        .order('imported_at', { ascending: false })
        .limit(6);

      if (ebooksError) throw ebooksError;

      setArticles(articlesData || []);
      setEbooks(ebooksData || []);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center animate-pulse">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-600 text-lg">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
        <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedArticle(null)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Articles</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-semibold">AuthorHub</span>
              </div>
            </div>
          </div>
        </nav>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {selectedArticle.cover_image_url && (
            <div className="rounded-2xl overflow-hidden shadow-2xl mb-8">
              <img
                src={selectedArticle.cover_image_url}
                alt={selectedArticle.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              {selectedArticle.title}
            </h1>

            {selectedArticle.excerpt && (
              <p className="text-xl text-slate-600 mb-6 leading-relaxed">{selectedArticle.excerpt}</p>
            )}

            <div className="flex items-center gap-6 text-slate-600 mb-8 pb-8 border-b border-slate-200">
              <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                <User className="w-5 h-5 text-blue-600" />
                <span className="font-medium">{selectedArticle.author.display_name}</span>
              </div>
              <div className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="font-medium">
                  {new Date(selectedArticle.published_at || selectedArticle.created_at).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </span>
              </div>
            </div>

            <div className="prose prose-slate max-w-none text-lg leading-relaxed">
              {selectedArticle.content.split('\n').map((paragraph, idx) => (
                <p key={idx} className="text-slate-700 mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <header className="bg-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-500 rounded-xl p-3 shadow-lg">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">AuthorHub</h1>
              <p className="text-gray-300 text-lg">Discover amazing stories and books from talented writers</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-slate-800">Latest Articles</h2>
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium">
              {articles.length} Published
            </div>
          </div>

          {articles.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-slate-700 mb-2">No articles published yet</h3>
              <p className="text-slate-500">Check back soon for amazing content from our writers</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                  onClick={() => setSelectedArticle(article)}
                >
                  {article.cover_image_url && (
                    <div className="aspect-video bg-slate-100 relative overflow-hidden">
                      <img
                        src={article.cover_image_url}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>

                    {article.excerpt && (
                      <p className="text-slate-600 mb-4 line-clamp-3 leading-relaxed">{article.excerpt}</p>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1">
                        <User className="w-4 h-4 text-slate-600" />
                        <span className="font-medium text-slate-700">{article.author.display_name}</span>
                      </div>
                      <span className="text-slate-500">
                        {new Date(article.published_at || article.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-slate-800">Featured eBooks</h2>
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium">
              {ebooks.length} Available
            </div>
          </div>

          {ebooks.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-slate-700 mb-2">No eBooks available yet</h3>
              <p className="text-slate-500">Our authors are working on amazing books for you</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {ebooks.map((ebook) => (
                <a
                  key={ebook.id}
                  href={ebook.amazon_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    {ebook.cover_image_url ? (
                      <div className="aspect-[3/4] bg-slate-100 overflow-hidden">
                        <img
                          src={ebook.cover_image_url}
                          alt={ebook.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[3/4] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {ebook.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 font-medium">{ebook.author_name}</p>
                </a>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}