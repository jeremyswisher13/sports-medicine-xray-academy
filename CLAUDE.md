# Claude Code Handoff

Date: 2026-06-06

## Project

Sports Medicine X-Ray Academy is a Vite + React 18 + TypeScript educational app for musculoskeletal radiograph interpretation. It uses Tailwind CSS, React Router v6, Firebase Auth/Firestore, and localStorage fallbacks when Firebase is not configured.

Live app and deployment notes are in `README.md` and `DEPLOYMENT.md`. Image sourcing and licensing rules are in `IMAGES.md`.

## Current Git State

- Branch: `codex/module-completion-reward`
- Worktree was clean immediately before this handoff file was added.
- Recent commits:
  - `18d6b14 harden Google sign-in fallback`
  - `2e2616f add module completion reward`
  - `932715a polish learner flow`
  - `285ab1c improve active learning flow`
  - `17a6226 simplify active learning flow`

## Run Commands

```bash
npm install
npm run dev
npm run test
npm run typecheck
npm run build
```

The app can boot without Firebase keys in localStorage-only mode. Do not expose `.env.local`; use `.env.example` for expected variable names.

## Code Conventions

- TypeScript strict mode.
- No committed `any`.
- No committed `console.log`.
- Tailwind utilities are the main styling mechanism.
- Icons live in `src/components/ui/Icon.tsx`; extend that file rather than adding an icon library.
- Firestore writes should go through `src/services/firestore.ts`, which also owns localStorage fallback behavior.
- Image registry lives in `src/data/images.ts`; every image entry should preserve source, license, and attribution.

## Important Files

- `src/App.tsx`: route shell.
- `src/pages/ModuleDetail.tsx`: main learner module workflow.
- `src/components/ModuleCheck.tsx`: pre/post module quick checks, confidence capture, module progress saving.
- `src/components/ModuleCompletionReward.tsx`: newly added post-check reward panel.
- `src/components/ModuleNextTaskPanel.tsx`: next-step/phase navigation panel.
- `src/data/modules.ts`: core module content.
- `src/data/moduleChecks.ts`: module pre/post check derivation.
- `src/hooks/useProgress.ts`: progress snapshot loader.
- `src/services/auth.ts`: latest commit hardened Google sign-in fallback.
- `src/services/firestore.ts`: persistence and fallback layer.
- `src/__tests__/dataGuards.test.ts`: curriculum/data integrity tests.

## Most Likely Cleanup Area

The branch name and recent commits suggest the current work is centered on the module completion flow.

`ModuleCompletionReward` was added and is rendered in `ModuleDetailPage` after a module post-check is saved:

- `src/components/ModuleCompletionReward.tsx`
- `src/pages/ModuleDetail.tsx`

Current behavior to review:

- The post-check in the takeaways phase has `completeModuleOnFinish`, so finishing the post-check can mark the module complete automatically.
- The module header also conditionally shows a separate `Mark complete` button when content is unlocked, not complete, and `moduleProgress?.postCheckAt` exists.
- Because post-check completion already marks complete in the normal flow, that header button may be redundant or only useful for older progress records. Decide whether to keep it as a fallback, hide it, or make the completion behavior more explicit.
- `ModuleCompletionReward` currently contains its own verdict and next-recommendation logic. If this grows, consider extracting pure helpers and adding focused tests.
- `ModuleCompletionReward` uses rounded `2xl` panels, while much of the repo uses `.card` / `rounded-xl`; consider visual consistency pass.

## Verification To Run

Before shipping changes, run:

```bash
npm run test
npm run typecheck
npm run build
```

For UX work, also run the app and manually walk:

1. Open a module with no progress.
2. Complete the pre-check and confirm the lesson unlocks.
3. Navigate through takeaways.
4. Complete the post-check and confidence rating.
5. Confirm `ModuleCompletionReward` appears with sensible score/confidence deltas.
6. Confirm the next-module CTA chooses an incomplete module.
7. Retake pre/post checks and verify existing progress is preserved or intentionally overwritten.
8. Test localStorage-only mode and Firebase-enabled mode if credentials are available.

## Suggested Next Pass

Start with a focused cleanup of `ModuleDetailPage` and `ModuleCompletionReward`:

- Make the completion path obvious and non-duplicative.
- Move reward verdict/target helpers into testable pure functions if changes continue.
- Add a small test around next-module recommendation and reward target selection.
- Run a responsive visual check on the takeaways phase after the post-check.
