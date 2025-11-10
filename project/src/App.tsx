import { useAuth, AuthProvider } from './contexts/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import PublicView from './components/PublicView';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  const shouldShowAuth = new URLSearchParams(window.location.search).get('login') === 'true';

  if (shouldShowAuth && !user) {
    return <Auth />;
  }

  if (!user) {
    return <Dashboard />;
  }

  return (
    <div>
      <PublicView />
      <div className="fixed bottom-6 right-6">
        <a
          href="?login=true"
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition font-medium"
        >
          Author Login
        </a>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
