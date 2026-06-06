import type { CaseScenario, QuizQuestionData } from '../types';

/**
 * ⚠️ DRAFT CONTENT — PENDING CLINICAL SIGN-OFF (Jeremy Swisher, MD).
 *
 * These additional cases and quiz questions are NOT wired into the live app.
 * They exist here so they can be reviewed for clinical accuracy and voice
 * before being promoted into `src/data/modules.ts`. Nothing in this file is
 * shown to learners until an approved item is copied into the matching
 * module's `cases` / `quiz` arrays.
 *
 * Authoring constraints honored:
 *   - Vignette-only; no real patient data, no fabricated citations.
 *   - Clinical claims reuse facts already taught elsewhere in the app.
 *   - imageKey values reference real registered entries in src/data/images.ts.
 *
 * Promotion workflow (after MD review):
 *   1. Move an approved CaseScenario into modules.ts → the module's `cases: [...]`.
 *   2. Move an approved QuizQuestionData into modules.ts → the module's `quiz: [...]`.
 *   3. Delete the promoted item from this file.
 */

export const draftCases: Record<string, CaseScenario[]> = {
  'xray-foundations': [
    {
      id: 'draft-foundations-case-2',
      moduleId: 'xray-foundations',
      title: 'Gymnast with wrist pain and a "normal" film',
      patientAge: '15-year-old',
      sportOrActivity: 'Competitive gymnastics',
      mechanism: 'Chronic axial loading, worse over 6 weeks',
      symptoms: 'Dorsal wrist pain at the distal radius, tender over the physis, no acute trauma',
      viewsObtained: ['PA wrist', 'Lateral wrist'],
      initialPrompt: 'Films are read as normal. What is the highest-yield next move?',
      diagnosisOptions: [
        { id: 'a', label: 'Reassure and return to full training' },
        { id: 'b', label: 'Consider distal radial physeal stress injury ("gymnast wrist"); relative rest and clinical follow-up' },
        { id: 'c', label: 'Immediate MRI for all wrist pain' },
        { id: 'd', label: 'Casting for 6 weeks regardless of exam' },
      ],
      correctOptionId: 'b',
      explanation:
        'Chronic dorsal wrist pain in a skeletally immature gymnast suggests distal radial physeal stress injury. Early films may be normal or show physeal widening/irregularity; management is activity modification with follow-up, escalating to MRI if symptoms persist.',
      teachingPearl:
        'A normal-looking film in a young athlete with load-related physeal pain does not exclude a stress-related physeal injury.',
      nextStep: 'Relative rest, activity modification, clinical follow-up; MRI if pain persists or to grade severity.',
      imagePanels: [{ view: 'AP', imageKey: 'normal:wrist' }],
    },
  ],

  shoulder: [
    {
      id: 'draft-shoulder-case-2',
      moduleId: 'shoulder',
      title: 'Overhead athlete with chronic anterior shoulder pain',
      patientAge: '34-year-old',
      sportOrActivity: 'Recreational swimming',
      mechanism: 'Insidious, activity-related, no acute injury',
      symptoms: 'Painful arc, pain with overhead reach, point tenderness near greater tuberosity',
      viewsObtained: ['AP internal rotation', 'AP external rotation (Grashey)'],
      initialPrompt: 'AP shows amorphous mineralization adjacent to the greater tuberosity. Most likely?',
      diagnosisOptions: [
        { id: 'a', label: 'Calcific tendinopathy of the rotator cuff' },
        { id: 'b', label: 'Acute greater tuberosity fracture' },
        { id: 'c', label: 'Glenohumeral osteoarthritis' },
        { id: 'd', label: 'Os acromiale' },
      ],
      correctOptionId: 'a',
      explanation:
        'Amorphous mineralization near the cuff insertion in an overhead athlete with a painful arc is classic calcific tendinopathy. It is frequently incidental, so correlate clinically before attributing all symptoms to it.',
      teachingPearl:
        'Calcific tendinopathy is a soft-tissue mineralization adjacent to the insertion — not a cortical fracture fragment.',
      nextStep: 'Activity modification, NSAIDs, physical therapy; consider ultrasound-guided barbotage if refractory.',
      imagePanels: [{ view: 'AP', imageKey: 'normal:shoulder-grashey' }],
    },
  ],

  elbow: [
    {
      id: 'draft-elbow-case-2',
      moduleId: 'elbow',
      title: 'Child with elbow pain after a fall',
      patientAge: '6-year-old',
      sportOrActivity: 'Playground fall onto outstretched hand',
      mechanism: 'FOOSH with hyperextension',
      symptoms: 'Refuses to extend the elbow, diffuse swelling, neurovascularly intact',
      viewsObtained: ['AP elbow', 'Lateral elbow'],
      initialPrompt: 'Lateral shows a posterior fat pad and the anterior humeral line passes anterior to the capitellum. Concern?',
      diagnosisOptions: [
        { id: 'a', label: 'Normal pediatric elbow' },
        { id: 'b', label: 'Supracondylar humerus fracture' },
        { id: 'c', label: 'Isolated olecranon bursitis' },
        { id: 'd', label: 'Nursemaid elbow (radial head subluxation)' },
      ],
      correctOptionId: 'b',
      explanation:
        'A posterior fat pad sign plus an anterior humeral line that no longer bisects the capitellum indicates a supracondylar fracture, the most common pediatric elbow fracture. Assess neurovascular status (anterior interosseous nerve, brachial artery) and refer.',
      teachingPearl:
        'In a child, a posterior fat pad is never normal — assume an occult supracondylar fracture until proven otherwise.',
      nextStep: 'Immobilize, document neurovascular exam, urgent orthopedic referral; displaced fractures need reduction/fixation.',
      imagePanels: [{ view: 'Lateral', imageKey: 'elbow:fat-pad-sign' }],
    },
  ],

  'wrist-hand': [
    {
      id: 'draft-wrist-case-2',
      moduleId: 'wrist-hand',
      title: 'Skier with thumb pain after a fall',
      patientAge: '29-year-old',
      sportOrActivity: 'Downhill skiing',
      mechanism: 'Fall onto an abducted thumb with the pole in hand',
      symptoms: 'Pain and laxity at the ulnar base of the thumb MCP, weak pinch',
      viewsObtained: ['AP thumb', 'Lateral thumb'],
      initialPrompt: 'Films show a small avulsion fragment at the ulnar base of the proximal phalanx. Most likely injury?',
      diagnosisOptions: [
        { id: 'a', label: 'Gamekeeper/skier thumb (ulnar collateral ligament avulsion)' },
        { id: 'b', label: 'Bennett fracture' },
        { id: 'c', label: 'Mallet thumb' },
        { id: 'd', label: 'Scaphoid fracture' },
      ],
      correctOptionId: 'a',
      explanation:
        'An ulnar-sided avulsion at the thumb MCP after forced abduction is a UCL injury (skier/gamekeeper thumb). A displaced fragment or a Stener lesion needs surgical referral because the adductor aponeurosis blocks healing.',
      teachingPearl:
        'Ulnar base-of-thumb avulsion + valgus laxity = UCL injury; assess for a Stener lesion.',
      nextStep: 'Thumb spica immobilization; refer displaced avulsions/suspected Stener lesions for surgical evaluation.',
      imagePanels: [{ view: 'AP', imageKey: 'normal:hand-pa' }],
    },
  ],

  'pelvis-hip': [
    {
      id: 'draft-hip-case-2',
      moduleId: 'pelvis-hip',
      title: 'Sprinter with sudden hip pain at push-off',
      patientAge: '16-year-old',
      sportOrActivity: 'Track sprinting',
      mechanism: 'Sudden forceful contraction during acceleration',
      symptoms: 'Acute pain at the anterior inferior iliac spine region, antalgic gait',
      viewsObtained: ['AP pelvis', 'Frog-leg lateral'],
      initialPrompt: 'AP shows a displaced bony fragment at the AIIS. Most likely?',
      diagnosisOptions: [
        { id: 'a', label: 'Apophyseal avulsion (rectus femoris origin, AIIS)' },
        { id: 'b', label: 'Femoral neck stress fracture' },
        { id: 'c', label: 'SCFE' },
        { id: 'd', label: 'Septic arthritis of the hip' },
      ],
      correctOptionId: 'a',
      explanation:
        'In adolescents, sudden eccentric load avulses the apophysis before the tendon fails. AIIS avulsion (rectus femoris) and ASIS (sartorius) are classic. Most are managed non-operatively unless widely displaced.',
      teachingPearl:
        'Adolescent pelvis pain with a sudden pop is an apophyseal avulsion until proven otherwise — the apophysis is the weak link.',
      nextStep: 'Protected weightbearing and progressive rehab; orthopedic referral for widely displaced fragments.',
      imagePanels: [{ view: 'AP', imageKey: 'normal:hip' }],
    },
  ],

  knee: [
    {
      id: 'draft-knee-case-2',
      moduleId: 'knee',
      title: 'Adolescent with kneecap that "popped out"',
      patientAge: '15-year-old',
      sportOrActivity: 'Dancing',
      mechanism: 'Twisting on a planted foot; patella displaced laterally and reduced',
      symptoms: 'Large effusion, medial tenderness, apprehension with lateral patellar glide',
      viewsObtained: ['AP knee', 'Lateral knee', 'Sunrise/Merchant'],
      initialPrompt: 'Sunrise view shows a small osteochondral fragment in the joint. Most likely?',
      diagnosisOptions: [
        { id: 'a', label: 'Lateral patellar dislocation with osteochondral injury' },
        { id: 'b', label: 'Bipartite patella' },
        { id: 'c', label: 'Tibial plateau fracture' },
        { id: 'd', label: 'Osgood-Schlatter disease' },
      ],
      correctOptionId: 'a',
      explanation:
        'Transient lateral patellar dislocation typically reduces spontaneously, leaving a large effusion, medial-sided (MPFL) tenderness, and sometimes an osteochondral fragment from the medial patella or lateral femoral condyle. MRI evaluates the MPFL and chondral surfaces.',
      teachingPearl:
        'A spontaneously reduced patellar dislocation can look subtle on x-ray — the effusion plus an osteochondral fragment is the clue.',
      nextStep: 'Brace and rehab; MRI for osteochondral/MPFL injury; orthopedic referral if a loose body or large fragment is present.',
      imagePanels: [{ view: 'Special', imageKey: 'knee:bipartite-patella' }],
    },
  ],

  'ankle-foot': [
    {
      id: 'draft-ankle-case-2',
      moduleId: 'ankle-foot',
      title: 'Footballer with high ankle pain after external rotation',
      patientAge: '23-year-old',
      sportOrActivity: 'American football',
      mechanism: 'External rotation of a dorsiflexed foot',
      symptoms: 'Pain above the ankle joint, pain with squeeze and external rotation stress',
      viewsObtained: ['AP ankle', 'Mortise', 'Lateral ankle'],
      initialPrompt: 'Mortise shows increased tibiofibular clear space and medial clear space. Concern?',
      diagnosisOptions: [
        { id: 'a', label: 'Syndesmotic (high ankle) injury — check the proximal fibula' },
        { id: 'b', label: 'Isolated lateral ankle sprain' },
        { id: 'c', label: 'Calcaneal stress fracture' },
        { id: 'd', label: 'Os trigonum syndrome' },
      ],
      correctOptionId: 'a',
      explanation:
        'External-rotation mechanism with widened tibiofibular and medial clear spaces indicates a syndesmotic injury. Always image the full length of the fibula — a proximal fibula fracture (Maisonneuve) completes the pattern and changes management.',
      teachingPearl:
        'High ankle pain with mortise widening = syndesmosis injury; clear the proximal fibula for a Maisonneuve.',
      nextStep: 'Weightbearing/stress views or CT; orthopedic referral for unstable syndesmosis.',
      imagePanels: [{ view: 'Special', imageKey: 'ankle:mortise-widening' }],
    },
  ],

  spine: [
    {
      id: 'draft-spine-case-2',
      moduleId: 'spine',
      title: 'Young gymnast with extension-related low back pain',
      patientAge: '14-year-old',
      sportOrActivity: 'Gymnastics',
      mechanism: 'Repetitive hyperextension; pain worse with extension and single-leg standing',
      symptoms: 'Focal lumbar pain, reproduced on extension, no radiculopathy',
      viewsObtained: ['AP lumbar spine', 'Lateral lumbar spine'],
      initialPrompt: 'Plain films are unremarkable. Best next step given the clinical picture?',
      diagnosisOptions: [
        { id: 'a', label: 'Reassure; no further workup needed' },
        { id: 'b', label: 'Consider spondylolysis (pars stress injury); advanced imaging (MRI) if suspicion is high' },
        { id: 'c', label: 'Immediate surgical referral' },
        { id: 'd', label: 'Lifelong activity cessation' },
      ],
      correctOptionId: 'b',
      explanation:
        'Extension-based back pain in an adolescent athlete suggests a pars interarticularis stress injury (spondylolysis). Plain films, including obliques, are often negative early; MRI is preferred to detect active stress reaction and avoids radiation.',
      teachingPearl:
        'Adolescent extension-related back pain is spondylolysis until proven otherwise — a normal x-ray does not exclude it.',
      nextStep: 'Activity modification; MRI for active pars stress reaction; sports medicine referral.',
      imagePanels: [{ view: 'Lateral', imageKey: 'normal:lumbar-spine-lateral' }],
    },
  ],

  'pediatric-adolescent': [
    {
      id: 'draft-peds-case-2',
      moduleId: 'pediatric-adolescent',
      title: 'Adolescent runner with anterior knee pain',
      patientAge: '13-year-old',
      sportOrActivity: 'Cross-country and basketball',
      mechanism: 'Insidious, activity-related, worse with jumping and stairs',
      symptoms: 'Tender, prominent tibial tubercle; pain with resisted extension',
      viewsObtained: ['Lateral knee'],
      initialPrompt: 'Lateral shows fragmentation at the tibial tubercle apophysis. Most likely?',
      diagnosisOptions: [
        { id: 'a', label: 'Osgood-Schlatter disease (tibial tubercle traction apophysitis)' },
        { id: 'b', label: 'Tibial tubercle avulsion fracture' },
        { id: 'c', label: 'Segond fracture' },
        { id: 'd', label: 'Patellar sleeve avulsion' },
      ],
      correctOptionId: 'a',
      explanation:
        'Activity-related anterior knee pain with a tender, fragmented tibial tubercle in a growing athlete is Osgood-Schlatter (traction apophysitis). It is a clinical diagnosis; imaging excludes acute avulsion. Contrast with an acute tibial tubercle avulsion, which is a sudden, displaced injury that may need fixation.',
      teachingPearl:
        'Apophysitis is chronic traction overuse; an acute displaced avulsion is a different, surgical problem — the history separates them.',
      nextStep: 'Activity modification, quad/hamstring flexibility, reassurance; it typically resolves with skeletal maturity.',
      imagePanels: [{ view: 'AP', imageKey: 'normal:knee-pediatric' }],
    },
  ],
};

