import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Categories from './components/Categories';
import SpecialTrips from './components/SpecialTrips';
import StatsAndTestimonials from './components/StatsAndTestimonials';
import SignupForm from './components/SignupForm';
import Footer from './components/Footer';
import KherjatPage from './components/KherjatPage';
import SouvenirsPage from './components/SouvenirsPage';
import AboutPage from './components/AboutPage';
import ExpeditionDetailsPage from './components/ExpeditionDetailsPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

import ChangePasswordPage from './components/ChangePasswordPage';
import { X, Calendar, User, Phone, Users, CheckCircle, AlertTriangle, Camera } from 'lucide-react';
import AdminDashboard from './components/AdminDashboard';
import AdminTrips from './components/AdminTrips';
import AdminAddTrip from './components/AdminAddTrip';
import AdminRegistrations from './components/AdminRegistrations';
import { fetchExpeditions, createInquiry, fetchInquiries, updateInquiryStatus, mapExpeditionToTrip, fetchCurrentUser, removeToken, setMyInquiryId } from './services/api';
import MyTicket from './components/MyTicket';

// Friendly prompts that rotate while the client captures their selfie.
const SELFIE_PROMPTS = [
  'Show us your smile 😊',
  'We wanna see you smiling!',
  'Let us see you happy!',
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);

  const [selectedTripDetails, setSelectedTripDetails] = useState(null);
  const [previousPage, setPreviousPage] = useState('landing');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('idle');
  const [bookingError, setBookingError] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    phone: '',
    tickets: 1
  });
  const [trips, setTrips] = useState([]);
  const [registrations, setRegistrations] = useState([]);


  // ── Selfie camera capture state ─────────────────────────────────
  const [selfieFile, setSelfieFile] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [selfiePromptIndex, setSelfiePromptIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSelfiePromptIndex((i) => (i + 1) % 3), 4000);
    return () => clearInterval(t);
  }, []);

  const handleLogout = () => {
    removeToken();
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  // ── Map a backend Inquiry to frontend registration format ────────
  function mapInquiryToRegistration(inq) {
    const statusMap = {
      'new': 'PENDING',
      'contacted': 'PENDING',
      'confirmed': 'CONFIRMED',
      'cancelled': 'SUSPENDED',
    };
    const created = new Date(inq.created_at);
    return {
      id: inq.id,
      name: inq.name,
      level: 'Intermediate',
      phone: inq.phone,
      email: inq.email,
      selfieUrl: inq.selfie_url || null,
      tripTitle: inq.expedition_title || 'General Inquiry',
      tripSubtitle: inq.message?.substring(0, 40) || '',
      date: created.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
      status: statusMap[inq.status] || 'PENDING',
    };
  }

  // ── Fetch expeditions from API on mount ──────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function loadTrips() {
      try {
        const data = await fetchExpeditions({ page_size: 50 });
        if (!cancelled) {
          const mapped = (data.results || []).map(mapExpeditionToTrip);
          setTrips(mapped);
        }
      } catch (err) {
        console.error('API call failed:', err.message);
        if (!cancelled) setTrips([]);
      }
    }

    async function loadUser() {
      try {
        const user = await fetchCurrentUser();
        if (!cancelled) {
          setCurrentUser({
            name: `${user.first_name} ${user.last_name}`.trim() || user.username,
            email: user.email,
            role: user.is_staff ? 'admin' : 'user',
            username: user.username
          });
        }
      } catch {
        removeToken();
        if (!cancelled) setCurrentUser(null);
      }
    }

    async function loadInquiries() {
      try {
        const data = await fetchInquiries();
        if (!cancelled) {
          const mapped = (data.results || data || []).map(mapInquiryToRegistration);
          setRegistrations(mapped);
        }
      } catch {
        // Non-admin or error — keep empty
      }
    }

    loadTrips();
    loadUser();
    loadInquiries();
    return () => { cancelled = true; };
  }, []);

  const handleBookClick = (trip) => {
    if (!currentUser) {
      setCurrentPage('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSelectedTrip(trip);
    setBookingStatus('idle');
    setBookingError(null);
    setBookingDetails({ 
      name: currentUser.name, 
      phone: currentUser.phone || '0555 12 34 56', 
      tickets: 1 
    });
  };

  const handleSelectTrip = (trip) => {
    setPreviousPage(currentPage);
    setSelectedTripDetails(trip);
    setCurrentPage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetails = () => {
    setSelectedTripDetails(null);
    setCurrentPage(previousPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSetPage = (page) => {
    if (page !== 'details') {
      setSelectedTripDetails(null);
    }
    setCurrentPage(page);
  };

  // ── Camera helpers (selfie capture) ──────────────────────────────
  async function startCamera() {
    setCameraError(null);
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 640 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setCameraError('Unable to access camera. Please allow camera permission and try again.');
      setShowCamera(false);
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  }

  function captureSelfie() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    const size = 480;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    // Center-crop square from the video
    const vw = video.videoWidth || 640;
    const vh = video.videoHeight || 480;
    const min = Math.min(vw, vh);
    const sx = (vw - min) / 2;
    const sy = (vh - min) / 2;
    ctx.drawImage(video, sx, sy, min, min, 0, 0, size, size);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
      setSelfieFile(file);
      setSelfiePreview(URL.createObjectURL(file));
      stopCamera();
    }, 'image/jpeg', 0.9);
  }

  function resetSelfie() {
    setSelfieFile(null);
    if (selfiePreview) URL.revokeObjectURL(selfiePreview);
    setSelfiePreview(null);
    setCameraError(null);
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingStatus('loading');
    setBookingError(null);

    if (!selfieFile) {
      setBookingError('Please add a selfie photo to complete your booking.');
      setBookingStatus('error');
      return;
    }

    const inquiryPayload = {
      name: currentUser?.name || bookingDetails.name || 'Explorer User',
      phone: currentUser?.phone || bookingDetails.phone || '0555123456',
      email: currentUser?.email || 'explorer@projectnature.dz',
      message: `Booking request for ${selectedTrip.title} (${selectedTrip.duration} — ${selectedTrip.price}). Seats requested: ${bookingDetails.tickets}.`,
      ...(selectedTrip.backendId ? { expedition: selectedTrip.backendId } : {}),
    };

    try {
      const inq = await createInquiry(inquiryPayload, selfieFile);

      const newReg = {
        id: inq.id || 'reg-' + Date.now(),
        name: inquiryPayload.name,
        level: 'Intermediate',
        phone: inquiryPayload.phone,
        email: inquiryPayload.email,
        tripTitle: selectedTrip.title,
        tripSubtitle: `${selectedTrip.duration} - ${selectedTrip.price}`,
        date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
        status: 'PENDING'
      };
      setRegistrations(prev => [newReg, ...prev]);
      setBookingStatus('success');
      setSelfieFile(null);
      setSelfiePreview(null);

      if (inq && inq.id) setMyInquiryId(inq.id);

      // Re-fetch inquiries from backend to keep admin view in sync
      try {
        const data = await fetchInquiries();
        const mapped = (data.results || data || []).map(mapInquiryToRegistration);
        setRegistrations(mapped);
      } catch {
        // Keep the local registration if re-fetch fails
      }
    } catch (err) {
      console.error('Booking submission failed:', err.message);
      setBookingError(err.message);
      setBookingStatus('error');
    }
  };

  const handleAddTrip = (newTrip) => {
    setTrips(prev => [newTrip, ...prev]);
  };

  const handleDeleteTrip = (tripId) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
  };

  const handleMarkCompleted = (tripId) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, completed: true, capacity: '20/20' } : t));
  };

  const handleConfirmRegistration = async (regId) => {
    setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status: 'CONFIRMED' } : r));
    try {
      await updateInquiryStatus(regId, 'confirmed');
    } catch (err) {
      console.error('Failed to confirm registration:', err.message);
      setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status: 'PENDING' } : r));
    }
  };

  const handleSuspendRegistration = async (regId) => {
    setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status: 'SUSPENDED' } : r));
    try {
      await updateInquiryStatus(regId, 'cancelled');
    } catch (err) {
      console.error('Failed to suspend registration:', err.message);
      setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status: 'PENDING' } : r));
    }
  };

  if (currentPage === 'login') {
    return <LoginPage setCurrentPage={handleSetPage} onLoginSuccess={(userData) => setCurrentUser(userData)} />;
  }

  if (currentPage === 'register') {
    return <RegisterPage setCurrentPage={handleSetPage} onRegisterSuccess={(userData) => {
      setCurrentUser(userData);
    }} />;
  }



  if (currentPage === 'change-password') {
    return <ChangePasswordPage setCurrentPage={handleSetPage} currentUser={currentUser} />;
  }

  if (currentPage === 'my-ticket') {
    return (
      <MyTicket
        setCurrentPage={handleSetPage}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  // ── Admin route guards: redirect non-staff users ────────────────
  const isAdmin = currentUser?.role === 'admin';

  if (currentPage === 'admin-dashboard' && isAdmin) {
    return (
      <AdminDashboard 
        currentPage={currentPage}
        setCurrentPage={handleSetPage}
        currentUser={currentUser}
        onLogout={handleLogout}
        trips={trips}
        registrations={registrations}
      />
    );
  }

  if (currentPage === 'admin-trips' && isAdmin) {
    return (
      <AdminTrips 
        currentPage={currentPage}
        setCurrentPage={handleSetPage}
        currentUser={currentUser}
        onLogout={handleLogout}
        trips={trips}
        onMarkCompleted={handleMarkCompleted}
        onDeleteTrip={handleDeleteTrip}
      />
    );
  }

  if (currentPage === 'admin-add-trip' && isAdmin) {
    return (
      <AdminAddTrip 
        currentPage={currentPage}
        setCurrentPage={handleSetPage}
        currentUser={currentUser}
        onLogout={handleLogout}
        onAddTrip={handleAddTrip}
      />
    );
  }

  if (currentPage === 'admin-registrations' && isAdmin) {
    return (
      <AdminRegistrations 
        currentPage={currentPage}
        setCurrentPage={handleSetPage}
        currentUser={currentUser}
        onLogout={handleLogout}
        registrations={registrations}
        onConfirmRegistration={handleConfirmRegistration}
        onSuspendRegistration={handleSuspendRegistration}
      />
    );
  }


  return (
    <div className="bg-brand-bg text-brand-dark min-h-screen relative font-work selection:bg-brand-orange selection:text-white">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={handleSetPage} 
        currentUser={currentUser} 
        onLogout={handleLogout}
      />

      <main>
        {currentPage === 'landing' ? (
          <>
            <Hero />
            <Services />
            <Categories />
            <SpecialTrips excursions={trips} onBookTrip={handleBookClick} onSelectTrip={handleSelectTrip} />
            <StatsAndTestimonials />
            <SignupForm />
          </>
        ) : currentPage === 'kherjat' ? (
          <KherjatPage excursions={trips} onBookTrip={handleBookClick} onSelectTrip={handleSelectTrip} />
        ) : currentPage === 'souvenirs' ? (
          <SouvenirsPage setCurrentPage={handleSetPage} />
        ) : currentPage === 'about' ? (
          <AboutPage setCurrentPage={handleSetPage} />
        ) : (
          selectedTripDetails && (
            <ExpeditionDetailsPage 
              selectedTrip={selectedTripDetails} 
              onBookTrip={handleBookClick} 
              onBack={handleBackFromDetails} 
            />
          )
        )}
      </main>

      <Footer />

      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-sm animate-fade-in">
          
          <div className="relative w-full max-w-lg bg-brand-sand border-4 border-brand-forestDark rounded p-8 shadow-[8px_8px_0px_0px_rgba(22,44,28,1)] animate-scale-up">
            
            <button 
              onClick={() => setSelectedTrip(null)}
              className="absolute top-4 right-4 p-1 rounded bg-white hover:bg-brand-orange hover:text-white text-brand-dark border-2 border-brand-forestDark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingStatus === 'success' ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-forestDark text-brand-sand rounded-full border-4 border-white mb-6 animate-bounce-short">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black font-syne text-brand-forestDark uppercase tracking-tight mb-4">
                  Request Sent!
                </h3>
                <p className="text-brand-dark/80 font-medium mb-6 leading-relaxed">
                  Thank you <strong className="text-brand-orange">{bookingDetails.name}</strong>! Your pre-booking for <strong>{selectedTrip.title}</strong> has been registered. Our team will contact you within 24 hours at <strong className="text-brand-orange">{bookingDetails.phone}</strong>.
                </p>
                <button 
                  onClick={() => setSelectedTrip(null)}
                  className="bg-brand-orange text-white px-8 py-3.5 font-space font-black border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase rounded w-full"
                >
                  Close
                </button>
              </div>
            ) : bookingStatus === 'error' ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full border-4 border-red-200 mb-6">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black font-syne text-red-700 uppercase tracking-tight mb-4">
                  Booking Failed
                </h3>
                <p className="text-brand-dark/70 font-medium mb-6 leading-relaxed text-sm">
                  {bookingError || 'Something went wrong. Please try again.'}
                </p>
                <button 
                  onClick={() => setBookingStatus('idle')}
                  className="bg-brand-orange text-white px-8 py-3.5 font-space font-black border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase rounded w-full"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="bg-brand-orange text-white text-[10px] font-space font-black px-2.5 py-1 rounded uppercase tracking-wider">
                    Pre-Booking
                  </span>
                  <h3 className="text-3xl font-black font-syne text-brand-forestDark uppercase tracking-tight mt-2 leading-none">
                    {selectedTrip.title}
                  </h3>
                  <p className="text-xs text-brand-dark/60 font-space font-bold mt-1 uppercase flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-brand-orange" />
                    <span>Duration: {selectedTrip.duration} &bull; Price: {selectedTrip.price}</span>
                  </p>
                </div>

                <div className="bg-white p-5 border-2 border-brand-forestDark shadow-[3px_3px_0px_rgba(22,44,28,1)] rounded mb-6 space-y-3.5 mt-5">
                  <div className="flex justify-between items-center text-sm border-b border-brand-forestDark/10 pb-2">
                    <span className="font-space font-bold text-brand-forestDark/65 uppercase text-[10px] tracking-widest flex items-center">
                      <User className="w-3.5 h-3.5 mr-1 text-brand-orange" />
                      Explorer
                    </span>
                    <span className="font-work font-bold text-brand-forestDark">{currentUser?.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-brand-forestDark/10 pb-2">
                    <span className="font-space font-bold text-brand-forestDark/65 uppercase text-[10px] tracking-widest flex items-center">
                      <Phone className="w-3.5 h-3.5 mr-1 text-brand-orange" />
                      Contact Phone
                    </span>
                    <span className="font-work font-bold text-brand-forestDark">{currentUser?.phone || '0555 12 34 56'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-space font-bold text-brand-forestDark/65 uppercase text-[10px] tracking-widest flex items-center">
                      <Users className="w-3.5 h-3.5 mr-1 text-brand-orange" />
                      Reserved Seats
                    </span>
                    <span className="font-work font-black text-brand-orange">1 Seat</span>
                  </div>
                </div>

                {/* ── Selfie capture step ── */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-space font-black text-[10px] text-brand-forestDark/65 uppercase tracking-widest flex items-center">
                      <Camera className="w-3.5 h-3.5 mr-1 text-brand-orange" />
                      Selfie Ticket
                    </span>
                    <span className="font-space font-black text-[9px] text-brand-orange uppercase tracking-wider">required</span>
                  </div>
                  <p className="text-sm font-work font-semibold text-brand-forestDark mb-3 text-center min-h-[20px]">
                    {SELFIE_PROMPTS[selfiePromptIndex]}
                  </p>
                  {cameraError && (
                    <p className="text-xs font-work font-medium text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-3">{cameraError}</p>
                  )}
                  {showCamera ? (
                    <div className="bg-brand-forestDark rounded p-2">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-square object-cover rounded" />
                      <div className="flex gap-2 mt-3">
                        <button type="button" onClick={captureSelfie} className="flex-1 bg-brand-orange text-white py-2.5 font-space font-black text-xs uppercase tracking-wider rounded cursor-pointer">
                          Capture
                        </button>
                        <button type="button" onClick={stopCamera} className="flex-1 bg-white text-brand-forestDark py-2.5 font-space font-black text-xs uppercase tracking-wider rounded cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : selfiePreview ? (
                    <div className="relative bg-white border-2 border-brand-forestDark rounded overflow-hidden">
                      <img src={selfiePreview} alt="Your selfie" className="w-full aspect-square object-cover" />
                      <div className="absolute bottom-2 right-2 flex gap-2">
                        <button type="button" onClick={startCamera} className="bg-brand-forest text-white px-3 py-1.5 font-space font-black text-[10px] uppercase tracking-wider rounded cursor-pointer">
                          Retake
                        </button>
                        <button type="button" onClick={resetSelfie} className="bg-red-600 text-white px-3 py-1.5 font-space font-black text-[10px] uppercase tracking-wider rounded cursor-pointer">
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button type="button" onClick={startCamera} className="w-full border-2 border-dashed border-brand-forestDark/40 rounded p-6 bg-brand-sand/40 hover:bg-brand-sand/70 transition-colors cursor-pointer flex flex-col items-center gap-2">
                      <Camera className="w-8 h-8 text-brand-orange" />
                      <span className="font-space font-black text-xs text-brand-forestDark uppercase tracking-wider">Take your selfie</span>
                      <span className="font-work font-medium text-[10px] text-brand-dark/60">Use your camera to capture a photo</span>
                    </button>
                  )}
                  {selfiePreview && <p className="text-[10px] font-space font-bold text-brand-dark/50 mt-2 text-center">Swapped in on your ticket if confirmed</p>}
                  <div className="mt-2 flex gap-1.5 justify-center">{[0,1,2,3].map(i => (
                    <span key={i} className={`h-1 w-6 rounded-full ${i === selfiePromptIndex ? 'bg-brand-orange' : 'bg-brand-forest/20'}`} />
                  ))}</div>
                </div>

                <form onSubmit={handleBookingSubmit}>
                  <button 
                    type="submit"
                    disabled={bookingStatus === 'loading'}
                    className="bg-brand-orange hover:bg-brand-orangeDark text-white py-4 font-space font-black border-2 border-brand-forestDark shadow-[4px_4px_0px_rgba(22,44,28,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 disabled:bg-gray-400 disabled:border-gray-500 disabled:shadow-none transition-all uppercase tracking-widest text-sm rounded w-full flex items-center justify-center"
                  >
                    <span>{bookingStatus === 'loading' ? 'Processing...' : 'Confirm Booking'}</span>
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
}
