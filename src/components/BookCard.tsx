import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Book } from '../types';
import { motion } from 'motion/react';

interface BookCardProps {
  book: Book;
  addToCart: (book: Book) => void;
}

export default function BookCard({ book, addToCart }: BookCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl overflow-hidden border border-black/5 hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={book.image_url} 
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-3 space-y-2">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-emerald-500 hover:text-white transition-colors">
            <Heart className="w-4 h-4" />
          </button>
        </div>
        {book.is_featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Bestseller
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center space-x-1 mb-2">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-xs font-medium text-stone-500">{book.rating}</span>
        </div>
        
        <Link to={`/book/${book.id}`}>
          <h3 className="font-serif font-bold text-stone-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-stone-500 mb-4">{book.author}</p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-stone-900">${book.price.toFixed(2)}</span>
          <button 
            onClick={() => addToCart(book)}
            className="p-2 bg-stone-100 rounded-full hover:bg-emerald-600 hover:text-white transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
