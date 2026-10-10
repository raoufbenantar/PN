/**
 * Supabase API layer for Project Nature (phase-1).
 * Mirrors src/services/api.js export names, backed by pn_* tables + auth + RPC.
 * Django JWT/localStorage flow is replaced by supabase.auth session.
 */
import { supabase } from '../lib/supabaseClient.js';

// ─── Auth (Supabase Auth; Django hashes require password reset) ──

export async function loginUser(email, password) {
  let { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error && /email not confirmed/i.test(error.message || '')) {
    try {
      const { data: suData, error: suErr } = await supabase.auth.signUp({ email, password });
      if (!suErr && suData?.session) {
        data = suData;
        error = null;
      } else {
        const retry = await supabase.auth.signInWithPassword({ email, password });
        if (!retry.error && retry.data?.session) {
          data = retry.data;
          error = null;
        }
      }
    } catch {
      // retain error
    }
  }
  if (error) throw error;
  return data;
}

export async function registerUser({ email, password, ...meta }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: meta },
  });
  if (error) {
    if (/already|registered|exists|deja/i.test(error.message || '')) {
      throw new Error('mail address deja exist');
    }
    throw error;
  }
  if (data?.user?.identities && data.user.identities.length === 0) {
    throw new Error('mail address deja exist');
  }
  if (data?.user?.created_at) {
    const createdAtMs = new Date(data.user.created_at).getTime();
    if (Date.now() - createdAtMs > 15000) {
      throw new Error('mail address deja exist');
    }
  }
  return data;
}

export async function fetchCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data?.user) return null;
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin, role, full_name, phone')
      .eq('id', data.user.id)
      .maybeSingle();
    const isAdmin = Boolean(profile?.is_admin === true || profile?.role === 'admin' || data.user.app_metadata?.role === 'admin');
    return {
      ...data.user,
      profile,
      is_staff: isAdmin,
      app_metadata: {
        ...data.user.app_metadata,
        role: isAdmin ? 'admin' : (data.user.app_metadata?.role || 'user'),
      },
    };
  } catch {
    return data.user;
  }
}

export async function changePassword(newPassword) {
  // TODO(phase-2): wire to actual ChangePasswordPage (Supabase updateUser).
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
  return data;
}

export function getToken() {
  // Compat shim: Supabase stores its own session; no manual JWT handling.
  return null;
}
export function setToken() {}
export function removeToken() {
  return supabase.auth.signOut();
}

// ─── Newsletter ─────────────────────────────────────────────────

export async function subscribeNewsletter(email) {
  const { data, error } = await supabase
    .from('pn_newsletter_subscriptions')
    .insert({ email })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Expeditions (public read: is_published only) ───────────────

export async function fetchExpeditions(params = {}) {
  let q = supabase
    .from('pn_expeditions')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });
  if (params.category) q = q.eq('category', params.category);
  if (params.limit || params.page_size) q = q.limit(params.limit || params.page_size);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function fetchExpeditionBySlug(slug) {
  const { data, error } = await supabase
    .from('pn_expeditions')
    .select('*, pn_expedition_images(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  if (error) throw error;
  return data;
}

export async function createExpedition() {
  // TODO(phase-2): admin write via authenticated client with app_metadata role=admin.
  throw new Error('createExpedition: admin write not wired in phase-1');
}

// ─── Inquiries ──────────────────────────────────────────────────

export async function createInquiry(data, selfieFile) {
  let selfiePath = null;
  if (selfieFile) {
    const ext = (selfieFile.name?.split('.').pop() || 'jpg').replace(/[^a-z0-9]/gi, '').toLowerCase() || 'jpg';
    selfiePath = `selfies/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from('pn-inquiry-selfies')
      .upload(selfiePath, selfieFile, { contentType: selfieFile.type || 'image/jpeg', upsert: false });
    if (upErr) throw upErr;
  }
  const payload = {
    name: data.name,
    phone: data.phone ?? '',
    email: data.email ?? '',
    message: data.message ?? '',
    expedition_id: data.expedition_id ?? data.expedition ?? null,
    selfie: selfiePath,
  };
  const { error: insErr } = await supabase
    .from('pn_inquiries')
    .insert(payload);
  if (insErr) throw insErr;

  let row = null;
  if (payload.email) {
    const { data: readData } = await supabase
      .from('pn_inquiries')
      .select('id,name,phone,email,message,expedition_id,selfie,status,created_at')
      .eq('email', payload.email)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    row = readData;
  }
  return row ?? { id: null, ...payload };
}

export async function fetchInquiryTicket(id) {
  // Mirrors Django ticket action: only confirmed inquiries resolve.
  const { data, error } = await supabase
    .from('pn_inquiries')
    .select('*, pn_expeditions(title)')
    .eq('id', id)
    .eq('status', 'confirmed')
    .single();
  if (error) throw error;
  return data;
}

export async function fetchInquiries() {
  // TODO(phase-2): admin only (requires role=admin session).
  const { data, error } = await supabase.from('pn_inquiries').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateInquiryStatus(id, status) {
  const { error } = await supabase
    .from('pn_inquiries')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
  return { id, status };
}

// ─── Store: products (public read: is_active only) ──────────────

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('pn_products')
    .select('*, pn_product_variants(*), pn_product_images(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchProductBySlug(slug) {
  const { data, error } = await supabase
    .from('pn_products')
    .select('*, pn_product_variants(*), pn_product_images(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchProductImages(productId) {
  const { data, error } = await supabase
    .from('pn_product_images')
    .select('*')
    .eq('product_id', productId)
    .order('order');
  if (error) throw error;
  return data;
}

export async function fetchProductVariants(productId) {
  const { data, error } = await supabase.from('pn_product_variants').select('*').eq('product_id', productId);
  if (error) throw error;
  return data;
}

export async function createStoreProduct() {
  throw new Error('createStoreProduct: admin write not wired in phase-1');
}
export async function updateStoreProduct() {
  throw new Error('updateStoreProduct: admin write not wired in phase-1');
}
export async function deleteStoreProduct() {
  throw new Error('deleteStoreProduct: admin write not wired in phase-1');
}
export async function createProductImage() {
  throw new Error('createProductImage: admin write not wired in phase-1');
}
export async function deleteProductImage() {
  throw new Error('deleteProductImage: admin write not wired in phase-1');
}
export async function createProductVariant() {
  throw new Error('createProductVariant: admin write not wired in phase-1');
}
export async function updateProductVariant() {
  throw new Error('updateProductVariant: admin write not wired in phase-1');
}
export async function deleteProductVariant() {
  throw new Error('deleteProductVariant: admin write not wired in phase-1');
}

// ─── Store: orders (atomic RPC replaces select_for_update) ──────

export async function createOrder({ full_name, phone_number, delivery_address, items }) {
  const { data, error } = await supabase.rpc('pn_create_order', {
    p_full_name: full_name,
    p_phone: phone_number,
    p_address: delivery_address,
    p_items: items,
  });
  if (error) throw error;
  return data;
}

export async function fetchOrders() {
  // TODO(phase-2): admin only (requires role=admin session).
  const { data, error } = await supabase.from('pn_orders').select('*, pn_order_items(*)').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id, status) {
  if (status === 'cancelled') {
    const { data, error } = await supabase.rpc('pn_cancel_order', { p_order_id: id });
    if (error) throw error;
    return data;
  }
  throw new Error('updateOrderStatus: only cancelled-via-RPC wired in phase-1');
}

// ─── Ticket/cart local helpers stay on legacy api.js for now ────
export { mapExpeditionToTrip, formatStorePrice, getCart, setCartStorage, clearCartStorage } from './api.js';
