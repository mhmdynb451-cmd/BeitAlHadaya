import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, R, shadow, fmt } from '../theme';
import { useApp } from '../context/AppContext';
import { SectionTitle, Price, Rating, Empty } from '../components/ui';

export default function HomeScreen({ navigation }) {
  const { liveProducts, categories, cartCount, addToCart } = useApp();
  const [q, setQ] = React.useState('');

  const deals = liveProducts.filter((p) => p.oldPrice && p.oldPrice > p.price).slice(0, 6);
  const best = [...liveProducts].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 6);
  const mainCats = categories.filter((c) => !c.parent);

  const results = q.trim()
    ? liveProducts.filter((p) => p.name.includes(q.trim()) || p.desc.includes(q.trim()))
    : null;

  const goCat = (cat) => navigation.navigate('Category', { categoryId: cat.id, title: cat.name });

  const Card = ({ item, wide }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate('Product', { productId: item.id })}
      style={[styles.card, wide && { width: 240 }]}
    >
      <View style={[styles.cardImg, { backgroundColor: item.tint + '1A' }]}>
        <Ionicons name={item.icon || 'cube-outline'} size={44} color={item.tint} />
        {item.oldPrice ? (
          <View style={styles.off}><Text style={styles.offTxt}>-{Math.round((1 - item.price / item.oldPrice) * 100)}%</Text></View>
        ) : null}
      </View>
      <View style={{ padding: 12, flex: 1 }}>
        <Text numberOfLines={2} style={styles.cardName}>{item.name}</Text>
        <View style={{ marginTop: 6 }}><Rating value={item.rating} sold={item.sold} /></View>
        <View style={{ marginTop: 8, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}>
          <Price value={item.price} old={item.oldPrice} />
          <TouchableOpacity
            onPress={() => addToCart(item.id)}
            style={styles.addBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (results) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.searchRow}>
          <TouchableOpacity onPress={() => setQ('')} style={styles.backBtn}>
            <Ionicons name="arrow-forward" size={22} color={C.ink} />
          </TouchableOpacity>
          <TextInput value={q} onChangeText={setQ} autoFocus placeholder="ابحث عن منتج..." placeholderTextColor={C.muted} style={styles.searchInput} />
        </View>
        <FlatList
          data={results}
          keyExtractor={(i) => i.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingVertical: 12, gap: 12, paddingBottom: 40 }}
          renderItem={({ item }) => <Card item={item} />}
          ListEmptyComponent={<Empty icon="search-outline" title="لا توجد نتائج" sub="جرب كلمة بحث مختلفة أو تصفح الأقسام" />}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']} testID="home">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brandSm}>غاوي خسارة</Text>
            <Text style={styles.brand}>بيت الهدايا</Text>
          </View>
          <View style={{ flexDirection: 'row-reverse', gap: 10 }}>
            <TouchableOpacity onPress={() => navigation.navigate('Support')} style={styles.hIcon}>
              <Ionicons name="chatbubbles-outline" size={21} color={C.ink} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.hIcon}>
              <Ionicons name="bag-outline" size={21} color={C.ink} />
              {cartCount > 0 && <View style={styles.dot}><Text style={styles.dotTxt}>{cartCount}</Text></View>}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.search} activeOpacity={0.8} onPress={() => setQ(' ')}>
          <Ionicons name="search" size={19} color={C.muted} />
          <Text style={styles.searchPh}>ابحث عن فستان، بوكس، أجهزة...</Text>
        </TouchableOpacity>

        <View style={styles.hero}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroKicker}>تجهيز العروسة</Text>
            <Text style={styles.heroTitle}>كل اللي بيتك محتاجه في مكان واحد</Text>
            <TouchableOpacity onPress={() => goCat(categories.find((c) => c.id === 'c4') || mainCats[0])} style={styles.heroBtn} activeOpacity={0.85}>
              <Text style={styles.heroBtnTxt}>اكتشف البوكسات</Text>
              <Ionicons name="arrow-back" size={15} color={C.slate} />
            </TouchableOpacity>
          </View>
          <View style={styles.heroArt}><Ionicons name="gift-outline" size={64} color={C.gold} /></View>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <SectionTitle title="تسوق حسب القسم" action="كل الأقسام" onAction={() => navigation.navigate('Categories')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 2 }}>
            {mainCats.map((c) => (
              <TouchableOpacity key={c.id} onPress={() => goCat(c)} style={styles.catCard} activeOpacity={0.85}>
                <View style={[styles.catIcon, { backgroundColor: c.tint + '1A' }]}>
                  <Ionicons name={c.icon} size={24} color={c.tint} />
                </View>
                <Text style={styles.catName}>{c.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ marginTop: 26 }}>
          <View style={{ paddingHorizontal: 16 }}><SectionTitle title="عروض اليوم" action="المزيد" onAction={() => navigation.navigate('Categories')} /></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}>
            {deals.map((p) => <Card key={p.id} item={p} wide />)}
          </ScrollView>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 26 }}>
          <SectionTitle title="الأكثر مبيعًا" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {best.map((p) => <Card key={p.id} item={p} />)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6 },
  brandSm: { fontSize: 12, color: C.goldDark, fontWeight: '700', letterSpacing: 0.5 },
  brand: { fontSize: 24, fontWeight: '800', color: C.ink },
  hIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', ...shadow(1) },
  dot: { position: 'absolute', top: -4, left: -4, backgroundColor: C.gold, minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  dotTxt: { color: '#fff', fontSize: 10, fontWeight: '800' },
  search: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, marginHorizontal: 16, marginTop: 8, backgroundColor: C.surface, borderRadius: R.md, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: C.line },
  searchPh: { color: C.muted, fontSize: 14, flex: 1, textAlign: 'right' },
  searchRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6 },
  searchInput: { flex: 1, backgroundColor: C.surface, borderRadius: R.md, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15, color: C.ink, textAlign: 'right', borderWidth: 1, borderColor: C.line },
  backBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' },
  hero: { flexDirection: 'row-reverse', marginHorizontal: 16, marginTop: 16, backgroundColor: C.slate, borderRadius: R.lg, padding: 20, overflow: 'hidden' },
  heroKicker: { color: C.gold, fontSize: 12, fontWeight: '700', marginBottom: 6 },
  heroTitle: { color: '#fff', fontSize: 20, fontWeight: '800', lineHeight: 30 },
  heroBtn: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, backgroundColor: C.gold, alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 9, borderRadius: R.pill, marginTop: 14 },
  heroBtnTxt: { color: C.slate, fontWeight: '800', fontSize: 13 },
  heroArt: { width: 96, alignItems: 'center', justifyContent: 'center' },
  catCard: { alignItems: 'center', width: 84 },
  catIcon: { width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  catName: { fontSize: 11, color: C.ink, fontWeight: '600', textAlign: 'center' },
  card: { width: '48.5%', backgroundColor: C.surface, borderRadius: R.lg, overflow: 'hidden', ...shadow(1) },
  cardImg: { height: 110, alignItems: 'center', justifyContent: 'center' },
  off: { position: 'absolute', top: 8, left: 8, backgroundColor: C.rose, paddingHorizontal: 7, paddingVertical: 3, borderRadius: R.sm },
  offTxt: { color: '#fff', fontSize: 10, fontWeight: '800' },
  cardName: { fontSize: 13, fontWeight: '700', color: C.ink, lineHeight: 19, textAlign: 'right' },
  addBtn: { width: 32, height: 32, borderRadius: 11, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center' },
});
