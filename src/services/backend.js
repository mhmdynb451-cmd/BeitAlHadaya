// Data layer. Two modes:
//  - Cloud: Supabase REST (URL + anon key come ONLY from EXPO_PUBLIC_* env vars).
//  - Demo: local persisted store seeded from src/data/seed.js (no network needed).
// No secrets are ever hardcoded here.
import { buildSeed } from '../data/seed';
import * as store from '../storage';

const URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isCloud = Boolean(URL && KEY);

const DB_KEY = 'bhh_db_v1';
let mem = null;

function demoDb() {
  if (mem) return mem;
  try {
    const raw = store.get(DB_KEY);
    if (raw) mem = JSON.parse(raw);
  } catch {}
  if (!mem || !Array.isArray(mem.products)) mem = buildSeed();
  return mem;
}

function persist() {
  try {
    store.set(DB_KEY, JSON.stringify(demoDb()));
  } catch {}
}

function headers(extra = {}) {
  return {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

async function sbList(table) {
  const res = await fetch(`${URL}/rest/v1/${table}?select=*`, { headers: headers() });
  if (!res.ok) throw new Error(`Supabase ${table}: ${res.status}`);
  return res.json();
}

async function sbInsert(table, row) {
  const res = await fetch(`${URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: headers({ Prefer: 'return=representation' }),
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`Supabase insert ${table}: ${res.status}`);
  const [created] = await res.json();
  return created;
}

async function sbUpdate(table, id, patch) {
  const res = await fetch(`${URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`Supabase update ${table}: ${res.status}`);
}

async function sbDelete(table, id) {
  const res = await fetch(`${URL}/rest/v1/${table}?id=eq.${id}`, { method: 'DELETE', headers: headers() });
  if (!res.ok) throw new Error(`Supabase delete ${table}: ${res.status}`);
}

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export const api = {
  isCloud,

  async bootstrap() {
    if (isCloud) {
      const [categories, products, orders, regions] = await Promise.all([
        sbList('categories'),
        sbList('products'),
        sbList('orders'),
        sbList('regions'),
      ]);
      return { categories, products, orders, regions, settings: { vodafoneNumber: '' } };
    }
    const db = demoDb();
    persist();
    return { categories: db.categories, products: db.products, orders: db.orders, regions: db.regions, settings: db.settings };
  },

  async signUp(email, password) {
    if (isCloud) {
      const res = await fetch(`${URL}/auth/v1/signup`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || data.error_description || 'تعذر إنشاء الحساب');
      return { id: data.user?.id, email };
    }
    const db = demoDb();
    if (db.users.some((u) => u.email === email)) throw new Error('هذا البريد مسجل بالفعل');
    const user = { id: uid(), email, password };
    db.users.push(user);
    persist();
    return { id: user.id, email };
  },

  async signIn(email, password) {
    if (isCloud) {
      const res = await fetch(`${URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || 'بيانات الدخول غير صحيحة');
      return { id: data.user?.id, email };
    }
    const db = demoDb();
    const user = db.users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error('بيانات الدخول غير صحيحة');
    return { id: user.id, email, role: user.role || 'customer', permissions: user.permissions || [] };
  },

  async saveCategory(cat) {
    if (isCloud) return cat.id ? (await sbUpdate('categories', cat.id, cat), cat) : await sbInsert('categories', { ...cat, id: uid() });
    const db = demoDb();
    if (cat.id) {
      db.categories = db.categories.map((c) => (c.id === cat.id ? { ...c, ...cat } : c));
    } else {
      db.categories.push({ ...cat, id: uid() });
    }
    persist();
    return cat;
  },

  async deleteCategory(id) {
    if (isCloud) return sbDelete('categories', id);
    const db = demoDb();
    db.categories = db.categories.filter((c) => c.id !== id && c.parent !== id);
    persist();
  },

  async saveProduct(p) {
    if (isCloud) return p.id ? (await sbUpdate('products', p.id, p), p) : await sbInsert('products', { ...p, id: uid() });
    const db = demoDb();
    if (p.id) {
      db.products = db.products.map((x) => (x.id === p.id ? { ...x, ...p } : x));
    } else {
      db.products.push({ ...p, id: uid(), deleted: false, rating: 4.5, sold: 0 });
    }
    persist();
    return p;
  },

  async trashProduct(id) {
    return this.saveProduct({ id, deleted: true });
  },

  async restoreProduct(id) {
    return this.saveProduct({ id, deleted: false });
  },

  async purgeProduct(id) {
    if (isCloud) return sbDelete('products', id);
    const db = demoDb();
    db.products = db.products.filter((p) => p.id !== id);
    persist();
  },

  async saveRegions(regions) {
    if (isCloud) {
      await Promise.all(regions.map((r) => sbUpdate('regions', r.id, r)));
      return regions;
    }
    const db = demoDb();
    db.regions = regions;
    persist();
    return regions;
  },

  async createOrder(order) {
    if (isCloud) return sbInsert('orders', order);
    const db = demoDb();
    db.orders.unshift(order);
    // decrement stock
    order.items.forEach((it) => {
      const p = db.products.find((x) => x.id === it.productId);
      if (p) p.stock = Math.max(0, (p.stock || 0) - it.qty);
    });
    persist();
    return order;
  },

  async listOrders(email) {
    if (isCloud) {
      const res = await fetch(`${URL}/rest/v1/orders?email=eq.${encodeURIComponent(email)}&select=*`, { headers: headers() });
      if (!res.ok) throw new Error('orders: ' + res.status);
      return res.json();
    }
    return demoDb().orders.filter((o) => o.email === email);
  },
};

export { uid };
