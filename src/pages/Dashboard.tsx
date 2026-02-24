import { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Order } from '../types';
import { Package, Clock, MapPin, ChevronRight, User as UserIcon } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders/my')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Profile Sidebar */}
        <aside className="w-full md:w-80 space-y-8">
          <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm text-center">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserIcon className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-1">{user?.name}</h2>
            <p className="text-sm text-stone-500 mb-6">{user?.email}</p>
            <div className="pt-6 border-t border-black/5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-stone-400">Total Orders</span>
                <span className="font-bold text-stone-900">{orders.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Member Since</span>
                <span className="font-bold text-stone-900">2024</span>
              </div>
            </div>
          </div>

          <nav className="bg-white rounded-3xl p-4 border border-black/5 shadow-sm">
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-emerald-50 text-emerald-700 font-bold">
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5" />
                <span>My Orders</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl text-stone-600 hover:bg-stone-50 font-medium transition-colors">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5" />
                <span>Addresses</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <h1 className="text-3xl font-serif font-bold text-stone-900 mb-8">Order History</h1>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-stone-100 rounded-xl">
                        <Package className="w-6 h-6 text-stone-600" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-stone-900">Order #{order.id}</div>
                        <div className="text-xs text-stone-500 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-xs text-stone-400 uppercase font-bold tracking-wider mb-1">Status</div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                          order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-stone-400 uppercase font-bold tracking-wider mb-1">Total</div>
                        <div className="font-bold text-stone-900">${order.total.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-stone-500 bg-stone-50 p-3 rounded-lg">
                    <MapPin className="w-3 h-3" />
                    <span className="line-clamp-1">{order.address}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-stone-300">
              <Package className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-stone-900">No orders yet</h3>
              <p className="text-stone-500">When you buy books, they'll appear here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
