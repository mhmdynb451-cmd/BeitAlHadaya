// Demo seed data (Arabic). Used when Supabase env vars are not configured.
export const seedCategories = [
  { id: 'c1', name: 'أجهزة كهربائية', icon: 'flash-outline', tint: '#C9A24B', parent: null },
  { id: 'c2', name: 'ملابس وأزياء', icon: 'shirt-outline', tint: '#D98E8E', parent: null },
  { id: 'c3', name: 'أدوات مطبخ', icon: 'restaurant-outline', tint: '#5E8C61', parent: null },
  { id: 'c4', name: 'بوكسات هدايا', icon: 'gift-outline', tint: '#C9A24B', parent: null },
  { id: 'c5', name: 'ديكور المنزل', icon: 'home-outline', tint: '#8A7BA8', parent: null },
  { id: 'c6', name: 'مفروشات', icon: 'bed-outline', tint: '#B07D4F', parent: null },
  { id: 'c1s1', name: 'أجهزة المطبخ', icon: 'cafe-outline', tint: '#C9A24B', parent: 'c1' },
  { id: 'c1s2', name: 'عناية وكهربائيات', icon: 'sparkles-outline', tint: '#C9A24B', parent: 'c1' },
  { id: 'c2s1', name: 'فساتين السهرة', icon: 'bow-outline', tint: '#D98E8E', parent: 'c2' },
  { id: 'c2s2', name: 'شنط وأحذية', icon: 'bag-handle-outline', tint: '#D98E8E', parent: 'c2' },
  { id: 'c3s1', name: 'أطقم الطهي', icon: 'egg-outline', tint: '#5E8C61', parent: 'c3' },
  { id: 'c4s1', name: 'بوكسات العروسة', icon: 'gift-outline', tint: '#C9A24B', parent: 'c4' },
];

