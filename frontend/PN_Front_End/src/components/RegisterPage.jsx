import { useState } from 'react';
import { ArrowRight, ArrowLeft, Eye, EyeOff, User, Mail, Phone, Lock, Compass, CheckCircle2 } from 'lucide-react';
import { registerUser } from '../services/api';

export default function RegisterPage({ setCurrentPage, onRegisterSuccess }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      alert('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const data = await registerUser({
        username: email,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone,
      });

      setSuccess(true);
      if (onRegisterSuccess) {
        onRegisterSuccess({
          name: fullName,
          email,
          phone,
          username: data.user?.username || email,
        });
      }
      setTimeout(() => {
        setCurrentPage('verify-email');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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

      <section className="hidden md:flex md:w-1/2 relative bg-brand-forestDark overflow-hidden min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuANn4rhTzScBo3-lYlSShRYS5u7oJNZgB8_4AMmUm0T3_iNb40n0tZphNoSHyLK5yFs2ITGWVBnQ_fB4dpTwPKwos9ErrQdtgWP8xgbxD3oAud7FEuKKXDdqWB16EMajd0X6InBc30x-hf7SYV9A-S2g8Pt668wWFPNKIrXvP_PaEvi9Xb8Tqci0RLV6uHrqWK_Pjb-yNpMEkOjORfgc1InrZzle3q9OMOVDL6voYEh3mBGb3UPCNV9')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-forestDark/90 via-brand-forestDark/30 to-transparent mix-blend-multiply"></div>

        <div className="relative z-10 flex flex-col justify-between p-16 w-full text-brand-bg h-full">
          <button
            onClick={() => setCurrentPage('landing')}
            className="self-start inline-flex items-center gap-2 font-space font-black text-xs uppercase tracking-widest text-brand-bg/85 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4.5 h-4.5" /> Back to home
          </button>

          <div className="mt-auto">
            <div className="flex items-center gap-3 mb-6 cursor-pointer group" onClick={() => setCurrentPage('landing')}>
              <Compass className="w-10 h-10 text-brand-orange animate-spin-slow group-hover:scale-115 transition-transform" />
              <h1 className="font-syne text-3xl font-extrabold tracking-tighter uppercase leading-[0.8]">
                PROJECT <span className="font-light italic text-brand-orange">NATURE</span>
              </h1>
            </div>
            <p className="font-work text-lg text-brand-bg/80 max-w-md leading-relaxed">
              Explore the wildest corners of Algeria with a community of passionate explorers.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-12 md:p-16 bg-brand-bg relative">

        <div
          onClick={() => setCurrentPage('landing')}
          className="md:hidden flex items-center gap-2 mb-10 w-full max-w-md self-start text-brand-forestDark cursor-pointer"
        >
          <Compass className="w-7 h-7 text-brand-orange" />
          <span className="font-syne text-xl font-bold tracking-tighter uppercase">PROJECT NATURE</span>
        </div>

        <div className="w-full max-w-md relative z-10 bg-brand-bg border-2 border-brand-forestDark p-8 shadow-[8px_8px_0px_0px_rgba(22,44,28,1)] rounded">

          {success ? (
            <div className="text-center py-10 animate-scale-up">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-sand text-brand-orange rounded-full border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-syne text-3xl font-black text-brand-forestDark uppercase mb-2">Account Created!</h2>
              <p className="text-brand-dark/70 text-sm font-medium">Your explorer profile is ready. Redirecting you to email verification...</p>
            </div>
          ) : (
            <>
              <h2 className="font-syne text-3xl md:text-4xl text-brand-forestDark mb-2 uppercase font-black tracking-tight leading-none">
                Join the Adventure
              </h2>
              <p className="font-work text-sm text-brand-dark/65 mb-8">
                Create your explorer profile to book your next expeditions.
              </p>

              {error && (
                <div className="bg-red-50 border-2 border-red-300 p-4 rounded mb-6 text-sm text-red-700 font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                  <label className="block font-space font-black text-xs text-brand-forestDark mb-2 uppercase tracking-widest" htmlFor="fullName">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-forestDark/40">
                      <User className="w-4.5 h-4.5" />
                    </span>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full bg-white border-2 border-brand-forestDark py-3 pl-10 pr-4 font-work text-sm text-brand-dark focus:outline-none focus:ring-0 focus:border-brand-orange transition-colors rounded outline-none"
                      id="fullName"
                      name="fullName"
                      placeholder="e.g. Amine Khali"
                      type="text"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-space font-black text-xs text-brand-forestDark mb-2 uppercase tracking-widest" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-forestDark/40">
                      <Mail className="w-4.5 h-4.5" />
                    </span>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-white border-2 border-brand-forestDark py-3 pl-10 pr-4 font-work text-sm text-brand-dark focus:outline-none focus:ring-0 focus:border-brand-orange transition-colors rounded outline-none"
                      id="email"
                      name="email"
                      placeholder="amine@example.com"
                      type="email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-space font-black text-xs text-brand-forestDark mb-2 uppercase tracking-widest" htmlFor="phone">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-forestDark/40">
                      <Phone className="w-4.5 h-4.5" />
                    </span>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border-2 border-brand-forestDark py-3 pl-10 pr-4 font-work text-sm text-brand-dark focus:outline-none focus:ring-0 focus:border-brand-orange transition-colors rounded outline-none"
                      id="phone"
                      name="phone"
                      placeholder="0555 00 00 00"
                      type="tel"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-space font-black text-xs text-brand-forestDark mb-2 uppercase tracking-widest" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-forestDark/40">
                      <Lock className="w-4.5 h-4.5" />
                    </span>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-white border-2 border-brand-forestDark py-3 pl-10 pr-12 font-work text-sm text-brand-dark focus:outline-none focus:ring-0 focus:border-brand-orange transition-colors rounded outline-none"
                      id="password"
                      name="password"
                      placeholder="Min 10 characters"
                      type={showPassword ? 'text' : 'password'}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-forestDark/60 hover:text-brand-orange transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-space font-black text-xs text-brand-forestDark mb-2 uppercase tracking-widest" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-forestDark/40">
                      <Lock className="w-4.5 h-4.5" />
                    </span>
                    <input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full bg-white border-2 border-brand-forestDark py-3 pl-10 pr-12 font-work text-sm text-brand-dark focus:outline-none focus:ring-0 focus:border-brand-orange transition-colors rounded outline-none"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="••••••••"
                      type={showConfirmPassword ? 'text' : 'password'}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-forestDark/60 hover:text-brand-orange transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      type="button"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    disabled={loading}
                    className="w-full bg-brand-orange text-white font-space font-black text-xs uppercase tracking-widest py-4 px-6 border-2 border-brand-forestDark flex justify-center items-center gap-2 hover:bg-brand-orangeDark transition-colors shadow-[4px_4px_0px_0px_rgba(22,44,28,1)] active:translate-y-1 active:shadow-none rounded disabled:opacity-50"
                    type="submit"
                  >
                    <span>{loading ? 'CREATING PROFILE...' : 'CREATE AN ACCOUNT'}</span>
                    {!loading && <ArrowRight className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setCurrentPage('login')}
                  className="font-space text-xs font-black text-brand-forestDark hover:text-brand-orange transition-colors inline-flex items-center gap-1.5 uppercase tracking-wider"
                >
                  Already an adventurer? Log In
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          <div className="absolute -top-6 -right-6 w-12 h-12 bg-brand-orange border-2 border-brand-forestDark shadow-[2px_2px_0px_0px_rgba(22,44,28,1)] transform rotate-12 z-[-1] rounded"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-8 bg-brand-sand border-2 border-brand-forestDark shadow-[2px_2px_0px_0px_rgba(22,44,28,1)] transform -rotate-6 z-[-1] rounded"></div>
        </div>

        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(45deg, #162c1c 25%, transparent 25%, transparent 75%, #162c1c 75%, #162c1c), repeating-linear-gradient(45deg, #162c1c 25%, transparent 25%, transparent 75%, #162c1c 75%, #162c1c)", backgroundPosition: "0 0, 10px 10px", backgroundSize: "20px 20px" }}></div>
      </section>

    </div>
  );
}
