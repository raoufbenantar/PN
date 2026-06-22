import { useState, useRef } from 'react';
import { ArrowRight, ArrowLeft, Mail, Key, Compass, CheckCircle } from 'lucide-react';
import { requestPasswordReset, resetPassword } from '../services/api';

export default function ForgotPasswordPage({ setCurrentPage }) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [isTokenVisible, setIsTokenVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState('');

  const tokenInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isTokenVisible) {
      if (!email) {
        alert('Please enter your email address.');
        return;
      }
      
      setLoading(true);
      setLoadingText('SENDING...');
      try {
        await requestPasswordReset(email);
        setIsTokenVisible(true);
        setTimeout(() => {
          if (tokenInputRef.current) tokenInputRef.current.focus();
        }, 50);
      } catch (err) {
        setError(err.message || 'Failed to send reset code.');
      } finally {
        setLoading(false);
        setLoadingText('');
      }
    } else {
      if (!token) {
        alert('Please enter the recovery code from your email.');
        return;
      }
      
      setLoading(true);
      setLoadingText('VERIFYING...');
      try {
        // Store token for the new-password page
        sessionStorage.setItem('passwordResetToken', token);
        setCurrentPage('new-password');
      } catch (err) {
        setError(err.message || 'Invalid recovery code.');
      } finally {
        setLoading(false);
        setLoadingText('');
      }
    }
  };

  return (
    <div className="bg-brand-bg text-brand-dark min-h-screen flex flex-col md:flex-row antialiased font-work relative">
      
      <div className="absolute top-6 left-6 z-20 md:hidden">
        <button 
          onClick={() => setCurrentPage('login')}
          className="bg-white p-2.5 rounded border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] flex items-center justify-center text-brand-forestDark"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <section className="hidden md:block w-1/2 relative border-r-4 border-brand-forestDark bg-brand-forestDark overflow-hidden min-h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBH0_xiomS43Pg1s3H5Rf8A_0mYI3Mw9zp_BkrkGZFEmUJku7_Vg3U_0En-Rw_4l_zdPbrvLPpyYCL-AC-BQBFnibuWkKnIvr2zSfTkUQrak_bOZb8IywyXWLDSi4HwgOrbt0FlKKPzOtMc9v2MEf7sD-nvLd-xOM-6TRu-cVHgYe6APO4-ARZu9clBnYOdYAtZOHg0VWaQ5zLkHuMBaJTfrGVvRtetLL_vxNYcHTiXdY3aTvsRP4tP')" }}
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

        <div className="absolute bottom-16 left-16 right-16 bg-brand-forestDark p-6 border-2 border-brand-forestDark shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] rotate-[1deg] text-brand-bg">
          <p className="font-work text-lg italic text-brand-bg/90">
            "The wild requires a reset sometimes."
          </p>
        </div>
      </section>

      <section className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-6 md:p-16 bg-brand-bg relative">
        <div className="w-full max-w-md relative z-10">
          
          <div 
            onClick={() => setCurrentPage('landing')}
            className="md:hidden flex items-center gap-2 mb-10 w-full max-w-md self-start text-brand-forestDark cursor-pointer"
          >
            <Compass className="w-7 h-7 text-brand-orange" />
            <span className="font-syne text-xl font-bold tracking-tighter uppercase">PROJECT NATURE</span>
          </div>

          <div className="absolute -inset-4 bg-brand-sand border-2 border-brand-forestDark transform rotate-2 rounded -z-10 shadow-[4px_4px_0px_rgba(22,44,28,1)]"></div>
          
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 border-2 border-brand-forestDark shadow-[8px_8px_0px_0px_rgba(22,44,28,1)] rounded relative z-10 space-y-6">
            
            <header>
              <h1 className="font-syne text-2xl md:text-3xl font-black text-brand-forestDark uppercase tracking-tight leading-none mb-3">
                Reset Password
              </h1>
              <p className="font-work text-sm text-brand-dark/65 leading-relaxed">
                Enter your email to receive a secure recovery code.
              </p>
            </header>

            {error && (
              <div className="bg-red-50 border-2 border-red-300 p-4 rounded text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            <div className="flex flex-col space-y-2">
              <label className="block font-space font-black text-xs text-brand-forestDark uppercase tracking-widest" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-forestDark/40">
                  <Mail className="w-4.5 h-4.5" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  readOnly={isTokenVisible}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="explorer@wilderness.com"
                  className={`w-full border-2 border-brand-forestDark py-3 pl-10 pr-4 font-work text-sm text-brand-dark focus:outline-none focus:ring-0 focus:border-brand-orange transition-colors rounded outline-none ${
                    isTokenVisible ? 'bg-brand-bg text-brand-dark/50 cursor-not-allowed border-dashed' : 'bg-white'
                  }`}
                />
              </div>
            </div>

            {isTokenVisible && (
              <div className="flex flex-col space-y-2 animate-fade-in">
                <label className="block font-space font-black text-xs text-brand-forestDark uppercase tracking-widest" htmlFor="token">
                  Recovery Code
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-forestDark/40">
                    <Key className="w-4.5 h-4.5" />
                  </span>
                  <input
                    id="token"
                    ref={tokenInputRef}
                    type="text"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste the code from your email"
                    className="w-full bg-white border-2 border-brand-forestDark py-3 pl-10 pr-4 font-work text-sm text-brand-dark focus:outline-none focus:ring-0 focus:border-brand-orange transition-colors rounded outline-none font-bold"
                  />
                </div>
                <p className="text-xs font-work text-brand-dark/50">
                  Check your inbox for the recovery code.
                </p>
              </div>
            )}

            <div className="pt-4">
              <button
                disabled={loading}
                type="submit"
                className="w-full py-4 bg-brand-orange text-white font-space font-black text-xs uppercase tracking-widest border-2 border-brand-forestDark shadow-[4px_4px_0px_0px_rgba(22,44,28,1)] active:translate-y-1 active:translate-x-1 active:shadow-none hover:bg-brand-orangeDark transition-all cursor-pointer flex justify-center items-center gap-2 rounded disabled:opacity-50"
              >
                {loading ? (
                  <span>{loadingText}</span>
                ) : (
                  <>
                    <span>{isTokenVisible ? 'VERIFY CODE' : 'CONTINUE'}</span>
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setCurrentPage('login')}
                className="font-space text-xs font-black text-brand-forestDark hover:text-brand-orange transition-colors inline-flex items-center gap-1.5 uppercase tracking-wider underline underline-offset-4 decoration-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Basecamp (Login)
              </button>
            </div>

          </form>
        </div>

        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(45deg, #162c1c 25%, transparent 25%, transparent 75%, #162c1c 75%, #162c1c), repeating-linear-gradient(45deg, #162c1c 25%, transparent 25%, transparent 75%, #162c1c 75%, #162c1c)", backgroundPosition: "0 0, 10px 10px", backgroundSize: "20px 20px" }}></div>
      </section>

    </div>
  );
}
