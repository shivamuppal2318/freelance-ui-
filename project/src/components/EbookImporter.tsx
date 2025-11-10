import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Search, BookOpen, X } from 'lucide-react';

export default function EbookImporter() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [amazonUrl, setAmazonUrl] = useState('');
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [importing, setImporting] = useState(false);

  const extractAsin = (url: string) => {
    const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})|\/gp\/product\/([A-Z0-9]{10})/);
    return asinMatch ? asinMatch[1] || asinMatch[2] : null;
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !authorName.trim() || !amazonUrl.trim()) {
      alert('Title, author name, and Amazon URL are required');
      return;
    }

    setImporting(true);
    try {
      const asin = extractAsin(amazonUrl);

      const ebookData = {
        author_id: user?.id,
        amazon_asin: asin,
        title: title.trim(),
        author_name: authorName.trim(),
        description: description.trim(),
        cover_image_url: coverImageUrl.trim() || null,
        amazon_url: amazonUrl.trim(),
        isbn: isbn.trim() || null,
        publication_date: publicationDate.trim() || null,
      };

      const { error } = await supabase.from('ebooks').insert([ebookData]);

      if (error) throw error;

      alert('eBook imported successfully!');
      setShowForm(false);
      setAmazonUrl('');
      setTitle('');
      setAuthorName('');
      setDescription('');
      setCoverImageUrl('');
      setIsbn('');
      setPublicationDate('');
      window.location.reload();
    } catch (error) {
      console.error('Error importing ebook:', error);
      alert('Failed to import eBook');
    } finally {
      setImporting(false);
    }
  };

  if (!showForm) {
    return (
      <div className="bg-[#2D2D2D] p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-[#107C10] p-3">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-normal text-white mb-1">Import from Amazon</h3>
              <p className="text-gray-400 font-normal">Add your published books from Amazon to showcase them</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-[#107C10] text-white px-6 py-3 font-normal hover:brightness-110 active:brightness-90 transition-all transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Import eBook</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#2D2D2D] p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-[#107C10] p-2">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-normal text-white">Import eBook from Amazon</h3>
            <p className="text-gray-400 font-normal">Fill in your book details to add it to your collection</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(false)}
          className="p-2 text-gray-400 hover:text-white hover:bg-[#3D3D3D] transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleImport} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-normal text-white mb-2">
                Amazon URL *
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={amazonUrl}
                  onChange={(e) => setAmazonUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#3D3D3D] border border-gray-600 text-white font-normal focus:outline-none focus:border-[#107C10]"
                  placeholder="https://www.amazon.com/dp/XXXXXXXXXX"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 font-normal">Paste the Amazon product page URL for your book</p>
            </div>

            <div>
              <label className="block text-sm font-normal text-white mb-2">
                Book Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-[#3D3D3D] border border-gray-600 text-white font-normal focus:outline-none focus:border-[#107C10]"
                placeholder="The Great Novel"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-normal text-white mb-2">
                Author Name *
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-4 py-3 bg-[#3D3D3D] border border-gray-600 text-white font-normal focus:outline-none focus:border-[#107C10]"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-normal text-white mb-2">
                Cover Image URL
              </label>
              <input
                type="url"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                className="w-full px-4 py-3 bg-[#3D3D3D] border border-gray-600 text-white font-normal focus:outline-none focus:border-[#107C10]"
                placeholder="https://example.com/cover.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-normal text-white mb-2">
                ISBN
              </label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="w-full px-4 py-3 bg-[#3D3D3D] border border-gray-600 text-white font-normal focus:outline-none focus:border-[#107C10]"
                placeholder="978-0-123456-78-9"
              />
            </div>

            <div>
              <label className="block text-sm font-normal text-white mb-2">
                Publication Date
              </label>
              <input
                type="text"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
                className="w-full px-4 py-3 bg-[#3D3D3D] border border-gray-600 text-white font-normal focus:outline-none focus:border-[#107C10]"
                placeholder="January 2024"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-normal text-white mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-[#3D3D3D] border border-gray-600 text-white font-normal focus:outline-none focus:border-[#107C10] resize-none"
            placeholder="Tell readers what your book is about..."
            rows={4}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={importing}
            className="flex-1 bg-[#107C10] text-white py-3 font-normal hover:brightness-110 active:brightness-90 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {importing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin" />
                <span>Importing eBook...</span>
              </div>
            ) : (
              'Import eBook'
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-8 py-3 border border-gray-600 text-gray-400 font-normal hover:bg-[#3D3D3D] hover:text-white transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}