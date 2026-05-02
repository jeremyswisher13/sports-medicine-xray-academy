# Sourcing teaching radiographs

This app ships with original illustrative teaching cards plus open-license radiographs so the curriculum is teaching-effective from day one. As you license real radiographs, register them through the protocol below and they replace the placeholders automatically.

## Where images live in the codebase

- `src/data/images.ts` — registry. One entry per image, keyed by a stable string (e.g. `shoulder:posterior-dislocation`).
- `public/diagrams/*.svg` — original UCLA Sports Medicine line-art diagrams (no real patient imaging).
- `public/uploads/*` — drop bitmap teaching radiographs here once licensed.
- `src/components/XRayImage.tsx` — renders an entry with attribution badge; falls back to `PlaceholderImagePanel` when no entry is provided.

## Adding a new image (5-step protocol)

1. **Source the image legally.**
   - **Radiopaedia** is preferred for real radiographs. License is **CC BY-NC-SA 3.0** — non-commercial education is OK with attribution and share-alike.
   - **Wikimedia Commons** — varies by file; check each license.
   - **Open-i (NIH)** — many open-access medical images.
   - **PubMed Open Access subset** — many CC-BY figures.
   - **Original drawings** — fine, label as `isDiagram: true`.
   - Patient images should only be used if they are institution-approved for education, fully de-identified, stripped of metadata, and cleared for this exact distribution context.
   - **Never** use copyrighted radiology textbook scans, AMSSM slide screenshots, casual patient exports, or images with patient identifiers.

2. **Save the file.**
   - Diagrams: `public/diagrams/<short-name>.svg`
   - Bitmaps: `public/uploads/<short-name>.jpg` (or .png, .webp)
   - Keep filenames lowercase-kebab-case.

3. **Strip identifiers and metadata.** Open the file and confirm there are no patient IDs, dates, accession numbers, facility names, or names burned into the image. Remove metadata and crop annotations away. If in doubt, don't use it.

4. **Register it.** Add an entry to `imageRegistry` in `src/data/images.ts`:

   ```ts
   'shoulder:posterior-dislocation': {
     id: 'shoulder-posterior-dislocation',
     src: '/uploads/posterior-dislocation-axillary.jpg',
     alt: 'Posterior shoulder dislocation, axillary view',
     view: 'Special',
     caption: 'Posterior shoulder dislocation — axillary view',
     source: 'Radiopaedia',
     sourceUrl: 'https://radiopaedia.org/cases/12345',
     license: 'CC BY-NC-SA 3.0',
     attribution: 'Case courtesy of Dr. X, Radiopaedia.org, rID: 12345',
     moduleId: 'shoulder',
   },
   ```

5. **Reference it from a module or case.**
   - In `ModuleDetail.tsx`, the Overview tab already pulls a hero diagram per module via `getImage('<key>')`.
   - In a case scenario, you can inject a real image by key (extend `CaseScenario.imagePanels` to support image keys when ready, or have the case page call `getImage` directly).

## Sourcing checklist (Radiopaedia-specific)

- Open the case page on Radiopaedia.
- Confirm it shows the **CC BY-NC-SA 3.0** badge (or compatible CC license).
- Note the case URL, the contributing physician name, and the rID number.
- Right-click → save the specific image needed.
- Confirm no patient identifiers are in the image.
- Crop to teaching ROI if appropriate.
- Add to `public/uploads/` and register.

The attribution string Radiopaedia recommends is exactly:
> "Case courtesy of [author], Radiopaedia.org, rID: [rID]"

## Using ChatGPT Pro / Sora for original illustrative diagrams

You can have a model help draft **original line-art SVGs** that explain a concept (e.g. anterior humeral line, Gilula arcs, mortise clear spaces) **without** generating imitation radiographs. Workflow:

1. Prompt the model for an SVG that explains the concept — flat geometry, simple shapes, labeled.
2. Paste the SVG into `public/diagrams/<concept>.svg`.
3. Add a registry entry with `isDiagram: true` and `license: "Original — Sports Medicine X-Ray Academy"`.

Do **not** generate AI imagery that looks like real radiographs and do not present it as such. The badge automatically labels diagrams "Illustrative diagram."

## Why the placeholder fallback exists

Every slot that doesn't yet have a registered entry renders a clean labeled placeholder ("Licensed teaching radiograph pending."). You can ship the curriculum to learners while images get sourced — and the moment you add a registry entry, the placeholder swaps for the real thing on the next deploy.
