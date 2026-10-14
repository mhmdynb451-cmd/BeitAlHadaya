import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { api, isCloud, uid } from '../services/backend';
import { can } from '../services/permissions';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [regions, setRegions] = useState([]);
  const [settings, setSettings] = useState({ vodafoneNumber: '' });
  const [users, setUsers] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [toast, setToastState] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg, type = 'info') => {
    setToastState({ msg, type, id: uid() });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastState(null), 3200);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const boot = await api.bootstrap();
        setCategories(boot.categories || []);
        setProducts(boot.products || []);
        setOrders(boot.orders || []);
        setRegions(boot.regions || []);
        setSettings(boot.settings || { vodafoneNumber: '' });
      } catch (e) {
        showToast('تعذر تحميل البيانات — تأكد من الاتصال', 'error');
      }
      setReady(true);
    })();
  }, []);

  const signIn = useCallback(async (email, password) => {
    const u = await api.signIn(email, password);
    setUser(u);
    setIsAdmin(u.role === 'admin' || u.role === 'super_admin' || email.startsWith('admin@'));
    showToast('تم تسجيل الدخول بنجاح', 'success');
    return u;
  }, [showToast]);

  // فحص صلاحية: المسؤول الرئيسي لديه كل شيء، والبقية حسب ما وزّعه المسؤول
  const hasPerm = useCallback((perm) => {
    if (!user) return false;
    if (can(user, perm)) return true;
    // في الوضع السحابي دور المستخدم غير معروف من REST — نحافظ على وصول الآدمن القديم
    return isCloud && (user.role === 'admin' || (user.email || '').startsWith('admin@'));
  }, [user]);

  const signUp = useCallback(async (email, password) => {
    const u = await api.signUp(email, password);
    setUser(u);
    showToast('تم إنشاء الحساب بنجاح', 'success');
    return u;
  }, [showToast]);

  const signOut = useCallback(() => {
    setUser(null);
    setIsAdmin(false);
    showToast('تم تسجيل الخروج');
  }, [showToast]);

  const addToCart = useCallback((productId, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((i) => i.productId === productId);
      if (found) return prev.map((i) => (i.productId === productId ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { productId, qty }];
    });
    showToast('تمت الإضافة إلى السلة', 'success');
  }, [showToast]);

  const setQty = useCallback((productId, qty) => {
    setCart((prev) => (qty <= 0 ? prev.filter((i) => i.productId !== productId) : prev.map((i) => (i.productId === productId ? { ...i, qty } : i))));
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const placeOrder = useCallback(async (orderData) => {
    const order = { id: uid(), createdAt: new Date().toISOString(), status: 'بانتظار دفع الشحن', email: user?.email || '', ...orderData };
    const saved = await api.createOrder(order);
    setOrders((prev) => [saved, ...prev]);
    setCart([]);
    return saved;
  }, [user]);

  // Admin operations
  const adminSaveProduct = useCallback(async (p) => {
    await api.saveProduct(p);
    setProducts((prev) => (p.id ? prev.map((x) => (x.id === p.id ? { ...x, ...p } : x)) : [...prev, { ...p, id: uid(), deleted: false, rating: 4.5, sold: 0 }]));
    showToast('تم حفظ المنتج', 'success');
  }, [showToast]);

  const adminTrashProduct = useCallback(async (id) => {
    await api.trashProduct(id);
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, deleted: true } : p)));
    showToast('تم نقل المنتج للسلة المهملة');
  }, [showToast]);

  const adminRestoreProduct = useCallback(async (id) => {
    await api.restoreProduct(id);
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, deleted: false } : p)));
    showToast('تم استرجاع المنتج', 'success');
  }, [showToast]);

  const adminPurgeProduct = useCallback(async (id) => {
    await api.purgeProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('تم الحذف نهائيًا');
  }, [showToast]);

  const adminSaveCategory = useCallback(async (cat) => {
    await api.saveCategory(cat);
    setCategories((prev) => (cat.id ? prev.map((c) => (c.id === cat.id ? { ...c, ...cat } : c)) : [...prev, { ...cat, id: uid() }]));
    showToast('تم حفظ القسم', 'success');
  }, [showToast]);

  const adminDeleteCategory = useCallback(async (id) => {
    await api.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id && c.parent !== id));
    showToast('تم حذف القسم');
  }, [showToast]);

  const adminSaveRegions = useCallback(async (list) => {
    const saved = await api.saveRegions(list);
    setRegions(saved);
    showToast('تم حفظ مناطق الشحن', 'success');
  }, [showToast]);

  // Admin: users & roles
  const refreshUsers = useCallback(async () => {
    try { setUsers(await api.listUsers()); } catch {}
  }, []);

  const adminSaveUser = useCallback(async (u) => {
    await api.saveUser(u);
    await refreshUsers();
    showToast('تم حفظ المستخدم', 'success');
  }, [refreshUsers, showToast]);

  const adminDeleteUser = useCallback(async (id) => {
    await api.deleteUser(id);
    await refreshUsers();
    showToast('تم حذف المستخدم');
  }, [refreshUsers, showToast]);

  // Admin: all orders
  const adminLoadOrders = useCallback(async () => {
    try { setAllOrders(await api.listAllOrders()); } catch {}
  }, []);

  const adminUpdateOrderStatus = useCallback(async (id, status) => {
    await api.updateOrderStatus(id, status);
    setAllOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    showToast('تم تحديث حالة الطلب', 'success');
  }, [showToast]);

  const liveProducts = products.filter((p) => !p.deleted);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => {
    const p = products.find((x) => x.id === i.productId);
    return s + (p ? p.price * i.qty : 0);
  }, 0);

  const value = {
    ready, isCloud, user, isAdmin, setIsAdmin, categories, products, liveProducts, orders, regions, settings,
    cart, cartCount, cartTotal, toast, showToast,
    signIn, signUp, signOut,
    addToCart, setQty, removeFromCart, placeOrder,
    adminSaveProduct, adminTrashProduct, adminRestoreProduct, adminPurgeProduct,
    adminSaveCategory, adminDeleteCategory, adminSaveRegions,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
