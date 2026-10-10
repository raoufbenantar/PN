-- Booking fix: the client inserts an inquiry with INSERT ... RETURNING
-- (.insert(...).select().single()). A new row has status 'new', which the old
-- SELECT policy did not cover, so Postgres rejected the RETURNING with
-- "new row violates row-level security policy for table pn_inquiries".
-- Users can now read their own inquiries (any status); My Ticket still works
-- because bookings are stored with the signed-in user's email.
-- The previous rule also let any authenticated user read ANY confirmed inquiry
-- (name/phone/selfie) — that privacy leak is removed. Admins keep full access
-- via pn_admin_all_inq.
DROP POLICY IF EXISTS "pn_inq_ticket_read" ON public.pn_inquiries;

CREATE POLICY "pn_inq_ticket_read" ON public.pn_inquiries
  FOR SELECT TO authenticated
  USING (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
