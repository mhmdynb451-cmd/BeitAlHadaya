# BeitAlHadaya — بيت الهدايا (غاوي خسارة)

Arabic RTL e-commerce Android app (Expo / React Native) for wedding-prep items, bridal appliances, clothes and home goods.

## Features
- Amazon-inspired home: search, hero banner, category rail, deals, best sellers
- Unlimited dynamic categories (main + sub), admin CRUD with icon/color pickers
- Email/password auth (Supabase when configured, local demo otherwise)
- Admin: product CRUD, trash/restore/purge, dynamic shipping regions & fees
- Checkout: COD for product value + upfront shipping deposit via Vodafone Cash or Visa
- AI support agent (Arabic) — bundle builder that adds items to cart directly from chat
- Zero hardcoded secrets: all keys via EXPO_PUBLIC_* env vars (see .env.example)

## Run
```bash
npm install
npx expo start        # press a for Android, w for web
```

## CI/CD (free, open-source friendly)
- `npm run build` → static web export (works on any CI runner, no native toolchain)
- EAS build config in `eas.json` (preview APK + production AAB); secrets via `eas secret:set`, never in repo
- GitHub Actions example:
```yaml
- uses: expo/expo-github-action@v8
- run: npm ci && npx expo export --platform web
```

## Supabase setup (optional)
Create tables `categories`, `products`, `orders`, `regions` with matching columns
(id, name, parent, icon, tint, price, old_price, stock, category_id, deleted, total,
shipping_fee, region, email, status, fee, created_at). Set env vars and the app
switches to cloud mode automatically.

Demo admin login: `admin@beitalhadaya.com` / `admin123` (demo mode only).
