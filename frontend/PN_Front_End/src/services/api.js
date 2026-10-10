/**
 * API Service Layer for Project Nature
 *
 * Supabase-backed when VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are set
 * (production on Vercel), otherwise falls back to the Django REST backend.
 * Export names, signatures, and Django-shaped return values are preserved
 * so no component changes are needed.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

const USE_SUPABASE = isSupabaseConfigured;

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

// ─── Supabase helpers ─────────────────────────────────────────────

function slugify(s) {
  return (
    (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'item'
  );
}

function publicImg(bucket, path) {
  if (!path) return null;
  if (/^(https?:|data:|blob:|\/)/.test(path)) return path;
  try {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl || path;
  } catch {
    return path;
  }
}

async function selfieUrl(path) {
  if (!path) return null;
  if (/^(https?:|data:|blob:|\/)/.test(path)) return path;
  try {
    const { data, error } = await supabase.storage
      .from('pn-inquiry-selfies')
      .createSignedUrl(path, 60 * 60 * 24 * 7);
    if (error || !data?.signedUrl) return null;
    return data.signedUrl;
  } catch {
    return null;
  }
}

function notFound(message = 'Not found') {
  const e = new Error(message);
  e.status = 404;
  return e;
}

function isFormData(v) {
  return typeof FormData !== 'undefined' && v instanceof FormData;
}

function field(data, key, dflt = '') {
  if (isFormData(data)) {
    const v = data.get(key);
    return v == null ? dflt : v;
  }
  const v = data?.[key];
  return v == null ? dflt : v;
}

function uploadExt(file, dflt = 'jpg') {
  const ext = (file?.name?.split('.').pop() || dflt).replace(/[^a-z0-9]/gi, '') || dflt;
  return ext.toLowerCase();
}

async function uploadTo(bucket, prefix, file) {
  const path = `${prefix}/${crypto.randomUUID()}.${uploadExt(file)}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type || 'image/jpeg',
    upsert: false,
  });
  if (error) throw error;
  return path;
}

function toDjangoUser(sbUser) {
  if (!sbUser) return null;
  const meta = sbUser.user_metadata || {};
  const appMeta = sbUser.app_metadata || {};
  const full = meta.name || [meta.first_name, meta.last_name].filter(Boolean).join(' ');
  const parts = (full || '').split(' ');
  const isStaff = appMeta.role === 'admin';
  return {
    id: sbUser.id,
    username: meta.username || sbUser.email,
    email: sbUser.email,
    first_name: meta.first_name || parts[0] || '',
    last_name: meta.last_name || parts.slice(1).join(' ') || '',
    is_staff: isStaff,
    role: isStaff ? 'admin' : 'user',
    name: full || meta.username || sbUser.email,
    phone: meta.phone || '',
  };
}

function toDjangoProduct(p) {
  const cover = publicImg('pn-product-images', p.cover_image);
  return {
    ...p,
    cover_image: cover,
    cover_image_url: cover,
    variants: (p.pn_product_variants || []).map((v) => ({ ...v, product: v.product_id })),
    images: (p.pn_product_images || [])
      .slice()
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((im) => ({ ...im, image: publicImg('pn-product-images', im.image) })),
  };
}

// ─── Token Management ───────────────────────────────────────────────

const TOKEN_KEY = 'project_nature_access';
const REFRESH_KEY = 'project_nature_refresh';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(access, refresh) {
  if (access) localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  if (USE_SUPABASE) supabase.auth.signOut().catch(() => {});
}

// ─── My Ticket (selfie ticket) ──────────────────────────────────────

const MY_TICKET_KEY = 'project_nature_my_inquiry_id';

export function setMyInquiryId(id) {
  localStorage.setItem(MY_TICKET_KEY, id);
}

export function getMyInquiryId() {
  return localStorage.getItem(MY_TICKET_KEY);
}

export function clearMyInquiryId() {
  localStorage.removeItem(MY_TICKET_KEY);
}

// ─── Helpers ──────────────────────────────────────────────────────

async function request(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401 && !url.includes('/token/')) {
      removeToken();
    }

    let detail;
    try {
      const body = await res.json();
      detail = body.detail || JSON.stringify(body);
    } catch {
      detail = res.statusText;
    }
    console.error(`[API] ${res.status} ${url}:`, detail);
    const err = new Error(detail);
    err.status = res.status;
    throw err;
  }

  if (res.status === 204) return null;

  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────

export async function loginUser(username, password) {
  if (USE_SUPABASE) {
    const email = String(username || '').trim();
    const pw = String(password || '').trim();
    let { data, error } = await supabase.auth.signInWithPassword({ email, password: pw });

    // If an existing account has an unconfirmed email from prior project settings,
    // re-trigger signup with the same credentials to auto-confirm and sign in seamlessly.
    if (error && /email not confirmed/i.test(error.message || '')) {
      try {
        const { data: suData, error: suErr } = await supabase.auth.signUp({ email, password: pw });
        if (!suErr && suData?.session) {
          data = suData;
          error = null;
        } else {
          const retry = await supabase.auth.signInWithPassword({ email, password: pw });
          if (!retry.error && retry.data?.session) {
            data = retry.data;
            error = null;
          }
        }
      } catch {
        // retain original error if recovery fails
      }
    }

    if (error) throw error;
    return {
      access: data.session?.access_token,
      refresh: data.session?.refresh_token,
      user: toDjangoUser(data.user),
    };
  }
  const data = await request(`${API_BASE}/token/`, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  setToken(data.access, data.refresh);
  return data;
}

export async function registerUser(userData) {
  if (USE_SUPABASE) {
    const email = String(userData.email || '').trim();
    const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
    const { data, error } = await supabase.auth.signUp({
      email,
      password: userData.password,
      options: {
        data: {
          name: fullName,
          username: userData.username || userData.email,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          phone: userData.phone || '',
        },
      },
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
    let session = data.session;
    if (!session) {
      try {
        const { data: loginData } = await supabase.auth.signInWithPassword({
          email,
          password: userData.password,
        });
        session = loginData?.session || null;
      } catch {
        // fallback
      }
    }
    return {
      user: toDjangoUser(data.user) || { username: userData.username || userData.email, email: userData.email, name: fullName, phone: userData.phone },
      session,
    };
  }
  const data = await request(`${API_BASE}/register/`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  setToken(data.access, data.refresh);
  return data;
}

export async function fetchCurrentUser() {
  if (USE_SUPABASE) {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (!data.user) {
      const e = new Error('Not authenticated');
      e.status = 401;
      throw e;
    }
    return toDjangoUser(data.user);
  }
  return request(`${API_BASE}/me/`);
}


// ─── Change Password ──────────────────────────────────────────────

export async function changePassword(oldPassword, newPassword, confirmPassword) {
  if (USE_SUPABASE) {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return data;
  }
  return request(`${API_BASE}/auth/change-password/`, {
    method: 'POST',
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword, confirm_password: confirmPassword }),
  });
}

// ─── Newsletter ─────────────────────────────────────────────────

export async function subscribeNewsletter(email) {
  if (USE_SUPABASE) {
    const { error } = await supabase.from('pn_newsletter_subscriptions').insert({ email });
    if (error) throw error;
    return { email };
  }
  return request(`${API_BASE}/auth/newsletter/subscribe/`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// ─── Expeditions ──────────────────────────────────────────────────

export async function fetchExpeditions(params = {}) {
  if (USE_SUPABASE) {
    let q = supabase.from('pn_expeditions').select('*').order('created_at', { ascending: false });
    if (params.category) q = q.eq('category', params.category);
    const lim = params.page_size || params.limit;
    if (lim) q = q.limit(lim);
    if (params.search) {
      const s = `%${params.search}%`;
      q = q.or(`title.ilike.${s},description.ilike.${s},location.ilike.${s}`);
    }
    const { data, error } = await q;
    if (error) throw error;
    return (data || []).map((r) => {
      const url = publicImg('pn-expedition-covers', r.cover_image);
      return { ...r, cover_image: url, cover_image_url: url };
    });
  }
  const query = new URLSearchParams(params).toString();
  const url = query ? `${API_BASE}/expeditions/?${query}` : `${API_BASE}/expeditions/`;
  return request(url);
}

export async function fetchExpeditionBySlug(slug) {
  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from('pn_expeditions')
      .select('*, pn_expedition_images(*)')
      .eq('slug', slug)
      .single();
    if (error || !data) throw notFound('Expedition not found');
    const url = publicImg('pn-expedition-covers', data.cover_image);
    return {
      ...data,
      cover_image: url,
      cover_image_url: url,
      images: (data.pn_expedition_images || [])
        .slice()
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((im) => ({ ...im, image: publicImg('pn-expedition-gallery', im.image) })),
    };
  }
  return request(`${API_BASE}/expeditions/${slug}/`);
}

/**
 * Create a new expedition with optional cover image (admin only).
 */
