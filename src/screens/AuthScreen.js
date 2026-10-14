import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, R } from '../theme';
import { useApp } from '../context/AppContext';
import { Btn, Input } from '../components/ui';

export default function AuthScreen({ navigation }) {
  const { signIn, signUp } = useApp();
  const [mode, setMode] = React.useState('login');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [err, setErr] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const submit = async () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return setErr('بريد إلكتروني غير صحيح');
    if (password.length < 6) return setErr('كلمة السر 6 أحرف على الأقل');
    setErr('');
    setBusy(true);
    try {
      if (mode === 'login') await signIn(email.trim(), password);
      else await signUp(email.trim(), password);
      navigation.goBack();
    } catch (e) {
      setErr(e.message || 'حدث خطأ — حاول تاني');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} keyboardShouldPersistTaps="handled">
        <View style={styles.logo}>
          <Ionicons name="gift-outline" size={34} color={C.gold} />
        </View>
        <Text style={styles.brand}>بيت الهدايا</Text>
        <Text style={styles.sub}>غاوي خسارة — سجل دخولك لمتابعة أوردراتك والتسوق بسهولة</Text>

        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => setMode('login')} style={[styles.tab, mode === 'login' && styles.tabOn]}>
            <Text style={[styles.tabTxt, mode === 'login' && styles.tabTxtOn]}>تسجيل الدخول</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode('signup')} style={[styles.tab, mode === 'signup' && styles.tabOn]}>
            <Text style={[styles.tabTxt, mode === 'signup' && styles.tabTxtOn]}>حساب جديد</Text>
          </TouchableOpacity>
        </View>

        <Input label="البريد الإلكتروني" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />
        <Input label="كلمة السر" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
        {err ? <Text style={styles.err}>{err}</Text> : null}

        <Btn title={mode === 'login' ? 'دخول' : 'إنشاء الحساب'} onPress={submit} loading={busy} style={{ marginTop: 8 }} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16, alignSelf: 'center' }}>
          <Text style={styles.skip}>متابعة كزائر</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>حساب تجريبي للإدارة: admin@beitalhadaya.com / admin123</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  logo: { width: 72, height: 72, borderRadius: 24, backgroundColor: C.goldSoft, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  brand: { fontSize: 26, fontWeight: '800', color: C.ink, textAlign: 'center', marginTop: 14 },
  sub: { fontSize: 13, color: C.muted, textAlign: 'center', marginTop: 6, lineHeight: 20 },
  tabs: { flexDirection: 'row-reverse', backgroundColor: C.surface, borderRadius: R.md, padding: 4, marginTop: 26, borderWidth: 1, borderColor: C.line },
  tab: { flex: 1, paddingVertical: 10, borderRadius: R.sm, alignItems: 'center' },
  tabOn: { backgroundColor: C.gold },
  tabTxt: { fontSize: 14, fontWeight: '700', color: C.muted },
  tabTxtOn: { color: '#fff' },
  err: { color: C.danger, fontSize: 13, textAlign: 'right', marginBottom: 10 },
  skip: { fontSize: 14, color: C.goldDark, fontWeight: '700' },
  hint: { fontSize: 11, color: C.muted, textAlign: 'center', marginTop: 22 },
});
