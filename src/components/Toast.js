import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, R, shadow } from '../theme';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toast } = useApp();
  const y = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    if (toast) {
      y.setValue(60);
      Animated.spring(y, { toValue: 0, useNativeDriver: true, bounciness: 6 }).start();
    }
  }, [toast, y]);

  if (!toast) return null;
  const bg = toast.type === 'error' ? C.danger : toast.type === 'success' ? C.success : C.slate;

  return (
    <View pointerEvents="none" style={styles.wrap}>
      <Animated.View style={[styles.toast, { backgroundColor: bg, transform: [{ translateY: y }] }, shadow(2)]}>
        <Ionicons name={toast.type === 'error' ? 'alert-circle' : toast.type === 'success' ? 'checkmark-circle' : 'information-circle'} size={18} color="#fff" />
        <Text style={styles.txt}>{toast.msg}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', bottom: 96, left: 16, right: 16, alignItems: 'center', zIndex: 100 },
  toast: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderRadius: R.pill },
  txt: { color: '#fff', fontSize: 13, fontWeight: '700' },
});
