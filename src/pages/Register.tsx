import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Mail, Lock, User, ArrowRight, BookOpen } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        navigate('/');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl border border-black/5">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-6">
            <BookOpen className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">Create Account</h1>
          <p className="text-stone-500">Join our community of book lovers</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl mb-6 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Full Name</label>
            <div className="relative">
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-100 border-none rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="John Doe"
              />
              <User className="absolute left-4 top-3.5 w-5 h-5 text-stone-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-100 border-none rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="name@example.com"
              />
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-stone-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-100 border-none rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="••••••••"
              />
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-stone-400" />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Creating account...' : 'Create Account'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-stone-500">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
