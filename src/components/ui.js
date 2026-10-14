import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, R, shadow, fmt } from '../theme';

export function Btn({ title, onPress, variant = 'primary', icon, disabled, loading, style, small }) {
  const bg = variant === 'primary' ? C.gold : variant === 'dark' ? C.slate : variant === 'danger' ? C.danger : 'transparent';
  const fg = variant === 'ghost' ? C.muted : '#FFFFFF';
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        styles.btn,
        { backgroundColor: bg, paddingVertical: small ? 10 : 14 },
        variant === 'ghost' && { borderWidth: 1, borderColor: C.line },
        variant === 'outline' && { borderWidth: 1.5, borderColor: C.gold },
        (disabled || loading) && { opacity: 0.55 },
        style,
      ]}
    >
      {loading ? (
        <Text style={{ color: fg, fontSize: 14, fontWeight: '700' }}>...جارٍ التنفيذ</Text>
      ) : (
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 8 }}>
          {icon ? <Ionicons name={icon} size={18} color={fg} /> : null}
          <Text style={{ color: variant === 'outline' ? C.goldDark : fg, fontSize: small ? 13 : 15, fontWeight: '700' }}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function Input({ label, error, style, ...props }) {
  return (
    <View style={{ marginBottom: 14 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={C.muted}
        style={[styles.input, error && { borderColor: C.danger }, style]}
        {...props}
      />
      {error ? <Text style={{ color: C.danger, fontSize: 12, marginTop: 4, textAlign: 'right' }}>{error}</Text> : null}
    </View>
  );
}

export function Chip({ label, active, onPress, icon }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.chip, active && { backgroundColor: C.gold, borderColor: C.gold }]}
    >
      {icon ? <Ionicons name={icon} size={15} color={active ? '#fff' : C.muted} /> : null}
      <Text style={{ color: active ? '#fff' : C.ink, fontSize: 13, fontWeight: active ? '700' : '500' }}>{label}</Text>
    </TouchableOpacity>
  );
}

export function Empty({ icon = 'cube-outline', title, sub, actionLabel, onAction }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32 }}>
      <View style={{ width: 72, height: 72, borderRadius: 24, backgroundColor: C.goldSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Ionicons name={icon} size={32} color={C.gold} />
      </View>
      <Text style={{ fontSize: 17, fontWeight: '700', color: C.ink, textAlign: 'center' }}>{title}</Text>
      {sub ? <Text style={{ fontSize: 13, color: C.muted, textAlign: 'center', marginTop: 6, lineHeight: 20 }}>{sub}</Text> : null}
      {actionLabel ? <Btn title={actionLabel} onPress={onAction} style={{ marginTop: 18 }} small /> : null}
    </View>
  );
}

export function Price({ value, old, big }) {
  return (
    <View style={{ flexDirection: 'row-reverse', alignItems: 'baseline', gap: 8 }}>
      <Text style={{ fontSize: big ? 24 : 16, fontWeight: '800', color: C.goldDark }}>{fmt(value)}</Text>
      {old ? <Text style={{ fontSize: big ? 14 : 12, color: C.muted, textDecorationLine: 'line-through' }}>{fmt(old)}</Text> : null}
    </View>
  );
}

export function Rating({ value, sold }) {
  return (
    <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 4 }}>
      <Ionicons name="star" size={13} color={C.gold} />
      <Text style={{ fontSize: 12, color: C.muted, fontWeight: '600' }}>{Number(value).toFixed(1)}{sold ? ` · ${sold} مبيع` : ''}</Text>
    </View>
  );
}

export function Badge({ text, tone = 'gold' }) {
  const map = { gold: [C.goldSoft, C.goldDark], green: ['rgba(94,140,97,0.12)', C.success], red: ['rgba(192,86,79,0.12)', C.danger], slate: ['rgba(58,58,68,0.08)', C.slate] };
  const [bg, fg] = map[tone] || map.gold;
  return <View style={{ backgroundColor: bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: R.sm, alignSelf: 'flex-start' }}><Text style={{ color: fg, fontSize: 11, fontWeight: '700' }}>{text}</Text></View>;
}

export function Sheet({ visible, onClose, title, children }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(43,43,51,0.45)', justifyContent: 'flex-end' }}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        <View style={{ backgroundColor: C.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, maxHeight: '88%' }}>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: C.ink }}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={22} color={C.muted} />
            </TouchableOpacity>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>{children}</ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export function SectionTitle({ title, action, onAction }) {
  return (
    <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <Text style={{ fontSize: 19, fontWeight: '800', color: C.ink }}>{title}</Text>
      {action ? (
        <TouchableOpacity onPress={onAction} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={{ color: C.goldDark, fontSize: 13, fontWeight: '700' }}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: R.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  label: { fontSize: 13, fontWeight: '700', color: C.ink, marginBottom: 6, textAlign: 'right' },
  input: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: R.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: C.ink,
    textAlign: 'right',
  },
  chip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: R.pill,
  },
});
