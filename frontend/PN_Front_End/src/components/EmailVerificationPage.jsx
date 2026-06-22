import { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Mail, Compass, CheckCircle2 } from 'lucide-react';
import { sendVerificationCode, verifyEmail } from '../services/api';

export default function EmailVerificationPage({ setCurrentPage, onVerifySuccess }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    const cleanValue = value.replace(/[^0-9]/g, '');
    
    const newCode = [...code];
    newCode[index] = cleanValue.slice(-1);
    setCode(newCode);

    if (cleanValue !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (code[index] === '' && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
      } else {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    
    if (pastedData) {
      const newCode = [...code];
      for (let i = 0; i < pastedData.length; i++) {
        newCode[i] = pastedData[i];
      }
      setCode(newCode);
      
      const targetFocusIndex = Math.min(pastedData.length, 5);
      if (inputRefs.current[targetFocusIndex]) {
        inputRefs.current[targetFocusIndex].focus();
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      alert('Please enter all 6 digits of your verification code.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await verifyEmail(email, fullCode);
      setSuccess(true);
      if (onVerifySuccess) onVerifySuccess();
      setTimeout(() => {
        setCurrentPage('landing');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email) {
      alert('Please enter your email address first.');
      return;
    }
    setResending(true);
    setResendStatus('');
    try {
      await sendVerificationCode(email);
      setResendStatus('Code resent! Check your inbox.');
    } catch {
      setResendStatus('Failed to resend. Please try again.');
    } finally {
      setResending(false);
      setTimeout(() => setResendStatus(''), 3000);
    }
  };

  return (
    <div className="bg-brand-bg text-brand-dark min-h-screen flex flex-col md:flex-row antialiased font-work relative">
      
      <div className="absolute top-6 left-6 z-20 md:hidden">
        <button 
          onClick={() => setCurrentPage('register')}
          className="bg-white p-2.5 rounded border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] flex items-center justify-center text-brand-forestDark"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <section className="hidden md:block md:w-1/2 md:h-screen relative md:border-r-4 md:border-brand-forestDark overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBb-hpUpyNI6nRz67I6qm1DYP7nx6BI5RbZNXtHdtywKFZ7UXdJcKyYzcxIl9pdq1aZeu_8-z80oeEUkgvLIYsNqdU648pRPCD9vUWDzecbwYY6ZvBsG6v5DEffHhkalMcrWYmEzOzUQRlgi_uG2e3hY9FMHHRuwtrk2R1MC5QNfaJxEbd4b0iYY5JlfiaPFeXRNwWyNkmnjW9gKYDR6xkOOLXx4TSZua-MsMzVNywPs2dWgULhNOYU')" }}
        />
        <div className="absolute inset-0 bg-brand-forestDark/20 mix-blend-multiply"></div>
        
        <div className="absolute top-6 left-6 md:top-16 md:left-16 bg-white px-5 py-2.5 border-2 border-brand-forestDark shadow-[4px_4px_0px_0px_rgba(22,44,28,1)] rotate-[-2deg] cursor-pointer group" onClick={() => setCurrentPage('landing')}>
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-brand-orange group-hover:scale-110 transition-transform" />
            <span className="font-syne text-xl font-black text-brand-forestDark tracking-tighter uppercase leading-[0.8]">
              PROJECT <span className="font-light italic text-brand-orange">NATURE</span>
            </span>
          </div>
        </div>
      </section>

      <section className="w-full md:w-1/2 min-h-screen flex flex-col items-center justify-center p-6 md:p-16 bg-brand-bg relative">
        <div className="absolute -top-12 -left-8 w-24 h-24 bg-brand-sand/50 rounded-full mix-blend-multiply opacity-50 pointer-events-none"></div>
        
        <div 
          onClick={() => setCurrentPage('landing')}
          className="md:hidden flex items-center gap-2 mb-10 w-full max-w-md self-start text-brand-forestDark cursor-pointer mt-16"
        >
          <Compass className="w-7 h-7 text-brand-orange" />
          <span className="font-syne text-xl font-bold tracking-tighter uppercase">PROJECT NATURE</span>
        </div>

        <div className="w-full max-w-md relative z-10">
          <form onSubmit={handleVerify} className="bg-white p-8 md:p-12 border-2 border-brand-forestDark shadow-[8px_8px_0px_0px_rgba(22,44,28,1)] rounded">
            
            {success ? (
              <div className="text-center py-10 animate-scale-up">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-sand text-brand-orange rounded-full border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="font-syne text-3xl font-black text-brand-forestDark uppercase mb-2">Email Verified!</h2>
                <p className="text-brand-dark/70 text-sm font-medium">Verification successful. Welcome to the trail...</p>
              </div>
            ) : (
              <>
                <div className="mb-8 border-b-2 border-brand-forestDark/10 pb-6">
                  <div className="flex items-center gap-3 mb-4 text-brand-forestDark">
                    <Mail className="w-8 h-8 text-brand-orange" />
                    <h1 className="font-syne text-2xl md:text-3xl font-black text-brand-forestDark uppercase tracking-tight leading-none">
                      Verify Your Email
                    </h1>
                  </div>
                  <p className="font-work text-sm text-brand-dark/65 leading-relaxed">
                    We've sent a 6-digit verification code to your email. Enter it below to continue.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border-2 border-red-300 p-4 rounded mb-6 text-sm text-red-700 font-medium">
                    {error}
                  </div>
                )}

                <div className="mb-4">
                  <label className="block font-space font-black text-xs text-brand-forestDark mb-2 uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-brand-bg border-2 border-brand-forestDark py-3 px-4 font-work text-sm text-brand-dark focus:outline-none focus:ring-0 focus:border-brand-orange transition-colors rounded outline-none"
                  />
                </div>

                <div className="mb-10">
                  <label className="block font-space font-black text-xs text-brand-forestDark mb-4 uppercase tracking-widest">
                    Security Code
                  </label>
                  <div className="flex justify-between gap-2 md:gap-3">
                    {code.map((num, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        value={num}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        maxLength={1}
                        type="text"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        className="otp-input w-10 h-14 md:w-14 md:h-18 text-center font-syne text-2xl md:text-3xl text-brand-forestDark font-bold bg-brand-bg border-2 border-brand-forestDark focus:outline-none focus:ring-0 focus:border-brand-orange shadow-[2px_2px_0px_0px_rgba(22,44,28,1)] transition-all focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_#a23f0a] rounded outline-none"
                      />
                    ))}
                  </div>
                </div>

                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full py-4 bg-brand-orange text-white font-space font-black text-xs uppercase tracking-widest border-2 border-brand-forestDark shadow-[4px_4px_0px_0px_rgba(22,44,28,1)] active:translate-y-1 active:translate-x-1 active:shadow-none hover:bg-brand-orangeDark transition-all cursor-pointer flex justify-center items-center gap-2 rounded disabled:opacity-50"
                >
                  <span>{loading ? 'VERIFYING CODE...' : 'VERIFY CODE'}</span>
                  {!loading && <ArrowRight className="w-4.5 h-4.5" />}
                </button>

                <div className="mt-8 text-center border-t-2 border-brand-forestDark/10 pt-6">
                  <p className="font-work text-sm text-brand-dark/60 mb-2">Didn't receive the code?</p>
                  <button 
                    disabled={resending}
                    onClick={handleResend}
                    className="inline-block font-space text-xs font-black text-brand-forestDark hover:text-brand-orange transition-colors pb-1 uppercase tracking-wider underline underline-offset-4 decoration-2 disabled:opacity-50"
                  >
                    {resending ? 'RESENDING...' : 'Resend Code'}
                  </button>
                  {resendStatus && (
                    <p className="mt-2 text-xs font-semibold text-brand-forest animate-fade-in">{resendStatus}</p>
                  )}
                </div>
              </>
            )}

          </form>
        </div>

        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(45deg, #162c1c 25%, transparent 25%, transparent 75%, #162c1c 75%, #162c1c), repeating-linear-gradient(45deg, #162c1c 25%, transparent 25%, transparent 75%, #162c1c 75%, #162c1c)", backgroundPosition: "0 0, 10px 10px", backgroundSize: "20px 20px" }}></div>
      </section>

    </div>
  );
}
