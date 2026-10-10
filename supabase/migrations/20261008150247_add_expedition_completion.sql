-- Supports admin "Mark Completed" persistence: the frontend updates
-- pn_expeditions.is_completed and completed trips reject new bookings.
ALTER TABLE public.pn_expeditions
  ADD COLUMN IF NOT EXISTS is_completed BOOLEAN NOT NULL DEFAULT false;
