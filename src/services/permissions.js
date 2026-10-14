// نظام الصلاحيات والأدوار — بيت الهدايا
// super_admin: صلاحيات كاملة دائمًا ولا يمكن حذفه أو تنزيل صلاحياته.
// باقي الأدوار: صلاحياتها تُوزَّع يدويًا من لوحة الإدارة.

export const MODULES = [
  { key: 'products', label: 'المنتجات', icon: 'cube-outline' },
  { key: 'categories', label: 'الأقسام', icon: 'grid-outline' },
  { key: 'orders', label: 'الطلبات', icon: 'receipt-outline' },
  { key: 'users', label: 'المستخدمون', icon: 'people-outline' },
  { key: 'reports', label: 'التقارير', icon: 'bar-chart-outline' },
  { key: 'shipping', label: 'الشحن', icon: 'car-outline' },
];

export const ALL_PERMS = MODULES.map((m) => m.key);

export const ROLE_LABELS = {
  super_admin: 'مسؤول رئيسي',
  admin: 'مدير',
  staff: 'موظف',
  customer: 'عميل',
};

// الأدوار التي يمكن تعيينها من اللوحة (المسؤول الرئيسي لا يُنشأ من هنا)
export const ASSIGNABLE_ROLES = ['admin', 'staff', 'customer'];

export const ORDER_STATUSES = ['بانتظار دفع الشحن', 'تم الدفع', 'قيد التجهيز', 'تم الشحن', 'تم التسليم', 'ملغي'];

export function statusTone(status) {
  if (status === 'ملغي') return 'red';
  if (status === 'تم التسليم' || status === 'تم الدفع' || status === 'تم الشحن') return 'green';
  return 'gold';
}

export function can(user, perm) {
  if (!user) return false;
  if (user.role === 'super_admin') return true;
  return Array.isArray(user.permissions) && user.permissions.includes(perm);
}
