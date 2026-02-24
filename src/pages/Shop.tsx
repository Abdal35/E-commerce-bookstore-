import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Book, Category } from '../types';
import BookCard from '../components/BookCard';
import { Search, Filter, SlidersHorizontal, Loader2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Shop({ addToCart }: { addToCart: (book: Book) => void }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [isDebouncing, setIsDebouncing] = useState(false);
  
  // Sidebar state
  const [isCatOpen, setIsCatOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('maxPrice')) || 100);

  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';

  // Sync searchTerm with URL
  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  // Debounce searchTerm
  useEffect(() => {
    if (searchTerm === currentSearch) {
      setIsDebouncing(false);
      return;
    }

    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        searchParams.set('search', searchTerm);
      } else {
        searchParams.delete('search');
      }
      setSearchParams(searchParams, { replace: true });
      setIsDebouncing(false);
    }, 500);

    setIsDebouncing(true);
    return () => clearTimeout(timer);
  }, [searchTerm, currentSearch, searchParams, setSearchParams]);

  // Debounce maxPrice
  useEffect(() => {
    const timer = setTimeout(() => {
      if (maxPrice < 100) {
        searchParams.set('maxPrice', maxPrice.toString());
      } else {
        searchParams.delete('maxPrice');
      }
      setSearchParams(searchParams, { replace: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [maxPrice, searchParams, setSearchParams]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (currentCategory) params.append('category', currentCategory);
    if (currentSearch) params.append('search', currentSearch);
    if (maxPrice < 100) params.append('maxPrice', maxPrice.toString());

    fetch(`/api/books?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      });

    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories);
  }, [currentCategory, currentSearch, searchParams.get('maxPrice')]);

  const handleCategoryChange = (slug: string) => {
    if (slug === currentCategory) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-6">
          {/* Categories Section */}
          <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm">
            <button 
              onClick={() => setIsCatOpen(!isCatOpen)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-center space-x-2 font-serif font-bold text-stone-900">
                <Filter className="w-4 h-4 text-emerald-600" />
                <span>Categories</span>
              </div>
              {isCatOpen ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
            </button>
            
            <AnimatePresence>
              {isCatOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-1">
                    <button 
                      onClick={() => handleCategoryChange('')}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${!currentCategory ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-stone-600 hover:bg-stone-100'}`}
                    >
                      All Categories
                    </button>
                    {categories.map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.slug)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${currentCategory === cat.slug ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-stone-600 hover:bg-stone-100'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Price Range Section */}
          <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm">
            <button 
              onClick={() => setIsPriceOpen(!isPriceOpen)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-center space-x-2 font-serif font-bold text-stone-900">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <span>Price Range</span>
              </div>
              {isPriceOpen ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
            </button>

            <AnimatePresence>
              {isPriceOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-8 pt-2 space-y-6">
                    <div className="space-y-4">
                      <input 
                        type="range" 
                        className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" 
                        min="0" 
                        max="100" 
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                      />
                      <div className="flex justify-between items-center">
                        <div className="bg-stone-100 px-3 py-1 rounded-lg text-xs font-bold text-stone-600">$0</div>
                        <div className="text-sm font-bold text-emerald-600">Up to ${maxPrice}</div>
                        <div className="bg-stone-100 px-3 py-1 rounded-lg text-xs font-bold text-stone-600">$100+</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-serif font-bold text-stone-900">
                {currentCategory ? categories.find(c => c.slug === currentCategory)?.name : 'All Books'}
                <span className="ml-3 text-sm font-sans font-normal text-stone-400">({books.length} items)</span>
              </h1>
              
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-black/10 rounded-xl py-2 pl-10 pr-10 text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  {(loading || isDebouncing) && searchTerm ? (
                    <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-emerald-500 animate-spin" />
                  ) : searchTerm ? (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : null}
                </div>
                <select className="bg-white border border-black/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>Newest Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Bestselling</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="bg-stone-200 aspect-[3/4] rounded-2xl" />
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                  <div className="h-4 bg-stone-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {books.map(book => (
                <BookCard key={book.id} book={book} addToCart={addToCart} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-stone-300">
              <Search className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-stone-900">No books found</h3>
              <p className="text-stone-500">Try adjusting your filters or search terms</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
