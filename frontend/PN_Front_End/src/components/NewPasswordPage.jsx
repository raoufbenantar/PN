import { useState } from 'react';
import { ArrowRight, ArrowLeft, Eye, EyeOff, Lock, Compass, CheckCircle } from 'lucide-react';
import { resetPassword } from '../services/api';

export default function NewPasswordPage({ setCurrentPage }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      alert('Please fill in both password fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const token = sessionStorage.getItem('passwordResetToken');
    if (!token) {
      alert('Reset token not found. Please start the password reset process again.');
      setCurrentPage('forgot-password');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await resetPassword(token, password, confirmPassword);
      sessionStorage.removeItem('passwordResetToken');
      setSuccess(true);
      setTimeout(() => {
        setCurrentPage('login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-bg text-brand-dark min-h-screen flex flex-col md:flex-row antialiased font-work relative">
      
      <div className="absolute top-6 left-6 z-20 md:hidden">
        <button 
          onClick={() => setCurrentPage('forgot-password')}
          className="bg-white p-2.5 rounded border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] flex items-center justify-center text-brand-forestDark"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <section className="hidden md:block w-1/2 relative border-r-4 border-brand-forestDark bg-brand-forestDark overflow-hidden min-h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuClg8-WJqIO1eN5vpejsvboHOpxFpdY90yTYsBhE_vTb6hNmxdiqgV2qzJPa96PA-_3M-xsJWnKbyUXn7GTTrX3uWcZ4bh7jMlwaEAtg-UHc-V-7_UGp2FSf1MCGhWRY0envMCOwPKhQmoghUycNxMugCjRBffWDdI2gfOyp9-1m8W9JljijhZ23KZSaEx1ZtLoDMmZIrkT7rDcGbnx6yyuRy_4xReEg3jQrqxmbTOFYOWi9Arabxc6')" }}
        />
        <div className="absolute inset-0 bg-brand-forestDark/20 mix-blend-multiply"></div>
        
        <div 
          onClick={() => setCurrentPage('landing')}
          className="absolute top-16 left-16 bg-white px-5 py-2.5 border-2 border-brand-forestDark shadow-[4px_4px_0px_0px_rgba(22,44,28,1)] rotate-[-2deg] cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-brand-orange group-hover:scale-110 transition-transform" />
            <span className="font-syne text-xl font-black text-brand-forestDark tracking-tighter uppercase leading-[0.8]">
              PROJECT <span className="font-light italic text-brand-orange">NATURE</span>
            </span>
          </div>
        </div>
      </section>

      <section className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-6 md:p-16 bg-brand-bg relative overflow-y-auto">
        
        <div 
          onClick={() => setCurrentPage('landing')}
          className="md:hidden flex items-center gap-2 mb-10 w-full max-w-md self-start text-brand-forestDark cursor-pointer"
        >
          <Compass className="w-7 h-7 text-brand-orange" />
          <span className="font-syne text-xl font-bold tracking-tighter uppercase">PROJECT NATURE</span>
        </div>

        <div className="w-full max-w-md mx-auto relative z-10">
          
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 border-2 border-brand-forestDark shadow-[8px_8px_0px_0px_rgba(22,44,28,1)] rounded relative z-10 space-y-6">
            
            {success ? (
              <div className="text-center py-10 animate-scale-up">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-sand text-brand-orange rounded-full border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] mb-6">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="font-syne text-3xl font-black text-brand-forestDark uppercase mb-2">Password Saved!</h2>
                <p className="text-brand-dark/70 text-sm font-medium">Your new password is set. Redirecting you to login...</p>
              </div>
            ) : (
              <>
                <header>
                  <h1 className="font-syne text-2xl md:text-3xl font-black text-brand-forestDark uppercase tracking-tight leading-none mb-3">
                    New Password
                  </h1>
                  <p className="font-work text-sm text-brand-dark/65 leading-relaxed">
                    Enter a strong new password to secure your explorer account.
                  </p>
                </header>

                {error && (
                  <div className="bg-red-50 border-2 border-red-300 p-4 rounded text-sm text-red-700 font-medium">
                    {error}
                  </div>
                )}

                <div className="flex flex-col space-y-2">
                  <label className="block font-space font-black text-xs text-brand-forestDark uppercase tracking-widest" htmlFor="password">
                    New Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-forestDark/40">
                      <Lock className="w-4.5 h-4.5" />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 10 characters"
                      className="w-full bg-white border-2 border-brand-forestDark py-3 pl-10 pr-12 font-work text-sm text-brand-dark focus:outline-none focus:ring-0 focus:border-brand-orange transition-colors rounded outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-forestDark/60 hover:text-brand-orange transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="block font-space font-black text-xs text-brand-forestDark uppercase tracking-widest" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-forestDark/40">
                      <Lock className="w-4.5 h-4.5" />
                    </span>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border-2 border-brand-forestDark py-3 pl-10 pr-12 font-work text-sm text-brand-dark focus:outline-none focus:ring-0 focus:border-brand-orange transition-colors rounded outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-forestDark/60 hover:text-brand-orange transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full py-4 bg-brand-orange text-white font-space font-black text-xs uppercase tracking-widest border-2 border-brand-forestDark shadow-[4px_4px_0px_0px_rgba(22,44,28,1)] active:translate-y-1 active:translate-x-1 active:shadow-none hover:bg-brand-orangeDark transition-all cursor-pointer flex justify-center items-center gap-2 rounded disabled:opacity-50"
                  >
                    <span>{loading ? 'SAVING...' : 'SAVE PASSWORD'}</span>
                    {!loading && <ArrowRight className="w-4.5 h-4.5" />}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setCurrentPage('login')}
                    className="font-space text-xs font-black text-brand-forestDark hover:text-brand-orange transition-colors inline-flex items-center gap-1.5 uppercase tracking-wider underline underline-offset-4 decoration-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to basecamp (Login)
                  </button>
                </div>
              </>
            )}

          </form>
        </div>

        <div className="hidden md:block absolute bottom-0 right-0 w-64 h-64 bg-brand-sand -z-10 transform translate-x-1/3 translate-y-1/3 border-t-2 border-l-2 border-brand-forestDark shadow-[-4px_-4px_0px_rgba(22,44,28,1)]"></div>
      </section>

    </div>
  );
}
