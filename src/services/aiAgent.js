// AI support agent (Arabic). Rule-based engine that works fully offline.
// If EXPO_PUBLIC_AI_API_KEY is set, a hosted LLM can be layered on top later —
// the key is read from env only, never hardcoded.
import { fmt } from '../theme';

const pick = (arr, n) => arr.slice(0, n);

export function agentReply(text, ctx) {
  const t = (text || '').trim();
  const has = (...ws) => ws.some((w) => t.includes(w));
  const { categories, products, regions, addToCart } = ctx;
  const live = products.filter((p) => !p.deleted);

  if (has('مرحبا', 'السلام', 'اهلا', 'أهلا', 'هاي')) {
    return {
      text: 'أهلاً بيك في بيت الهدايا 👋 أنا مساعدك الذكي. أقدر أساعدك في تجهيز العروسة، اختيار البوكسات، أو معرفة تفاصيل الشحن والدفع. تحب نبدأ بإيه؟',
      actions: [],
      suggestions: ['جهزلي بوكس عروسة', 'إزاي أدفع؟', 'مصاريف الشحن؟'],
    };
  }

  if (has('شحن', 'توصيل', 'الشحن', 'مصاريف')) {
    const lines = regions.map((r) => `• ${r.name}: ${fmt(r.fee)}`).join('\n');
    return {
      text: `الشحن بيتحسب حسب المنطقة بالظبط:\n${lines}\n\nوقيمة المنتج بتتدفع كاش عند الاستلام (الدفع عند الاستلام)، أما رسوم الشحن بتتدفع مقدمًا لتأكيد الأوردر.`,
      actions: [],
      suggestions: ['إزاي أدفع الشحن؟', 'شوف المنتجات'],
    };
  }

  if (has('دفع', 'فيزا', 'فودافون', 'كاش', 'الدفع')) {
    return {
      text: 'نظامنا بسيط:\n1) قيمة المنتجات: كاش عند الاستلام.\n2) رسوم الشحن: بتتدفع مقدمًا لتأكيد الأوردر — فيزا أو فودافون كاش.\n\nبيانات البطاقة مش بتتخزن عندنا نهائيًا، بتتوثق عبر بوابة دفع آمنة.',
      actions: [],
      suggestions: ['جهزلي بوكس عروسة', 'مصاريف الشحن؟'],
    };
  }

  if (has('بوكس', 'بندل', 'تجهيز', 'عروسة', 'خطوبة', 'زفاف', 'جهيزة')) {
    const bundle = [
      live.find((p) => p.categoryId === 'c4s1'),
      live.find((p) => p.categoryId === 'c3s1'),
      live.find((p) => p.categoryId === 'c6'),
      live.find((p) => p.categoryId === 'c5'),
    ].filter(Boolean);
    const total = bundle.reduce((s, p) => s + p.price, 0);
    return {
      text: `جهزتلك اقتراح بوكس العروسة الأساسي 🎁\n${bundle.map((p) => `• ${p.name} — ${fmt(p.price)}`).join('\n')}\n\nالإجمالي: ${fmt(total)} (بدون الشحن). تحب أضيفهم للسلة؟`,
      actions: bundle.map((p) => ({ type: 'add_to_cart', productId: p.id, label: `أضف: ${p.name}` })),
      suggestions: ['أضف الكل للسلة', 'مصاريف الشحن؟'],
    };
  }

  if (has('طلبي', 'تتبع', 'اوردر', 'أوردر', 'طلبات')) {
    return {
      text: 'تقدر تتابع كل أوردراتك من تبويب «طلباتي» في الشريط السفلي. حالة الأوردر بتتحول من «بانتظار دفع الشحن» إلى «قيد التجهيز» بعد تأكيد الدفع المقدم.',
      actions: [],
      suggestions: ['إزاي أدفع الشحن؟'],
    };
  }

  if (has('ارجاع', 'إرجاع', 'استبدال', 'استرجاع')) {
    return {
      text: 'الاستبدال متاح خلال 14 يوم من الاستلام بشرط أن يكون المنتج بحالته الأصلية. رسوم الشحن غير قابلة للاسترداد بعد بدء التجهيز.',
      actions: [],
      suggestions: ['شوف المنتجات'],
    };
  }

  // Category / product intent
  const cat = categories.find((c) => !c.parent && t.includes(c.name.split(' ')[0]));
  if (cat) {
    const items = pick(live.filter((p) => {
      const c = categories.find((x) => x.id === p.categoryId);
      return c && (c.id === cat.id || c.parent === cat.id);
    }), 3);
    if (items.length) {
      return {
        text: `أحسن اختيارات في «${cat.name}»:\n${items.map((p) => `• ${p.name} — ${fmt(p.price)}`).join('\n')}`,
        actions: items.map((p) => ({ type: 'add_to_cart', productId: p.id, label: `أضف: ${p.name}` })),
        suggestions: ['جهزلي بوكس عروسة'],
      };
    }
  }

  if (has('بحث', 'دور', 'عايز', 'أريد', 'ابحث')) {
    return {
      text: 'قولي اسم المنتج أو القسم اللي بتدور عليه (أجهزة، ملابس، مطبخ، بوكسات، ديكور، مفروشات) وأنا أرشحلك الأفضل فورًا.',
      actions: [],
      suggestions: ['بوكسات هدايا', 'أجهزة كهربائية', 'مفروشات'],
    };
  }

  return {
    text: 'أنا هنا لمساعدتك في: تجهيز العروسة، البوكسات، تفاصيل الشحن والدفع، وتتبع الأوردر. اختار من الاقتراحات أو اسألني مباشرة.',
    actions: [],
    suggestions: ['جهزلي بوكس عروسة', 'مصاريف الشحن؟', 'إزاي أدفع؟'],
  };
}