export async function createExpedition(formData) {
  if (USE_SUPABASE) {
    const file = isFormData(formData) ? formData.get('cover_image') : formData?.cover_image;
    let coverPath = null;
    if (file && typeof file === 'object' && 'size' in file && file.size > 0) {
      coverPath = await uploadTo('pn-expedition-covers', 'covers', file);
    }
    const title = String(field(formData, 'title', 'Untitled'));
    const base = {
      title,
      description: String(field(formData, 'description', '')),
      category: String(field(formData, 'category', 'expedition')),
      difficulty: String(field(formData, 'difficulty', 'moderate')),
      duration_days: parseInt(field(formData, 'duration_days', 0), 10) || 0,
      price_dzd: field(formData, 'price_dzd', 0),
      location: String(field(formData, 'location', '')),
      start_date: field(formData, 'start_date', null) || null,
      cover_image: coverPath,
      is_published: String(field(formData, 'is_published', 'true')).toLowerCase() === 'true',
    };
    let slug = slugify(title);
    for (let i = 0; i < 5; i++) {
      const { data, error } = await supabase.from('pn_expeditions').insert({ ...base, slug }).select().single();
      if (!error) {
        const url = publicImg('pn-expedition-covers', coverPath);
        return { ...data, cover_image: url, cover_image_url: url };
      }
      if (error.code === '23505') {
        slug = `${slugify(title)}-${Math.random().toString(36).slice(2, 7)}`;
        continue;
      }
      throw error;
    }
    throw new Error('Could not create expedition');
  }
  const url = `${API_BASE}/expeditions/`;
  const headers = {};
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    if (res.status === 401) removeToken();
    let detail;
    try {
      const body = await res.json();
      detail = body.detail || JSON.stringify(body);
    } catch {
      detail = res.statusText;
    }
    throw new Error(detail);
  }

  return res.json();
}

