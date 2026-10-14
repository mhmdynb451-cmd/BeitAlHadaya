import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Btn, Input } from '../components/ui';
import { C, R, fmt } from '../theme';

const ICONS = ['gift-outline', 'flash-outline', 'shirt-outline', 'restaurant-outline', 'home-outline', 'bed-outline', 'cafe-outline', 'sparkles-outline', 'wine-outline', 'flower-outline', 'bag-handle-outline', 'bow-outline', 'albums-outline', 'egg-outline'];
const TINTS = ['#C9A24B', '#D98E8E', '#5E8C61', '#8A7BA8', '#B07D4F', '#C0564F'];

export default function ProductFormScreen({ route, navigation }) {
  const { productId } = route.params || {};
  const { products, categories, adminSaveProduct } = useApp();
  const existing = products.find((p) => p.id === productId);

  const [name, setName] = React.useState(existing ? existing.name : '');
  const [desc, setDesc] = React.useState(existing ? existing.desc : '');
  const [price, setPrice] = React.useState(existing ? String(existing.price) : '');
  const [oldPrice, setOldPrice] = React.useState(existing && existing.oldPrice ? String(existing.oldPrice) : '');
  const [stock, setStock] = React.useState(existing ? String(existing.stock) : '');
  const [categoryId, setCategoryId] = React.useState(existing ? existing.categoryId : null);
  const [icon, setIcon] = React.useState(existing ? existing.icon : ICONS[0]);
  const [tint, setTint] = React.useState(existing ? existing.tint : TINTS[0]);
  const [err, setErr] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: existing ? 'تعديل منتج' : 'منتج جديد' });
  }, [navigation, existing]);

  const save = async () => {
    const p = Number(price), s = Number(stock);
    if (!name.trim()) return setErr('اسم المنتج مطلوب');
    if (!p || p <= 0) return setErr('سعر صحيح مطلوب');
    if (!categoryId) return setErr('اختار القسم');
    if (isNaN(s) || s < 0) return setErr('مخزون صحيح مطلوب');
    setErr('');
    setBusy(true);
    try {
      await adminSaveProduct({
        ...(existing || {}),
        name: name.trim(),
        desc: desc.trim() || 'منتج مميز من بيت الهدايا',
        price: p,
        oldPrice: Number(oldPrice) > p ? Number(oldPrice) : null,
        stock: s,
        categoryId,
        icon,
        tint,
      });
      navigation.goBack();
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <View style={[styles.preview, { backgroundColor: tint + '14' }]}>
          <View style={styles.previewIcon}><Ionicons name={icon} size={44} color={tint} /></View>
          <Text style={styles.previewName}>{name || 'اسم المنتج'}</Text>
          <Text style={styles.previewPrice}>{price ? fmt(Number(price)) : 'السعر'}</Text>
        </View>

        <Input label="اسم المنتج" value={name} onChangeText={setName} placeholder="مثال: طقم أواني طهي جرانيت" />
        <Input label="الوصف" value={desc} onChangeText={setDesc} placeholder="وصف مختصر وجاذب للمنتج" multiline />
        <View style={{ flexDirection: 'row-reverse', gap: 10 }}>
          <View style={{ flex: 1 }}><Input label="السعر (ج.م)" value={price} onChangeText={setPrice} keyboardType="number-pad" placeholder="0" /></View>
          <View style={{ flex: 1 }}><Input label="السعر قبل الخصم" value={oldPrice} onChangeText={setOldPrice} keyboardType="number-pad" placeholder="اختياري" /></View>
        </View>
        <Input label="المخزون المتاح" value={stock} onChangeText={setStock} keyboardType="number-pad" placeholder="0" />

        <Text style={styles.fLabel}>القسم</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 16 }}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c.id}
              onPress={() => setCategoryId(c.id)}
              style={[styles.chip, categoryId === c.id && styles.chipOn]}
              activeOpacity={0.8}
            >
              <Ionicons name={c.icon} size={14} color={categoryId === c.id ? '#fff' : c.tint} />
              <Text style={[styles.chipTxt, categoryId === c.id && { color: '#fff' }]}>{c.parent ? '↳ ' : ''}{c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.fLabel}>أيقونة المنتج (صورة بديلة أنيقة)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 16 }}>
          {ICONS.map((ic) => (
            <TouchableOpacity key={ic} onPress={() => setIcon(ic)} style={[styles.iconPick, icon === ic && { borderColor: C.gold, backgroundColor: C.goldSoft }]} activeOpacity={0.8}>
              <Ionicons name={ic} size={20} color={icon === ic ? C.goldDark : C.muted} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.fLabel}>لون الخلفية</Text>
        <View style={{ flexDirection: 'row-reverse', gap: 10, marginBottom: 20 }}>
          {TINTS.map((t) => (
            <TouchableOpacity key={t} onPress={() => setTint(t)} style={[styles.tintPick, { backgroundColor: t }, tint === t && { borderWidth: 3, borderColor: C.ink }]} activeOpacity={0.8} />
          ))}
        </View>

        {err ? <Text style={styles.err}>{err}</Text> : null}
        <Btn title={existing ? 'حفظ التعديلات' : 'إضافة المنتج'} onPress={save} loading={busy} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  preview: { borderRadius: R.lg, alignItems: 'center', padding: 24, marginBottom: 18 },
  previewIcon: { width: 84, height: 84, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center' },
  previewName: { fontSize: 16, fontWeight: '800', color: C.ink, marginTop: 12, textAlign: 'center' },
  previewPrice: { fontSize: 14, fontWeight: '800', color: C.goldDark, marginTop: 4 },
  fLabel: { fontSize: 13, fontWeight: '700', color: C.ink, marginBottom: 8, textAlign: 'right' },
  chip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, paddingHorizontal: 13, paddingVertical: 8, borderRadius: R.pill, borderWidth: 1, borderColor: C.line, backgroundColor: C.surface },
  chipOn: { backgroundColor: C.gold, borderColor: C.gold },
  chipTxt: { fontSize: 12, fontWeight: '700', color: C.ink },
  iconPick: { width: 42, height: 42, borderRadius: 13, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center', backgroundColor: C.surface },
  tintPick: { width: 34, height: 34, borderRadius: 17 },
  err: { color: C.danger, fontSize: 13, textAlign: 'right', marginBottom: 10 },
});
