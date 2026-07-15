# Deployment

## Live URLs

- **Primary:** https://swisher-xray-academy.web.app
- **Legacy:** https://ucla-hamstring-ultrasound.web.app (kept until you confirm everyone has migrated)
- **Console:** https://console.firebase.google.com/project/ucla-hamstring-ultrasound

Both sites serve the same build. You can delete the legacy site at any time from the Firebase console once it's no longer needed.

## What's deployed
- Firebase Hosting (Vite production bundle from `dist/`)
- Firestore security rules (`firestore.rules`)
- Firestore composite indexes (`firestore.indexes.json`)

## Required one-time console steps

These cannot be automated from the CLI — please do them once in https://console.firebase.google.com/project/ucla-hamstring-ultrasound:

1. **Enable Google Sign-In**
   - Authentication → Sign-in method → Google → Enable
   - Set the public-facing project name and a support email
2. **Authorized domains** (Authentication → Settings → Authorized domains)
   - Confirm `swisher-xray-academy.web.app` and `ucla-hamstring-ultrasound.web.app` are present (auto-added on hosting deploy)
   - Add any custom domain you wire up later (e.g. `xray.swisher.uclahealth.org`)
3. *(Optional)* **Delete legacy hamstring-ultrasound Firestore data**
   - Firestore Database → Data → expand any old collections from the prior project and delete them
   - The new x-ray app uses different collection names (`users`, `moduleProgress`, `quizAttempts`, `confidenceRatings`, `caseAttempts`, `videoProgress`, `auditLogs`, `bookmarks`, `adminContentDrafts`) and won't collide

## Deploy commands

```bash
# Full deploy (hosting + Firestore rules + indexes)
npm run deploy

# Selective
npm run deploy:hosting
npm run deploy:rules
npm run deploy:indexes
```

The `deploy` scripts invoke `firebase` from `node_modules/.bin`, so no global install is needed.

## Release gate

Do not deploy directly after a curriculum or persistence change. Complete this gate first:

```bash
npm run check
npm run build
npm run preview -- --host 127.0.0.1
SMOKE_BASE_URL=http://127.0.0.1:4173 SMOKE_EXPECT_PWA=1 npm run smoke:app
```

`npm run check` includes unit tests, Firestore emulator rules tests, the curriculum audit, and the production/PWA audit. The rules emulator requires JDK 21; this Mac uses Homebrew `openjdk@21`.

Firestore rules are intentionally a separate release decision. Review the emulator results and the `firestore.rules` diff before running `npm run deploy:rules`; do not bundle a rules deploy into a content-only release without that review.

## Local development with Firebase emulators (optional)

```bash
npm run emulators
```
Then run `npm run dev` in another terminal.

## Custom domain (optional)

1. Firebase console → Hosting → Add custom domain
2. Choose the `swisher-xray-academy` site
3. Follow the DNS instructions
4. After SSL provisioning completes, add the new domain to **Authentication → Authorized domains**

## Rollback

Hosting keeps every deploy. Use:
- Console → Hosting → Release history → click any prior release → **Rollback**
- or `npx firebase hosting:rollback --site swisher-xray-academy`

## Re-deploying after content edits

Curriculum content lives in `src/data/`:
- `modules.ts` — module text, views, anatomy, pathology, cases, quizzes
- `videoResources.ts` — AMSSM video catalog
- `quizzes.ts` — pre/post-course bank and confidence domains

After editing, just run `npm run deploy:hosting` (Firestore data is per-learner and isn't in this repo).

## Fellow home-screen QA before release

Run this on a real iPhone in Safari before asking fellows to install the app:

1. Open the primary URL, sign in, and confirm the welcome screen is readable without zoom.
2. Safari Share → Add to Home Screen → launch from the new icon.
3. Confirm the app opens full-screen to the dashboard, with the top status area and bottom nav clear of the iPhone safe areas.
4. Tap Dashboard, Modules, Cards, and Sheets in the bottom nav; each should load without browser chrome or horizontal scrolling.
5. Start the pre-course assessment and confirm the bottom nav stays hidden during quiz flow.
6. Open X-Ray Foundations after the course baseline and confirm the module entry check is the first active task.
7. Turn on Airplane Mode, relaunch the home-screen app, and confirm the dashboard shell and offline banner render.
8. Turn Airplane Mode off, reload once, and confirm videos/resources that need internet recover normally.
9. Deploy a new build, reopen the installed app, and confirm the update prompt appears or the new version loads after refresh.
10. Repeat one quick pass on a small iPhone viewport and one larger iPhone/Plus viewport.
11. Confirm a second learner on the same device does not inherit the first learner's flashcard or systematic-read state.
12. Complete a record while offline, reconnect, refresh, and confirm the result remains visible and syncs without duplication.
