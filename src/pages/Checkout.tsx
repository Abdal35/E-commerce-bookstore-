import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { CartItem } from '../types';
import { useAuth } from '../App';
import { CheckCircle2, CreditCard, Truck, ShieldCheck } from 'lucide-react';

interface CheckoutProps {
  cart: CartItem[];
  clearCart: () => void;
}

export default function Checkout({ cart, clearCart }: CheckoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<number | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (!user) return <Navigate to="/login" />;
  if (cart.length === 0 && !orderComplete) return <Navigate to="/shop" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          total,
          address,
          paymentMethod
        })
      });

      const data = await res.json();
      if (res.ok) {
        setOrderComplete(data.orderId);
        clearCart();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="bg-white rounded-[3rem] p-16 shadow-xl border border-black/5">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4">Order Confirmed!</h1>
          <p className="text-stone-500 mb-8">
            Thank you for your purchase. Your order <span className="font-bold text-stone-900">#{orderComplete}</span> has been placed successfully.
          </p>
          <div className="bg-stone-50 rounded-2xl p-6 mb-10 text-left">
            <h3 className="font-bold text-stone-900 mb-4">What's next?</h3>
            <ul className="space-y-3 text-sm text-stone-600">
              <li className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span>You'll receive a confirmation email shortly.</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span>Our team will prepare your books for shipping.</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span>Payment will be collected upon delivery.</span>
              </li>
            </ul>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-stone-900 text-white px-10 py-4 rounded-full font-bold hover:bg-stone-800 transition-all"
          >
            Track Your Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-stone-900 mb-12">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-10">
          <section>
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-6 flex items-center space-x-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              <span>Shipping Details</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={user.name} 
                  disabled 
                  className="w-full bg-stone-100 border-none rounded-xl px-4 py-3 text-stone-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Delivery Address</label>
                <textarea 
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, City, Postal code..."
                  rows={4}
                  className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-6 flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>Payment Method</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${paymentMethod === 'COD' ? 'border-emerald-600 bg-emerald-50' : 'border-black/5 bg-white hover:border-stone-300'}`}
              >
                <div className="font-bold text-stone-900 mb-1">Cash on Delivery</div>
                <div className="text-xs text-stone-500">Pay when you receive your books</div>
              </button>
              <button 
                type="button"
                disabled
                className="p-6 rounded-2xl border-2 border-black/5 bg-stone-50 text-left opacity-50 cursor-not-allowed"
              >
                <div className="font-bold text-stone-400 mb-1">Online Payment</div>
                <div className="text-xs text-stone-400">Coming soon</div>
              </button>
            </div>
          </section>

          <div className="flex items-center space-x-2 text-stone-500 text-sm bg-stone-100 p-4 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Your data is encrypted and secure.</span>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 text-white py-5 rounded-full font-bold text-lg hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="bg-white rounded-3xl p-10 border border-black/5 shadow-sm h-fit sticky top-24">
          <h3 className="text-xl font-serif font-bold text-stone-900 mb-8">Order Summary</h3>
          <div className="space-y-6 mb-8 max-h-96 overflow-y-auto pr-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <img src={item.image_url} className="w-12 h-16 object-cover rounded" referrerPolicy="no-referrer" />
                  <div>
                    <div className="text-sm font-bold text-stone-900 line-clamp-1">{item.title}</div>
                    <div className="text-xs text-stone-500">Qty: {item.quantity}</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-stone-900">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="space-y-4 pt-6 border-t border-black/5">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="pt-4 border-t border-black/5 flex justify-between text-2xl font-bold text-stone-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
