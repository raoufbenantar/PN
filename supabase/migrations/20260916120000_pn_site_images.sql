-- =============================================================
-- Project Nature — Editable Site Images
-- Adds a key/value store for the fixed pictures shown across the
-- public site (hero, services, categories, souvenirs gallery,
-- kherjat, about/team, auth backgrounds) plus the storage bucket.
-- =============================================================

-- ─────────────────────────────────────────────
-- TABLE
-- ─────────────────────────────────────────────
CREATE TABLE public.pn_site_images (
  key        TEXT PRIMARY KEY,
  image      TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_pn_site_img_touch
  BEFORE UPDATE ON public.pn_site_images
  FOR EACH ROW EXECUTE FUNCTION public.pn_touch_updated_at();

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
ALTER TABLE public.pn_site_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pn_site_img_pub_read" ON public.pn_site_images
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "pn_admin_all_site_img" ON public.pn_site_images FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ─────────────────────────────────────────────
-- STORAGE BUCKET
-- ─────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES
  ('pn-site-images', 'pn-site-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read for the new bucket (and keep the existing public buckets working).
DROP POLICY IF EXISTS "pn_site_img_storage_pub_read" ON storage.objects;
CREATE POLICY "pn_site_img_storage_pub_read" ON storage.objects
  FOR SELECT USING (
    bucket_id IN (
      'pn-expedition-covers',
      'pn-expedition-gallery',
      'pn-product-images',
      'pn-site-images'
    )
  );

-- Admin-only writes to the site images bucket (the shared
-- pn_storage_admin_all policy from the initial schema already covers admins).
DROP POLICY IF EXISTS "pn_site_img_storage_admin_write" ON storage.objects;
CREATE POLICY "pn_site_img_storage_admin_write" ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id = 'pn-site-images'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    bucket_id = 'pn-site-images'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
