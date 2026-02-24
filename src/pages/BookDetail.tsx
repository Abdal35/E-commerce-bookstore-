import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book } from '../types';
import { ShoppingCart, Star, Heart, Share2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function BookDetail({ addToCart }: { addToCart: (book: Book) => void }) {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/books/${id}`)
      .then(res => res.json())
      .then(data => {
        setBook(data);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (book) {
      addToCart(book);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-24 animate-pulse">Loading...</div>;
  if (!book) return <div className="max-w-7xl mx-auto px-4 py-24">Book not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/shop" className="inline-flex items-center space-x-2 text-stone-500 hover:text-emerald-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Shop</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Image Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl"
        >
          <img 
            src={book.image_url} 
            alt={book.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Content Section */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {book.category_name}
              </span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold text-stone-900">{book.rating}</span>
                <span className="text-sm text-stone-400">(128 reviews)</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-2">{book.title}</h1>
            <p className="text-xl text-stone-500 italic">by {book.author}</p>
          </div>

          <div className="text-3xl font-bold text-stone-900">
            ${book.price.toFixed(2)}
          </div>

          <div className="prose prose-stone max-w-none">
            <p className="text-stone-600 leading-relaxed">
              {book.description || "No description available for this title. However, Lumina Books guarantees the quality and authenticity of every book in our collection."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-8 border-y border-black/5">
            <div>
              <span className="text-xs text-stone-400 uppercase font-bold block mb-1">Format</span>
              <span className="font-medium text-stone-900">{book.format}</span>
            </div>
            <div>
              <span className="text-xs text-stone-400 uppercase font-bold block mb-1">Availability</span>
              <span className={`font-medium ${book.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {book.stock > 0 ? `In Stock (${book.stock})` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleAddToCart}
              disabled={book.stock === 0}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-full font-bold transition-all ${
                added 
                ? 'bg-emerald-600 text-white' 
                : 'bg-stone-900 text-white hover:bg-stone-800 disabled:bg-stone-300'
              }`}
            >
              {added ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
            <div className="flex gap-2">
              <button className="p-4 border border-black/10 rounded-full hover:bg-stone-100 transition-colors">
                <Heart className="w-6 h-6 text-stone-600" />
              </button>
              <button className="p-4 border border-black/10 rounded-full hover:bg-stone-100 transition-colors">
                <Share2 className="w-6 h-6 text-stone-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
