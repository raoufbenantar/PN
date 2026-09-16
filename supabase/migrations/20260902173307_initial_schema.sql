-- =============================================================
-- Project Nature — Full Schema Snapshot
-- Generated from live Supabase project icxcsjcmpipbtwzydzks
-- =============================================================

-- ─────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────
CREATE TYPE public.order_status AS ENUM (
  'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
);

-- ─────────────────────────────────────────────
-- TABLES — Legacy (Django-era, kept for compatibility)
-- ─────────────────────────────────────────────
CREATE TABLE public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT,
  phone      TEXT,
  wilaya     TEXT,
  is_admin   BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.categories (
  id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  image_url   TEXT,
  description TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.products (
  id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  price         INTEGER NOT NULL,
  compare_price INTEGER,
  image_url     TEXT,
  images        TEXT[],
  category_id   INTEGER REFERENCES public.categories(id),
  stock         INTEGER DEFAULT 0,
  sku           TEXT,
  featured      BOOLEAN DEFAULT false,
  active        BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.orders (
  id               INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id          UUID REFERENCES public.profiles(id),
  status           public.order_status DEFAULT 'pending',
  full_name        TEXT NOT NULL,
  phone            TEXT NOT NULL,
  wilaya           TEXT NOT NULL,
  address          TEXT,
  notes            TEXT,
  total_amount     INTEGER NOT NULL,
  idempotency_key  TEXT,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.order_items (
  id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id     INTEGER REFERENCES public.orders(id),
  product_id   INTEGER REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  price        INTEGER NOT NULL,
  quantity     INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE public.cart_items (
  id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    UUID REFERENCES public.profiles(id),
  product_id INTEGER REFERENCES public.products(id),
  quantity   INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- ─────────────────────────────────────────────
-- TABLES — PN Native (Supabase-first)
-- ─────────────────────────────────────────────
CREATE TABLE public.pn_expeditions (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title          VARCHAR NOT NULL,
  slug           VARCHAR NOT NULL UNIQUE,
  description    TEXT NOT NULL,
  category       VARCHAR NOT NULL CHECK (category IN ('expedition','trekking','bivouac','camping','photography','wildlife','cultural')),
  difficulty     VARCHAR NOT NULL CHECK (difficulty IN ('easy','moderate','difficult','expert')),
  duration_days  INTEGER NOT NULL DEFAULT 0 CHECK (duration_days >= 0),
  price_dzd      NUMERIC NOT NULL DEFAULT 0,
  location       VARCHAR NOT NULL DEFAULT '',
  latitude       NUMERIC,
  longitude      NUMERIC,
  start_date     DATE,
  cover_image    TEXT,
  is_published   BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.pn_expedition_images (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  expedition_id BIGINT NOT NULL REFERENCES public.pn_expeditions(id) ON DELETE CASCADE,
  image         TEXT NOT NULL,
  caption       VARCHAR,
  "order"      INTEGER NOT NULL DEFAULT 0 CHECK ("order" >= 0)
);

CREATE TABLE public.pn_products (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name         VARCHAR NOT NULL,
  slug         VARCHAR NOT NULL UNIQUE,
  description  TEXT NOT NULL DEFAULT '',
  price        NUMERIC NOT NULL DEFAULT 0,
  category     VARCHAR NOT NULL CHECK (category IN ('t-shirt','hoodie','cap')),
  cover_image  TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.pn_product_images (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES public.pn_products(id) ON DELETE CASCADE,
  image      TEXT NOT NULL,
  caption    VARCHAR,
  "order"   INTEGER NOT NULL DEFAULT 0 CHECK ("order" >= 0)
);

CREATE TABLE public.pn_product_variants (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES public.pn_products(id) ON DELETE CASCADE,
  size       VARCHAR NOT NULL CHECK (size IN ('xs','s','m','l','xl','xxl')),
  color      VARCHAR NOT NULL DEFAULT '',
  stock      INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  UNIQUE(product_id, size, color)
);

CREATE TABLE public.pn_orders (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name        VARCHAR NOT NULL,
  phone_number     VARCHAR NOT NULL,
  delivery_address TEXT NOT NULL,
  status           VARCHAR NOT NULL DEFAULT 'new' CHECK (status IN ('new','confirmed','cancelled')),
  stock_restored   BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.pn_order_items (
  id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id            BIGINT NOT NULL REFERENCES public.pn_orders(id) ON DELETE CASCADE,
  variant_id          BIGINT NOT NULL REFERENCES public.pn_product_variants(id),
  quantity            INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_snapshot NUMERIC NOT NULL
);

CREATE TABLE public.pn_inquiries (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name          VARCHAR NOT NULL,
  phone         VARCHAR NOT NULL DEFAULT '',
  email         VARCHAR NOT NULL DEFAULT '',
  message       TEXT NOT NULL DEFAULT '',
  expedition_id BIGINT REFERENCES public.pn_expeditions(id),
  selfie        TEXT,
  status        VARCHAR NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','confirmed','cancelled')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.pn_newsletter_subscriptions (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email      VARCHAR NOT NULL UNIQUE,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- FUNCTIONS
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  );
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_stock(p_product_id INTEGER, p_qty INTEGER)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.products
  SET stock = stock - p_qty
  WHERE id = p_product_id AND stock >= p_qty;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'insufficient stock for product %', p_product_id;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS TABLE(
  total_orders bigint, total_revenue bigint, pending_orders bigint,
  total_products bigint, confirmed_orders bigint, shipped_orders bigint,
  delivered_orders bigint, cancelled_orders bigint
)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  RETURN QUERY
  SELECT
    (SELECT count(*) FROM public.orders),
    (SELECT COALESCE(sum(total_amount), 0) FROM public.orders WHERE status != 'cancelled'),
    (SELECT count(*) FROM public.orders WHERE status = 'pending'),
    (SELECT count(*) FROM public.products),
    (SELECT count(*) FROM public.orders WHERE status = 'confirmed'),
    (SELECT count(*) FROM public.orders WHERE status = 'shipped'),
    (SELECT count(*) FROM public.orders WHERE status = 'delivered'),
    (SELECT count(*) FROM public.orders WHERE status = 'cancelled');
END;
$$;

CREATE OR REPLACE FUNCTION public.pn_touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.pn_create_order(
  p_full_name VARCHAR,
  p_phone VARCHAR,
  p_address TEXT,
  p_items JSONB
) RETURNS BIGINT
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_order_id BIGINT;
  r JSONB;
  v_variant_id BIGINT;
  v_qty INT;
  v_price NUMERIC;
  v_stock INT;
BEGIN
  IF p_full_name IS NULL OR length(trim(p_full_name)) < 2 THEN RAISE EXCEPTION 'full_name required'; END IF;
  IF p_phone IS NULL OR length(trim(p_phone)) < 6 THEN RAISE EXCEPTION 'phone required'; END IF;
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN RAISE EXCEPTION 'items required'; END IF;

  INSERT INTO public.pn_orders (full_name, phone_number, delivery_address, status)
  VALUES (p_full_name, p_phone, p_address, 'new')
  RETURNING id INTO v_order_id;

  FOR r IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_variant_id := (r->>'variant_id')::bigint;
    v_qty := (r->>'quantity')::int;
    IF v_qty IS NULL OR v_qty <= 0 THEN RAISE EXCEPTION 'invalid quantity'; END IF;

    SELECT price INTO v_price
    FROM public.pn_products p
    JOIN public.pn_product_variants v ON v.product_id = p.id
    WHERE v.id = v_variant_id;

    SELECT stock INTO v_stock
    FROM public.pn_product_variants WHERE id = v_variant_id FOR UPDATE;

    IF NOT FOUND THEN RAISE EXCEPTION 'variant % not found', v_variant_id; END IF;
    IF v_stock < v_qty THEN RAISE EXCEPTION 'insufficient stock for variant %', v_variant_id; END IF;
    IF v_price IS NULL THEN SELECT 0 INTO v_price; END IF;

    INSERT INTO public.pn_order_items (order_id, variant_id, quantity, unit_price_snapshot)
    VALUES (v_order_id, v_variant_id, v_qty, v_price);

    UPDATE public.pn_product_variants SET stock = stock - v_qty WHERE id = v_variant_id;
  END LOOP;

  RETURN v_order_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.pn_cancel_order(p_order_id BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE it RECORD;
BEGIN
  UPDATE public.pn_orders
  SET status = 'cancelled', stock_restored = true, updated_at = now()
  WHERE id = p_order_id AND stock_restored = false;

  IF NOT FOUND THEN RETURN false; END IF;

  FOR it IN SELECT variant_id, quantity FROM public.pn_order_items WHERE order_id = p_order_id LOOP
    UPDATE public.pn_product_variants SET stock = stock + it.quantity WHERE id = it.variant_id;
  END LOOP;

  RETURN true;
END;
$$;

-- ─────────────────────────────────────────────
-- TRIGGERS
-- ─────────────────────────────────────────────
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER trg_pn_exp_touch
  BEFORE UPDATE ON public.pn_expeditions
  FOR EACH ROW EXECUTE FUNCTION public.pn_touch_updated_at();

CREATE TRIGGER trg_pn_inq_touch
  BEFORE UPDATE ON public.pn_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.pn_touch_updated_at();

CREATE TRIGGER trg_pn_prod_touch
  BEFORE UPDATE ON public.pn_products
  FOR EACH ROW EXECUTE FUNCTION public.pn_touch_updated_at();

CREATE TRIGGER trg_pn_order_touch
  BEFORE UPDATE ON public.pn_orders
  FOR EACH ROW EXECUTE FUNCTION public.pn_touch_updated_at();

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Profiles updateable" ON public.profiles FOR UPDATE USING ((auth.uid() = id) OR is_admin()) WITH CHECK ((auth.uid() = id) OR is_admin());

-- Categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Only admin can modify categories" ON public.categories FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products viewable" ON public.products FOR SELECT USING (active OR is_admin());
CREATE POLICY "Only admin can modify products" ON public.products FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Orders viewable" ON public.orders FOR SELECT USING ((auth.uid() = user_id) OR is_admin());
CREATE POLICY "Admin can update orders" ON public.orders FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

-- Order Items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Order items viewable" ON public.order_items FOR SELECT USING (
  is_admin() OR EXISTS (
    SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  )
);

-- Cart Items
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own cart" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-- PN Expeditions
ALTER TABLE public.pn_expeditions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pn_exp_pub_read" ON public.pn_expeditions FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "pn_admin_all_exp" ON public.pn_expeditions FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- PN Expedition Images
ALTER TABLE public.pn_expedition_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pn_expimg_pub_read" ON public.pn_expedition_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "pn_admin_all_expimg" ON public.pn_expedition_images FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- PN Products
ALTER TABLE public.pn_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pn_prod_pub_read" ON public.pn_products FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "pn_admin_all_prod" ON public.pn_products FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- PN Product Images
ALTER TABLE public.pn_product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pn_pimg_pub_read" ON public.pn_product_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "pn_admin_all_pimg" ON public.pn_product_images FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- PN Product Variants
ALTER TABLE public.pn_product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pn_pvar_pub_read" ON public.pn_product_variants FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "pn_admin_all_pvar" ON public.pn_product_variants FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- PN Orders
ALTER TABLE public.pn_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pn_order_insert" ON public.pn_orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "pn_admin_all_orders" ON public.pn_orders FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- PN Order Items
ALTER TABLE public.pn_order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pn_oitem_insert" ON public.pn_order_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "pn_admin_all_oitems" ON public.pn_order_items FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- PN Inquiries
ALTER TABLE public.pn_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pn_inq_insert" ON public.pn_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "pn_inq_ticket_read" ON public.pn_inquiries FOR SELECT TO authenticated
  USING ((status)::text = 'confirmed'::text);
CREATE POLICY "pn_admin_all_inq" ON public.pn_inquiries FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- PN Newsletter Subscriptions
ALTER TABLE public.pn_newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pn_news_insert" ON public.pn_newsletter_subscriptions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "pn_admin_all_news" ON public.pn_newsletter_subscriptions FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ─────────────────────────────────────────────
-- STORAGE BUCKETS
-- ─────────────────────────────────────────────
INSERT INTO storage.buckets (id, name) VALUES
  ('pn-expedition-covers', 'pn-expedition-covers'),
  ('pn-expedition-gallery', 'pn-expedition-gallery'),
  ('pn-inquiry-selfies', 'pn-inquiry-selfies'),
  ('pn-product-images', 'pn-product-images');

-- Storage policies
CREATE POLICY "pn_storage_pub_read" ON storage.objects
  FOR SELECT USING (bucket_id IN ('pn-expedition-covers','pn-expedition-gallery','pn-product-images'));

CREATE POLICY "pn_storage_pub_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id IN ('pn-expedition-covers','pn-expedition-gallery','pn-inquiry-selfies','pn-product-images'));

CREATE POLICY "pn_storage_pub_update" ON storage.objects
  FOR UPDATE USING (bucket_id IN ('pn-expedition-covers','pn-expedition-gallery','pn-inquiry-selfies','pn-product-images'))
  WITH CHECK (bucket_id IN ('pn-expedition-covers','pn-expedition-gallery','pn-inquiry-selfies','pn-product-images'));

CREATE POLICY "pn_storage_admin_all" ON storage.objects FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "pn_storage_selfie_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'pn-inquiry-selfies');
