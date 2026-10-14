# Design Contract — BeitAlHadaya

- Primary user: Arabic-speaking bride/groom preparing a wedding; secondary: merchant/admin.
- Core journey: browse categories → product → cart → checkout (address → dynamic shipping fee → upfront shipping payment via Vodafone Cash/Visa → COD for product value) → order confirmation.
- Art direction: warm bridal palette — soft gold #C9A24B accent, warm beige bg #FAF6F1, white surfaces, dark slate ink #2B2B33, rose secondary #D98E8E. Full RTL (row-reverse + textAlign right everywhere, deterministic across platforms).
- Type: system fonts (Noto Sans Arabic on Android), weight-based hierarchy (800 titles / 600 body).
- Radius scale: 10/14/20/pill. One shadow scale. Spacing rhythm: multiples of 4.
- States: skeleton-free simple loaders (text-based), intentional empty states with icon + guidance, toasts bottom, bottom-sheet forms (no full-screen modals).
- Navigation: bottom tab bar (home, categories, cart, orders, support) + stack-style screen push for detail/checkout/admin.
- Motion: subtle press opacity only (0.85) — no heavy animation libs, keeps APK lean and CI-safe.
- Scope exclusions: no real payment gateway processing (simulated confirmation flow), no push notifications.
- Secrets: EXPO_PUBLIC_* env vars only; .env.example documents them; demo mode needs no keys.
