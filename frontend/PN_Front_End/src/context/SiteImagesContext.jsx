import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { fetchSiteImages } from '../services/api';
import { SITE_IMAGE_DEFAULTS } from '../lib/siteImages';
import { isSupabaseConfigured } from '../lib/supabaseClient';

const SiteImagesContext = createContext(null);

export function SiteImagesProvider({ children }) {
  const [remote, setRemote] = useState({});
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setRemote({});
      setLoaded(true);
      return;
    }
    try {
      const rows = await fetchSiteImages();
      const map = {};
      (rows || []).forEach((row) => {
        if (row && row.key && row.image) map[row.key] = row.image;
      });
      setRemote(map);
    } catch {
      setRemote({});
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo(
    () => ({
      loaded,
      images: remote,
      getImage: (key) => remote[key] || SITE_IMAGE_DEFAULTS[key] || null,
      reload: load,
      setImage: (key, url) => setRemote((prev) => ({ ...prev, [key]: url })),
      clearImage: (key) =>
        setRemote((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        }),
    }),
    [remote, loaded, load],
  );

  return <SiteImagesContext.Provider value={value}>{children}</SiteImagesContext.Provider>;
}

export function useSiteImages() {
  const ctx = useContext(SiteImagesContext);
  if (!ctx) throw new Error('useSiteImages must be used within a SiteImagesProvider');
  return ctx;
}