export const seedProducts = [
  { id: 'p1', name: 'طقم أواني طهي جرانيت 10 قطع', desc: 'طقم جرانيت مضاد للالتصاق، مقاوم للخدش، مناسب لجميع أنواع المواقد.', price: 2450, oldPrice: 2900, categoryId: 'c3s1', stock: 14, rating: 4.8, sold: 320, tint: '#5E8C61', icon: 'restaurant-outline', deleted: false },
  { id: 'p2', name: 'فستان سهرة زفاف دانتيل', desc: 'فستان سهرة بقصة امبريال من الدانتيل الفرنسي مع تطريز يدوي وتنورة واسعة.', price: 5800, oldPrice: 6900, categoryId: 'c2s1', stock: 6, rating: 4.9, sold: 95, tint: '#D98E8E', icon: 'bow-outline', deleted: false },
  { id: 'p3', name: 'خلاط كهربائي 1000 واط', desc: 'خلاط قوي بست سرعات ووعاء زجاج مقاوم للحرارة، ضمان سنتين.', price: 1290, oldPrice: 1550, categoryId: 'c1s1', stock: 22, rating: 4.6, sold: 410, tint: '#C9A24B', icon: 'cafe-outline', deleted: false },
  { id: 'p4', name: 'بوكس هدايا العروسة الفخم', desc: 'بوكس يجمع العطور والبراويز وأدوات العناية بتغليف فخم — مثالي للخطوبة.', price: 950, oldPrice: 1200, categoryId: 'c4s1', stock: 30, rating: 4.9, sold: 520, tint: '#C9A24B', icon: 'gift-outline', deleted: false },
  { id: 'p5', name: 'طقم فرش سرير قطن مصري 6 قطع', desc: 'قطن مصري 100%، ملمس ناعم وألوان ثابتة بعد الغسيل.', price: 1750, oldPrice: 2100, categoryId: 'c6', stock: 18, rating: 4.7, sold: 260, tint: '#B07D4F', icon: 'bed-outline', deleted: false },
  { id: 'p6', name: 'مكواة بخار سيراميك 2400 واط', desc: 'قاعدة سيراميك، بخار عمودي قوي، إطفاء تلقائي للأمان.', price: 890, oldPrice: 1050, categoryId: 'c1s2', stock: 25, rating: 4.5, sold: 300, tint: '#C9A24B', icon: 'sparkles-outline', deleted: false },
  { id: 'p7', name: 'طقم أكواب زجاج مزخرف 12 قطعة', desc: 'زجاج مقاوم للصدمات بنقشات ذهبية أنيقة تناسب التجهيزات.', price: 640, oldPrice: 780, categoryId: 'c3', stock: 40, rating: 4.4, sold: 180, tint: '#8A7BA8', icon: 'wine-outline', deleted: false },
  { id: 'p8', name: 'شنطة عروس جلد طبيعي', desc: 'جلد طبيعي بحزام كتف معدني ومساحة تكفي المستندات والأساسيات.', price: 1450, oldPrice: 1700, categoryId: 'c2s2', stock: 12, rating: 4.6, sold: 140, tint: '#D98E8E', icon: 'bag-handle-outline', deleted: false },
  { id: 'p9', name: 'طقم شموع ديكور عطري 9 قطع', desc: 'شموع صويا برائحة الورد والفانيلا مع حاملات سيراميك.', price: 480, oldPrice: 590, categoryId: 'c5', stock: 50, rating: 4.7, sold: 610, tint: '#8A7BA8', icon: 'flower-outline', deleted: false },
  { id: 'p10', name: 'طقم صواني تقديم ذهبي 5 قطع', desc: 'ستانلس ستيل مطلي ذهب، مثالي للضيافة في المناسبات.', price: 1120, oldPrice: 1350, categoryId: 'c5', stock: 16, rating: 4.5, sold: 210, tint: '#C9A24B', icon: 'albums-outline', deleted: false },
  { id: 'p11', name: 'فستان خطوبة ساتان وردي', desc: 'ساتان فخم بقصة حورية البحر وتفاصيل كريستال على الأكمام.', price: 3200, oldPrice: 3800, categoryId: 'c2s1', stock: 8, rating: 4.8, sold: 88, tint: '#D98E8E', icon: 'bow-outline', deleted: false },
  { id: 'p12', name: 'طقم سكاكين مطبخ ستانلس 8 قطع', desc: 'شفرات ستانلس ستيل مع قاعدة خشب زان، حاد ومتين.', price: 720, oldPrice: 860, categoryId: 'c3s1', stock: 28, rating: 4.6, sold: 240, tint: '#5E8C61', icon: 'restaurant-outline', deleted: false },
  { id: 'p13', name: 'آلة قهوة تركية كهربائية', desc: 'تحضير سريع مع إيقاف تلقائي لمنع الفيض، تصميم أنيق.', price: 980, oldPrice: 1150, categoryId: 'c1s1', stock: 20, rating: 4.5, sold: 190, tint: '#C9A24B', icon: 'cafe-outline', deleted: false },
  { id: 'p14', name: 'بوكس تجهيز العروسين الأساسي', desc: 'يجمع أساسيات المطبخ والغرفة في بوكس واحد بسعر موفر.', price: 4200, oldPrice: 5000, categoryId: 'c4s1', stock: 10, rating: 4.9, sold: 130, tint: '#C9A24B', icon: 'gift-outline', deleted: false },
];

export const seedRegions = [
  { id: 'r1', name: 'القاهرة', fee: 60 },
  { id: 'r2', name: 'الجيزة', fee: 65 },
  { id: 'r3', name: 'الإسكندرية', fee: 85 },
  { id: 'r4', name: 'الدلتا والقنال', fee: 95 },
  { id: 'r5', name: 'الصعيد', fee: 110 },
  { id: 'r6', name: 'المدن الجديدة والعواصم', fee: 75 },
];

export const seedSettings = { vodafoneNumber: '0101 234 5678', storeName: 'بيت الهدايا - غاوي خسارة' };

// حساب المسؤول الرئيسي — صلاحيات كاملة غير قابلة للتعديل أو الحذف
export const ADMIN_EMAIL = 'mhmder936@gmail.com';
export const ADMIN_PASSWORD = 'Admin@2024';
export const seedUsers = [
  { id: 'u-admin', email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'super_admin', permissions: ['products', 'categories', 'orders', 'users', 'reports', 'shipping'] },
];

export function buildSeed() {
  return { categories: seedCategories, products: seedProducts, orders: [], regions: seedRegions, settings: seedSettings, users: [...seedUsers] };
}
