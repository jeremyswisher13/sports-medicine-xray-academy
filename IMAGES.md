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
   - **Never** use real patient images, copyrighted radiology textbook scans, AMSSM slide screenshots, casual patient exports, or images with patient identifiers.

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

## Normal image sourcing priorities

Learners need repeated normal comparisons before pathology feels obvious. The current atlas has a useful normal baseline, but the next acquisition pass should prioritize these open-license images:

- **Shoulder:** normal axillary view, AP internal/external rotation pair, normal AC/clavicle comparison view.
- **Wrist/hand:** normal lateral wrist, scaphoid/navicular view, pediatric hand/wrist with open physes.
- **Pelvis/hip:** normal adult AP pelvis, frog-leg lateral hip, Dunn or lateral hip view for FAI comparison.
- **Knee:** normal tunnel/notch view, weight-bearing AP comparison, pediatric knee with open physes.
- **Spine:** normal lumbar AP, thoracic AP/lateral, cervical oblique views if used in the curriculum.
- **Pediatric/adolescent:** normal pediatric elbow ossification centers, normal ankle physes, normal hip/pelvis by age range.
- **Do-not-miss comparisons:** normal carpal alignment PA/lateral, normal pediatric hip AP/frog-leg, normal ankle mortise comparison.

Prefer open-license repositories when an equivalent normal image is available. Do not add patient-derived images to this app.

## Deep Research prompt for the next normal-image pass

Use this exact prompt when asking ChatGPT Deep Research to help source images:

> Find open-license normal musculoskeletal radiographs for a sports medicine teaching atlas for family medicine residents and sports medicine fellows. Prioritize normal comparison images over pathology. For each candidate, provide the exact file page URL, direct image URL if available, license, required attribution, author/contributor, view/projection, body region/module, whether it is adult or pediatric, and a one-sentence teaching use. Only include images that are public domain, CC0, CC BY, or CC BY-SA, preferably from Wikimedia Commons or PubMed Central open-access sources. Do not include patient-derived private images, textbook screenshots, AMSSM slide screenshots, Radiopaedia cases unless the license and non-commercial restrictions are explicitly stated, or any image with visible identifiers. Highest priority views: shoulder AP internal/external and axillary, wrist PA/lateral/scaphoid and pediatric open physes, AP pelvis plus frog-leg/Dunn hip, knee AP/lateral/sunrise/tunnel including pediatric open physes, ankle AP/lateral/mortise and foot AP/oblique/lateral, pediatric elbow ossification centers, and normal do-not-miss comparisons for carpal arcs, ankle mortise, pediatric hip, and shoulder alignment.

## Deep Research candidate list

These are candidate Wikimedia Commons file pages surfaced by the May 2026 Deep Research pass. They are **not registered in `src/data/images.ts` yet**; verify the file-page license and attribution immediately before adding them through the 5-step protocol above.

| Module | Candidate | Type | Reported license | File page |
|---|---|---|---|---|
| Shoulder | Normal shoulder Y projection | Normal | CC0 1.0 | https://commons.wikimedia.org/wiki/File:Y-projection_X-ray_of_a_normal_shoulder.jpg |
| Elbow | Normal elbow external oblique projection | Normal | CC0 1.0 | https://commons.wikimedia.org/wiki/File:X-ray_of_normal_elbow_by_30_degrees_external_oblique_projection.jpg |
| Wrist/hand | Dynamic scapholunate instability | Pathology | CC0 1.0 | https://commons.wikimedia.org/wiki/File:X-ray_of_dynamic_scapholunate_instability.jpg |
| Pelvis/hip | Normal hip measurements | Normal | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:X-ray_of_measurements_on_a_normal_hip.jpg |
| Knee | Normal AP knee | Normal | CC0 1.0 | https://commons.wikimedia.org/wiki/File:X-ray_of_a_normal_knee_by_anteroposterior_projection.jpg |
| Ankle/foot | Normal dorsoplantar foot | Normal | CC0 1.0 | https://commons.wikimedia.org/wiki/File:X-ray_of_normal_right_foot_by_dorsoplantar_projection.jpg |
| Spine | Normal lateral cervical spine | Normal | Public domain | https://commons.wikimedia.org/wiki/File:X-ray_of_the_cervical_spine_of_a_20_year_old_male_-_lateral.jpg |
| Pediatric/adolescent | Trethowan sign in SCFE | Pathology | CC0 1.0 | https://commons.wikimedia.org/wiki/File:Trethowan%27s_sign_seen_in_SCFE.jpg |
| Do not miss | Posterior shoulder dislocation light-bulb sign | Pathology | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Lightbulb_sign_-_posterior_shoulder_dislocation_-_Roe_vor_und_nach_Reposition_001_-_Annotation.jpg |
| Pediatric/adolescent | Residual Osgood-Schlatter lesion | Pathology | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Residuum_bei_Zn_Morbus_Osgood-Schlatter_24W_-_CR_seitlich_-_001.jpg |
