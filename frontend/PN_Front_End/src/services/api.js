/**
 * API Service Layer for Project Nature
 *
 * Connects the React frontend to the Django REST Framework backend.
 * All expedition data and inquiry submissions flow through here.
 */

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : '/api';

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
  const data = await request(`${API_BASE}/token/`, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  setToken(data.access, data.refresh);
  return data;
}

export async function registerUser(userData) {
  const data = await request(`${API_BASE}/register/`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  setToken(data.access, data.refresh);
  return data;
}

export async function fetchCurrentUser() {
  return request(`${API_BASE}/me/`);
}


// ─── Change Password ──────────────────────────────────────────────

export async function changePassword(oldPassword, newPassword, confirmPassword) {
  return request(`${API_BASE}/auth/change-password/`, {
    method: 'POST',
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword, confirm_password: confirmPassword }),
  });
}

// ─── Newsletter ─────────────────────────────────────────────────

export async function subscribeNewsletter(email) {
  return request(`${API_BASE}/auth/newsletter/subscribe/`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// ─── Expeditions ──────────────────────────────────────────────────

export async function fetchExpeditions(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `${API_BASE}/expeditions/?${query}` : `${API_BASE}/expeditions/`;
  return request(url);
}

export async function fetchExpeditionBySlug(slug) {
  return request(`${API_BASE}/expeditions/${slug}/`);
}

/**
 * Create a new expedition with optional cover image (admin only).
 */
export async function createExpedition(formData) {
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
  return request(`${API_BASE}/inquiries/${id}/ticket/`);
}

export async function fetchInquiries() {
  return request(`${API_BASE}/inquiries/`);
}

export async function updateInquiryStatus(id, status) {
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
