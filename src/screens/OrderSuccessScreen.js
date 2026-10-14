import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, R, shadow } from '../theme';
import { Btn } from '../components/ui';

export default function OrderSuccessScreen({ route, navigation }) {
  const { orderId } = route.params || {};
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.wrap}>
        <View style={styles.circle}><Ionicons name="checkmark" size={56} color={C.success} /></View>
        <Text style={styles.h}>تم تأكيد أوردر بنجاح!</Text>
        <Text style={styles.p}>تم استلام دفع رسوم الشحن المقدم. الأوردر دلوقتي في حالة «بانتظار التجهيز»، وقيمة المنتجات هتتدفع كاش عند الاستلام.</Text>
        {orderId ? <View style={styles.idBox}><Text style={styles.idLbl}>رقم الأوردر</Text><Text style={styles.idVal}>{orderId}</Text></View> : null}
        <Btn title="تتبع طلبي" icon="receipt-outline" onPress={() => navigation.navigate('Orders')} style={{ alignSelf: 'stretch', marginTop: 24 }} />
        <Btn title="متابعة التسوق" variant="ghost" onPress={() => navigation.navigate('Home')} style={{ alignSelf: 'stretch', marginTop: 10 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  circle: { width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(94,140,97,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  h: { fontSize: 22, fontWeight: '800', color: C.ink, textAlign: 'center' },
  p: { fontSize: 14, color: C.muted, textAlign: 'center', lineHeight: 23, marginTop: 10 },
  idBox: { marginTop: 20, backgroundColor: C.surface, borderRadius: R.md, paddingHorizontal: 20, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: C.line, ...shadow(1) },
  idLbl: { fontSize: 11, color: C.muted, fontWeight: '600' },
  idVal: { fontSize: 15, fontWeight: '800', color: C.goldDark, marginTop: 2 },
});
