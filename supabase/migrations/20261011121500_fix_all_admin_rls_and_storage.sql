-- =============================================================
-- Project Nature — Comprehensive Admin RLS & Storage Permissions
-- Enables admin operations for site images, products, expeditions,
-- and storage buckets based on profiles.is_admin or app_metadata.
-- =============================================================

-- 1. Helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_pn_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
    OR coalesce((auth.jwt() -> 'user_metadata' ->> 'role'), '') = 'admin'
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

GRANT EXECUTE ON FUNCTION public.is_pn_admin() TO authenticated;

-- 2. Sync existing admin profiles to raw_app_meta_data
UPDATE auth.users u
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
FROM public.profiles p
WHERE u.id = p.id AND p.is_admin = true;

-- 3. Fix pn_site_images RLS policies
DROP POLICY IF EXISTS "pn_admin_all_site_img" ON public.pn_site_images;
CREATE POLICY "pn_admin_all_site_img" ON public.pn_site_images
  FOR ALL TO authenticated
  USING (public.is_pn_admin())
  WITH CHECK (public.is_pn_admin());

-- 4. Fix pn_expeditions RLS policies
DROP POLICY IF EXISTS "pn_exp_admin_all" ON public.pn_expeditions;
DROP POLICY IF EXISTS "pn_admin_all_exp" ON public.pn_expeditions;
CREATE POLICY "pn_admin_all_exp" ON public.pn_expeditions
  FOR ALL TO authenticated
  USING (public.is_pn_admin())
  WITH CHECK (public.is_pn_admin());

-- 5. Fix pn_expedition_images RLS policies
DROP POLICY IF EXISTS "pn_admin_all_expimg" ON public.pn_expedition_images;
CREATE POLICY "pn_admin_all_expimg" ON public.pn_expedition_images
  FOR ALL TO authenticated
  USING (public.is_pn_admin())
  WITH CHECK (public.is_pn_admin());

-- 6. Fix pn_inquiries RLS policies
DROP POLICY IF EXISTS "pn_admin_all_inq" ON public.pn_inquiries;
CREATE POLICY "pn_admin_all_inq" ON public.pn_inquiries
  FOR ALL TO authenticated
  USING (public.is_pn_admin())
  WITH CHECK (public.is_pn_admin());

-- 7. Fix pn_products, pn_product_images, pn_product_variants, pn_orders, pn_order_items RLS policies
DROP POLICY IF EXISTS "pn_admin_all_prod" ON public.pn_products;
CREATE POLICY "pn_admin_all_prod" ON public.pn_products
  FOR ALL TO authenticated
  USING (public.is_pn_admin())
  WITH CHECK (public.is_pn_admin());

DROP POLICY IF EXISTS "pn_admin_all_pimg" ON public.pn_product_images;
CREATE POLICY "pn_admin_all_pimg" ON public.pn_product_images
  FOR ALL TO authenticated
  USING (public.is_pn_admin())
  WITH CHECK (public.is_pn_admin());

DROP POLICY IF EXISTS "pn_admin_all_pvar" ON public.pn_product_variants;
CREATE POLICY "pn_admin_all_pvar" ON public.pn_product_variants
  FOR ALL TO authenticated
  USING (public.is_pn_admin())
  WITH CHECK (public.is_pn_admin());

DROP POLICY IF EXISTS "pn_admin_all_orders" ON public.pn_orders;
CREATE POLICY "pn_admin_all_orders" ON public.pn_orders
  FOR ALL TO authenticated
  USING (public.is_pn_admin())
  WITH CHECK (public.is_pn_admin());

DROP POLICY IF EXISTS "pn_admin_all_oitems" ON public.pn_order_items;
CREATE POLICY "pn_admin_all_oitems" ON public.pn_order_items
  FOR ALL TO authenticated
  USING (public.is_pn_admin())
  WITH CHECK (public.is_pn_admin());

-- 8. Fix Storage objects policies for admin writes across all PN buckets
DROP POLICY IF EXISTS "pn_site_img_storage_admin_write" ON storage.objects;
CREATE POLICY "pn_site_img_storage_admin_write" ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id = 'pn-site-images' AND public.is_pn_admin()
  )
  WITH CHECK (
    bucket_id = 'pn-site-images' AND public.is_pn_admin()
  );

DROP POLICY IF EXISTS "pn_storage_admin_all" ON storage.objects;
CREATE POLICY "pn_storage_admin_all" ON storage.objects
  FOR ALL TO authenticated
  USING (
    public.is_pn_admin()
  )
  WITH CHECK (
    public.is_pn_admin()
  );
