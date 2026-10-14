import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, R, shadow, fmt } from '../theme';
import { useApp } from '../context/AppContext';
import { Btn, Empty } from '../components/ui';

export default function CartScreen({ navigation }) {
  const { cart, products, setQty, removeFromCart, cartTotal } = useApp();

  const rows = cart
    .map((i) => ({ ...i, product: products.find((p) => p.id === i.productId) }))
    .filter((r) => r.product && !r.product.deleted);

  if (rows.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <Empty
          icon="bag-handle-outline"
          title="سلتك فاضية"
          sub="ابدأ التسوق واختار من تشكيلتنا الواسعة لتجهيز بيتك"
          actionLabel="تصفح المنتجات"
          onAction={() => navigation.navigate('Home')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <FlatList
        data={rows}
        keyExtractor={(i) => i.productId}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 130 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={[styles.img, { backgroundColor: item.product.tint + '1A' }]}>
              <Ionicons name={item.product.icon || 'cube-outline'} size={30} color={item.product.tint} />
            </View>
            <View style={{ flex: 1 }}>
              <Text numberOfLines={2} style={styles.name}>{item.product.name}</Text>
              <Text style={styles.price}>{fmt(item.product.price)}</Text>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 10, marginTop: 8 }}>
                <View style={styles.qty}>
                  <TouchableOpacity onPress={() => setQty(item.productId, item.qty - 1)} style={styles.qBtn}><Ionicons name="remove" size={15} color={C.ink} /></TouchableOpacity>
                  <Text style={styles.qTxt}>{item.qty}</Text>
                  <TouchableOpacity onPress={() => setQty(item.productId, item.qty + 1)} style={styles.qBtn}><Ionicons name="add" size={15} color={C.ink} /></TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.productId)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="trash-outline" size={18} color={C.danger} />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.lineTotal}>{fmt(item.product.price * item.qty)}</Text>
          </View>
        )}
      />
      <View style={[styles.bar, shadow(2)]}>
        <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text style={styles.barLbl}>إجمالي المنتجات</Text>
          <Text style={styles.barVal}>{fmt(cartTotal)}</Text>
        </View>
        <Text style={styles.note}>رسوم الشحن تُحسب حسب منطقتك في الخطوة التالية وتُدفع مقدمًا لتأكيد الأوردر</Text>
        <Btn title="إتمام الشراء" icon="arrow-back-circle-outline" onPress={() => navigation.navigate('Checkout')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  row: { flexDirection: 'row-reverse', backgroundColor: C.surface, borderRadius: R.lg, padding: 12, gap: 12, ...shadow(1) },
  img: { width: 64, height: 64, borderRadius: R.md, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 13, fontWeight: '700', color: C.ink, lineHeight: 18, textAlign: 'right', flex: 1 },
  price: { fontSize: 13, color: C.goldDark, fontWeight: '800', marginTop: 3, textAlign: 'right' },
  lineTotal: { fontSize: 14, fontWeight: '800', color: C.ink, alignSelf: 'flex-start' },
  qty: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  qBtn: { width: 26, height: 26, borderRadius: 9, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.line },
  qTxt: { fontSize: 14, fontWeight: '800', color: C.ink, minWidth: 18, textAlign: 'center' },
  bar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.line },
  barLbl: { fontSize: 13, color: C.muted, fontWeight: '600' },
  barVal: { fontSize: 18, fontWeight: '800', color: C.ink },
  note: { fontSize: 11, color: C.muted, textAlign: 'right', marginBottom: 10, lineHeight: 16 },
});
