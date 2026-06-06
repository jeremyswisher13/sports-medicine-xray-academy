import type { XRayImageEntry } from '../types';

// Image registry. Add real teaching images here as they are licensed in.
// Every entry should include source/license/attribution where applicable.
//
// Sourcing protocol (see IMAGES.md):
//   - Radiopaedia images are CC BY-NC-SA 3.0 — non-commercial education is OK
//     with attribution. Use the case ID URL.
//   - Wikimedia Commons / OpenI / public domain works are also acceptable.
//   - Original SVG diagrams (no real patient imaging) live in /public/diagrams.
//   - Never upload identifiable patient images.
//
// Lookup by `imageKey` (typically `${moduleId}:${slot}` or `case:${caseId}:${view}`).

export const imageRegistry: Record<string, XRayImageEntry> = {
  // ── Original illustrative diagrams (no real x-rays) ────────────────────
  'foundations:systematic-read': {
    id: 'foundations-systematic-read',
    src: '/diagrams/systematic-read.svg',
    alt: 'Diagram of the Systematic X-Ray Read framework',
    view: 'Diagram',
    caption: 'Systematic X-Ray Read framework',
    source: 'Original UCLA Sports Medicine diagram',
    license: 'Original — Sports Medicine X-Ray Academy',
    attribution: 'Jeremy Swisher, MD',
    isDiagram: true,
    moduleId: 'xray-foundations',
  },
  'shoulder:ac-cc-distance': {
    id: 'shoulder-ac-cc-distance',
    src: '/diagrams/ac-cc-distance.svg',
    alt: 'Diagram showing coracoclavicular distance and AC joint relationship',
    view: 'Diagram',
    caption: 'AC joint and coracoclavicular distance',
    source: 'Original UCLA Sports Medicine diagram',
    license: 'Original — Sports Medicine X-Ray Academy',
    attribution: 'Jeremy Swisher, MD',
    isDiagram: true,
    moduleId: 'shoulder',
  },
  'knee-segond': {
    id: 'knee-segond',
    src: '/diagrams/segond-fracture.svg',
    alt: 'Diagram showing a Segond avulsion fragment off the lateral tibial plateau',
    view: 'Diagram',
    caption: 'Segond fracture (lateral tibial plateau avulsion)',
    source: 'Original UCLA Sports Medicine diagram',
    license: 'Original — Sports Medicine X-Ray Academy',
    attribution: 'Jeremy Swisher, MD',
    isDiagram: true,
    moduleId: 'knee',
  },
  'ankle-mortise-clear-spaces': {
    id: 'ankle-mortise-clear-spaces',
    src: '/diagrams/mortise-clear-spaces.svg',
    alt: 'Diagram of ankle mortise medial and superior clear spaces',
    view: 'Diagram',
    caption: 'Ankle mortise — medial and superior clear spaces',
    source: 'Original UCLA Sports Medicine diagram',
    license: 'Original — Sports Medicine X-Ray Academy',
    attribution: 'Jeremy Swisher, MD',
    isDiagram: true,
    moduleId: 'ankle-foot',
  },
  'do-not-miss-klein-line': {
    id: 'do-not-miss-klein-line',
    src: '/diagrams/klein-line.svg',
    alt: 'Diagram of Klein line on AP pelvis with normal vs SCFE',
    view: 'Diagram',
    caption: 'Klein line — normal vs SCFE',
    source: 'Original UCLA Sports Medicine diagram',
    license: 'Original — Sports Medicine X-Ray Academy',
    attribution: 'Jeremy Swisher, MD',
    isDiagram: true,
    moduleId: 'do-not-miss',
  },
  'do-not-miss-gilula-arcs': {
    id: 'do-not-miss-gilula-arcs',
    src: '/diagrams/gilula-arcs.svg',
    alt: 'Diagram of Gilula arcs on a PA wrist with normal vs perilunate disruption',
    view: 'Diagram',
    caption: 'Gilula arcs — normal vs perilunate disruption',
    source: 'Original UCLA Sports Medicine diagram',
    license: 'Original — Sports Medicine X-Ray Academy',
    attribution: 'Jeremy Swisher, MD',
    isDiagram: true,
    moduleId: 'do-not-miss',
  },

  // ── Round 4: original concept teaching diagrams (no real x-ray) ───────────
  'elbow:alignment-lines': {
    id: 'elbow-alignment-lines',
    src: '/diagrams/elbow-alignment-lines.svg',
    alt: 'Diagram of the anterior humeral line and radiocapitellar line on a lateral elbow',
    view: 'Diagram',
    caption: 'Elbow alignment lines — anterior humeral & radiocapitellar',
    source: 'Original UCLA Sports Medicine diagram',
    license: 'Original — Sports Medicine X-Ray Academy',
    attribution: 'Jeremy Swisher, MD',
    isDiagram: true,
    moduleId: 'elbow',
  },
  'pediatric:critoe': {
    id: 'pediatric-critoe',
    src: '/diagrams/critoe-ossification.svg',
    alt: 'Diagram of CRITOE pediatric elbow ossification order with approximate ages',
    view: 'Diagram',
    caption: 'CRITOE — elbow ossification order',
    source: 'Original UCLA Sports Medicine diagram',
    license: 'Original — Sports Medicine X-Ray Academy',
    attribution: 'Jeremy Swisher, MD',
    isDiagram: true,
    moduleId: 'pediatric-adolescent',
  },
  'ankle:fifth-metatarsal-zones': {
    id: 'ankle-fifth-metatarsal-zones',
    src: '/diagrams/fifth-metatarsal-zones.svg',
    alt: 'Diagram of 5th metatarsal fracture zones: tuberosity avulsion, Jones, proximal diaphyseal stress',
    view: 'Diagram',
    caption: '5th metatarsal fracture zones',
    source: 'Original UCLA Sports Medicine diagram',
    license: 'Original — Sports Medicine X-Ray Academy',
    attribution: 'Jeremy Swisher, MD',
    isDiagram: true,
    moduleId: 'ankle-foot',
  },
  'pediatric:salter-harris': {
    id: 'pediatric-salter-harris',
    src: '/diagrams/salter-harris.svg',
    alt: 'Diagram of the Salter-Harris physeal fracture classification types I through V',
    view: 'Diagram',
    caption: 'Salter-Harris classification (I–V)',
    source: 'Original UCLA Sports Medicine diagram',
    license: 'Original — Sports Medicine X-Ray Academy',
    attribution: 'Jeremy Swisher, MD',
    isDiagram: true,
    moduleId: 'pediatric-adolescent',
  },

  // ── Real licensed teaching radiographs (Wikimedia Commons) ───────────────
  'shoulder:posterior-dislocation': {
    id: 'shoulder-posterior-dislocation',
    src: '/uploads/shoulder-posterior-dislocation-lightbulb.jpg',
    alt:
      'AP shoulder radiograph showing the "light bulb sign" — posterior shoulder dislocation with humeral head fixed in internal rotation',
    view: 'Special',
    caption: 'Posterior shoulder dislocation — "light bulb sign" on AP',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Lightbulb_sign_-_posterior_shoulder_dislocation_-_Roe_vor_und_nach_Reposition_001.jpg',
    license: 'CC BY-SA 3.0',
    attribution: 'Hellerhoff, via Wikimedia Commons',
    moduleId: 'shoulder',
  },

  'shoulder:ac-separation-grade-iii': {
    id: 'shoulder-ac-separation-grade-iii',
    src: '/uploads/shoulder-ac-separation-grade3.png',
    alt:
      'Annotated AP shoulder radiograph showing a Grade III acromioclavicular separation with widened coracoclavicular distance',
    view: 'Annotated',
    caption: 'Grade III AC joint separation — widened CC distance',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Grade3ACsepMark.png',
    license: 'CC BY-SA 4.0',
    attribution: 'James Heilman, MD, via Wikimedia Commons',
    moduleId: 'shoulder',
  },

  'shoulder:hill-sachs': {
    id: 'shoulder-hill-sachs',
    src: '/uploads/shoulder-hill-sachs-postreduction.jpg',
    alt:
      'Post-reduction AP shoulder radiograph demonstrating Hill-Sachs and bony Bankart lesions',
    view: 'AP',
    caption: 'Hill-Sachs lesion — post-reduction AP',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Shoulder_dislocation,_anteroposterior_after_reduction,_with_Bankart_and_Hill-Sachs_lesions,_without_labels.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'shoulder',
  },

  'elbow:fat-pad-sign': {
    id: 'elbow-fat-pad-sign',
    src: '/uploads/elbow-fat-pad-sign.jpg',
    alt:
      'Lateral elbow radiograph showing anterior and posterior fat pad signs — occult intra-articular fracture',
    view: 'Lateral',
    caption: 'Posterior fat pad sign — lateral elbow',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:CR._Anterior_and_posterior_fat_pad_sign..jpg',
    license: 'CC BY-SA 3.0',
    attribution: 'RSatUSZ, via Wikimedia Commons',
    moduleId: 'elbow',
  },

  'elbow:medial-epicondyle-avulsion': {
    id: 'elbow-medial-epicondyle-avulsion',
    src: '/uploads/elbow-medial-epicondyle-avulsion.jpg',
    alt:
      'Adolescent elbow radiograph and CT showing displaced medial epicondyle avulsion in a 15-year-old',
    view: 'AP',
    caption: 'Medial epicondyle avulsion — adolescent thrower',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Dislozierter_Ausriss_Epicondylus_ulnaris_15M_-_CR_und_CT_-_001.jpg',
    license: 'CC BY-SA 4.0',
    attribution: 'Hellerhoff, via Wikimedia Commons',
    moduleId: 'pediatric-adolescent',
  },

  'wrist:perilunate-dislocation': {
    id: 'wrist-perilunate-dislocation',
    src: '/uploads/wrist-perilunate-dislocation.jpg',
    alt: 'Lateral wrist radiograph showing a perilunate dislocation with disrupted carpal alignment',
    view: 'Lateral',
    caption: 'Perilunate dislocation — disrupted Gilula arcs',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Perilunaere_Luxation.jpg',
    license: 'CC BY-SA 3.0',
    attribution: 'Hellerhoff, via Wikimedia Commons',
    moduleId: 'wrist-hand',
  },

  'hip:scfe': {
    id: 'hip-scfe',
    src: '/uploads/hip-scfe.jpg',
    alt: 'Pediatric hip radiograph showing slipped capital femoral epiphysis (SCFE)',
    view: 'AP',
    caption: 'SCFE — slipped capital femoral epiphysis',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Slipped_capital_femoral_epiphysis.jpg',
    license: 'CC0 1.0',
    attribution: 'Dr. Jochen Lengerke, via Wikimedia Commons',
    moduleId: 'pelvis-hip',
  },

  'knee:segond-fracture': {
    id: 'knee-segond-fracture',
    src: '/uploads/knee-segond-fracture.jpg',
    alt:
      'AP knee radiograph showing a Segond fracture — small avulsion fragment off the lateral tibial plateau',
    view: 'AP',
    caption: 'Segond fracture — lateral tibial plateau avulsion',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:SegondFracture.JPG',
    license: 'Public domain',
    attribution: 'Ellisbjohns, via Wikimedia Commons',
    moduleId: 'knee',
  },

  'knee:tibial-plateau-fracture': {
    id: 'knee-tibial-plateau-fracture',
    src: '/uploads/knee-tibial-plateau-fracture.png',
    alt:
      'Annotated AP knee radiograph showing a depressed lateral tibial plateau fracture',
    view: 'Annotated',
    caption: 'Tibial plateau fracture — annotated AP',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:TibPlatFracPlainMark.png',
    license: 'CC BY-SA 4.0',
    attribution: 'James Heilman, MD, via Wikimedia Commons',
    moduleId: 'knee',
  },

  'knee:bipartite-patella': {
    id: 'knee-bipartite-patella',
    src: '/uploads/knee-bipartite-patella.jpg',
    alt:
      'AP and tangential patellar radiographs showing a bipartite patella — smooth corticated superolateral fragment',
    view: 'Special',
    caption: 'Bipartite patella — superolateral with smooth corticated margins',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Patella_bipartita.jpg',
    license: 'CC BY-SA 3.0',
    attribution: 'Hellerhoff, via Wikimedia Commons',
    moduleId: 'knee',
  },

  'foot:lisfranc-injury': {
    id: 'foot-lisfranc-injury',
    src: '/uploads/foot-lisfranc-injury.png',
    alt: 'Annotated foot radiograph showing tarsometatarsal malalignment in a Lisfranc injury',
    view: 'Annotated',
    caption: 'Lisfranc injury — tarsometatarsal diastasis',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:LisFrancArrow.png',
    license: 'CC BY-SA 4.0',
    attribution: 'James Heilman, MD, via Wikimedia Commons',
    moduleId: 'ankle-foot',
  },

  'foot:jones-fracture': {
    id: 'foot-jones-fracture',
    src: '/uploads/foot-jones-fracture.jpg',
    alt:
      'Oblique foot radiograph showing a Jones fracture at the metaphyseal-diaphyseal junction of the 5th metatarsal',
    view: 'Oblique',
    caption: 'Jones fracture — 5th MT metaphyseal-diaphyseal junction',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Jones-Fraktur_61M_-_CR_schraeg_-_001.jpg',
    license: 'CC BY-SA 4.0',
    attribution: 'Hellerhoff, via Wikimedia Commons',
    moduleId: 'ankle-foot',
  },

  // ── Round 2 additions (Wikimedia Commons) ────────────────────────────────
  'wrist:scaphoid-waist-fracture': {
    id: 'wrist-scaphoid-waist-fracture',
    src: '/uploads/wrist-scaphoid-waist-fracture.jpg',
    alt:
      'PA wrist radiograph demonstrating a scaphoid waist fracture with visible fracture line through the waist',
    view: 'AP',
    caption: 'Scaphoid waist fracture — PA wrist',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Scaphoid_Wrist_Fracture.jpg',
    license: 'CC BY-SA 4.0',
    attribution:
      'Gilo1969; derivative by Andrewmeyerson, via Wikimedia Commons',
    moduleId: 'wrist-hand',
  },

  'ankle:talar-dome-ocd': {
    id: 'ankle-talar-dome-ocd',
    src: '/uploads/ankle-talar-dome-ocd.jpg',
    alt:
      'AP ankle radiograph showing an osteochondral lesion of the medial talar dome',
    view: 'AP',
    caption: 'Talar dome osteochondral lesion — medial dome',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Osteochondrosis_dissecans_des_Talus_medial_36M_-_CR_ap_-_001.jpg',
    license: 'CC BY-SA 4.0',
    attribution: 'Hellerhoff, via Wikimedia Commons',
    moduleId: 'ankle-foot',
  },

  'hip:femoral-neck-stress-fracture': {
    id: 'hip-femoral-neck-stress-fracture',
    src: '/uploads/hip-femoral-neck-stress-fracture.jpg',
    alt:
      'Hip radiograph showing a subtle femoral neck stress fracture — line of sclerosis at the inferior femoral neck',
    view: 'AP',
    caption: 'Femoral neck stress fracture — subtle on plain film',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_stress_fracture_of_the_hip.jpg',
    license: 'CC BY 4.0',
    attribution:
      'Ruiz Santiago F, Santiago Chinchilla A, Ansari A, Guzmán Álvarez L, Castellano García MM, Martínez Martínez A, Tercedor Sánchez J, via Wikimedia Commons',
    moduleId: 'pelvis-hip',
  },

  'shoulder:posterior-dislocation-y-view': {
    id: 'shoulder-posterior-dislocation-y-view',
    src: '/uploads/shoulder-posterior-dislocation-y-view.jpg',
    alt:
      'Two-view shoulder radiograph series including an orthogonal projection showing posterior shoulder dislocation',
    view: 'Special',
    caption: 'Posterior shoulder dislocation — orthogonal companion view',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Typische_hintere_Schulterluxation_43M_-_CR_-_001.jpg',
    license: 'CC BY-SA 4.0',
    attribution: 'Hellerhoff, via Wikimedia Commons',
    moduleId: 'shoulder',
  },

  'hip:scfe-frog-leg': {
    id: 'hip-scfe-frog-leg',
    src: '/uploads/hip-scfe-frog-leg.jpg',
    alt:
      'Frog-leg lateral pelvis radiograph showing slipped capital femoral epiphysis with posterior slip',
    view: 'Special',
    caption: 'SCFE — frog-leg lateral confirmatory view',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:SCFE_FROG_B%26W.jpg',
    license: 'Public domain',
    attribution: 'Mikir, via Wikimedia Commons',
    moduleId: 'pelvis-hip',
  },

  'hip:fai-cam-morphology': {
    id: 'hip-fai-cam-morphology',
    src: '/uploads/hip-fai-cam-morphology.jpg',
    alt:
      'AP pelvis radiograph showing prominent cam morphology of the femoral head-neck junction in femoroacetabular impingement',
    view: 'AP',
    caption: 'Cam morphology — aspherical femoral head-neck junction (FAI)',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:CAM-Impingement_und_Coxarthrose_50W_-_CR_Beckenuebersicht_pa_-_001.jpg',
    license: 'CC BY-SA 4.0',
    attribution: 'Hellerhoff, via Wikimedia Commons',
    moduleId: 'pelvis-hip',
  },

  'pediatric:salter-harris-ii-distal-radius': {
    id: 'pediatric-salter-harris-ii-distal-radius',
    src: '/uploads/pediatric-salter-harris-ii-distal-radius.jpg',
    alt:
      'Two-view distal radius radiograph showing a Salter-Harris II fracture with a Thurston-Holland metaphyseal fragment',
    view: 'AP',
    caption: 'Salter-Harris II — distal radius (Thurston-Holland fragment)',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Aitken_I-_Salter-Harris-_II_Fraktur_des_distalen_Radius_9M_-_CR_2_Ebenen_-_001.jpg',
    license: 'CC BY-SA 4.0',
    attribution: 'Hellerhoff, via Wikimedia Commons',
    moduleId: 'pediatric-adolescent',
  },

  // ── Normal anatomy reference radiographs ─────────────────────────────────
  // Predominantly CC0 from Mikael Häggström, MD (Wikimedia Commons).
  'normal:shoulder-grashey': {
    id: 'normal-shoulder-grashey',
    src: '/uploads/normal-shoulder-grashey.jpg',
    alt: 'Normal anteroposterior glenoid (Grashey view) radiograph of the shoulder',
    view: 'AP',
    caption: 'Normal shoulder — Grashey (true AP)',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Anteroposterior_glenoid_(Grashey_view)_X-ray_of_a_normal_shoulder.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'shoulder',
    isNormal: true,
  },
  'normal:shoulder-y': {
    id: 'normal-shoulder-y',
    src: '/uploads/normal-shoulder-y.jpg',
    alt: 'Normal Y-projection (scapular Y) radiograph of the shoulder',
    view: 'Special',
    caption: 'Normal shoulder — scapular Y',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Y-projection_X-ray_of_a_normal_shoulder.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'shoulder',
    isNormal: true,
  },
  'normal:elbow-ap': {
    id: 'normal-elbow-ap',
    src: '/uploads/normal-elbow-ap.jpg',
    alt: 'Normal anteroposterior elbow radiograph',
    view: 'AP',
    caption: 'Normal elbow — AP',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_normal_elbow_by_anteroposterior_projection.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'elbow',
    isNormal: true,
  },
  'normal:elbow-lateral': {
    id: 'normal-elbow-lateral',
    src: '/uploads/normal-elbow-lateral.jpg',
    alt: 'Normal lateral elbow radiograph (no posterior fat pad sign)',
    view: 'Lateral',
    caption: 'Normal elbow — lateral (no posterior fat pad)',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_normal_elbow_by_lateral_projection.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'elbow',
    isNormal: true,
  },
  'normal:wrist': {
    id: 'normal-wrist',
    src: '/uploads/normal-wrist.jpg',
    alt: 'Normal wrist radiograph (left panel) with carpal alignment intact',
    view: 'AP',
    caption: 'Normal wrist — carpal alignment intact',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_normal_wrist_and_wrist_with_dorsally_tilted_wrist_joint.jpg',
    license: 'CC BY-SA 3.0',
    attribution: 'Nevit Dilmen, via Wikimedia Commons',
    moduleId: 'wrist-hand',
    isNormal: true,
  },
  'normal:hand-pa': {
    id: 'normal-hand-pa',
    src: '/uploads/normal-hand-pa.jpg',
    alt: 'Normal posteroanterior (dorsoplantar) hand radiograph',
    view: 'AP',
    caption: 'Normal hand — PA',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_normal_hand_by_dorsoplantar_projection.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'wrist-hand',
    isNormal: true,
  },
  'normal:hand-lateral': {
    id: 'normal-hand-lateral',
    src: '/uploads/normal-hand-lateral.jpg',
    alt: 'Normal lateral hand radiograph',
    view: 'Lateral',
    caption: 'Normal hand — lateral',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_normal_hand_by_lateral_projection.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'wrist-hand',
    isNormal: true,
  },
  'normal:hip': {
    id: 'normal-hip',
    src: '/uploads/normal-hip.jpg',
    alt: 'Normal anteroposterior hip radiograph',
    view: 'AP',
    caption: 'Normal hip — AP',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:X-ray_of_a_normal_hip.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'pelvis-hip',
    isNormal: true,
  },
  'normal:knee-ap': {
    id: 'normal-knee-ap',
    src: '/uploads/normal-knee-ap.jpg',
    alt: 'Normal anteroposterior knee radiograph',
    view: 'AP',
    caption: 'Normal knee — AP',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_a_normal_knee_by_anteroposterior_projection.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'knee',
    isNormal: true,
  },
  'normal:knee-lateral': {
    id: 'normal-knee-lateral',
    src: '/uploads/normal-knee-lateral.jpg',
    alt: 'Normal lateral knee radiograph (suprapatellar recess clear, no effusion)',
    view: 'Lateral',
    caption: 'Normal knee — lateral (no effusion)',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_a_normal_knee_by_lateral_projection.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'knee',
    isNormal: true,
  },
  'normal:ankle-ap': {
    id: 'normal-ankle-ap',
    src: '/uploads/normal-ankle-ap.jpg',
    alt: 'Normal anteroposterior ankle radiograph',
    view: 'AP',
    caption: 'Normal ankle — AP',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:X-ray_of_normal_ankle_-_frontal.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'ankle-foot',
    isNormal: true,
  },
  'normal:ankle-lateral': {
    id: 'normal-ankle-lateral',
    src: '/uploads/normal-ankle-lateral.jpg',
    alt: 'Normal lateral ankle radiograph',
    view: 'Lateral',
    caption: 'Normal ankle — lateral',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:X-ray_of_normal_ankle_-_lateral.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'ankle-foot',
    isNormal: true,
  },
  'normal:ankle-mortise': {
    id: 'normal-ankle-mortise',
    src: '/uploads/normal-ankle-mortise.jpg',
    alt: 'Normal ankle mortise view (15° internal rotation) with symmetric clear spaces',
    view: 'Special',
    caption: 'Normal mortise — symmetric clear spaces',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_normal_ankle_-_15_degrees_internal_rotation.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'ankle-foot',
    isNormal: true,
  },
  'normal:foot-ap': {
    id: 'normal-foot-ap',
    src: '/uploads/normal-foot-ap.jpg',
    alt: 'Normal AP (dorsoplantar) foot radiograph',
    view: 'AP',
    caption: 'Normal foot — AP / dorsoplantar',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_normal_right_foot_by_dorsoplantar_projection.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'ankle-foot',
    isNormal: true,
  },
  'normal:foot-lateral': {
    id: 'normal-foot-lateral',
    src: '/uploads/normal-foot-lateral.jpg',
    alt: 'Normal lateral foot radiograph',
    view: 'Lateral',
    caption: 'Normal foot — lateral',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_normal_right_foot_by_lateral_projection.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'ankle-foot',
    isNormal: true,
  },
  'normal:foot-oblique': {
    id: 'normal-foot-oblique',
    src: '/uploads/normal-foot-oblique.jpg',
    alt: 'Normal oblique foot radiograph',
    view: 'Oblique',
    caption: 'Normal foot — oblique',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_normal_right_foot_by_oblique_projection.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'ankle-foot',
    isNormal: true,
  },
  'normal:cervical-spine-lateral': {
    id: 'normal-cervical-spine-lateral',
    src: '/uploads/normal-cervical-spine-lateral.jpg',
    alt: 'Normal lateral cervical spine radiograph of a 20-year-old male',
    view: 'Lateral',
    caption: 'Normal cervical spine — lateral',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_the_cervical_spine_of_a_20_year_old_male_-_lateral.jpg',
    license: 'Public domain',
    attribution:
      'Department of Radiology, UC San Diego Health, via Wikimedia Commons',
    moduleId: 'spine',
    isNormal: true,
  },

  // ── Round 3 normals: oblique views, sunrise patella, cervical AP/odontoid,
  //    pediatric pelvis, lumbar lateral ──────────────────────────────────────
  'normal:elbow-oblique-internal': {
    id: 'normal-elbow-oblique-internal',
    src: '/uploads/normal-elbow-oblique-internal.jpg',
    alt: 'Normal 30° internal oblique elbow radiograph',
    view: 'Oblique',
    caption: 'Normal elbow — 30° internal oblique',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_normal_elbow_by_30_degrees_internal_oblique_projection.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'elbow',
    isNormal: true,
  },
  'normal:elbow-oblique-external': {
    id: 'normal-elbow-oblique-external',
    src: '/uploads/normal-elbow-oblique-external.jpg',
    alt: 'Normal 30° external oblique elbow radiograph',
    view: 'Oblique',
    caption: 'Normal elbow — 30° external oblique',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_normal_elbow_by_30_degrees_external_oblique_projection.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'elbow',
    isNormal: true,
  },
  'normal:hand-oblique': {
    id: 'normal-hand-oblique',
    src: '/uploads/normal-hand-oblique.jpg',
    alt: 'Normal oblique hand radiograph',
    view: 'Oblique',
    caption: 'Normal hand — oblique',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_normal_hand_by_oblique_projection.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'wrist-hand',
    isNormal: true,
  },
  'normal:cervical-spine-ap': {
    id: 'normal-cervical-spine-ap',
    src: '/uploads/normal-cervical-spine-ap.jpg',
    alt: 'Normal anteroposterior cervical spine radiograph of a 20-year-old male',
    view: 'AP',
    caption: 'Normal cervical spine — AP',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_the_cervical_spine_of_a_20_year_old_male_-_anteroposterior.jpg',
    license: 'Public domain',
    attribution:
      'Department of Radiology, UC San Diego Health, via Wikimedia Commons',
    moduleId: 'spine',
    isNormal: true,
  },
  'normal:cervical-spine-odontoid': {
    id: 'normal-cervical-spine-odontoid',
    src: '/uploads/normal-cervical-spine-odontoid.jpg',
    alt: 'Normal odontoid (open-mouth) view of the cervical spine',
    view: 'Special',
    caption: 'Normal cervical spine — odontoid (open-mouth)',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_the_cervical_spine_of_a_20_year_old_male_-_odontoid.jpg',
    license: 'Public domain',
    attribution:
      'Department of Radiology, UC San Diego Health, via Wikimedia Commons',
    moduleId: 'spine',
    isNormal: true,
  },
  'normal:patella-skyline': {
    id: 'normal-patella-skyline',
    src: '/uploads/normal-patella-skyline.jpg',
    alt:
      'Normal patella skyline (sunrise / Merchant) view radiograph of a 31-year-old male',
    view: 'Special',
    caption: 'Normal patella — skyline (sunrise / Merchant)',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_a_normal_patella.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'knee',
    isNormal: true,
  },
  'normal:pelvis-ap-pediatric': {
    id: 'normal-pelvis-ap-pediatric',
    src: '/uploads/normal-pediatric-pelvis-ap.jpg',
    alt: 'Normal anteroposterior pelvis radiograph of a 22-month-old male',
    view: 'AP',
    caption: 'Normal pediatric pelvis — AP',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_the_pelvis_of_a_22_months_old_male_-_anteroposterior.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'pediatric-adolescent',
    isNormal: true,
  },
  'normal:pelvis-frog-leg-pediatric': {
    id: 'normal-pelvis-frog-leg-pediatric',
    src: '/uploads/normal-pediatric-pelvis-frog-leg.jpg',
    alt: 'Normal frog-leg lateral (Lauenstein) pelvis radiograph of a 22-month-old male',
    view: 'Special',
    caption: 'Normal pediatric pelvis — frog-leg lateral (Lauenstein)',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_the_pelvis_of_a_22_months_old_male_-_Lauenstein.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'pediatric-adolescent',
    isNormal: true,
  },
  'normal:lumbar-spine-lateral': {
    id: 'normal-lumbar-spine-lateral',
    src: '/uploads/normal-lumbar-spine-lateral.jpg',
    alt: 'Normal lateral lumbar spine radiograph',
    view: 'Lateral',
    caption: 'Normal lumbar spine — lateral',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lateral_lumbar_x_ray.jpg',
    license: 'CC BY-SA 4.0',
    attribution: 'FitBro, via Wikimedia Commons',
    moduleId: 'spine',
    isNormal: true,
  },

  // ── Round 3 normals: wrist lateral + pediatric open-physis comparisons ───
  'normal:wrist-lateral': {
    id: 'normal-wrist-lateral',
    src: '/uploads/normal-wrist-lateral.jpg',
    alt: 'Normal lateral wrist radiograph',
    view: 'Lateral',
    caption: 'Normal wrist — lateral',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_normal_wrist_by_lateral_projection.jpg',
    license: 'CC0 1.0',
    attribution: 'Mikael Häggström, MD, via Wikimedia Commons',
    moduleId: 'wrist-hand',
    isNormal: true,
  },
  'normal:wrist-pediatric': {
    id: 'normal-wrist-pediatric',
    src: '/uploads/normal-wrist-pediatric-pa.jpg',
    alt: 'Normal pediatric wrist radiograph (PA) showing open distal radial and ulnar physes',
    view: 'AP',
    caption: 'Normal pediatric wrist — open physes (PA)',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_the_wrist_of_a_2_year_old_male_-_posteroanterior.jpg',
    license: 'Public domain',
    attribution:
      'Department of Radiology, UC San Diego Health, via Wikimedia Commons',
    moduleId: 'pediatric-adolescent',
    isNormal: true,
  },
  'normal:knee-pediatric': {
    id: 'normal-knee-pediatric',
    src: '/uploads/normal-knee-pediatric-ap.jpg',
    alt: 'Normal pediatric knee radiograph (AP) showing open distal femoral and proximal tibial physes',
    view: 'AP',
    caption: 'Normal pediatric knee — open physes (AP)',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_the_knee_of_a_9_year_old_female_-_case_1_-_anteroposterior.jpg',
    license: 'Public domain',
    attribution:
      'Department of Radiology, UC San Diego Health, via Wikimedia Commons',
    moduleId: 'pediatric-adolescent',
    isNormal: true,
  },
  'normal:ankle-pediatric': {
    id: 'normal-ankle-pediatric',
    src: '/uploads/normal-ankle-pediatric-ap.jpg',
    alt: 'Normal pediatric ankle radiograph (AP) showing open distal tibial and fibular physes',
    view: 'AP',
    caption: 'Normal pediatric ankle — open physes (AP)',
    source: 'Wikimedia Commons',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:X-ray_of_the_ankle_of_a_9_year_old_female_-_case_1_-_anteroposterior.jpg',
    license: 'Public domain',
    attribution:
      'Department of Radiology, UC San Diego Health, via Wikimedia Commons',
    moduleId: 'pediatric-adolescent',
    isNormal: true,
  },

  // ── Pathology: ankle mortise widening (deltoid tear) ────────────────────
  'ankle:mortise-widening': {
    id: 'ankle-mortise-widening',
    src: '/uploads/ankle-mortise-widening-deltoid-tear.jpg',
    alt:
      'Stress view of the ankle showing widened medial clear space consistent with deltoid ligament tear',
    view: 'Special',
    caption: 'Mortise widening — stress view, deltoid ligament tear',
    source: 'Wikimedia Commons (originally Radiopaedia)',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Stress-view-of-ankle-with-deltoid-ligament-tear.jpg',
    license: 'CC BY-SA 4.0',
    attribution:
      'Case courtesy of Dr Maulik S Patel, Radiopaedia.org, rID: 16344, via Wikimedia Commons',
    moduleId: 'ankle-foot',
  },
};

export function getImage(key: string): XRayImageEntry | undefined {
  return imageRegistry[key];
}

export function getRealImagesForModule(moduleId: string): XRayImageEntry[] {
  return Object.values(imageRegistry).filter(
    (img) => img.moduleId === moduleId && !img.isDiagram,
  );
}

export function getNormalImagesForModule(moduleId: string): XRayImageEntry[] {
  return Object.values(imageRegistry).filter(
    (img) => img.moduleId === moduleId && img.isNormal && !img.isDiagram,
  );
}

export function getPathologyImagesForModule(moduleId: string): XRayImageEntry[] {
  return Object.values(imageRegistry).filter(
    (img) => img.moduleId === moduleId && !img.isNormal && !img.isDiagram,
  );
}

export function getAllRealImages(): XRayImageEntry[] {
  return Object.values(imageRegistry).filter((img) => !img.isDiagram);
}

export function getDiagramsForModule(moduleId: string): XRayImageEntry[] {
  return Object.values(imageRegistry).filter(
    (img) => img.moduleId === moduleId && img.isDiagram,
  );
}
