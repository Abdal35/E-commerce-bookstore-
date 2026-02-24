import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-white font-serif text-xl font-bold">Lumina Books</h3>
            <p className="text-sm leading-relaxed">
              Curating the world's most inspiring literature. From timeless classics to modern masterpieces, find your next great read with us.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Explore</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Books</Link></li>
              <li><Link to="/shop?category=fiction" className="hover:text-white transition-colors">Fiction</Link></li>
              <li><Link to="/shop?category=non-fiction" className="hover:text-white transition-colors">Non-Fiction</Link></li>
              <li><Link to="/shop?category=technology" className="hover:text-white transition-colors">Technology</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-6">Support</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>123 Library Lane, Booktown</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>+1 (555) 000-BOOK</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-emerald-500" />
                <span>hello@luminabooks.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Lumina Books. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
