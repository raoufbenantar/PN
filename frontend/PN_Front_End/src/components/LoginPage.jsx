import { useState } from 'react';
import { ArrowRight, ArrowLeft, KeyRound, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { loginUser, fetchCurrentUser } from '../services/api';

export default function LoginPage({ setCurrentPage, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in all required fields.');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await loginUser(email, password);
      const user = await fetchCurrentUser();
      const userData = {
        name: `${user.first_name} ${user.last_name}`.trim() || user.username,
        email: user.email,
        role: user.is_staff ? 'admin' : 'user',
        username: user.username
      };
      setSuccess(true);
      if (onLoginSuccess) onLoginSuccess(userData);
      setTimeout(() => {
        if (user.is_staff) {
          setCurrentPage('admin-dashboard');
        } else {
          setCurrentPage('landing');
        }
      }, 1500);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-bg text-brand-dark min-h-screen flex flex-col md:flex-row antialiased font-work relative">
      
      <div className="absolute top-6 left-6 z-20 md:hidden">
        <button 
          onClick={() => setCurrentPage('landing')}
          className="bg-white p-2.5 rounded border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] flex items-center justify-center text-brand-forestDark"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <main className="w-full md:w-[40%] min-h-screen flex flex-col justify-center px-6 md:px-16 bg-brand-bg border-r-0 md:border-r-2 border-brand-forestDark z-10 relative">
        
        <div className="absolute top-8 md:top-16 left-6 md:left-16 cursor-pointer group" onClick={() => setCurrentPage('landing')}>
          <div className="flex items-center gap-2">
            <span className="font-syne text-2xl md:text-3xl font-extrabold text-brand-forestDark tracking-tighter uppercase leading-[0.8] block group-hover:text-brand-orange transition-colors">
              Project <span className="font-light italic text-brand-forest">Nature</span>
            </span>
          </div>
          <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-space font-black uppercase text-brand-orange mt-2 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowLeft className="w-3 h-3" /> Back to Home
          </span>
        </div>

        <div className="w-full max-w-md mx-auto mt-24 md:mt-0 relative">
          
          {success ? (
            <div className="bg-white border-2 border-brand-forestDark p-8 rounded shadow-brutalist-orange text-center py-12 animate-scale-up">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-sand text-brand-orange rounded-full border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-syne text-3xl font-black text-brand-forestDark uppercase mb-2">Welcome Back!</h2>
              <p className="text-brand-dark/70 text-sm font-medium">Authentication successful. Redirecting you to the basecamp...</p>
            </div>
          ) : (
            <>
              <h1 className="font-syne text-4xl md:text-5xl text-brand-forestDark font-black uppercase tracking-tight mb-10 mt-12">
                Login
              </h1>

              {error && (
                <div className="bg-red-50 border-2 border-red-300 p-4 rounded mb-6 text-sm text-red-700 font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                  <label className="font-space font-black text-xs text-brand-forestDark block mb-2 tracking-widest" htmlFor="email">
                    EMAIL ADDRESS
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-forestDark/40">
                      <Mail className="w-4.5 h-4.5" />
                    </span>
                    <input 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full border-2 border-brand-forestDark bg-white py-3 pl-10 pr-4 font-work text-sm text-brand-dark focus:outline-none focus:ring-0 shadow-[4px_4px_0px_rgba(22,44,28,1)] rounded transition-all focus:shadow-[2px_2px_0px_rgba(22,44,28,1)] focus:translate-y-0.5 focus:translate-x-0.5 outline-none" 
                      id="email" 
                      name="email" 
                      placeholder="explorer@projectnature.dz" 
                      type="email"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <label className="font-space font-black text-xs text-brand-forestDark block tracking-widest" htmlFor="password">
                      PASSWORD
                    </label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-forestDark/40">
                      <KeyRound className="w-4.5 h-4.5" />
                    </span>
                    <input 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full border-2 border-brand-forestDark bg-white py-3 pl-10 pr-4 font-work text-sm text-brand-dark focus:outline-none focus:ring-0 shadow-[4px_4px_0px_rgba(22,44,28,1)] rounded transition-all focus:shadow-[2px_2px_0px_rgba(22,44,28,1)] focus:translate-y-0.5 focus:translate-x-0.5 outline-none" 
                      id="password" 
                      name="password" 
                      placeholder="••••••••" 
                      type="password"
                    />
                  </div>
                  <div className="text-right mt-3">
                    <button 
                      type="button"
                      className="font-space text-xs font-bold text-brand-orange hover:underline underline-offset-4 decoration-2"
                      onClick={(e) => { e.preventDefault(); setCurrentPage('forgot-password'); }}
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    disabled={loading}
                    className="w-full bg-brand-orange text-white border-2 border-brand-forestDark py-4 px-6 font-space font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_rgba(22,44,28,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_rgba(22,44,28,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all rounded flex justify-center items-center gap-2 disabled:opacity-50" 
                    type="submit"
                  >
                    <span>{loading ? 'LOGGING IN...' : 'LOG IN'}</span>
                    {!loading && <ArrowRight className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </form>

              <div className="mt-12 text-center border-t-2 border-brand-forest/10 pt-8">
                <p className="font-work text-sm text-brand-dark/60 font-medium">
                  No adventure yet? 
                  <a className="text-brand-orange font-bold hover:underline decoration-2 underline-offset-4 ml-1" href="#register" onClick={(e) => { e.preventDefault(); setCurrentPage('register'); }}>
                    Create an account
                  </a>
                </p>
              </div>
            </>
          )}

        </div>
      </main>

      <aside className="hidden md:block w-[60%] relative overflow-hidden bg-brand-forestDark">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCljJvyaGkf1y2WXHrK93oDCMDZa-dvb6_qOgVZBoWlfKzz6WsI1Qz8CjxFwWAuxhB2lKbQe2d-NohY804mEsiusrygo-sidVE8xf-iq_WTcz54PuGsF13rAumRCYz1rXMdvNFcp3M7m6FyMrLOVCSJ1avl7kjZx-AR1zCUDVcnnhxEmrR7Rq9TdtGlcoxFp0LY49qRlvn8FnvHkOaAeO0SdZCpJyD1VVWG5ypqMmmo_xMG7BnDmv4L')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-forestDark/80 via-brand-forestDark/20 to-transparent mix-blend-multiply"></div>
        
        <div className="absolute bottom-16 left-16 right-16 max-w-2xl">
          <div className="bg-brand-sand border-2 border-brand-forestDark p-8 shadow-[8px_8px_0px_#a23f0a] relative rounded">
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-brand-orange border-2 border-brand-forestDark rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)]"></div>
            <p className="font-syne text-2xl font-bold text-brand-forestDark leading-snug">
              "Adventure is not in the climb, but in the encounters along the way."
            </p>
          </div>
        </div>
      </aside>

    </div>
  );
}