// ─── Inquiries ────────────────────────────────────────────────────

export async function createInquiry(data, selfieFile) {
  if (USE_SUPABASE) {
    let selfiePath = null;
    if (selfieFile && typeof selfieFile === 'object' && 'size' in selfieFile && selfieFile.size > 0) {
      selfiePath = await uploadTo('pn-inquiry-selfies', 'selfies', selfieFile);
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

    const resRow = row ?? { id: null, ...payload };
    let expedition_title = null;
    if (resRow.expedition_id) {
      const { data: ex } = await supabase.from('pn_expeditions').select('title').eq('id', resRow.expedition_id).single();
      expedition_title = ex?.title || null;
    }
    return { ...resRow, selfie_url: await selfieUrl(resRow.selfie), expedition_title };
  }
  const url = `${API_BASE}/inquiries/`;
  const formData = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v !== undefined && v !== null) formData.append(k, String(v));
  });
  if (selfieFile) {
    formData.append('selfie', selfieFile, selfieFile.name || 'selfie.jpg');
  }
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { method: 'POST', headers, body: formData });
  if (!res.ok) {
    if (res.status === 401) removeToken();
    let detail;
    try {
      const body = await res.json();
      detail = body.detail || JSON.stringify(body);
    } catch {
      detail = res.statusText;
    }
    throw new Error(detail);
  }
  return res.json();
}

