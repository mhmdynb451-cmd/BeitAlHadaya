import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, R, shadow } from '../theme';
import { useApp } from '../context/AppContext';
import { Chip, Empty, Price, Rating } from '../components/ui';

const SORTS = [
  { key: 'new', label: 'الأحدث' },
  { key: 'priceAsc', label: 'الأقل سعرًا' },
  { key: 'priceDesc', label: 'الأعلى سعرًا' },
  { key: 'rating', label: 'الأعلى تقييمًا' },
];

export default function CategoryScreen({ route, navigation }) {
  const { categoryId, title } = route.params || {};
  const { liveProducts, categories } = useApp();
  const [sort, setSort] = React.useState('new');
  const [sub, setSub] = React.useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: title || 'الأقسام' });
  }, [navigation, title]);

  const subCats = categories.filter((c) => c.parent === categoryId);
  const ids = [categoryId, ...subCats.map((s) => s.id)].filter(Boolean);
  let items = liveProducts.filter((p) => ids.includes(p.categoryId));
  if (sub) items = items.filter((p) => p.categoryId === sub);

  items = [...items].sort((a, b) =>
    sort === 'priceAsc' ? a.price - b.price : sort === 'priceDesc' ? b.price - a.price : sort === 'rating' ? b.rating - a.rating : 0
  );

  const Card = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate('Product', { productId: item.id })}
      style={styles.card}
    >
      <View style={[styles.img, { backgroundColor: item.tint + '1A' }]}>
        <Ionicons name={item.icon || 'cube-outline'} size={40} color={item.tint} />
      </View>
      <View style={{ padding: 12, flex: 1 }}>
        <Text numberOfLines={2} style={styles.name}>{item.name}</Text>
        <View style={{ marginTop: 5 }}><Rating value={item.rating} sold={item.sold} /></View>
        <View style={{ marginTop: 8 }}><Price value={item.price} old={item.oldPrice} /></View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingVertical: 14, gap: 12, paddingBottom: 40, flexGrow: 1 }}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 16, marginBottom: 14 }}>
            {subCats.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
                <Chip label="الكل" active={!sub} onPress={() => setSub(null)} />
                {subCats.map((s) => <Chip key={s.id} label={s.name} active={sub === s.id} onPress={() => setSub(s.id)} />)}
              </ScrollView>
            )}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginTop: 10 }}>
              {SORTS.map((s) => <Chip key={s.key} label={s.label} active={sort === s.key} onPress={() => setSort(s.key)} />)}
            </ScrollView>
          </View>
        }
        renderItem={({ item }) => <Card item={item} />}
        ListEmptyComponent={<Empty icon="grid-outline" title="لا توجد منتجات بعد" sub="سيتم إضافة منتجات هذا القسم قريبًا" />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  card: { flex: 1, backgroundColor: C.surface, borderRadius: R.lg, overflow: 'hidden', ...shadow(1) },
  img: { height: 100, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 13, fontWeight: '700', color: C.ink, lineHeight: 19, textAlign: 'right' },
});
