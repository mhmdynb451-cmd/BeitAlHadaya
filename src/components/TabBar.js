import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, shadow } from '../theme';
import { useApp } from '../context/AppContext';

const TABS = [
  { key: 'Home', label: 'الرئيسية', icon: 'home-outline', path: '/home' },
  { key: 'Categories', label: 'الأقسام', icon: 'grid-outline', path: '/categories' },
  { key: 'Cart', label: 'السلة', icon: 'bag-handle-outline', path: '/cart' },
  { key: 'Orders', label: 'طلباتي', icon: 'receipt-outline', path: '/orders' },
  { key: 'Support', label: 'الدعم', icon: 'chatbubbles-outline', path: '/support' },
  { key: 'Admin', label: 'الإدارة', icon: 'settings-outline', path: '/admin' },
];

export default function TabBar({ state, navigation }) {
  const { cartCount } = useApp();
  const insets = useSafeAreaInsets();

  const tabs = TABS;

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }, shadow(2)]}>
      {tabs.map((t) => {
        const focused = state.routes[state.index] && state.routes[state.index].name === t.key;
        const color = focused ? C.goldDark : C.muted;
        return (
          <TouchableOpacity
            key={t.key}
            onPress={() => navigation.navigate(t.key)}
            style={styles.tab}
            activeOpacity={0.8}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
          >
            <View>
              <Ionicons name={t.icon} size={22} color={color} />
              {t.key === 'Cart' && cartCount > 0 && (
                <View style={styles.dot}><Text style={styles.dotTxt}>{cartCount}</Text></View>
              )}
            </View>
            <Text style={[styles.txt, { color }]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row-reverse',
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: C.line,
    paddingTop: 8,
    paddingHorizontal: 6,
  },
  tab: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 4 },
  txt: { fontSize: 10.5, fontWeight: '700' },
  dot: { position: 'absolute', top: -4, left: -6, backgroundColor: C.gold, minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  dotTxt: { color: '#fff', fontSize: 9, fontWeight: '800' },
});
