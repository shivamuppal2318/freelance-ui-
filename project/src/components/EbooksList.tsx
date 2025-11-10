import { useEffect, useState } from 'react';
import { supabase, Ebook } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ExternalLink, Trash2 } from 'lucide-react';

export default function EbooksList() {
  const { user } = useAuth();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadEbooks();
    }
  }, [user]);

  const loadEbooks = async () => {
    try {
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .eq('author_id', user?.id)
        .order('imported_at', { ascending: false });

      if (error) throw error;
      setEbooks(data || []);
    } catch (error) {
      console.error('Error loading ebooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this eBook?')) return;

    try {
      const { error } = await supabase.from('ebooks').delete().eq('id', id);
      if (error) throw error;
      setEbooks(ebooks.filter((e) => e.id !== id));
    } catch (error) {
      console.error('Error deleting ebook:', error);
      alert('Failed to delete eBook');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-600">Loading eBooks...</div>;
  }

  if (ebooks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <p className="text-slate-600 text-lg mb-2">No eBooks imported yet</p>
        <p className="text-slate-500">Import your first eBook from Amazon to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ebooks.map((ebook) => (
        <div
          key={ebook.id}
          className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
        >
          {ebook.cover_image_url && (
            <div className="aspect-[3/4] bg-slate-100">
              <img
                src={ebook.cover_image_url}
                alt={ebook.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-5">
            <h3 className="text-lg font-semibold text-slate-800 mb-1 line-clamp-2">
              {ebook.title}
            </h3>
            <p className="text-sm text-slate-600 mb-3">{ebook.author_name}</p>

            {ebook.description && (
              <p className="text-sm text-slate-600 mb-4 line-clamp-3">{ebook.description}</p>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
              {ebook.isbn && <span>ISBN: {ebook.isbn}</span>}
              {ebook.publication_date && (
                <>
                  {ebook.isbn && <span>•</span>}
                  <span>{ebook.publication_date}</span>
                </>
              )}
            </div>

            <div className="flex gap-2">
              <a
                href={ebook.amazon_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Amazon
              </a>
              <button
                onClick={() => handleDelete(ebook.id)}
                className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