export const draftQuiz: Record<string, QuizQuestionData[]> = {
  'xray-foundations': [
    {
      id: 'draft-foundations-q4',
      moduleId: 'xray-foundations',
      domain: 'systematic',
      prompt:
        'You receive a single AP view of an acutely injured joint. Before interpreting pathology, what is the best habit?',
      options: [
        { id: 'a', text: 'Call the read from the single view to save time' },
        { id: 'b', text: 'Confirm adequacy and obtain an orthogonal (and any special) view first' },
        { id: 'c', text: 'Order MRI before reading the x-ray' },
        { id: 'd', text: 'Assume normal if no fracture is obvious' },
      ],
      correctOptionId: 'b',
      explanation:
        'A single projection hides dislocations, subtle fractures, and joint-space disease. Confirm the study is adequate and obtain orthogonal/special views before committing to an impression.',
    },
    {
      id: 'draft-foundations-q5',
      moduleId: 'xray-foundations',
      domain: 'occult',
      prompt: 'Which finding is the most reliable soft-tissue clue to an occult fracture?',
      options: [
        { id: 'a', text: 'A displaced fat pad or focal soft-tissue swelling' },
        { id: 'b', text: 'Uniform bone density' },
        { id: 'c', text: 'Vascular calcification' },
        { id: 'd', text: 'A well-corticated accessory ossicle' },
      ],
      correctOptionId: 'a',
      explanation:
        'Displaced fat pads (e.g., posterior elbow) and focal effusion/swelling often signal an occult fracture even when the cortex looks intact.',
    },
  ],

  shoulder: [
    {
      id: 'draft-shoulder-q3',
      moduleId: 'shoulder',
      domain: 'shoulder',
      prompt:
        'A patient cannot tolerate a standard axillary view after a suspected dislocation. What is the best alternative to assess glenohumeral alignment?',
      options: [
        { id: 'a', text: 'Velpeau axillary view' },
        { id: 'b', text: 'AP internal rotation only' },
        { id: 'c', text: 'AC joint view' },
        { id: 'd', text: 'Skip orthogonal imaging' },
      ],
      correctOptionId: 'a',
      explanation:
        'When a standard axillary is not tolerated, a Velpeau (or an adequate scapular Y) provides the orthogonal information needed to confirm glenohumeral alignment and avoid missing a posterior dislocation.',
    },
    {
      id: 'draft-shoulder-q4',
      moduleId: 'shoulder',
      domain: 'shoulder',
      prompt: 'An acromiohumeral interval under 7 mm most suggests:',
      options: [
        { id: 'a', text: 'Chronic rotator cuff insufficiency' },
        { id: 'b', text: 'Acute anterior dislocation' },
        { id: 'c', text: 'Calcific tendinopathy' },
        { id: 'd', text: 'Normal variant requiring no thought' },
      ],
      correctOptionId: 'a',
      explanation:
        'A high-riding humeral head (acromiohumeral interval < 7 mm) implies chronic rotator cuff insufficiency.',
    },
  ],

  elbow: [
    {
      id: 'draft-elbow-q3',
      moduleId: 'elbow',
      domain: 'elbow',
      prompt: 'On a lateral elbow, the radiocapitellar line should:',
      options: [
        { id: 'a', text: 'Bisect the capitellum on every view' },
        { id: 'b', text: 'Pass anterior to the capitellum normally' },
        { id: 'c', text: 'Only matter in adults' },
        { id: 'd', text: 'Pass through the coronoid' },
      ],
      correctOptionId: 'a',
      explanation:
        'A line drawn through the radial neck (radiocapitellar line) should bisect the capitellum on every view; if it does not, suspect a radial head dislocation (e.g., Monteggia).',
    },
    {
      id: 'draft-elbow-q4',
      moduleId: 'elbow',
      domain: 'elbow',
      prompt: 'In an adult with a posterior fat pad sign and no visible fracture, the most likely occult injury is:',
      options: [
        { id: 'a', text: 'Radial head fracture' },
        { id: 'b', text: 'Supracondylar fracture' },
        { id: 'c', text: 'Clavicle fracture' },
        { id: 'd', text: 'Scaphoid fracture' },
      ],
      correctOptionId: 'a',
      explanation:
        'In adults, an effusion with a posterior fat pad sign most often reflects an occult radial head fracture; in children, suspect a supracondylar fracture.',
    },
  ],

  'wrist-hand': [
    {
      id: 'draft-wrist-q3',
      moduleId: 'wrist-hand',
      domain: 'wrist-hand',
      prompt: 'A scapholunate gap greater than ~3 mm ("Terry Thomas sign") indicates:',
      options: [
        { id: 'a', text: 'Scapholunate ligament injury' },
        { id: 'b', text: 'Normal variant in all adults' },
        { id: 'c', text: 'Distal radius physeal injury' },
        { id: 'd', text: 'Triquetral avulsion' },
      ],
      correctOptionId: 'a',
      explanation:
        'Widening of the scapholunate interval (> ~3 mm) suggests scapholunate ligament disruption and carpal instability.',
    },
    {
      id: 'draft-wrist-q4',
      moduleId: 'wrist-hand',
      domain: 'do-not-miss',
      prompt: 'A FOOSH with snuffbox tenderness and normal initial films should be managed as:',
      options: [
        { id: 'a', text: 'Presumed scaphoid fracture: thumb spica + repeat imaging or MRI' },
        { id: 'b', text: 'Sprain: no immobilization' },
        { id: 'c', text: 'Immediate surgery' },
        { id: 'd', text: 'Discharge with no follow-up' },
      ],
      correctOptionId: 'a',
      explanation:
        'Occult scaphoid fracture is common and risks nonunion/AVN; immobilize in a thumb spica and re-image in 10–14 days or obtain MRI.',
    },
  ],

  'pelvis-hip': [
    {
      id: 'draft-hip-q3',
      moduleId: 'pelvis-hip',
      domain: 'pelvis-hip',
      prompt: "Klein's line drawn along the superior femoral neck that fails to intersect the epiphysis indicates:",
      options: [
        { id: 'a', text: 'SCFE' },
        { id: 'b', text: 'Femoroacetabular impingement' },
        { id: 'c', text: 'Avascular necrosis' },
        { id: 'd', text: 'Normal adolescent hip' },
      ],
      correctOptionId: 'a',
      explanation:
        'When Klein’s line does not intersect the lateral femoral epiphysis, suspect SCFE; obtain a frog-leg lateral and refer emergently.',
    },
    {
      id: 'draft-hip-q4',
      moduleId: 'pelvis-hip',
      domain: 'occult',
      prompt: 'A distance runner has groin pain and normal radiographs. Which finding would most raise concern for a tension-side femoral neck stress fracture?',
      options: [
        { id: 'a', text: 'Pain with weightbearing and night pain in a high-mileage runner' },
        { id: 'b', text: 'Pain only after sitting' },
        { id: 'c', text: 'Painless clicking' },
        { id: 'd', text: 'Isolated lateral hip tenderness' },
      ],
      correctOptionId: 'a',
      explanation:
        'Progressive weightbearing/night pain in an endurance athlete warrants MRI even with normal films; tension-side femoral neck stress fractures can complete and are limb-threatening.',
    },
  ],

  knee: [
    {
      id: 'draft-knee-q3',
      moduleId: 'knee',
      domain: 'knee',
      prompt: 'A large lipohemarthrosis (fat-fluid level) on a cross-table lateral knee implies:',
      options: [
        { id: 'a', text: 'An intra-articular fracture until proven otherwise' },
        { id: 'b', text: 'A simple effusion needing no further thought' },
        { id: 'c', text: 'Chronic osteoarthritis' },
        { id: 'd', text: 'Bipartite patella' },
      ],
      correctOptionId: 'a',
      explanation:
        'A fat-fluid level reflects marrow fat entering the joint from an intra-articular fracture; pursue CT/MRI even if the fracture line is not obvious.',
    },
    {
      id: 'draft-knee-q4',
      moduleId: 'knee',
      domain: 'knee',
      prompt: 'Which view best demonstrates patellofemoral alignment and tilt?',
      options: [
        { id: 'a', text: 'Sunrise / Merchant view' },
        { id: 'b', text: 'AP weightbearing' },
        { id: 'c', text: 'Tunnel/notch view' },
        { id: 'd', text: 'Cross-table lateral' },
      ],
      correctOptionId: 'a',
      explanation:
        'The sunrise/Merchant (axial patellar) view profiles the patella in the trochlear groove to assess tilt, subluxation, and patellofemoral arthritis.',
    },
  ],

  'ankle-foot': [
    {
      id: 'draft-ankle-q3',
      moduleId: 'ankle-foot',
      domain: 'ankle-foot',
      prompt: 'A transverse fracture at the metaphyseal-diaphyseal junction of the 5th metatarsal (Jones zone) differs from a tuberosity avulsion mainly because it:',
      options: [
        { id: 'a', text: 'Has a higher nonunion rate and often needs surgical consideration in athletes' },
        { id: 'b', text: 'Never needs immobilization' },
        { id: 'c', text: 'Always heals faster' },
        { id: 'd', text: 'Is purely a soft-tissue injury' },
      ],
      correctOptionId: 'a',
      explanation:
        'Jones fractures occur in a watershed blood supply zone with higher nonunion risk; athletes are frequently offered surgical fixation, unlike most tuberosity avulsions.',
    },
    {
      id: 'draft-ankle-q4',
      moduleId: 'ankle-foot',
      domain: 'do-not-miss',
      prompt: 'Midfoot pain with plantar ecchymosis and normal non-weightbearing films should prompt:',
      options: [
        { id: 'a', text: 'Weightbearing foot views or CT to evaluate for a Lisfranc injury' },
        { id: 'b', text: 'Reassurance and immediate return to play' },
        { id: 'c', text: 'MRI of the lumbar spine' },
        { id: 'd', text: 'No further imaging' },
      ],
      correctOptionId: 'a',
      explanation:
        'Plantar ecchymosis with midfoot pain is a Lisfranc red flag; non-weightbearing films can look normal, so obtain weightbearing views or CT.',
    },
  ],

  spine: [
    {
      id: 'draft-spine-q3',
      moduleId: 'spine',
      domain: 'spine',
      prompt: 'In an adolescent athlete with extension-related back pain and negative plain films, the preferred next imaging is:',
      options: [
        { id: 'a', text: 'MRI to detect an active pars stress reaction without ionizing radiation' },
        { id: 'b', text: 'Repeat identical plain films weekly' },
        { id: 'c', text: 'No imaging ever' },
        { id: 'd', text: 'Immediate myelography' },
      ],
      correctOptionId: 'a',
      explanation:
        'MRI detects early/active pars stress reaction and spares radiation in young athletes, making it the preferred modality when spondylolysis is suspected.',
    },
    {
      id: 'draft-spine-q4',
      moduleId: 'spine',
      domain: 'escalation',
      prompt: 'Which feature most warrants urgent advanced imaging rather than plain films alone in spine evaluation?',
      options: [
        { id: 'a', text: 'Progressive neurologic deficit or red-flag symptoms' },
        { id: 'b', text: 'Mild muscular soreness after a game' },
        { id: 'c', text: 'Isolated paraspinal tenderness with normal exam' },
        { id: 'd', text: 'Stiffness that improves with warm-up' },
      ],
      correctOptionId: 'a',
      explanation:
        'Neurologic deficits or red flags (e.g., bowel/bladder changes, severe night pain) require MRI/CT; plain films are insufficient to exclude cord or significant structural pathology.',
    },
  ],

  'pediatric-adolescent': [
    {
      id: 'draft-peds-q3',
      moduleId: 'pediatric-adolescent',
      domain: 'pediatric',
      prompt: 'A Salter-Harris II fracture involves the:',
      options: [
        { id: 'a', text: 'Physis and a metaphyseal fragment (Thurston-Holland)' },
        { id: 'b', text: 'Physis and epiphysis only' },
        { id: 'c', text: 'Physis alone' },
        { id: 'd', text: 'Crushed physis with no fragment' },
      ],
      correctOptionId: 'a',
      explanation:
        'Salter-Harris II (the most common type) extends through the physis and exits the metaphysis, producing a Thurston-Holland fragment.',
    },
    {
      id: 'draft-peds-q4',
      moduleId: 'pediatric-adolescent',
      domain: 'pediatric',
      prompt: 'What best distinguishes a traction apophysitis (e.g., Osgood-Schlatter) from an acute apophyseal avulsion?',
      options: [
        { id: 'a', text: 'Chronic activity-related onset vs. a sudden, often displaced injury' },
        { id: 'b', text: 'Apophysitis is always surgical' },
        { id: 'c', text: 'Avulsions never show on x-ray' },
        { id: 'd', text: 'They are radiographically identical and clinically indistinguishable' },
      ],
      correctOptionId: 'a',
      explanation:
        'Apophysitis is a chronic overuse/traction phenomenon; an acute avulsion is a sudden, frequently displaced fragment from a forceful contraction — the history and degree of displacement separate them.',
    },
  ],

  'do-not-miss': [
    {
      id: 'draft-dnm-q2',
      moduleId: 'do-not-miss',
      domain: 'do-not-miss',
      prompt: 'Disrupted Gilula arcs on a wrist radiograph should raise concern for:',
      options: [
        { id: 'a', text: 'Perilunate/lunate dislocation' },
        { id: 'b', text: 'Bipartite patella' },
        { id: 'c', text: 'Os trigonum' },
        { id: 'd', text: 'Calcific tendinopathy' },
      ],
      correctOptionId: 'a',
      explanation:
        'The three smooth Gilula arcs describe normal carpal alignment; disruption indicates a perilunate or lunate dislocation, which needs urgent reduction and hand-surgery referral.',
    },
    {
      id: 'draft-dnm-q3',
      moduleId: 'do-not-miss',
      domain: 'escalation',
      prompt: 'A high-suspicion injury with a normal-appearing radiograph should generally be managed by:',
      options: [
        { id: 'a', text: 'Protecting/immobilizing and escalating imaging rather than reassuring' },
        { id: 'b', text: 'Discharging because the film is read as normal' },
        { id: 'c', text: 'Returning to sport immediately' },
        { id: 'd', text: 'Waiting months before any action' },
      ],
      correctOptionId: 'a',
      explanation:
        'Occult scaphoid, femoral neck stress, Lisfranc, and talar dome injuries can be radiographically silent; when suspicion is high, protect and escalate (repeat films, CT, or MRI).',
    },
  ],
};
