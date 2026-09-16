import { useState } from 'react';
import Navbar2 from './Navbar2';
import {
  updateExpeditionCover,
  fetchExpeditionImages,
  createExpeditionImage,
  deleteExpeditionImage,
} from '../services/api';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024;

function validateFile(file) {
  if (!file) return 'No file selected.';
  if (file.size > MAX_BYTES) return 'Image must be less than 5 MB.';
  if (!ALLOWED.includes(file.type)) return 'Only JPG, PNG, and WebP images are allowed.';
  return null;
}

export default function AdminTrips({
  currentPage,
  setCurrentPage,
  currentUser,
  onLogout,
  trips,
  onMarkCompleted,
  onDeleteTrip,
}) {
  const [openId, setOpenId] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const openManager = async (trip) => {
    if (openId === trip.id) {
      setOpenId(null);
      return;
    }
    setOpenId(trip.id);
    setError(null);
    setGallery([]);
    if (!trip.backendId) return;
    setLoadingGallery(true);
    try {
      const imgs = await fetchExpeditionImages(trip.backendId);
      setGallery(imgs || []);
    } catch (err) {
      setError(err.message || 'Could not load gallery.');
    } finally {
      setLoadingGallery(false);
    }
  };

  const handleCover = async (trip, file) => {
    const invalid = validateFile(file);
    if (invalid) {
      alert(invalid);
      return;
    }
    setBusy(`cover-${trip.id}`);
    try {
      await updateExpeditionCover(trip.backendId, file);
      alert('Cover image updated. It may take a moment to refresh across the site.');
    } catch (err) {
      alert(err.message || 'Cover upload failed.');
    } finally {
      setBusy(null);
    }
  };

  const handleAddGallery = async (trip, files) => {
    if (!files || files.length === 0) return;
    setBusy(`gallery-${trip.id}`);
    try {
      let order = gallery.length;
      for (const file of Array.from(files)) {
        const invalid = validateFile(file);
        if (invalid) {
          alert(`${file.name}: ${invalid}`);
          continue;
        }
        const row = await createExpeditionImage(trip.backendId, file, '', order);
        setGallery((prev) => [...prev, row]);
        order += 1;
      }
    } catch (err) {
      alert(err.message || 'Gallery upload failed.');
    } finally {
      setBusy(null);
    }
  };

  const handleDeleteGallery = async (trip, imageId) => {
    if (!window.confirm('Remove this gallery image?')) return;
    setBusy(`del-${imageId}`);
    try {
      await deleteExpeditionImage(imageId);
      setGallery((prev) => prev.filter((im) => im.id !== imageId));
    } catch (err) {
      alert(err.message || 'Failed to delete image.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen flex flex-col md:flex-row antialiased">
      {/* Sidebar Navigation */}
      <Navbar2
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto mb-20 md:mb-0">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b-2 border-primary text-left">
            <div>
              <h2 className="font-syne text-3xl font-black text-primary uppercase">Manage Expeditions</h2>
              <p className="font-work text-sm text-on-surface-variant font-medium mt-1">Manage upcoming trips, photos, and curate the wilderness experience.</p>
            </div>
            <button 
              onClick={() => setCurrentPage('admin-add-trip')}
              className="bg-secondary text-white font-space font-black text-xs uppercase tracking-widest px-5 py-3 border-2 border-primary shadow-[4px_4px_0px_#162c1c] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all flex items-center shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined mr-2">add</span>
              New Expedition
            </button>
          </div>

          {/* Trips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {trips.map((trip) => (
              <article 
                key={trip.id} 
                className="bg-white border-2 border-primary shadow-[6px_6px_0px_#162c1c] flex flex-col relative transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_#162c1c] transition-all duration-300 rounded"
              >
                <div className="h-64 border-b-2 border-primary relative overflow-hidden bg-primary-container p-2 pb-6">
                  <img 
                    className="w-full h-full object-cover border-2 border-primary shadow-[2px_2px_0px_#162c1c] rounded" 
                    alt={trip.title} 
                    src={trip.image}
                  />
                  <div className="absolute top-4 right-4 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 font-space font-bold text-[11px] border-2 border-primary shadow-[2px_2px_0px_#162c1c] rotate-2">
                    {trip.duration}
                  </div>
                  {trip.type && (
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 font-space font-bold text-[10px] border border-brand-sand rounded uppercase tracking-wider">
                      {trip.type}
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex-grow flex flex-col bg-white z-10">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-syne font-black text-xl text-primary uppercase leading-tight line-clamp-1">{trip.title}</h3>
                    <div className={`px-2.5 py-1 font-space font-bold text-[10px] rounded-DEFAULT border ${
                      trip.completed 
                        ? 'bg-amber-100 text-amber-800 border-amber-300' 
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}>
                      {trip.completed ? 'FULLY BOOKED' : `${trip.capacity || '0/20'} Seats`}
                    </div>
                  </div>
                  
                  <div className="font-space font-bold text-xs text-on-surface-variant mb-4 flex items-center">
                    <span className="material-symbols-outlined mr-2 text-[18px]">calendar_today</span>
                    {trip.dates || 'TBD'}
                  </div>

                  <p className="font-work text-sm text-on-surface-variant mb-6 line-clamp-2">{trip.description}</p>

                  <div className="mt-auto flex flex-wrap gap-3 pt-4 border-t border-primary/10">
                    <button 
                      disabled={trip.completed}
                      onClick={() => onMarkCompleted(trip.id)}
                      className={`flex-grow border-2 px-4 py-2 font-space font-black text-[10px] uppercase tracking-wider flex items-center justify-center transition-colors cursor-pointer focus:outline-none ${
                        trip.completed 
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : 'bg-slate-50 border-primary text-primary hover:bg-primary hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined mr-1.5 text-[16px]">check_circle</span>
                      {trip.completed ? 'Fully Booked' : 'Mark Completed'}
                    </button>
                    <button 
                      onClick={() => onDeleteTrip(trip.id)}
                      className="px-4 py-2 text-error border-2 border-transparent hover:border-error hover:bg-red-55/20 transition-colors font-space font-black text-[10px] uppercase tracking-wider flex items-center justify-center cursor-pointer focus:outline-none"
                    >
                      <span className="material-symbols-outlined mr-1.5 text-[16px]">delete</span>
                      Delete
                    </button>
                    <button
                      onClick={() => openManager(trip)}
                      disabled={!trip.backendId}
                      className={`w-full border-2 px-4 py-2 font-space font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed ${
                        openId === trip.id
                          ? 'bg-primary text-white border-primary'
                          : 'bg-secondary/10 border-secondary text-secondary hover:bg-secondary hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">photo_library</span>
                      {openId === trip.id ? 'Close Photos' : 'Manage Photos'}
                    </button>
                  </div>
                </div>

                {/* Inline image manager */}
                {openId === trip.id && (
                  <div className="border-t-2 border-primary bg-slate-50 p-5 space-y-5">
                    {error && (
                      <p className="text-red-600 font-work text-xs font-medium">{error}</p>
                    )}

                    {/* Cover */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-space font-black text-[10px] text-primary uppercase tracking-widest">Cover Image</span>
                        <label className={`text-[9px] font-space font-black uppercase tracking-wider px-2.5 py-1 border-2 border-primary cursor-pointer transition-colors ${busy === `cover-${trip.id}` ? 'bg-slate-200 text-slate-400' : 'bg-secondary text-white hover:bg-primary'}`}>
                          {busy === `cover-${trip.id}` ? 'Uploading...' : 'Change Cover'}
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            className="hidden"
                            disabled={busy === `cover-${trip.id}`}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              e.target.value = '';
                              if (file) handleCover(trip, file);
                            }}
                          />
                        </label>
                      </div>
                      <img src={trip.image} alt={trip.title} className="w-full h-32 object-cover border-2 border-primary rounded" />
                    </div>

                    {/* Gallery */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-space font-black text-[10px] text-primary uppercase tracking-widest">Gallery ({gallery.length})</span>
                        <label className={`text-[9px] font-space font-black uppercase tracking-wider px-2.5 py-1 border-2 border-primary cursor-pointer transition-colors ${busy === `gallery-${trip.id}` ? 'bg-slate-200 text-slate-400' : 'bg-primary text-white hover:bg-secondary'}`}>
                          {busy === `gallery-${trip.id}` ? 'Uploading...' : 'Add Photos'}
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            className="hidden"
                            multiple
                            disabled={busy === `gallery-${trip.id}`}
                            onChange={(e) => {
                              const files = e.target.files;
                              e.target.value = '';
                              handleAddGallery(trip, files);
                            }}
                          />
                        </label>
                      </div>

                      {loadingGallery ? (
                        <p className="text-xs text-on-surface-variant font-medium">Loading gallery...</p>
                      ) : gallery.length === 0 ? (
                        <p className="text-xs text-on-surface-variant font-medium border-2 border-dashed border-primary/30 rounded p-4 text-center">
                          No gallery photos yet.
                        </p>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {gallery.map((im) => (
                            <div key={im.id} className="relative group aspect-square rounded overflow-hidden border-2 border-primary">
                              <img
                                src={im.image}
                                alt="Gallery"
                                className="w-full h-full object-cover cursor-zoom-in"
                                onClick={() => setLightbox(im.image)}
                              />
                              <button
                                onClick={() => handleDeleteGallery(trip, im.id)}
                                disabled={busy === `del-${im.id}`}
                                className="absolute top-1 right-1 w-6 h-6 rounded bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-50"
                                title="Delete"
                              >
                                <span className="material-symbols-outlined text-[14px]">close</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </article>
            ))}

            {trips.length === 0 && (
              <div className="col-span-2 p-12 text-center bg-white border-2 border-primary border-dashed rounded-xl text-on-surface-variant font-medium">
                No excursions configured. Create one to begin.
              </div>
            )}
          </div>
          
        </div>
      </main>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="Preview" className="max-h-full max-w-full object-contain border-4 border-white rounded" />
        </div>
      )}
    </div>
  );
}
