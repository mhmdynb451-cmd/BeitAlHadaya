import React, { useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, R, shadow } from '../theme';
import { useApp } from '../context/AppContext';
import { agentReply } from '../services/aiAgent';

let msgId = 0;
const nid = () => 'm' + (++msgId);

export default function SupportScreen() {
  const { liveProducts, categories, regions, addToCart } = useApp();
  const [msgs, setMsgs] = React.useState([
    { id: nid(), role: 'bot', text: 'أهلاً بيك في بيت الهدايا 👋 أنا مساعدك الذكي. أقدر أساعدك في تجهيز العروسة، اختيار البوكسات، أو معرفة تفاصيل الشحن والدفع.', suggestions: ['جهزلي بوكس عروسة', 'مصاريف الشحن؟', 'إزاي أدفع؟'] },
  ]);
  const [input, setInput] = React.useState('');

  const send = (text) => {
    const t = (text != null ? text : input).trim();
    if (!t) return;
    setInput('');
    setMsgs((prev) => [...prev, { id: nid(), role: 'me', text: t }]);
    setTimeout(() => {
      const reply = agentReply(t, { categories, products: liveProducts, regions, addToCart });
      setMsgs((prev) => [...prev, { id: nid(), role: 'bot', text: reply.text, actions: reply.actions, suggestions: reply.suggestions }]);
    }, 450);
  };

  const runAction = (a) => {
    if (a.type === 'add_to_cart') addToCart(a.productId);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={[...msgs].reverse()}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          renderItem={({ item }) => (
            <View style={{ alignItems: item.role === 'me' ? 'flex-start' : 'flex-end' }}>
              <View style={[styles.bubble, item.role === 'me' ? styles.me : styles.bot]}>
                <Text style={[styles.bTxt, item.role === 'me' && { color: '#fff' }]}>{item.text}</Text>
                {item.actions && item.actions.length > 0 && (
                  <View style={{ gap: 6, marginTop: 10 }}>
                    {item.actions.map((a, i) => (
                      <TouchableOpacity key={i} onPress={() => runAction(a)} style={styles.actBtn} activeOpacity={0.8}>
                        <Ionicons name="add-circle-outline" size={16} color={C.goldDark} />
                        <Text style={styles.actTxt}>{a.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {item.suggestions && item.suggestions.length > 0 && (
                  <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                    {item.suggestions.map((s, i) => (
                      <TouchableOpacity key={i} onPress={() => send(s)} style={styles.sugg} activeOpacity={0.8}>
                        <Text style={styles.suggTxt}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          )}
        />
        <View style={styles.inputBar}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="اكتب سؤالك..."
            placeholderTextColor={C.muted}
            style={styles.input}
            onSubmitEditing={() => send()}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={() => send()} style={styles.send} activeOpacity={0.85}>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  bubble: { maxWidth: '85%', padding: 14, borderRadius: R.lg },
  me: { backgroundColor: C.gold, borderBottomLeftRadius: 6 },
  bot: { backgroundColor: C.surface, borderBottomRightRadius: 6, borderWidth: 1, borderColor: C.line, ...shadow(1) },
  bTxt: { fontSize: 14, color: C.ink, lineHeight: 22, textAlign: 'right' },
  actBtn: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, backgroundColor: C.goldSoft, paddingHorizontal: 12, paddingVertical: 9, borderRadius: R.md },
  actTxt: { fontSize: 12, fontWeight: '700', color: C.goldDark, flex: 1, textAlign: 'right' },
  sugg: { backgroundColor: C.bg, borderWidth: 1, borderColor: C.line, paddingHorizontal: 12, paddingVertical: 7, borderRadius: R.pill },
  suggTxt: { fontSize: 12, color: C.ink, fontWeight: '600' },
  inputBar: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, padding: 12, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.line },
  input: { flex: 1, backgroundColor: C.bg, borderRadius: R.pill, paddingHorizontal: 16, paddingVertical: 11, fontSize: 14, color: C.ink, textAlign: 'right' },
  send: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center' },
});
