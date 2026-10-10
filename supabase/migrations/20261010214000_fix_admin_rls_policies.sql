-- Sync admin role to auth.users raw_app_meta_data for all profile admins
UPDATE auth.users u
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
FROM public.profiles p
WHERE u.id = p.id AND p.is_admin = true;

-- Trigger to automatically sync is_admin from profiles to auth.users raw_app_meta_data
CREATE OR REPLACE FUNCTION public.sync_profile_admin_role()
RETURNS trigger AS $$
BEGIN
  IF NEW.is_admin = true THEN
    UPDATE auth.users
    SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_admin_sync ON public.profiles;
CREATE TRIGGER on_profile_admin_sync
  AFTER INSERT OR UPDATE OF is_admin ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_admin_role();

-- Fix pn_inquiries admin policy to check profiles as well
DROP POLICY IF EXISTS "pn_admin_all_inq" ON public.pn_inquiries;
CREATE POLICY "pn_admin_all_inq" ON public.pn_inquiries FOR ALL TO authenticated
  USING (
    ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Fix pn_expeditions admin policy
DROP POLICY IF EXISTS "pn_exp_admin_all" ON public.pn_expeditions;
CREATE POLICY "pn_exp_admin_all" ON public.pn_expeditions FOR ALL TO authenticated
  USING (
    ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );
