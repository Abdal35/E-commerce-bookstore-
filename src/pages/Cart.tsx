import { Link } from 'react-router-dom';
import { CartItem } from '../types';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

interface CartProps {
  cart: CartItem[];
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
}

export default function Cart({ cart, removeFromCart, updateQuantity }: CartProps) {
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="bg-white rounded-3xl p-16 border border-dashed border-stone-300 inline-block">
          <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-6" />
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Your cart is empty</h2>
          <p className="text-stone-500 mb-8">Looks like you haven't added any books yet.</p>
          <Link to="/shop" className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-500 transition-all">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-stone-900 mb-12">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-md-2 space-y-6">
          {cart.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-6 flex items-center space-x-6 border border-black/5 shadow-sm">
              <img 
                src={item.image_url} 
                alt={item.title} 
                className="w-24 h-32 object-cover rounded-lg"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1">
                <Link to={`/book/${item.id}`} className="font-serif font-bold text-stone-900 hover:text-emerald-600 transition-colors">
                  {item.title}
                </Link>
                <p className="text-sm text-stone-500 mb-4">{item.author}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-black/10 rounded-full px-2">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:text-emerald-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:text-emerald-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-stone-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="text-lg font-bold text-stone-900">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm sticky top-24">
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-8">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                  Add ${(50 - subtotal).toFixed(2)} more for FREE shipping
                </p>
              )}
              <div className="pt-4 border-t border-black/5 flex justify-between text-xl font-bold text-stone-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout" className="w-full bg-stone-900 text-white py-4 rounded-full font-bold hover:bg-stone-800 transition-all flex items-center justify-center space-x-2">
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
