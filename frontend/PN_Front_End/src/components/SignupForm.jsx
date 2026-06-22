import React, { useState } from 'react';
import { Mail, CheckCircle, Send } from 'lucide-react';
import { subscribeNewsletter } from '../services/api';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setStatus('error');
      setMessage('Please enter an email address.');
      return;
    }
    
    // Quick regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    try {
      await subscribeNewsletter(email);
      setStatus('success');
      setMessage('Welcome aboard! You will receive our next trips soon.');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Subscription failed. Please try again.');
    }
  };

  return (
    <section id="signup" className="py-32 px-6 bg-brand-bg relative overflow-hidden">
      
      {/* Container */}
      <div className="max-w-4xl mx-auto bg-brand-sand relative p-8 md:p-16 border-2 border-brand-forestDark rounded shadow-brutalist-forest border-b-8 border-b-brand-orange">
        
        {/* Decorative background envelope icon */}
        <div className="absolute top-6 right-8 text-7xl text-brand-orange/15 select-none pointer-events-none transform rotate-12">
          <Mail className="w-16 h-16 stroke-[1.5]" />
        </div>

        <div className="relative z-10 text-center">
          
          <h2 className="text-4xl md:text-5xl font-black text-brand-forestDark font-syne uppercase tracking-tight mb-4">
            Ready for the Next Departure?
          </h2>
          
          <p className="text-brand-dark/70 font-medium mb-10 max-w-md mx-auto leading-relaxed">
            Subscribe to our newsletter to receive exclusive trips and secret expeditions in preview.
          </p>

          {/* Form */}
          {status === 'success' ? (
            <div className="max-w-md mx-auto p-6 bg-brand-forestDark text-white border-2 border-white rounded shadow-brutalist-orange animate-bounce-short flex flex-col items-center">
              <CheckCircle className="w-10 h-10 text-brand-sand mb-3" />
              <p className="font-space font-bold text-center text-sm tracking-wide">
                {message}
              </p>
              <button 
                onClick={() => setStatus('idle')} 
                className="mt-4 text-xs font-space font-bold border-b border-brand-sand hover:text-brand-orange transition-colors"
              >
                Subscribe another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto items-stretch">
              
              <div className="flex-grow flex flex-col">
                <input 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  disabled={status === 'loading'}
                  className="w-full p-4 border-2 border-brand-forestDark focus:border-brand-orange outline-none bg-white rounded text-brand-dark font-medium shadow-[2px_2px_0px_rgba(22,44,28,1)] transition-all" 
                  placeholder="your@email.com" 
                  type="email"
                />
                
                {status === 'error' && (
                  <span className="text-red-700 text-xs font-space font-bold mt-2 text-left bg-red-100 px-3 py-1 rounded border border-red-200">
                    ⚠️ {message}
                  </span>
                )}
              </div>

              <button 
                type="submit"
                disabled={status === 'loading'}
                className="bg-brand-orange hover:bg-brand-orangeDark text-white px-8 py-4 font-space font-black border-2 border-brand-forestDark shadow-brutalist-dark hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none disabled:bg-gray-400 disabled:border-gray-500 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 transition-all uppercase tracking-widest text-sm rounded shrink-0 flex items-center justify-center space-x-2"
              >
                <span>{status === 'loading' ? 'Sending...' : 'Subscribe'}</span>
                {status !== 'loading' && <Send className="w-4 h-4" />}
              </button>

            </form>
          )}

        </div>

        {/* Decorative Zigzag Edge at the bottom */}
        <div className="absolute -bottom-5 left-0 w-full zigzag-border"></div>

      </div>

    </section>
  );
}