export async function fetchInquiryTicket(id) {
  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from('pn_inquiries')
      .select('*, pn_expeditions(title)')
      .eq('id', id)
      .eq('status', 'confirmed')
      .single();
    if (error || !data) throw notFound('Ticket not found');
    return {
      ...data,
      selfie_url: await selfieUrl(data.selfie),
      expedition_title: data.pn_expeditions?.title || null,
    };
  }
  return request(`${API_BASE}/inquiries/${id}/ticket/`);
}

export async function fetchInquiries() {
  if (USE_SUPABASE) {
    const { data, error } = await supabase.from('pn_inquiries').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }
  return request(`${API_BASE}/inquiries/`);
}

export async function updateInquiryStatus(id, status) {
  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from('pn_inquiries')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  return request(`${API_BASE}/inquiries/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// ─── Transform helpers ────────────────────────────────────────────

export function mapExpeditionToTrip(exp) {
  const categoryStyles = {
    expedition: { tag: 'Starting Soon', tagBg: 'bg-brand-orange', type: 'EXPEDITION' },
    trekking:   { tag: 'Trekking',      tagBg: 'bg-teal-700',     type: 'TREKKING' },
    bivouac:    { tag: 'Bivouac',        tagBg: 'bg-slate-800',    type: 'BIVOUAC' },
    camping:    { tag: 'Camping',        tagBg: 'bg-emerald-700',  type: 'CAMPING' },
    photography:{ tag: 'Photography',    tagBg: 'bg-purple-700',   type: 'PHOTOGRAPHY' },
    wildlife:   { tag: 'Wildlife',       tagBg: 'bg-amber-700',    type: 'WILDLIFE' },
    cultural:   { tag: 'Cultural',       tagBg: 'bg-rose-700',     type: 'CULTURAL' },
  };

  const style = categoryStyles[exp.category] || categoryStyles.expedition;

  const durationLabel = exp.duration_days <= 2
    ? 'WEEKEND'
    : `${exp.duration_days} DAYS`;

  const priceNum = parseFloat(exp.price_dzd);
  const priceFormatted = priceNum.toLocaleString('fr-DZ', { maximumFractionDigits: 0 }).replace(/\s/g, '.') + ' DA';

  let dates = 'TBD';
  if (exp.start_date) {
    const start = new Date(exp.start_date);
    const end = new Date(start);
    end.setDate(end.getDate() + (exp.duration_days - 1));
    const fmtOpts = { day: '2-digit', month: 'short', year: 'numeric' };
    dates = `${start.toLocaleDateString('en-US', fmtOpts)} - ${end.toLocaleDateString('en-US', fmtOpts)}`;
  }

  const image = exp.cover_image || '';

  return {
    id: exp.slug,
    backendId: exp.id,
    title: exp.title,
    slug: exp.slug,
    tag: style.tag,
    tagBg: style.tagBg,
    duration: durationLabel,
    price: priceFormatted,
    image,
    description: exp.description || '',
    dates,
    capacity: '—',
    completed: false,
    type: style.type,
    category: exp.category,
    difficulty: exp.difficulty,
    location: exp.location,
  };
}

// ─── Store: cart persistence ───────────────────────────────────────

const STORE_CART_KEY = 'project_nature_store_cart';

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(STORE_CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function setCartStorage(cart) {
  localStorage.setItem(STORE_CART_KEY, JSON.stringify(cart));
}

export function clearCartStorage() {
  localStorage.removeItem(STORE_CART_KEY);
}

// ─── Store: helper ─────────────────────────────────────────────────

export function formatStorePrice(value) {
  const num = parseFloat(value);
  if (Number.isNaN(num)) return '—';
  return num.toLocaleString('fr-DZ', { maximumFractionDigits: 0 }).replace(/\s/g, '.') + ' DA';
}

// ─── Store: multipart helper (bearer + no Content-Type) ────────────

async function multipartRequest(url, method, formData) {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { method, headers, body: formData });
  if (!res.ok) {
    if (res.status === 401) removeToken();
    let detail;
    try {
      const body = await res.json();
      detail = body.detail || JSON.stringify(body);
    } catch {
      detail = res.statusText;
    }
    const err = new Error(detail);
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

// ─── Store: products (public read) ─────────────────────────────────

export async function fetchProducts(params = {}) {
  if (USE_SUPABASE) {
    let q = supabase
      .from('pn_products')
      .select('*, pn_product_variants(*), pn_product_images(*)')
      .order('created_at', { ascending: false });
    if (params.category) q = q.eq('category', params.category);
    const lim = params.page_size || params.limit;
    if (lim) q = q.limit(lim);
    if (params.search) {
      const s = `%${params.search}%`;
      q = q.or(`name.ilike.${s},description.ilike.${s}`);
    }
    const { data, error } = await q;
    if (error) throw error;
    return (data || []).map(toDjangoProduct);
  }
  const q = new URLSearchParams(params).toString();
  return request(`${API_BASE}/store/products/${q ? '?' + q : ''}`);
}

export async function fetchProductBySlug(slug) {
  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from('pn_products')
      .select('*, pn_product_variants(*), pn_product_images(*)')
      .eq('slug', slug)
      .single();
    if (error || !data) throw notFound('Product not found');
    return toDjangoProduct(data);
  }
  return request(`${API_BASE}/store/products/${slug}/`);
}

// ─── Store: products (admin write) ─────────────────────────────────

export async function createStoreProduct(data, coverFile) {
  if (USE_SUPABASE) {
    const file = isFormData(data) ? data.get('cover_image') : coverFile;
    let coverPath = null;
    if (file && typeof file === 'object' && 'size' in file && file.size > 0) {
      coverPath = await uploadTo('pn-product-images', 'covers', file);
    }
    const name = String(field(data, 'name', 'Untitled'));
    const base = {
      name,
      description: String(field(data, 'description', '')),
      price: field(data, 'price', 0),
      category: String(field(data, 'category', 't-shirt')),
      cover_image: coverPath,
      is_active: String(field(data, 'is_active', 'true')).toLowerCase() !== 'false',
    };
    let slug = slugify(name);
    for (let i = 0; i < 5; i++) {
      const { data: row, error } = await supabase.from('pn_products').insert({ ...base, slug }).select().single();
      if (!error) return toDjangoProduct({ ...row, pn_product_variants: [], pn_product_images: [] });
      if (error.code === '23505') {
        slug = `${slugify(name)}-${Math.random().toString(36).slice(2, 7)}`;
        continue;
      }
      throw error;
    }
    throw new Error('Could not create product');
  }
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v !== undefined && v !== null) fd.append(k, String(v));
  });
  if (coverFile) fd.append('cover_image', coverFile, coverFile.name || 'cover.jpg');
  return multipartRequest(`${API_BASE}/store/products/`, 'POST', fd);
}

export async function updateStoreProduct(slug, data, coverFile) {
  if (USE_SUPABASE) {
    const file = isFormData(data) ? data.get('cover_image') : coverFile;
    const patch = {};
    const pick = (k, parse) => {
      const v = isFormData(data) ? data.get(k) : data?.[k];
      if (v !== undefined && v !== null && v !== '') patch[k] = parse ? parse(v) : v;
    };
    pick('name');
    pick('description');
    pick('price');
    pick('category');
    if (isFormData(data) ? data.get('is_active') != null : data?.is_active !== undefined) {
      const v = isFormData(data) ? data.get('is_active') : data.is_active;
      patch.is_active = String(v).toLowerCase() !== 'false';
    }
    if (file && typeof file === 'object' && 'size' in file && file.size > 0) {
      patch.cover_image = await uploadTo('pn-product-images', 'covers', file);
    }
    if (patch.name && !patch.slug) {
      // keep slug stable unless explicitly provided
    }
    const { data: row, error } = await supabase.from('pn_products').update(patch).eq('slug', slug).select().single();
    if (error) throw error;
    return toDjangoProduct({ ...row, pn_product_variants: [], pn_product_images: [] });
  }
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v !== undefined && v !== null) fd.append(k, String(v));
  });
  if (coverFile) fd.append('cover_image', coverFile, coverFile.name || 'cover.jpg');
  return multipartRequest(`${API_BASE}/store/products/${slug}/`, 'PATCH', fd);
}

export async function deleteStoreProduct(slug) {
  if (USE_SUPABASE) {
    const { error } = await supabase.from('pn_products').delete().eq('slug', slug);
    if (error) throw error;
    return null;
  }
  return request(`${API_BASE}/store/products/${slug}/`, { method: 'DELETE' });
}

// ─── Store: product images (admin) ─────────────────────────────────

export async function fetchProductImages(productId) {
  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from('pn_product_images')
      .select('*')
      .eq('product_id', productId)
      .order('order');
    if (error) throw error;
    return (data || []).map((im) => ({ ...im, image: publicImg('pn-product-images', im.image) }));
  }
  return request(`${API_BASE}/store/product-images/?product=${productId}`);
}

export async function createProductImage(productId, imageFile, caption = '', order = 0) {
  if (USE_SUPABASE) {
    const path = await uploadTo('pn-product-images', 'gallery', imageFile);
    const { data, error } = await supabase
      .from('pn_product_images')
      .insert({ product_id: productId, image: path, caption, order: parseInt(order, 10) || 0 })
      .select()
      .single();
    if (error) throw error;
    return { ...data, image: publicImg('pn-product-images', data.image) };
  }
  const fd = new FormData();
  fd.append('product', String(productId));
  fd.append('image', imageFile, imageFile.name || 'image.jpg');
  fd.append('caption', caption);
  fd.append('order', String(order));
  return multipartRequest(`${API_BASE}/store/product-images/`, 'POST', fd);
}

export async function deleteProductImage(id) {
  if (USE_SUPABASE) {
    const { error } = await supabase.from('pn_product_images').delete().eq('id', id);
    if (error) throw error;
    return null;
  }
  return request(`${API_BASE}/store/product-images/${id}/`, { method: 'DELETE' });
}

// ─── Store: product variants (admin) ───────────────────────────────

export async function fetchProductVariants(productId) {
  if (USE_SUPABASE) {
    const { data, error } = await supabase.from('pn_product_variants').select('*').eq('product_id', productId);
    if (error) throw error;
    return (data || []).map((v) => ({ ...v, product: v.product_id }));
  }
  return request(`${API_BASE}/store/product-variants/?product=${productId}`);
}

export async function createProductVariant(data) {
  if (USE_SUPABASE) {
    const { data: row, error } = await supabase
      .from('pn_product_variants')
      .insert({
        product_id: data.product ?? data.product_id,
        size: data.size,
        color: data.color,
        stock: parseInt(data.stock, 10) || 0,
      })
      .select()
      .single();
    if (error) throw error;
    return { ...row, product: row.product_id };
  }
  return request(`${API_BASE}/store/product-variants/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProductVariant(id, data) {
  if (USE_SUPABASE) {
    const patch = {};
    if (data.size !== undefined) patch.size = data.size;
    if (data.color !== undefined) patch.color = data.color;
    if (data.stock !== undefined) patch.stock = parseInt(data.stock, 10) || 0;
    const { data: row, error } = await supabase.from('pn_product_variants').update(patch).eq('id', id).select().single();
    if (error) throw error;
    return { ...row, product: row.product_id };
  }
  return request(`${API_BASE}/store/product-variants/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteProductVariant(id) {
  if (USE_SUPABASE) {
    const { error } = await supabase.from('pn_product_variants').delete().eq('id', id);
    if (error) throw error;
    return null;
  }
  return request(`${API_BASE}/store/product-variants/${id}/`, { method: 'DELETE' });
}

// ─── Store: orders ─────────────────────────────────────────────────

export async function createOrder(data) {
  if (USE_SUPABASE) {
    const { data: orderId, error } = await supabase.rpc('pn_create_order', {
      p_full_name: data.full_name,
      p_phone: data.phone_number,
      p_address: data.delivery_address,
      p_items: data.items,
    });
    if (error) throw error;
    const { data: lines } = await supabase
      .from('pn_order_items')
      .select('quantity, unit_price_snapshot')
      .eq('order_id', orderId);
    const total = (lines || []).reduce(
      (s, l) => s + parseFloat(l.unit_price_snapshot || 0) * l.quantity,
      0,
    );
    return { id: orderId, full_name: data.full_name, phone_number: data.phone_number, delivery_address: data.delivery_address, status: 'new', total };
  }
  return request(`${API_BASE}/store/orders/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchOrders(params = {}) {
  if (USE_SUPABASE) {
    let q = supabase
      .from('pn_orders')
      .select('*, pn_order_items(*, pn_product_variants(*, pn_products(name)))')
      .order('created_at', { ascending: false });
    if (params.status) q = q.eq('status', params.status);
    const lim = params.page_size || params.limit;
    if (lim) q = q.limit(lim);
    const { data, error } = await q;
    if (error) throw error;
    return (data || []).map((o) => {
      const items = (o.pn_order_items || []).map((it) => ({
        id: it.id,
        product_name: it.pn_product_variants?.pn_products?.name || 'Product',
        size: it.pn_product_variants?.size,
        color: it.pn_product_variants?.color,
        quantity: it.quantity,
        unit_price: it.unit_price_snapshot,
      }));
      const total = (o.pn_order_items || []).reduce(
        (s, it) => s + parseFloat(it.unit_price_snapshot || 0) * it.quantity,
        0,
      );
      return { ...o, items, total };
    });
  }
  const q = new URLSearchParams(params).toString();
  return request(`${API_BASE}/store/orders/${q ? '?' + q : ''}`);
}

export async function updateOrderStatus(id, status) {
  if (USE_SUPABASE) {
    if (status === 'cancelled') {
      const { data, error } = await supabase.rpc('pn_cancel_order', { p_order_id: id });
      if (error) throw error;
      return data;
    }
    const { data, error } = await supabase.from('pn_orders').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }
  return request(`${API_BASE}/store/orders/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// ─── Site images (admin editable fixed pictures) ───────────────────

function toSiteImage(row) {
  return { ...row, image: row?.image ? publicImg('pn-site-images', row.image) : null };
}

export async function fetchSiteImages() {
  if (USE_SUPABASE) {
    const { data, error } = await supabase.from('pn_site_images').select('*');
    if (error) throw error;
    return (data || []).map(toSiteImage);
  }
  return request(`${API_BASE}/site-images/`);
}

export async function updateSiteImage(key, file) {
  if (USE_SUPABASE) {
    const path = await uploadTo('pn-site-images', 'site', file);
    const { data, error } = await supabase
      .from('pn_site_images')
      .upsert({ key, image: path }, { onConflict: 'key' })
      .select()
      .single();
    if (error) throw error;
    return toSiteImage(data);
  }
  const fd = new FormData();
  fd.append('key', key);
  fd.append('image', file, file.name || 'image.jpg');
  return multipartRequest(`${API_BASE}/site-images/`, 'POST', fd);
}

export async function resetSiteImage(key) {
  if (USE_SUPABASE) {
    const { error } = await supabase.from('pn_site_images').delete().eq('key', key);
    if (error) throw error;
    return null;
  }
  return request(`${API_BASE}/site-images/${key}/`, { method: 'DELETE' });
}

// ─── Expeditions: admin listing + gallery (admin write) ────────────

export async function fetchAdminExpeditions() {
  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from('pn_expeditions')
      .select('*, pn_expedition_images(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((exp) => {
      const cover = publicImg('pn-expedition-covers', exp.cover_image);
      return {
        ...exp,
        cover_image: cover,
        cover_image_url: cover,
        images: (exp.pn_expedition_images || [])
          .slice()
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((im) => ({ ...im, image: publicImg('pn-expedition-gallery', im.image) })),
      };
    });
  }
  return request(`${API_BASE}/expeditions/`);
}

export async function updateExpedition(backendId, patch) {
  if (USE_SUPABASE) {
    const { data, error } = await supabase.from('pn_expeditions').update(patch).eq('id', backendId).select().single();
    if (error) throw error;
    const url = publicImg('pn-expedition-covers', data.cover_image);
    return { ...data, cover_image: url, cover_image_url: url };
  }
  return request(`${API_BASE}/expeditions/${backendId}/`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}

export async function updateExpeditionCover(backendId, file) {
  if (USE_SUPABASE) {
    const path = await uploadTo('pn-expedition-covers', 'covers', file);
    const { data, error } = await supabase
      .from('pn_expeditions')
      .update({ cover_image: path })
      .eq('id', backendId)
      .select()
      .single();
    if (error) throw error;
    const url = publicImg('pn-expedition-covers', path);
    return { ...data, cover_image: url, cover_image_url: url };
  }
  const fd = new FormData();
  fd.append('cover_image', file, file.name || 'cover.jpg');
  return multipartRequest(`${API_BASE}/expeditions/${backendId}/`, 'PATCH', fd);
}

export async function fetchExpeditionImages(expeditionId) {
  if (USE_SUPABASE) {
    const { data, error } = await supabase
      .from('pn_expedition_images')
      .select('*')
      .eq('expedition_id', expeditionId)
      .order('order');
    if (error) throw error;
    return (data || []).map((im) => ({ ...im, image: publicImg('pn-expedition-gallery', im.image) }));
  }
  return request(`${API_BASE}/expeditions/images/?expedition=${expeditionId}`);
}

export async function createExpeditionImage(expeditionId, file, caption = '', order = 0) {
  if (USE_SUPABASE) {
    const path = await uploadTo('pn-expedition-gallery', 'gallery', file);
    const { data, error } = await supabase
      .from('pn_expedition_images')
      .insert({ expedition_id: expeditionId, image: path, caption, order: parseInt(order, 10) || 0 })
      .select()
      .single();
    if (error) throw error;
    return { ...data, image: publicImg('pn-expedition-gallery', data.image) };
  }
  const fd = new FormData();
  fd.append('expedition', String(expeditionId));
  fd.append('image', file, file.name || 'image.jpg');
  fd.append('caption', caption);
  fd.append('order', String(order));
  return multipartRequest(`${API_BASE}/expeditions/images/`, 'POST', fd);
}

export async function deleteExpeditionImage(id) {
  if (USE_SUPABASE) {
    const { error } = await supabase.from('pn_expedition_images').delete().eq('id', id);
    if (error) throw error;
    return null;
  }
  return request(`${API_BASE}/expeditions/images/${id}/`, { method: 'DELETE' });
}
