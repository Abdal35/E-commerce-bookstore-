import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, Category } from '../types';
import BookCard from '../components/BookCard';
import { motion } from 'motion/react';
import { ArrowRight, Truck, ShieldCheck, Headphones, RefreshCw } from 'lucide-react';

export default function Home({ addToCart }: { addToCart: (book: Book) => void }) {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/books?featured=true')
      .then(res => res.json())
      .then(setFeaturedBooks);

    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories);
  }, []);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-stone-900">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://picsum.photos/seed/library/1920/1080?blur=5" 
            className="w-full h-full object-cover"
            alt="Library background"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="text-emerald-400 font-medium tracking-widest uppercase text-sm mb-4 block">Welcome to Lumina</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-6">
              Discover Your Next <br />
              <span className="italic text-emerald-400">Great Adventure</span>
            </h1>
            <p className="text-stone-300 text-lg mb-10 leading-relaxed">
              Explore our curated collection of over 1 million titles. From timeless classics to modern bestsellers, we have something for every reader.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-500 transition-all flex items-center space-x-2">
                <span>Shop Collection</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/shop?category=fiction" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all">
                Explore Categories
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
            { icon: ShieldCheck, title: "Secure Payment", desc: "100% secure checkout" },
            { icon: Headphones, title: "24/7 Support", desc: "Dedicated book experts" },
            { icon: RefreshCw, title: "Easy Returns", desc: "30-day return policy" }
          ].map((service, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-3">
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-black/5">
                <service.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-stone-900">{service.title}</h3>
              <p className="text-xs text-stone-500">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">Featured Books</h2>
            <p className="text-stone-500">Handpicked by our expert librarians</p>
          </div>
          <Link to="/shop" className="text-emerald-600 font-bold hover:underline flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredBooks.map(book => (
            <BookCard key={book.id} book={book} addToCart={addToCart} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-stone-200/50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">Browse by Category</h2>
            <p className="text-stone-500">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map(cat => (
              <Link 
                key={cat.id} 
                to={`/shop?category=${cat.slug}`}
                className="bg-white p-6 rounded-2xl border border-black/5 text-center hover:bg-emerald-600 hover:text-white transition-all group shadow-sm"
              >
                <span className="text-sm font-bold uppercase tracking-wider">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-900 rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full -mr-32 -mt-32 opacity-50" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">Join the Book Club</h2>
            <p className="text-emerald-100/70 mb-10 max-w-lg mx-auto">
              Subscribe to our newsletter and get 10% off your first order, plus weekly reading recommendations.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder:text-emerald-100/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button className="bg-white text-emerald-900 px-8 py-4 rounded-full font-bold hover:bg-emerald-50 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
