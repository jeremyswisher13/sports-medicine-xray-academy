# Sports Medicine X-Ray Academy

A premium educational web app for UCLA family medicine residents and sports medicine fellows.
**High-Yield Musculoskeletal Radiograph Interpretation** — by Jeremy Swisher, MD.

## Live
- **Primary**: https://swisher-xray-academy.web.app
- **Legacy**: https://ucla-hamstring-ultrasound.web.app

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the deploy workflow and [IMAGES.md](./IMAGES.md) for the image-sourcing protocol.

## What's inside
- 10 modules covering Foundations, Shoulder, Elbow, Wrist & Hand, Pelvis & Hip, Knee, Ankle & Foot, Spine, Pediatric & Adolescent, and a curated Do-Not-Miss case bank
- Per-module pre/post 3-question checks plus a course-wide pre/post knowledge quiz with a 6-domain confidence Likert
- 40+ flashcards with active recall (`/flashcards`)
- Printable cheat sheets per module (`/cheatsheets`)
- Image atlas with normal vs pathology filter (`/atlas`) — 52+ open-license radiographs and original UCLA SVG diagrams
- Curated supplemental AMSSM YouTube videos with post-video active-recall questions
- Admin dashboard with learner roll-up, module analytics, audit log, and CSV export
- Firestore-backed progress tracking with automatic localStorage fallback when Firebase isn't configured

## Stack
- Vite + React 18 + TypeScript (strict)
- Tailwind CSS (UCLA Health–inspired palette)
- Firebase Auth (Google OAuth) + Cloud Firestore
- React Router v6

## Local development

```bash
npm install
cp .env.example .env.local   # then paste your Firebase keys
npm run dev
```

The app boots in **localStorage-only mode** if Firebase keys aren't set. To enable real auth and persistent progress:

1. Create a Firebase project and enable **Authentication → Google** and **Firestore Database**.
2. Paste the web app config values into `.env.local`.
3. Set `VITE_FIREBASE_ENABLED=true`.
4. Restart `npm run dev`.

## Build / deploy

```bash
npm run typecheck    # TypeScript strict mode
npm run build        # production bundle to ./dist
npm run preview      # preview the production build locally
npm run deploy       # build + Firebase hosting + Firestore rules + indexes
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full deploy workflow including Firestore rules, custom domains, and rollback.

## Repository conventions
- TypeScript strict, no `any`, no `console.log` in committed code
- Tailwind utility classes only (custom palette in `tailwind.config.js`)
- Single icon system: `src/components/ui/Icon.tsx` (extend; don't add icon libraries)
- All Firestore writes go through `src/services/firestore.ts` (auto-fallback to localStorage)
- Image registry at `src/data/images.ts` — every entry includes source, license, and attribution

## Content rules
- All x-ray images come from open-license sources (predominantly Wikimedia Commons CC0/CC-BY/CC-BY-SA, plus original UCLA SVG diagrams). Never upload identifiable patient images. See [IMAGES.md](./IMAGES.md).
- AMSSM YouTube videos are linked as supplemental external resources; not reproduced.

## Disclaimer
This educational tool is designed for clinician education and does not replace formal radiology interpretation, clinical judgment, or institutional protocols.
