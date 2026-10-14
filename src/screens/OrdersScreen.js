import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, R, shadow, fmt } from '../theme';
import { useApp } from '../context/AppContext';
import { Badge, Empty } from '../components/ui';

const statusTone = (s) => (s.includes('بانتظار') ? 'gold' : s.includes('تجهيز') ? 'slate' : s.includes('تم') ? 'green' : 'red');

export default function OrdersScreen({ navigation }) {
  const { orders, user } = useApp();
  const mine = orders.filter((o) => !user || o.email === user.email);

  if (mine.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <Empty
          icon="receipt-outline"
          title="لا توجد أوردرات بعد"
          sub="أول أوردر ليك هيظهر هنا مع حالته وتفاصيله كاملة"
          actionLabel="ابدأ التسوق"
          onAction={() => navigation.navigate('Home')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={mine}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.id}>#{item.id.slice(-6).toUpperCase()}</Text>
              <Badge text={item.status} tone={statusTone(item.status)} />
            </View>
            <View style={{ gap: 4, marginTop: 10 }}>
              {item.items.map((it, idx) => (
                <Text key={idx} style={styles.item} numberOfLines={1}>• {it.name} × {it.qty}</Text>
              ))}
            </View>
            <View style={[styles.sRow, { marginTop: 10 }]}>
              <Text style={styles.sLbl}>المنتجات (كاش عند الاستلام)</Text>
              <Text style={styles.sVal}>{fmt(item.total)}</Text>
            </View>
            <View style={styles.sRow}>
              <Text style={styles.sLbl}>الشحن ({item.region}) — مدفوع مقدمًا</Text>
              <Text style={[styles.sVal, { color: C.success }]}>{fmt(item.shippingFee)} ✓</Text>
            </View>
            <View style={[styles.sRow, { borderTopWidth: 1, borderTopColor: C.line, paddingTop: 8, marginTop: 4 }]}>
              <Text style={styles.sLbl}>العنوان</Text>
              <Text style={[styles.sVal, { fontWeight: '600', flexShrink: 1, textAlign: 'left' }]} numberOfLines={1}>{item.address}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  card: { backgroundColor: C.surface, borderRadius: R.lg, padding: 16, ...shadow(1) },
  id: { fontSize: 14, fontWeight: '800', color: C.ink },
  item: { fontSize: 13, color: C.ink, textAlign: 'right' },
  sRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginTop: 4 },
  sLbl: { fontSize: 12, color: C.muted, fontWeight: '600' },
  sVal: { fontSize: 13, fontWeight: '700', color: C.ink },
});
