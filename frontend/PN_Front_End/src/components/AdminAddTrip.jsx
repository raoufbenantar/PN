import { useState, useRef } from 'react';
import Navbar2 from './Navbar2';
import { createExpedition, mapExpeditionToTrip } from '../services/api';

export default function AdminAddTrip({
  currentPage,
  setCurrentPage,
  currentUser,
  onLogout,
  onAddTrip,
}) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('moderate');
  const [category, setCategory] = useState('expedition');
  const [price, setPrice] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [location, setLocation] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isPublished, setIsPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5 MB.');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert('Only JPG, PNG, and WebP images are allowed.');
        return;
      }
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !startDate || !description || !location || !durationDays) {
      alert('Please fill in all required fields.');
      return;
    }

    const priceNum = parseFloat(price) || (difficulty === 'easy' ? 12000 : difficulty === 'moderate' ? 22000 : 35000);
    const diffDays = parseInt(durationDays, 10);

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('difficulty', difficulty);
      formData.append('duration_days', diffDays);
      formData.append('price_dzd', priceNum.toFixed(2));
      formData.append('location', location);
      formData.append('start_date', startDate);
      formData.append('is_published', isPublished ? 'true' : 'false');
      if (coverImage) {
        formData.append('cover_image', coverImage);
      }

      const result = await createExpedition(formData);
      if (onAddTrip && result) {
        onAddTrip(mapExpeditionToTrip(result));
      }
      alert('Expedition created successfully!');
      setCurrentPage('admin-trips');
    } catch (err) {
      alert(`Failed to create expedition: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen flex flex-col md:flex-row antialiased">
      <Navbar2
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <main className="flex-grow p-6 md:p-12 overflow-y-auto mb-20 md:mb-0">
        <div className="max-w-4xl mx-auto space-y-8 text-left">
          
          <header className="flex justify-between items-end mb-8 border-b-2 border-primary/20 pb-4">
            <div>
              <h2 className="font-syne text-3xl font-black text-primary uppercase">New Expedition</h2>
              <p className="font-work text-sm text-on-surface-variant max-w-xl mt-1">Draft a new path for the adventurous. Ensure all technical details are accurate.</p>
            </div>
            <div className="hidden md:block">
              <span className="font-space font-black text-[10px] border-2 border-primary px-4 py-2 text-primary uppercase tracking-widest bg-white">DRAFT STATUS: READY</span>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            <section className="bg-orange-50/50 p-6 md:p-8 border-2 border-primary card-offset rounded-xl">
              <h3 className="font-space font-black text-xs text-primary mb-6 border-b-2 border-primary pb-2 inline-block uppercase tracking-widest">01. TRIP IDENTITY</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block font-space font-black text-[11px] text-primary mb-2 uppercase tracking-widest">Trip Title *</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-white border-2 border-primary px-4 py-3 focus:outline-none focus:ring-0 focus:border-secondary outline-none font-medium text-sm rounded shadow-[2px_2px_0px_#162c1c]"
                    placeholder="e.g. Crossing the Tassili Ridge"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block font-space font-black text-[11px] text-primary mb-2 uppercase tracking-widest">Start Date *</label>
                  <input
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full bg-white border-2 border-primary px-4 py-3 focus:outline-none focus:ring-0 focus:border-secondary outline-none font-medium text-sm rounded shadow-[2px_2px_0px_#162c1c]"
                    type="date"
                  />
                </div>
                <div>
                  <label className="block font-space font-black text-[11px] text-primary mb-2 uppercase tracking-widest">Location *</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="w-full bg-white border-2 border-primary px-4 py-3 focus:outline-none focus:ring-0 focus:border-secondary outline-none font-medium text-sm rounded shadow-[2px_2px_0px_#162c1c]"
                    placeholder="e.g. Tassili n'Ajjer, Algeria"
                    type="text"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white p-6 md:p-8 border-2 border-primary card-offset rounded-xl">
              <h3 className="font-space font-black text-xs text-primary mb-6 border-b-2 border-primary pb-2 inline-block uppercase tracking-widest">02. NARRATIVE &amp; LOGISTICS</h3>
              <div className="space-y-6">
                <div>
                  <label className="block font-space font-black text-[11px] text-primary mb-2 uppercase tracking-widest">Expedition Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full bg-white border-2 border-primary px-4 py-3 focus:outline-none focus:ring-0 focus:border-secondary outline-none font-medium text-sm rounded shadow-[2px_2px_0px_#162c1c]"
                    placeholder="Describe the terrain, the biological diversity, and the sensory experience..."
                    rows="4"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block font-space font-black text-[11px] text-primary mb-2 uppercase tracking-widest">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white border-2 border-primary px-4 py-3 focus:outline-none focus:ring-0 focus:border-secondary outline-none font-medium text-sm rounded shadow-[2px_2px_0px_#162c1c]"
                    >
                      <option value="expedition">Expedition</option>
                      <option value="trekking">Trekking</option>
                      <option value="bivouac">Bivouac</option>
                      <option value="camping">Camping</option>
                      <option value="photography">Photography</option>
                      <option value="wildlife">Wildlife</option>
                      <option value="cultural">Cultural</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-space font-black text-[11px] text-primary mb-2 uppercase tracking-widest">Difficulty Level</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full bg-white border-2 border-primary px-4 py-3 focus:outline-none focus:ring-0 focus:border-secondary outline-none font-medium text-sm rounded shadow-[2px_2px_0px_#162c1c]"
                    >
                      <option value="easy">Easy — Guided Strolls</option>
                      <option value="moderate">Moderate — Steady Ascent</option>
                      <option value="difficult">Difficult — Technical Terrain</option>
                      <option value="expert">Expert — Extreme</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-space font-black text-[11px] text-primary mb-2 uppercase tracking-widest">Duration (Days) *</label>
                    <input
                      value={durationDays}
                      onChange={(e) => setDurationDays(e.target.value)}
                      required
                      className="w-full bg-white border-2 border-primary px-4 py-3 focus:outline-none focus:ring-0 focus:border-secondary outline-none font-medium text-sm rounded shadow-[2px_2px_0px_#162c1c]"
                      placeholder="e.g. 5"
                      type="number"
                      min="1"
                      max="60"
                    />
                  </div>

                  <div>
                    <label className="block font-space font-black text-[11px] text-primary mb-2 uppercase tracking-widest">Price (DZD)</label>
                    <input
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-white border-2 border-primary px-4 py-3 focus:outline-none focus:ring-0 focus:border-secondary outline-none font-medium text-sm rounded shadow-[2px_2px_0px_#162c1c]"
                      placeholder="e.g. 22000"
                      type="number"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-slate-100/50 p-6 md:p-8 border-2 border-primary card-offset rounded-xl">
              <h3 className="font-space font-black text-xs text-primary mb-4 border-b-2 border-primary pb-2 inline-block uppercase tracking-widest">03. COVER IMAGE</h3>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
              />

              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative border-2 border-primary rounded-lg overflow-hidden">
                    <img src={imagePreview} alt="Cover preview" className="w-full h-64 object-cover" />
                    <button
                      type="button"
                      onClick={() => { setCoverImage(null); setImagePreview(null); fileInputRef.current.value = ''; }}
                      className="absolute top-2 right-2 bg-secondary text-white font-space font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded cursor-pointer hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-[10px] text-on-surface-variant">{coverImage?.name} ({(coverImage?.size / 1024 / 1024).toFixed(2)} MB)</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="w-full border-2 border-dashed border-primary/50 p-8 text-center bg-white rounded-lg cursor-pointer hover:border-secondary hover:bg-orange-50/50 transition-colors"
                >
                  <span className="material-symbols-outlined text-primary text-4xl mb-2">cloud_upload</span>
                  <p className="font-space font-black text-xs text-primary">Click to upload a cover image</p>
                  <p className="text-[10px] text-on-surface-variant mt-1">JPG, PNG, or WebP — max 5 MB</p>
                </button>
              )}

              <div className="flex items-center gap-3 mt-4 p-3 bg-white border-2 border-primary rounded">
                <input
                  type="checkbox"
                  id="publish-toggle"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 accent-secondary cursor-pointer"
                />
                <label htmlFor="publish-toggle" className="font-space font-black text-xs text-primary uppercase tracking-widest cursor-pointer">
                  Publish immediately (visible to public)
                </label>
              </div>
            </section>

            <footer className="flex flex-col sm:flex-row items-center gap-4 pt-4 pb-12">
              <button
                type="submit"
                disabled={submitting}
                className={`bg-secondary text-white font-space font-black text-xs uppercase tracking-widest px-10 py-4 btn-shadow w-full sm:w-auto cursor-pointer focus:outline-none transition-all rounded ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {submitting ? 'Creating...' : 'Create Expedition'}
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage('admin-trips')}
                className="font-space font-black text-xs text-primary hover:underline uppercase tracking-widest py-2 cursor-pointer focus:outline-none"
              >
                Discard Draft
              </button>
            </footer>

          </form>

        </div>
      </main>
    </div>
  );
}
