import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, R, shadow, fmt } from '../theme';
import { useApp } from '../context/AppContext';
import { Btn, Price, Rating, Badge, Empty } from '../components/ui';

export default function ProductScreen({ route, navigation }) {
  const { productId } = route.params || {};
  const { liveProducts, categories, addToCart } = useApp();
  const product = liveProducts.find((p) => p.id === productId);
  const [qty, setQty] = React.useState(1);

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: product ? product.name : 'المنتج' });
  }, [navigation, product]);

  if (!product) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <Empty title="المنتج غير متاح" onAction={() => navigation.goBack()} actionLabel="رجوع" />
      </SafeAreaView>
    );
  }

  const cat = categories.find((c) => c.id === product.categoryId);
  const related = liveProducts.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);
  const off = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={[styles.hero, { backgroundColor: product.tint + '14' }]}>
          <Ionicons name={product.icon || 'cube-outline'} size={96} color={product.tint} />
          {off > 0 && <View style={styles.off}><Text style={styles.offTxt}>وفّر {off}%</Text></View>}
        </View>

        <View style={{ padding: 16 }}>
          {cat && <Badge text={cat.name} />}
          <Text style={styles.name}>{product.name}</Text>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 12, marginTop: 8 }}>
            <Rating value={product.rating} sold={product.sold} />
            <Badge text={product.stock > 0 ? 'متاح — ' + product.stock + ' قطعة' : 'غير متاح'} tone={product.stock > 0 ? 'green' : 'red'} />
          </View>
          <View style={{ marginTop: 14 }}><Price value={product.price} old={product.oldPrice} big /></View>
          <Text style={styles.desc}>{product.desc}</Text>

          <View style={styles.perk}><Ionicons name="cash-outline" size={18} color={C.goldDark} /><Text style={styles.perkTxt}>الدفع عند الاستلام (كاش) — رسوم الشحن فقط مقدمًا</Text></View>
          <View style={styles.perk}><Ionicons name="car-outline" size={18} color={C.goldDark} /><Text style={styles.perkTxt}>الشحن لكل المناطق — السعر حسب محافظتك</Text></View>
          <View style={styles.perk}><Ionicons name="swap-horizontal-outline" size={18} color={C.goldDark} /><Text style={styles.perkTxt}>استبدال خلال 14 يوم</Text></View>
        </View>

        {related.length > 0 && (
          <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
            <Text style={styles.relTitle}>منتجات مشابهة</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {related.map((r) => (
                <TouchableOpacity key={r.id} onPress={() => navigation.push('Product', { productId: r.id })} style={styles.relCard} activeOpacity={0.9}>
                  <View style={[styles.relImg, { backgroundColor: r.tint + '1A' }]}><Ionicons name={r.icon || 'cube-outline'} size={30} color={r.tint} /></View>
                  <Text numberOfLines={2} style={styles.relName}>{r.name}</Text>
                  <Text style={styles.relPrice}>{fmt(r.price)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      <View style={[styles.ctaBar, shadow(2)]}>
        <View style={styles.qty}>
          <TouchableOpacity onPress={() => setQty((q) => Math.max(1, q - 1))} style={styles.qtyBtn}><Ionicons name="remove" size={18} color={C.ink} /></TouchableOpacity>
          <Text style={styles.qtyTxt}>{qty}</Text>
          <TouchableOpacity onPress={() => setQty((q) => Math.min(product.stock || 99, q + 1))} style={styles.qtyBtn}><Ionicons name="add" size={18} color={C.ink} /></TouchableOpacity>
        </View>
        <Btn
          title={'أضف للسلة — ' + fmt(product.price * qty)}
          icon="bag-handle-outline"
          onPress={() => { addToCart(product.id, qty); navigation.navigate('Cart'); }}
          style={{ flex: 1 }}
          disabled={product.stock <= 0}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  hero: { height: 240, alignItems: 'center', justifyContent: 'center' },
  off: { position: 'absolute', top: 16, left: 16, backgroundColor: C.rose, paddingHorizontal: 10, paddingVertical: 5, borderRadius: R.sm },
  offTxt: { color: '#fff', fontSize: 12, fontWeight: '800' },
  name: { fontSize: 22, fontWeight: '800', color: C.ink, marginTop: 10, lineHeight: 32, textAlign: 'right' },
  desc: { fontSize: 14, color: C.muted, lineHeight: 24, marginTop: 12, textAlign: 'right' },
  perk: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, marginTop: 12, backgroundColor: C.surface, padding: 12, borderRadius: R.md, borderWidth: 1, borderColor: C.line },
  perkTxt: { flex: 1, fontSize: 13, color: C.ink, fontWeight: '600', textAlign: 'right' },
  relTitle: { fontSize: 17, fontWeight: '800', color: C.ink, marginBottom: 12 },
  relCard: { width: 130, backgroundColor: C.surface, borderRadius: R.lg, padding: 10, ...shadow(1) },
  relImg: { height: 70, borderRadius: R.md, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  relName: { fontSize: 12, fontWeight: '700', color: C.ink, lineHeight: 17, textAlign: 'right' },
  relPrice: { fontSize: 13, fontWeight: '800', color: C.goldDark, marginTop: 4, textAlign: 'right' },
  ctaBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row-reverse', alignItems: 'center', gap: 12, padding: 14, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.line },
  qty: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, backgroundColor: C.bg, borderRadius: R.md, paddingHorizontal: 8, paddingVertical: 6 },
  qtyBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.line },
  qtyTxt: { fontSize: 16, fontWeight: '800', color: C.ink, minWidth: 22, textAlign: 'center' },
});
