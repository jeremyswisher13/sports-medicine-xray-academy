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
