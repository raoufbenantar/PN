import { useRef, useState } from 'react';
import Navbar2 from './Navbar2';
import { SITE_IMAGE_SECTIONS } from '../lib/siteImages';
import { useSiteImages } from '../context/SiteImagesContext';
import { updateSiteImage, resetSiteImage } from '../services/api';
import { Image as ImageIcon, Upload, RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

function validateFile(file) {
  if (!file) return 'No file selected.';
  if (file.size > MAX_BYTES) return 'Image must be less than 5 MB.';
  if (!ALLOWED.includes(file.type)) return 'Only JPG, PNG, and WebP images are allowed.';
  return null;
}

export default function AdminSiteImages({ currentPage, setCurrentPage, currentUser, onLogout }) {
  const { getImage, images, setImage, clearImage, reload } = useSiteImages();
  const [busyKey, setBusyKey] = useState(null);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const inputs = useRef({});

  const handleUpload = async (key, file) => {
    const invalid = validateFile(file);
    if (invalid) {
      setErrors((prev) => ({ ...prev, [key]: invalid }));
      return;
    }
    setErrors((prev) => ({ ...prev, [key]: null }));
    setBusyKey(key);
    setNotice(null);
    try {
      const row = await updateSiteImage(key, file);
      if (row?.image) setImage(key, row.image);
      else await reload();
      setNotice({ type: 'success', message: 'Image updated.' });
    } catch (err) {
      setErrors((prev) => ({ ...prev, [key]: err.message || 'Upload failed.' }));
    } finally {
      setBusyKey(null);
    }
  };

  const handleReset = async (key) => {
    if (!window.confirm('Restore the original image? This removes your uploaded version.')) return;
    setBusyKey(key);
    setNotice(null);
    try {
      await resetSiteImage(key);
      clearImage(key);
      setNotice({ type: 'success', message: 'Original image restored.' });
    } catch (err) {
      setErrors((prev) => ({ ...prev, [key]: err.message || 'Could not restore.' }));
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen flex flex-col md:flex-row antialiased">
      <Navbar2 currentPage={currentPage} setCurrentPage={setCurrentPage} currentUser={currentUser} onLogout={onLogout} />

      <main className="flex-1 p-6 md:p-12 overflow-y-auto mb-20 md:mb-0">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b-2 border-primary text-left">
            <div>
              <h2 className="font-syne text-3xl font-black text-primary uppercase">Site Images</h2>
              <p className="font-work text-sm text-on-surface-variant font-medium mt-1">
                Replace any picture shown across the website. Upload straight from your device — changes go live immediately.
              </p>
            </div>
            <button
              onClick={reload}
              className="bg-secondary text-white font-space font-black text-xs uppercase tracking-widest px-5 py-3 border-2 border-primary shadow-[4px_4px_0px_#162c1c] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {notice && (
            <div className={`flex items-center gap-2 border-2 rounded px-4 py-3 font-medium text-sm ${
              notice.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <CheckCircle className="w-4 h-4 shrink-0" />
              {notice.message}
            </div>
          )}

          {SITE_IMAGE_SECTIONS.map((section) => (
            <section key={section.id} className="space-y-4">
              <div className="text-left">
                <h3 className="font-syne font-black text-xl text-primary uppercase">{section.title}</h3>
                <p className="font-work text-xs text-on-surface-variant font-medium mt-0.5">{section.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {section.images.map((slot) => {
                  const src = getImage(slot.key);
                  const overridden = Boolean(images[slot.key]);
                  const busy = busyKey === slot.key;
                  return (
                    <article key={slot.key} className="bg-white border-2 border-primary shadow-[5px_5px_0px_#162c1c] rounded overflow-hidden flex flex-col text-left">
                      <div className="relative h-48 bg-primary-container border-b-2 border-primary">
                        {src ? (
                          <img src={src} alt={slot.label} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-on-primary">
                            <ImageIcon className="w-10 h-10" />
                          </div>
                        )}
                        {overridden && (
                          <span className="absolute top-2 right-2 bg-emerald-100 text-emerald-800 border border-emerald-300 font-space font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                            Custom
                          </span>
                        )}
                        {busy && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="font-space font-black text-xs text-white uppercase tracking-widest animate-pulse">Saving...</span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex-grow flex flex-col gap-3">
                        <div>
                          <h4 className="font-syne font-black text-sm text-primary leading-tight">{slot.label}</h4>
                          <p className="font-work text-[11px] text-on-surface-variant font-medium mt-0.5">{slot.hint}</p>
                        </div>

                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                          className="hidden"
                          ref={(el) => { inputs.current[slot.key] = el; }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            e.target.value = '';
                            if (file) handleUpload(slot.key, file);
                          }}
                        />

                        {errors[slot.key] && (
                          <div className="flex items-center gap-1.5 text-red-600 font-work text-[11px] font-medium">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            {errors[slot.key]}
                          </div>
                        )}

                        <div className="mt-auto flex items-center gap-2">
                          <button
                            onClick={() => inputs.current[slot.key]?.click()}
                            disabled={busy}
                            className="flex-1 bg-secondary text-white font-space font-black text-[10px] uppercase tracking-wider px-3 py-2.5 border-2 border-primary shadow-[2px_2px_0px_#162c1c] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            Upload
                          </button>
                          {overridden && (
                            <button
                              onClick={() => handleReset(slot.key)}
                              disabled={busy}
                              title="Restore original"
                              className="px-3 py-2.5 border-2 border-primary/30 text-on-surface-variant hover:border-primary hover:text-primary transition-colors font-space font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}

          <p className="font-work text-xs text-on-surface-variant font-medium text-center pb-10">
            Trip covers &amp; galleries are edited from <strong>Trips</strong>; product photos from <strong>Store Products</strong>.
          </p>
        </div>
      </main>
    </div>
  );
}
