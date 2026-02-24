import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, BookOpen, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../App';
import { useState, useEffect } from 'react';

export default function Header({ cartCount }: { cartCount: number }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Sync search input with URL on initial load or navigation
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search') || '';
    setSearch(query);
  }, [location.search]);

  // Debounce search
  useEffect(() => {
    if (!search.trim() && !new URLSearchParams(location.search).get('search')) {
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(() => {
      if (search.trim()) {
        navigate(`/shop?search=${encodeURIComponent(search)}`, { replace: true });
      } else if (new URLSearchParams(location.search).get('search')) {
        navigate('/shop', { replace: true });
      }
      setIsSearching(false);
    }, 500);

    setIsSearching(true);
    return () => clearTimeout(timer);
  }, [search, navigate]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-black/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <BookOpen className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-serif font-bold tracking-tight text-stone-900">Lumina Books</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-stone-100 border-none rounded-full py-2 pl-10 pr-10 text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            {isSearching && (
              <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-emerald-500 animate-spin" />
            )}
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link to="/shop" className="text-sm font-medium text-stone-600 hover:text-emerald-600 transition-colors">Shop</Link>
            
            <Link to="/cart" className="relative group">
              <ShoppingCart className="w-6 h-6 text-stone-600 group-hover:text-emerald-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="flex items-center space-x-1 text-sm font-medium text-stone-600 hover:text-emerald-600 transition-colors">
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="text-stone-400 hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-stone-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
