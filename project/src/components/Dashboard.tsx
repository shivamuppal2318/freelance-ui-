import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, FileText, BookMarked, LogOut, Plus, Mail, ShoppingBag } from 'lucide-react';
import ArticlesList from './ArticlesList';
import ArticleEditor from './ArticleEditor';
import EbookImporter from './EbookImporter';
import EbooksList from './EbooksList';
import MailView from './MailView';
import StoreView from './StoreView';

type View = 'articles' | 'ebooks' | 'editor' | 'mail' | 'store';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<View>('articles');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNewArticle = () => {
    setEditingArticleId(null);
    setCurrentView('editor');
  };

  const handleEditArticle = (id: string) => {
    setEditingArticleId(id);
    setCurrentView('editor');
  };

  const handleBackToArticles = () => {
    setEditingArticleId(null);
    setCurrentView('articles');
  };

  const tiles = [
    {
      id: 'articles',
      title: 'Articles',
      icon: FileText,
      color: 'bg-[#0078D7]',
      description: 'Write and manage articles',
      action: () => setCurrentView('articles')
    },
    {
      id: 'ebooks',
      title: 'eBooks',
      icon: BookMarked,
      color: 'bg-[#107C10]',
      description: 'Manage your eBook collection',
      action: () => setCurrentView('ebooks')
    },
    {
      id: 'mail',
      title: 'Mail',
      icon: Mail,
      color: 'bg-[#8661C5]',
      description: 'Check your messages',
      action: () => setCurrentView('mail')
    },
    {
      id: 'store',
      title: 'Store',
      icon: ShoppingBag,
      color: 'bg-[#F7630C]',
      description: 'Visit the store',
      action: () => setCurrentView('store')
    },
    {
      id: 'new-article',
      title: 'New Article',
      icon: Plus,
      color: 'bg-[#68217A]',
      description: 'Create a new article',
      action: handleNewArticle
    }
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'editor':
        return (
          <div className="animate-slideInRight">
            <ArticleEditor articleId={editingArticleId} onBack={handleBackToArticles} />
          </div>
        );
      case 'ebooks':
        return (
          <div className="p-4 w-full animate-slideInRight">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-normal text-white drop-shadow-lg">My eBooks</h2>
              <button
                onClick={() => setCurrentView('articles')}
                className="bg-[#0078D7] text-white px-4 py-2 font-normal hover:brightness-110 active:brightness-90 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Back to Dashboard
              </button>
            </div>
            <EbookImporter />
            <EbooksList />
          </div>
        );
      case 'mail':
        return (
          <div className="p-4 w-full animate-slideInRight">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-normal text-white drop-shadow-lg">Mail</h2>
              <button
                onClick={() => setCurrentView('articles')}
                className="bg-[#0078D7] text-white px-4 py-2 font-normal hover:brightness-110 active:brightness-90 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Back to Dashboard
              </button>
            </div>
            <MailView />
          </div>
        );
      case 'store':
        return (
          <div className="p-4 w-full animate-slideInRight">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-normal text-white drop-shadow-lg">Store</h2>
              <button
                onClick={() => setCurrentView('articles')}
                className="bg-[#0078D7] text-white px-4 py-2 font-normal hover:brightness-110 active:brightness-90 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Back to Dashboard
              </button>
            </div>
            <StoreView />
          </div>
        );
      default:
        return (
          <div className="p-4 w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {tiles.map((tile, index) => (
                <button
                  key={tile.id}
                  onClick={tile.action}
                  onMouseEnter={() => setHoveredTile(tile.id)}
                  onMouseLeave={() => setHoveredTile(null)}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    transform: mounted ? 'scale(1)' : 'scale(0.8)',
                    opacity: mounted ? 1 : 0
                  }}
                  className={`${tile.color} text-white p-6 text-left min-h-[140px] flex flex-col justify-between transition-all duration-500 transform-gpu relative overflow-hidden group shadow-lg
                    ${hoveredTile === tile.id ? 'animate-tileHover shadow-2xl' : 'hover:shadow-xl'}`}
                >
                  {/* Animated background wave effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 transition-all duration-1000 ${
                    hoveredTile === tile.id ? 'translate-x-full' : '-translate-x-full'
                  }`} />
                  
                  {/* Floating particles */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-white/30 rounded-full"
                        style={{
                          top: `${20 + i * 25}%`,
                          left: `${10 + i * 30}%`,
                          animation: `float 3s ease-in-out ${i * 0.5}s infinite`
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex items-start justify-between relative z-10">
                    <tile.icon className="w-8 h-8 text-white/90 transition-all duration-500 group-hover:scale-125 drop-shadow-md" />
                    {tile.id === 'new-article' && (
                      <Plus className="w-5 h-5 text-white/80 transition-all duration-500 group-hover:rotate-90 group-hover:scale-110 drop-shadow-md" />
                    )}
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-normal text-lg mb-1 transition-all duration-500 group-hover:translate-x-2 drop-shadow-md">{tile.title}</h3>
                    <p className="text-white/80 text-sm opacity-0 md:opacity-100 transition-all duration-500 group-hover:translate-x-2 group-hover:opacity-100 font-normal drop-shadow">
                      {tile.description}
                    </p>
                  </div>

                  {/* Border glow effect */}
                  <div className={`absolute inset-0 border-2 border-white/0 transition-all duration-500 ${
                    hoveredTile === tile.id ? 'border-white/30 animate-pulseGlow' : ''
                  }`} />
                </button>
              ))}
            </div>
            <div className="w-full animate-fadeInUp" style={{ animationDelay: '500ms' }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-normal text-white drop-shadow-lg">My Articles</h2>
                <button
                  onClick={handleNewArticle}
                  className="flex items-center bg-[#0078D7] text-white px-4 py-2 font-normal hover:brightness-110 active:brightness-90 transition-all transform hover:scale-105 active:scale-95 group shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-90 drop-shadow-md" />
                  New Article
                </button>
              </div>
              <ArticlesList onEdit={handleEditArticle} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#1D1D1D] font-segoe-ui w-full overflow-hidden">
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(30px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes tileHover {
          0% { 
            transform: scale(1);
            filter: brightness(1);
          }
          100% { 
            transform: scale(1.05);
            filter: brightness(1.1);
          }
        }
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.3;
          }
          33% { 
            transform: translateY(-10px) translateX(5px) scale(1.1);
            opacity: 0.6;
          }
          66% { 
            transform: translateY(5px) translateX(-5px) scale(0.9);
            opacity: 0.4;
          }
        }
        @keyframes pulseGlow {
          0%, 100% { 
            border-color: rgba(255, 255, 255, 0.3);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.1);
          }
          50% { 
            border-color: rgba(255, 255, 255, 0.5);
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.4), 0 0 30px rgba(255, 255, 255, 0.2);
          }
        }
        @keyframes shadowPulse {
          0%, 100% {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          }
          50% {
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-tileHover {
          animation: tileHover 0.3s ease-out forwards;
        }
        .animate-pulseGlow {
          animation: pulseGlow 1s ease-in-out infinite;
        }
        .animate-shadowPulse {
          animation: shadowPulse 2s ease-in-out infinite;
        }
      `}</style>

      <nav className="bg-[#0078D7] sticky top-0 z-10 w-full transform transition-all duration-300 hover:shadow-2xl shadow-lg">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-white/20 p-2 transition-all duration-300 hover:bg-white/30 transform hover:scale-105 shadow-md hover:shadow-lg">
                <BookOpen className="w-8 h-8 text-white transition-transform duration-300 hover:rotate-12 drop-shadow-md" />
              </div>
              <div>
                <h1 className="text-2xl font-normal text-white transition-all duration-300 hover:tracking-wider drop-shadow-lg">AuthorHub</h1>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setCurrentView('articles')}
                className={`px-4 py-2 font-normal transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
                  currentView === 'articles'
                    ? 'bg-white/20 text-white shadow-inner'
                    : 'bg-transparent text-white/80 hover:bg-white/10'
                }`}
              >
                Articles
              </button>
              <button
                onClick={() => setCurrentView('ebooks')}
                className={`px-4 py-2 font-normal transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
                  currentView === 'ebooks'
                    ? 'bg-white/20 text-white shadow-inner'
                    : 'bg-transparent text-white/80 hover:bg-white/10'
                }`}
              >
                eBooks
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 bg-white/10 px-3 py-2 transition-all duration-300 hover:bg-white/20 transform hover:scale-105 shadow-md hover:shadow-lg">
                <div className="w-8 h-8 bg-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/30 shadow-sm">
                  <span className="text-white text-sm font-normal drop-shadow">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-white/80 text-sm font-normal transition-all duration-300 hover:text-white drop-shadow">
                  {user?.email?.split('@')[0]}
                </span>
              </div>

              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 bg-[#E81123] text-white px-4 py-2 font-normal hover:brightness-110 active:brightness-90 transition-all duration-300 transform hover:scale-105 active:scale-95 group shadow-lg hover:shadow-xl"
              >
                <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1 drop-shadow-md" />
                <span className="hidden sm:block transition-all duration-300 group-hover:translate-x-1 drop-shadow">Sign Out</span>
              </button>
            </div>
          </div>

          <div className="md:hidden pb-3">
            <div className="flex space-x-2 overflow-x-auto">
              <button
                onClick={() => setCurrentView('articles')}
                className={`flex-shrink-0 px-4 py-2 font-normal transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
                  currentView === 'articles'
                    ? 'bg-white/20 text-white shadow-inner'
                    : 'bg-transparent text-white/80'
                }`}
              >
                Articles
              </button>
              <button
                onClick={() => setCurrentView('ebooks')}
                className={`flex-shrink-0 px-4 py-2 font-normal transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
                  currentView === 'ebooks'
                    ? 'bg-white/20 text-white shadow-inner'
                    : 'bg-transparent text-white/80'
                }`}
              >
                eBooks
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="w-full">
        {renderContent()}
      </div>
    </div>
  );
}