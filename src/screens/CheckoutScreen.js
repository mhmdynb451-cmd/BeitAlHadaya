import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, R, shadow, fmt } from '../theme';
import { useApp } from '../context/AppContext';
import { Btn, Input } from '../components/ui';

export default function CheckoutScreen({ navigation }) {
  const { cart, products, cartTotal, regions, settings, placeOrder, showToast } = useApp();
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [regionId, setRegionId] = React.useState(null);
  const [payMethod, setPayMethod] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const [busy, setBusy] = React.useState(false);

  const rows = cart.map((i) => ({ ...i, product: products.find((p) => p.id === i.productId) })).filter((r) => r.product);
  const region = regions.find((r) => r.id === regionId);
  const shipping = region ? region.fee : 0;

  if (rows.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Ionicons name="cart-outline" size={48} color={C.gold} />
          <Text style={{ fontSize: 16, fontWeight: '700', color: C.ink, marginTop: 12 }}>السلة فاضية</Text>
          <Btn title="تصفح المنتجات" onPress={() => navigation.navigate('Home')} style={{ marginTop: 16 }} small />
        </View>
      </SafeAreaView>
    );
  }

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'الاسم مطلوب';
    if (!/^01[0-9]{9}$/.test(phone.trim())) e.phone = 'رقم موبايل مصري صحيح (11 رقم)';
    if (!address.trim()) e.address = 'العنوان مطلوب';
    if (!regionId) e.region = 'اختار منطقتك';
    if (!payMethod) e.pay = 'اختار وسيلة دفع الشحن';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const confirm = () => {
    if (!validate()) return;
    Alert.alert(
      'تأكيد الدفع المقدم للشحن',
      'سيتم خصم ' + fmt(shipping) + ' رسوم شحن مقدمًا عبر ' + (payMethod === 'visa' ? 'بطاقة فيزا' : 'فودافون كاش') + '، وقيمة المنتجات ' + fmt(cartTotal) + ' كاش عند الاستلام. هل تريد المتابعة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تأكيد ودفع',
          onPress: async () => {
            setBusy(true);
            try {
              // Simulated secure payment handoff — real gateway tokens never touch the client.
              await new Promise((r) => setTimeout(r, 900));
              const order = await placeOrder({
                items: rows.map((r) => ({ productId: r.productId, name: r.product.name, qty: r.qty, price: r.product.price })),
                total: cartTotal,
                shippingFee: shipping,
                region: region.name,
                customerName: name.trim(),
                phone: phone.trim(),
                address: address.trim(),
                payMethod,
                paymentStatus: 'مدفوع (شحن مقدم)',
              });
              navigation.replace('OrderSuccess', { orderId: order.id });
            } catch (err) {
              showToast('تعذر إتمام الأوردر — حاول تاني', 'error');
            } finally {
              setBusy(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={styles.h1}>عنوان التوصيل</Text>
        <Input label="الاسم بالكامل" value={name} onChangeText={setName} error={errors.name} placeholder="مثال: محمد أحمد" />
        <Input label="رقم الموبايل" value={phone} onChangeText={setPhone} error={errors.phone} placeholder="01xxxxxxxxx" keyboardType="phone-pad" />
        <Input label="العنوان بالتفصيل" value={address} onChangeText={setAddress} error={errors.address} placeholder="الشارع، رقم العمارة، الدور، علامة مميزة" multiline />

        <Text style={styles.h1}>منطقة الشحن</Text>
        <View style={{ gap: 8 }}>
          {regions.map((r) => (
            <TouchableOpacity
              key={r.id}
              onPress={() => setRegionId(r.id)}
              style={[styles.region, regionId === r.id && { borderColor: C.gold, backgroundColor: C.goldSoft }]}
              activeOpacity={0.85}
            >
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 10 }}>
                <Ionicons name="location-outline" size={18} color={regionId === r.id ? C.goldDark : C.muted} />
                <Text style={[styles.regionName, regionId === r.id && { color: C.goldDark }]}>{r.name}</Text>
              </View>
              <Text style={[styles.regionFee, regionId === r.id && { color: C.goldDark }]}>{fmt(r.fee)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.region ? <Text style={styles.err}>{errors.region}</Text> : null}

        <Text style={[styles.h1, { marginTop: 22 }]}>دفع رسوم الشحن مقدمًا</Text>
        <Text style={styles.hint}>قيمة المنتجات تُدفع كاش عند الاستلام — رسوم الشحن فقط تُدفع الآن لتأكيد الأوردر</Text>
        <View style={{ gap: 8, marginTop: 10 }}>
          <TouchableOpacity
            onPress={() => setPayMethod('vodafone')}
            style={[styles.pay, payMethod === 'vodafone' && { borderColor: C.gold, backgroundColor: C.goldSoft }]}
            activeOpacity={0.85}
          >
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 10 }}>
              <View style={[styles.payIcon, { backgroundColor: '#E60000' }]}><Ionicons name="phone-portrait-outline" size={18} color="#fff" /></View>
              <View>
                <Text style={styles.payName}>فودافون كاش</Text>
                {settings.vodafoneNumber ? <Text style={styles.paySub}>تحويل إلى: {settings.vodafoneNumber}</Text> : null}
              </View>
            </View>
            <Ionicons name={payMethod === 'vodafone' ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={payMethod === 'vodafone' ? C.gold : C.line} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPayMethod('visa')}
            style={[styles.pay, payMethod === 'visa' && { borderColor: C.gold, backgroundColor: C.goldSoft }]}
            activeOpacity={0.85}
          >
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 10 }}>
              <View style={[styles.payIcon, { backgroundColor: C.slate }]}><Ionicons name="card-outline" size={18} color="#fff" /></View>
              <View>
                <Text style={styles.payName}>بطاقة فيزا / ماستركارد</Text>
                <Text style={styles.paySub}>دفع آمن عبر بوابة الدفع — بيانات البطاقة لا تُخزن</Text>
              </View>
            </View>
            <Ionicons name={payMethod === 'visa' ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={payMethod === 'visa' ? C.gold : C.line} />
          </TouchableOpacity>
        </View>
        {errors.pay ? <Text style={styles.err}>{errors.pay}</Text> : null}

        <View style={styles.summary}>
          <View style={styles.sRow}><Text style={styles.sLbl}>قيمة المنتجات (كاش عند الاستلام)</Text><Text style={styles.sVal}>{fmt(cartTotal)}</Text></View>
          <View style={styles.sRow}><Text style={styles.sLbl}>رسوم الشحن (تُدفع مقدمًا)</Text><Text style={styles.sVal}>{fmt(shipping)}</Text></View>
          <View style={[styles.sRow, { borderTopWidth: 1, borderTopColor: C.line, paddingTop: 10, marginTop: 4 }]}>
            <Text style={[styles.sLbl, { fontWeight: '800', color: C.ink }]}>المطلوب دفعه الآن</Text>
            <Text style={[styles.sVal, { fontWeight: '800', color: C.goldDark }]}>{fmt(shipping)}</Text>
          </View>
        </View>

        <Btn title={busy ? 'جارٍ تأكيد الدفع...' : 'تأكيد ودفع ' + fmt(shipping) + ' رسوم شحن'} onPress={confirm} loading={busy} style={{ marginTop: 18 }} />
        <Text style={styles.legal}>بالمتابعة أنت توافق على سياسة الاستبدال خلال 14 يوم. الدفع المقدم لرسوم الشحن غير قابل للاسترداد بعد بدء التجهيز.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  h1: { fontSize: 17, fontWeight: '800', color: C.ink, marginBottom: 12, marginTop: 8 },
  hint: { fontSize: 12, color: C.muted, lineHeight: 18, marginTop: -6, marginBottom: 10, textAlign: 'right' },
  region: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: R.md, paddingHorizontal: 14, paddingVertical: 13 },
  regionName: { fontSize: 14, fontWeight: '700', color: C.ink },
  regionFee: { fontSize: 14, fontWeight: '800', color: C.muted },
  pay: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: R.md, paddingHorizontal: 14, paddingVertical: 13 },
  payIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  payName: { fontSize: 14, fontWeight: '700', color: C.ink },
  paySub: { fontSize: 11, color: C.muted, marginTop: 2 },
  summary: { backgroundColor: C.surface, borderRadius: R.lg, padding: 16, marginTop: 20, borderWidth: 1, borderColor: C.line },
  sRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 8 },
  sLbl: { fontSize: 13, color: C.muted, fontWeight: '600' },
  sVal: { fontSize: 13, fontWeight: '700', color: C.ink },
  err: { color: C.danger, fontSize: 12, marginTop: 6, textAlign: 'right' },
  legal: { fontSize: 11, color: C.muted, textAlign: 'right', lineHeight: 17, marginTop: 12 },
});
