# Project Context

*Auto-maintained by Multos. Updated after every build.*

## Build
- **Last build:** 2026-10-14 00:47 UTC
- **Preview:** https://app-8c56d65e-preview.multos.app
- **Build:** ✅ Success
- **Quality:** FAIL
- **Verification build:** dde8482be550424e9784e54bdf825ea7
- **Unmet quality gates:** journeys, interaction, visual, accessibility, motion, performance

## Session update (build fix)
- Fixed web export: app.json web.output changed static -> single (static required expo-router, which this app doesn't use).
- Fixed broken relative imports in App.js (./theme, ./context/AppContext, ./components/*, ./screens/* -> ./src/...).
- Added testID="home" to HomeScreen root so the acceptance journey can assert it.
- Build + both acceptance journeys PASS (build_id 1ea6b291). Interaction/visual/a11y/motion/perf remain UNVERIFIED (no browser evidence available; screenshot persistence failed).
- Remaining: email/password auth polish, Supabase cloud-mode end-to-end verification, COD checkout live test.
