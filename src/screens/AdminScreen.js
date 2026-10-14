import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, R, shadow, fmt } from '../theme';
import { useApp } from '../context/AppContext';
import { Btn, Badge, Empty, Sheet } from '../components/ui';

const ICONS = ['gift-outline', 'flash-outline', 'shirt-outline', 'restaurant-outline', 'home-outline', 'bed-outline', 'cafe-outline', 'sparkles-outline', 'wine-outline', 'flower-outline', 'bag-handle-outline', 'bow-outline', 'albums-outline', 'egg-outline'];
const TINTS = ['#C9A24B', '#D98E8E', '#5E8C61', '#8A7BA8', '#B07D4F', '#C0564F'];

export default function AdminScreen({ navigation }) {
  const { isAdmin, liveProducts, products, categories, adminSaveCategory, adminDeleteCategory, adminSaveRegions, regions, settings } = useApp();
  const [tab, setTab] = React.useState('products');
  const [catSheet, setCatSheet] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [cName, setCName] = React.useState('');
  const [cParent, setCParent] = React.useState(null);
  const [cIcon, setCIcon] = React.useState(ICONS[0]);
  const [cTint, setCTint] = React.useState(TINTS[0]);
  const [regionDraft, setRegionDraft] = React.useState(null);

  React.useEffect(() => { setRegionDraft(JSON.parse(JSON.stringify(regions))); }, [regions]);

  if (!isAdmin) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <Empty
          icon="lock-closed-outline"
          title="لوحة التحكم للإدارة فقط"
          sub="سجل الدخول بحساب إداري للوصول لإدارة المنتجات والأقسام والشحن"
          actionLabel="تسجيل الدخول"
          onAction={() => navigation.navigate('Auth')}
        />
      </SafeAreaView>
    );
  }

  const openCat = (cat = null, parent = null) => {
    setEditing(cat);
    setCName(cat ? cat.name : '');
    setCParent(cat ? cat.parent : parent);
    setCIcon(cat ? cat.icon : ICONS[0]);
    setCTint(cat ? cat.tint : TINTS[0]);
    setCatSheet(true);
  };

  const saveCat = async () => {
    if (!cName.trim()) return;
    await adminSaveCategory({ ...(editing || {}), name: cName.trim(), parent: cParent, icon: cIcon, tint: cTint });
    setCatSheet(false);
  };

  const mainCats = categories.filter((c) => !c.parent);
  const trashed = products.filter((p) => p.deleted);

  const ProductRow = ({ p }) => (
    <View style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: p.tint + '1A' }]}><Ionicons name={p.icon || 'cube-outline'} size={22} color={p.tint} /></View>
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={styles.rowName}>{p.name}</Text>
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <Text style={styles.rowPrice}>{fmt(p.price)}</Text>
          <Badge text={'مخزون: ' + p.stock} tone={p.stock > 5 ? 'green' : p.stock > 0 ? 'gold' : 'red'} />
        </View>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('ProductForm', { productId: p.id })} style={styles.rowBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="create-outline" size={19} color={C.goldDark} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => adminTrashProduct(p.id)} style={styles.rowBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="trash-outline" size={19} color={C.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.tabs}>
        {[
          { k: 'products', label: 'المنتجات', icon: 'cube-outline' },
          { k: 'cats', label: 'الأقسام', icon: 'grid-outline' },
          { k: 'trash', label: 'المهملة (' + trashed.length + ')', icon: 'trash-outline' },
          { k: 'shipping', label: 'الشحن', icon: 'car-outline' },
        ].map((t) => (
          <TouchableOpacity key={t.k} onPress={() => setTab(t.k)} style={[styles.tab, tab === t.k && styles.tabOn]} activeOpacity={0.8}>
            <Ionicons name={t.icon} size={16} color={tab === t.k ? '#fff' : C.muted} />
            <Text style={[styles.tabTxt, tab === t.k && { color: '#fff' }]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {tab === 'products' && (
          <View>
            <Btn title="إضافة منتج جديد" icon="add" onPress={() => navigation.navigate('ProductForm', {})} style={{ marginBottom: 16 }} />
            {liveProducts.map((p) => <ProductRow key={p.id} p={p} />)}
            {liveProducts.length === 0 && <Empty icon="cube-outline" title="لا توجد منتجات" sub="ابدأ بإضافة أول منتج للمتجر" />}
          </View>
        )}

        {tab === 'cats' && (
          <View>
            <Btn title="قسم رئيسي جديد" icon="add" onPress={() => openCat(null, null)} style={{ marginBottom: 16 }} />
            {mainCats.map((c) => (
              <View key={c.id} style={{ marginBottom: 12 }}>
                <View style={styles.row}>
                  <View style={[styles.rowIcon, { backgroundColor: c.tint + '1A' }]}><Ionicons name={c.icon} size={22} color={c.tint} /></View>
                  <Text style={[styles.rowName, { flex: 1 }]}>{c.name}</Text>
                  <TouchableOpacity onPress={() => openCat(null, c.id)} style={styles.rowBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="add-circle-outline" size={20} color={C.success} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openCat(c)} style={styles.rowBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="create-outline" size={19} color={C.goldDark} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => Alert.alert('حذف القسم', 'حذف «' + c.name + '» وكل أقسامه الفرعية؟', [
                      { text: 'إلغاء', style: 'cancel' },
                      { text: 'حذف', style: 'destructive', onPress: () => adminDeleteCategory(c.id) },
                    ])}
                    style={styles.rowBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={19} color={C.danger} />
                  </TouchableOpacity>
                </View>
                {categories.filter((s) => s.parent === c.id).map((s) => (
                  <View key={s.id} style={[styles.row, { marginHorizontal: 16, marginTop: 6, backgroundColor: C.bg, shadowOpacity: 0.03, elevation: 1 }]}>
                    <View style={[styles.rowIcon, { backgroundColor: s.tint + '1A', width: 38, height: 38 }]}><Ionicons name={s.icon} size={18} color={s.tint} /></View>
                    <Text style={[styles.rowName, { flex: 1, fontSize: 13 }]}>{s.name}</Text>
                    <TouchableOpacity onPress={() => openCat(s)} style={styles.rowBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Ionicons name="create-outline" size={18} color={C.goldDark} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => adminDeleteCategory(s.id)} style={styles.rowBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Ionicons name="trash-outline" size={18} color={C.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {tab === 'trash' && (
          <View>
            {trashed.length === 0 && <Empty icon="trash-outline" title="السلة المهملة فاضية" sub="المنتجات المحذوفة تظهر هنا لاسترجاعها أو حذفها نهائيًا" />}
            {trashed.map((p) => (
              <View key={p.id} style={[styles.row, { marginBottom: 10, opacity: 0.85 }]}>
                <View style={[styles.rowIcon, { backgroundColor: p.tint + '1A' }]}><Ionicons name={p.icon || 'cube-outline'} size={22} color={p.tint} /></View>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={styles.rowName}>{p.name}</Text>
                  <Text style={styles.rowPrice}>{fmt(p.price)}</Text>
                </View>
                <TouchableOpacity onPress={() => adminRestoreProduct(p.id)} style={styles.rowBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="refresh-outline" size={19} color={C.success} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Alert.alert('حذف نهائي', 'حذف «' + p.name + '» نهائيًا؟ لا يمكن التراجع.', [
                    { text: 'إلغاء', style: 'cancel' },
                    { text: 'حذف نهائي', style: 'destructive', onPress: () => adminPurgeProduct(p.id) },
                  ])}
                  style={styles.rowBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle-outline" size={19} color={C.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {tab === 'shipping' && regionDraft && (
          <View>
            <Text style={styles.shipHint}>حدد رسوم الشحن لكل منطقة — العميل يدفع رسوم منطقته مقدمًا لتأكيد الأوردر.</Text>
            {regionDraft.map((r, idx) => (
              <View key={r.id} style={[styles.row, { marginBottom: 10 }]}>
                <Ionicons name="location-outline" size={20} color={C.goldDark} />
                <Text style={[styles.rowName, { flex: 1, marginHorizontal: 10 }]}>{r.name}</Text>
                <TextInput
                  value={String(r.fee)}
                  onChangeText={(v) => setRegionDraft(regionDraft.map((x, i) => (i === idx ? { ...x, fee: Number(String(v).replace(/[^0-9]/g, '')) || 0 } : x)))}
                  keyboardType="number-pad"
                  style={styles.feeInput}
                />
                <Text style={styles.feeUnit}>ج.م</Text>
              </View>
            ))}
            <Btn title="حفظ رسوم الشحن" icon="save-outline" onPress={() => adminSaveRegions(regionDraft)} style={{ marginTop: 8 }} />
            <View style={styles.vfBox}>
              <Text style={styles.vfLbl}>رقم فودافون كاش لاستقبال دفعات الشحن</Text>
              <Text style={styles.vfVal}>{settings.vodafoneNumber || 'غير محدد'}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <Sheet visible={catSheet} onClose={() => setCatSheet(false)} title={editing ? 'تعديل القسم' : 'قسم جديد'}>
        <Input label="اسم القسم" value={cName} onChangeText={setCName} placeholder="مثال: أجهزة كهربائية" />
        <Text style={styles.fLabel}>القسم الأب</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 14 }}>
          <TouchableOpacity onPress={() => setCParent(null)} style={[styles.pChip, !cParent && styles.pChipOn]} activeOpacity={0.8}>
            <Text style={[styles.pChipTxt, !cParent && { color: '#fff' }]}>قسم رئيسي</Text>
          </TouchableOpacity>
          {mainCats.filter((c) => !editing || c.id !== editing.id).map((c) => (
            <TouchableOpacity key={c.id} onPress={() => setCParent(c.id)} style={[styles.pChip, cParent === c.id && styles.pChipOn]} activeOpacity={0.8}>
              <Text style={[styles.pChipTxt, cParent === c.id && { color: '#fff' }]}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.fLabel}>الأيقونة</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 14 }}>
          {ICONS.map((ic) => (
            <TouchableOpacity key={ic} onPress={() => setCIcon(ic)} style={[styles.iconPick, cIcon === ic && { borderColor: C.gold, backgroundColor: C.goldSoft }]} activeOpacity={0.8}>
              <Ionicons name={ic} size={20} color={cIcon === ic ? C.goldDark : C.muted} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.fLabel}>اللون</Text>
        <View style={{ flexDirection: 'row-reverse', gap: 10, marginBottom: 20 }}>
          {TINTS.map((t) => (
            <TouchableOpacity key={t} onPress={() => setCTint(t)} style={[styles.tintPick, { backgroundColor: t }, cTint === t && { borderWidth: 3, borderColor: C.ink }]} activeOpacity={0.8} />
          ))}
        </View>
        <Btn title="حفظ القسم" onPress={saveCat} />
      </Sheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  tabs: { flexDirection: 'row-reverse', gap: 8, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  tab: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, paddingHorizontal: 13, paddingVertical: 9, borderRadius: R.pill, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line },
  tabOn: { backgroundColor: C.slate, borderColor: C.slate },
  tabTxt: { fontSize: 12, fontWeight: '700', color: C.muted },
  row: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderRadius: R.md, padding: 12, ...shadow(1) },
  rowIcon: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  rowName: { fontSize: 14, fontWeight: '700', color: C.ink, textAlign: 'right' },
  rowPrice: { fontSize: 12, fontWeight: '800', color: C.goldDark },
  rowBtn: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg },
  fLabel: { fontSize: 13, fontWeight: '700', color: C.ink, marginBottom: 8, textAlign: 'right' },
  pChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: R.pill, borderWidth: 1, borderColor: C.line, backgroundColor: C.surface },
  pChipOn: { backgroundColor: C.gold, borderColor: C.gold },
  pChipTxt: { fontSize: 12, fontWeight: '700', color: C.ink },
  iconPick: { width: 42, height: 42, borderRadius: 13, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center', backgroundColor: C.surface },
  tintPick: { width: 34, height: 34, borderRadius: 17 },
  feeInput: { width: 80, backgroundColor: C.bg, borderWidth: 1, borderColor: C.line, borderRadius: R.sm, paddingHorizontal: 10, paddingVertical: 8, fontSize: 14, fontWeight: '700', color: C.ink, textAlign: 'center' },
  feeUnit: { fontSize: 12, color: C.muted, fontWeight: '700' },
  shipHint: { fontSize: 12, color: C.muted, lineHeight: 19, marginBottom: 14, textAlign: 'right' },
  vfBox: { backgroundColor: C.surface, borderRadius: R.md, padding: 14, marginTop: 16, borderWidth: 1, borderColor: C.line },
  vfLbl: { fontSize: 12, color: C.muted, fontWeight: '600', textAlign: 'right' },
  vfVal: { fontSize: 15, fontWeight: '800', color: C.ink, marginTop: 4, textAlign: 'right' },
});
