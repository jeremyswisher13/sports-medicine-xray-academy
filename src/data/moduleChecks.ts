import { moduleContents } from './modules';
import type { ModuleContent, QuizQuestionData } from '../types';

// Generic 3-question systematic-read pre/post check used as a fallback for
// modules that don't yet have curated module-specific pre/post questions.
// (Delivered with every module so the learner experience is consistent.)
const genericPreCheck = (moduleId: string): QuizQuestionData[] => [
  {
    id: `${moduleId}-pre-q1`,
    moduleId,
    domain: 'systematic',
    prompt:
      'Which step of the Systematic X-Ray Read is most likely to catch a subtle dislocation or instability?',
    options: [
      { id: 'a', text: 'Bone (cortical disruption)' },
      { id: 'b', text: 'Alignment (joint congruity)' },
      { id: 'c', text: 'Cartilage (joint space)' },
      { id: 'd', text: 'Soft tissues only' },
    ],
    correctOptionId: 'b',
    explanation:
      'Alignment is often the fastest cue for dislocation, subluxation, or instability — even when bone looks intact.',
  },
  {
    id: `${moduleId}-pre-q2`,
    moduleId,
    domain: 'occult',
    prompt:
      'A clinically suspicious presentation has a "normal" x-ray. What is the most appropriate clinical instinct?',
    options: [
      { id: 'a', text: 'Reassure and discharge' },
      { id: 'b', text: 'Document the negative film and never re-image' },
      { id: 'c', text: 'Treat empirically and escalate to MRI/CT/repeat film if suspicion remains' },
      { id: 'd', text: 'Order labs first' },
    ],
    correctOptionId: 'c',
    explanation:
      'Suspicion drives the workup, not radiologist sign-off alone. Stress fractures, occult scaphoid, Lisfranc, and femoral neck stress can all be radiographically silent.',
  },
  {
    id: `${moduleId}-pre-q3`,
    moduleId,
    domain: 'views',
    prompt:
      'Which choice best characterizes when standard two-view x-rays are insufficient?',
    options: [
      { id: 'a', text: 'Always — get advanced imaging up front for any sports injury' },
      { id: 'b', text: 'Never — two views always suffice in sports medicine clinic' },
      { id: 'c', text: 'When pretest probability for a not-to-miss injury remains high' },
      { id: 'd', text: 'Only when the patient asks for an MRI' },
    ],
    correctOptionId: 'c',
    explanation:
      'Match imaging escalation to clinical pretest probability and the consequences of missing the diagnosis.',
  },
];

const genericPostCheck = (moduleId: string): QuizQuestionData[] => [
  {
    id: `${moduleId}-post-q1`,
    moduleId,
    domain: 'systematic',
    prompt:
      'Which best summarizes the Systematic X-Ray Read?',
    options: [
      { id: 'a', text: 'Bone, cartilage, ligament, tendon, nerve, vessel' },
      { id: 'b', text: 'Confirm, alignment, bone, cartilage, soft tissues, impression' },
      { id: 'c', text: 'Look at the obvious finding; ignore the rest' },
      { id: 'd', text: 'Order MRI first; review films second' },
    ],
    correctOptionId: 'b',
    explanation:
      'Confirm → Alignment → Bone → Cartilage → Soft Tissues → Impression. A repeatable habit beats memorizing fracture patterns.',
  },
  {
    id: `${moduleId}-post-q2`,
    moduleId,
    domain: 'do-not-miss',
    prompt:
      'Which scenario most warrants advanced imaging even with a normal radiograph?',
    options: [
      { id: 'a', text: 'A child with mild bruising and pain-free range of motion' },
      { id: 'b', text: 'An adult with snuffbox tenderness after a FOOSH and "normal" wrist films' },
      { id: 'c', text: 'A teenager with a sprained ankle and no swelling' },
      { id: 'd', text: 'A weekend warrior with post-exercise soreness' },
    ],
    correctOptionId: 'b',
    explanation:
      'Occult scaphoid is the prototype "normal x-ray, abnormal patient" scenario — thumb spica + repeat films/MRI.',
  },
  {
    id: `${moduleId}-post-q3`,
    moduleId,
    domain: 'escalation',
    prompt:
      'A reasonable sports medicine impression on a radiograph should include which of the following?',
    options: [
      { id: 'a', text: 'Most likely diagnosis only' },
      { id: 'b', text: 'A list of every fracture pattern seen historically' },
      { id: 'c', text: 'Most likely diagnosis, important negatives, clinical correlation, and next step' },
      { id: 'd', text: 'A copy-paste of the radiology read' },
    ],
    correctOptionId: 'c',
    explanation:
      'Sports medicine impressions are concise and clinically actionable: diagnosis + relevant negatives + correlation + next step.',
  },
];

// Module-specific pre/post checks. Index by moduleId. If absent, we fall back
// to the generic systematic-read checks above. Each is 3 questions to keep the
// "quick" promise to the learner.
const specificPreChecks: Record<string, QuizQuestionData[]> = {
  shoulder: [
    {
      id: 'shoulder-pre-q1',
      moduleId: 'shoulder',
      domain: 'shoulder',
      prompt:
        'Which view is most essential for diagnosing a posterior shoulder dislocation?',
      options: [
        { id: 'a', text: 'AP internal rotation' },
        { id: 'b', text: 'Grashey view alone' },
        { id: 'c', text: 'Axillary or adequate scapular Y' },
        { id: 'd', text: 'AC joint dedicated view' },
      ],
      correctOptionId: 'c',
      explanation: 'AP can be near-normal; axillary or true Y reveals the malalignment.',
    },
    {
      id: 'shoulder-pre-q2',
      moduleId: 'shoulder',
      domain: 'shoulder',
      prompt: 'On a Grashey view, what should the glenohumeral joint space look like?',
      options: [
        { id: 'a', text: 'Overlapping humeral head and glenoid' },
        { id: 'b', text: 'A clean, concentric joint space' },
        { id: 'c', text: 'Asymmetric superior narrowing' },
        { id: 'd', text: 'A "light bulb" appearance' },
      ],
      correctOptionId: 'b',
      explanation: 'A true Grashey shows a concentric joint space — that is how you confirm an adequate film.',
    },
    {
      id: 'shoulder-pre-q3',
      moduleId: 'shoulder',
      domain: 'shoulder',
      prompt:
        'Which AP finding most strongly suggests chronic rotator cuff insufficiency?',
      options: [
        { id: 'a', text: 'Calcific tendinopathy' },
        { id: 'b', text: 'Hill-Sachs lesion' },
        { id: 'c', text: 'Acromiohumeral interval < 7 mm (high-riding humeral head)' },
        { id: 'd', text: 'Os acromiale' },
      ],
      correctOptionId: 'c',
      explanation: 'Acromiohumeral narrowing implies chronic cuff dysfunction.',
    },
  ],
  elbow: [
    {
      id: 'elbow-pre-q1',
      moduleId: 'elbow',
      domain: 'elbow',
      prompt: 'A posterior fat pad on an elbow lateral radiograph most strongly suggests:',
      options: [
        { id: 'a', text: 'Normal elbow variant' },
        { id: 'b', text: 'Occult intra-articular fracture until proven otherwise' },
        { id: 'c', text: 'Isolated tendinopathy' },
        { id: 'd', text: 'Olecranon bursitis only' },
      ],
      correctOptionId: 'b',
      explanation:
        'A posterior fat pad is abnormal. Think radial head/neck fracture in adults and occult supracondylar fracture in children.',
    },
    {
      id: 'elbow-pre-q2',
      moduleId: 'elbow',
      domain: 'elbow',
      prompt: 'Which line should intersect the capitellum on every elbow view?',
      options: [
        { id: 'a', text: 'Radiocapitellar line' },
        { id: 'b', text: "Shenton's line" },
        { id: 'c', text: "Klein's line" },
        { id: 'd', text: 'Gilula arc' },
      ],
      correctOptionId: 'a',
      explanation:
        'The radiocapitellar line runs through the radial neck and should intersect the capitellum on every view.',
    },
    {
      id: 'elbow-pre-q3',
      moduleId: 'elbow',
      domain: 'views',
      prompt: 'Oblique elbow views are most helpful when you need more detail of the:',
      options: [
        { id: 'a', text: 'Radial head, radial neck, or coronoid' },
        { id: 'b', text: 'Femoral head coverage' },
        { id: 'c', text: 'Scapholunate interval' },
        { id: 'd', text: 'Ankle mortise' },
      ],
      correctOptionId: 'a',
      explanation:
        'Obliques help profile the radial head/neck and coronoid when AP/lateral are not enough.',
    },
  ],
  'wrist-hand': [
    {
      id: 'wrist-hand-pre-q1',
      moduleId: 'wrist-hand',
      domain: 'wrist-hand',
      prompt: 'The standard wrist trauma series should include:',
      options: [
        { id: 'a', text: 'PA, lateral, and oblique' },
        { id: 'b', text: 'AP shoulder and scapular Y' },
        { id: 'c', text: 'AP pelvis and frog-leg lateral' },
        { id: 'd', text: 'Mortise ankle view only' },
      ],
      correctOptionId: 'a',
      explanation:
        'Standard wrist trauma radiographs are PA, lateral, and oblique; add targeted views based on suspicion.',
    },
    {
      id: 'wrist-hand-pre-q2',
      moduleId: 'wrist-hand',
      domain: 'wrist-hand',
      prompt: 'A clenched-fist or stress wrist view is most useful for suspected:',
      options: [
        { id: 'a', text: 'Dynamic scapholunate instability' },
        { id: 'b', text: 'Posterior shoulder dislocation' },
        { id: 'c', text: 'SCFE' },
        { id: 'd', text: 'Lisfranc injury' },
      ],
      correctOptionId: 'a',
      explanation:
        'Stress/clenched-fist views can reveal dynamic scapholunate widening that neutral films miss.',
    },
    {
      id: 'wrist-hand-pre-q3',
      moduleId: 'wrist-hand',
      domain: 'do-not-miss',
      prompt: 'On the lateral wrist, the capitate no longer stacks on the lunate. The dangerous diagnosis is:',
      options: [
        { id: 'a', text: 'Perilunate or lunate dislocation' },
        { id: 'b', text: 'TFCC sprain only' },
        { id: 'c', text: 'Mallet finger' },
        { id: 'd', text: 'Normal carpal alignment' },
      ],
      correctOptionId: 'a',
      explanation:
        'Perilunate/lunate injuries are commonly missed and require urgent reduction and hand surgery evaluation.',
    },
  ],
  'pelvis-hip': [
    {
      id: 'pelvis-hip-pre-q1',
      moduleId: 'pelvis-hip',
      domain: 'views',
      prompt: 'Acute hip fracture is suspected. Which lateral view strategy is safest?',
      options: [
        { id: 'a', text: 'Cross-table lateral of the symptomatic hip' },
        { id: 'b', text: 'Frog-leg lateral of the painful hip' },
        { id: 'c', text: 'Sunrise/Merchant view' },
        { id: 'd', text: 'Clenched-fist view' },
      ],
      correctOptionId: 'a',
      explanation:
        'Avoid frog-leg positioning when acute fracture is suspected; cross-table lateral is safer.',
    },
    {
      id: 'pelvis-hip-pre-q2',
      moduleId: 'pelvis-hip',
      domain: 'pediatric',
      prompt: 'An adolescent with knee pain but no knee injury should make you deliberately evaluate the:',
      options: [
        { id: 'a', text: 'Hip, including SCFE screening' },
        { id: 'b', text: 'Cervical spine first' },
        { id: 'c', text: 'Wrist alignment' },
        { id: 'd', text: 'Contralateral shoulder only' },
      ],
      correctOptionId: 'a',
      explanation:
        'SCFE and other hip pathology can present as thigh or knee pain. The hip must stay in the differential.',
    },
    {
      id: 'pelvis-hip-pre-q3',
      moduleId: 'pelvis-hip',
      domain: 'occult',
      prompt: 'A distance runner has focal femoral neck pain and negative x-rays. Best next step if suspicion remains high?',
      options: [
        { id: 'a', text: 'MRI and protected/non-weightbearing management while evaluating' },
        { id: 'b', text: 'Reassurance because x-rays are normal' },
        { id: 'c', text: 'Ignore until a fracture line appears' },
        { id: 'd', text: 'Only repeat x-rays in one year' },
      ],
      correctOptionId: 'a',
      explanation:
        'Femoral neck stress fractures can be radiographically occult and can complete catastrophically.',
    },
  ],
  knee: [
    {
      id: 'knee-pre-q1',
      moduleId: 'knee',
      domain: 'knee',
      prompt:
        'A small avulsion fragment on the lateral tibial plateau after a pivot-shift injury most strongly implies what?',
      options: [
        { id: 'a', text: 'LCL strain in isolation' },
        { id: 'b', text: 'ACL tear (Segond fracture)' },
        { id: 'c', text: 'Tibial tubercle apophysitis' },
        { id: 'd', text: 'Lateral meniscus root tear in isolation' },
      ],
      correctOptionId: 'b',
      explanation: 'Segond → ACL until proven otherwise.',
    },
    {
      id: 'knee-pre-q2',
      moduleId: 'knee',
      domain: 'knee',
      prompt: 'Which view best evaluates patellofemoral alignment?',
      options: [
        { id: 'a', text: 'AP knee' },
        { id: 'b', text: 'Lateral knee' },
        { id: 'c', text: 'Sunrise / Merchant' },
        { id: 'd', text: 'Tunnel / notch' },
      ],
      correctOptionId: 'c',
      explanation: 'Sunrise/Merchant profiles the patella in the trochlear groove.',
    },
    {
      id: 'knee-pre-q3',
      moduleId: 'knee',
      domain: 'knee',
      prompt:
        'A large effusion on a lateral knee after acute trauma with normal-appearing bone most warrants:',
      options: [
        { id: 'a', text: 'Reassurance and NSAIDs' },
        { id: 'b', text: 'MRI to evaluate for internal derangement or occult fracture' },
        { id: 'c', text: 'Bone scan' },
        { id: 'd', text: 'Casting and re-image in 6 weeks' },
      ],
      correctOptionId: 'b',
      explanation:
        'Acute traumatic effusion + normal x-ray = suspect ACL, meniscus, or osteochondral injury.',
    },
  ],
  'ankle-foot': [
    {
      id: 'ankle-foot-pre-q1',
      moduleId: 'ankle-foot',
      domain: 'ankle-foot',
      prompt:
        'On a mortise view, the medial clear space exceeds the superior clear space by 3 mm. This implies:',
      options: [
        { id: 'a', text: 'Normal mortise' },
        { id: 'b', text: 'Deltoid / syndesmotic injury' },
        { id: 'c', text: 'Posterior malleolar fracture only' },
        { id: 'd', text: 'Os trigonum' },
      ],
      correctOptionId: 'b',
      explanation: 'Asymmetric medial > superior clear space = deltoid/syndesmosis disruption.',
    },
    {
      id: 'ankle-foot-pre-q2',
      moduleId: 'ankle-foot',
      domain: 'ankle-foot',
      prompt:
        'Plantar ecchymosis with midfoot pain and a normal NWB foot film — best next step?',
      options: [
        { id: 'a', text: 'Reassure' },
        { id: 'b', text: 'Weightbearing AP foot or CT' },
        { id: 'c', text: 'MRI lumbar spine' },
        { id: 'd', text: 'Splint and re-image in 6 weeks' },
      ],
      correctOptionId: 'b',
      explanation: 'Plantar ecchymosis = Lisfranc until proven otherwise.',
    },
    {
      id: 'ankle-foot-pre-q3',
      moduleId: 'ankle-foot',
      domain: 'ankle-foot',
      prompt:
        'A transverse fracture at the metaphyseal-diaphyseal junction of the 5th MT in an athlete is best managed initially with:',
      options: [
        { id: 'a', text: 'WBAT in a hard-sole shoe' },
        { id: 'b', text: 'NWB CAM boot and orthopedic referral (Jones)' },
        { id: 'c', text: 'Ace wrap and discharge' },
        { id: 'd', text: 'Tylenol only' },
      ],
      correctOptionId: 'b',
      explanation: 'Jones fractures have higher nonunion risk; NWB and surgical evaluation are standard.',
    },
  ],
  spine: [
    {
      id: 'spine-pre-q1',
      moduleId: 'spine',
      domain: 'spine',
      prompt: 'Adult acute low back pain without red flags usually warrants:',
      options: [
        { id: 'a', text: 'No routine initial imaging' },
        { id: 'b', text: 'Immediate lumbar x-rays for everyone' },
        { id: 'c', text: 'Immediate MRI for everyone' },
        { id: 'd', text: 'CT before clinical exam' },
      ],
      correctOptionId: 'a',
      explanation:
        'Knowing when not to image is part of high-value spine care. Red flags change the pathway.',
    },
    {
      id: 'spine-pre-q2',
      moduleId: 'spine',
      domain: 'spine',
      prompt: 'Suspected adolescent spondylolysis generally starts with:',
      options: [
        { id: 'a', text: 'AP and lateral radiographs' },
        { id: 'b', text: 'Routine CT for every athlete' },
        { id: 'c', text: 'Hand radiographs' },
        { id: 'd', text: 'No imaging even with persistent focal extension pain' },
      ],
      correctOptionId: 'a',
      explanation:
        'AP and lateral radiographs are the starting study; MRI is useful when films are negative but suspicion remains or active stress injury matters.',
    },
    {
      id: 'spine-pre-q3',
      moduleId: 'spine',
      domain: 'escalation',
      prompt: 'Which spine presentation warrants prompt escalation regardless of plain-film appearance?',
      options: [
        { id: 'a', text: 'Progressive neurologic deficit or urinary retention' },
        { id: 'b', text: 'Mild soreness after a new workout with normal exam' },
        { id: 'c', text: 'Improving mechanical pain only' },
        { id: 'd', text: 'Chronic stiffness without red flags' },
      ],
      correctOptionId: 'a',
      explanation:
        'Neurologic or cauda equina-type symptoms are disposition-changing red flags.',
    },
  ],
  'pediatric-adolescent': [
    {
      id: 'pediatric-adolescent-pre-q1',
      moduleId: 'pediatric-adolescent',
      domain: 'pediatric',
      prompt: 'What normal pediatric finding commonly mimics fracture for trainees?',
      options: [
        { id: 'a', text: 'Open physes, ossification centers, and apophyses' },
        { id: 'b', text: 'Primary osteoarthritis' },
        { id: 'c', text: 'Chronic rotator cuff arthropathy' },
        { id: 'd', text: 'Adult-type degenerative scoliosis only' },
      ],
      correctOptionId: 'a',
      explanation:
        'Pediatric normal variants are a major source of overcalls and undercalls; normal-first exposure matters.',
    },
    {
      id: 'pediatric-adolescent-pre-q2',
      moduleId: 'pediatric-adolescent',
      domain: 'pediatric',
      prompt: 'Stable SCFE is typically evaluated with:',
      options: [
        { id: 'a', text: 'Bilateral AP pelvis and frog-leg lateral hips' },
        { id: 'b', text: 'Single AP knee only' },
        { id: 'c', text: 'Scaphoid view' },
        { id: 'd', text: 'Ankle mortise only' },
      ],
      correctOptionId: 'a',
      explanation:
        'Stable SCFE is commonly evaluated with bilateral AP and frog-leg lateral hips; unstable/acute SCFE needs a safer lateral strategy.',
    },
    {
      id: 'pediatric-adolescent-pre-q3',
      moduleId: 'pediatric-adolescent',
      domain: 'do-not-miss',
      prompt: 'Which limping-child diagnosis is an orthopedic emergency?',
      options: [
        { id: 'a', text: 'Septic arthritis' },
        { id: 'b', text: 'Osgood-Schlatter disease' },
        { id: 'c', text: 'Accessory ossicle' },
        { id: 'd', text: 'Mild Sever disease' },
      ],
      correctOptionId: 'a',
      explanation:
        'Septic arthritis is a do-not-miss emergency; refusal to bear weight, systemic symptoms, and severe pain should escalate care.',
    },
  ],
  'xray-foundations': [
    {
      id: 'xray-foundations-pre-q1',
      moduleId: 'xray-foundations',
      domain: 'foundations',
      prompt:
        'When you receive a single-view x-ray of an acute MSK injury, the right move is to:',
      options: [
        { id: 'a', text: 'Make the call from one view to save time' },
        { id: 'b', text: 'Insist on orthogonal views before interpretation' },
        { id: 'c', text: 'Order an MRI' },
        { id: 'd', text: 'Refer to ortho without further imaging' },
      ],
      correctOptionId: 'b',
      explanation:
        'Almost every MSK injury requires orthogonal views — pathology hides on a single projection.',
    },
    {
      id: 'xray-foundations-pre-q2',
      moduleId: 'xray-foundations',
      domain: 'foundations',
      prompt:
        'Soft tissue swelling and effusion are useful x-ray findings because:',
      options: [
        { id: 'a', text: 'They are always specific to a single diagnosis' },
        { id: 'b', text: 'They can be the only clue to occult fracture' },
        { id: 'c', text: 'They preclude the need for MRI' },
        { id: 'd', text: 'They replace clinical exam' },
      ],
      correctOptionId: 'b',
      explanation:
        'A displaced fat pad is often the only sign of an occult fracture.',
    },
    {
      id: 'xray-foundations-pre-q3',
      moduleId: 'xray-foundations',
      domain: 'foundations',
      prompt: 'A normal x-ray most reliably rules out which of the following?',
      options: [
        { id: 'a', text: 'Femoral neck stress fracture' },
        { id: 'b', text: 'Scaphoid fracture' },
        { id: 'c', text: 'A displaced long-bone diaphyseal fracture' },
        { id: 'd', text: 'Lisfranc injury' },
      ],
      correctOptionId: 'c',
      explanation:
        'Displaced diaphyseal fractures are reliably visible. Scaphoid, femoral neck stress, and Lisfranc can all be radiographically occult.',
    },
  ],
  'do-not-miss': [
    {
      id: 'do-not-miss-pre-q1',
      moduleId: 'do-not-miss',
      domain: 'do-not-miss',
      prompt:
        'Which is the most consequential miss in sports medicine x-ray interpretation?',
      options: [
        { id: 'a', text: 'A small distal phalangeal tuft fracture' },
        { id: 'b', text: 'A femoral neck stress fracture' },
        { id: 'c', text: 'A normal AC joint with mild widening' },
        { id: 'd', text: 'A stable buckle fracture in a child' },
      ],
      correctOptionId: 'b',
      explanation:
        'Tension-side femoral neck stress fractures can complete catastrophically; missing them changes outcomes profoundly.',
    },
    {
      id: 'do-not-miss-pre-q2',
      moduleId: 'do-not-miss',
      domain: 'do-not-miss',
      prompt: "Klein's line abnormality on AP pelvis in an adolescent suggests:",
      options: [
        { id: 'a', text: 'Transient synovitis' },
        { id: 'b', text: 'SCFE' },
        { id: 'c', text: 'Apophysitis' },
        { id: 'd', text: 'Legg-Calvé-Perthes' },
      ],
      correctOptionId: 'b',
      explanation:
        'Klein line failing to intersect the lateral epiphysis is the classic SCFE finding.',
    },
    {
      id: 'do-not-miss-pre-q3',
      moduleId: 'do-not-miss',
      domain: 'do-not-miss',
      prompt:
        'Disrupted Gilula arcs on a lateral wrist x-ray suggests:',
      options: [
        { id: 'a', text: 'Distal radius fracture' },
        { id: 'b', text: 'Perilunate dislocation' },
        { id: 'c', text: 'Scaphoid waist fracture' },
        { id: 'd', text: 'Triangular fibrocartilage tear' },
      ],
      correctOptionId: 'b',
      explanation:
        'Perilunate dislocation needs urgent reduction and hand surgery referral.',
    },
  ],
};

const specificPostChecks: Record<string, QuizQuestionData[]> = {
  shoulder: [
    {
      id: 'shoulder-post-q1',
      moduleId: 'shoulder',
      domain: 'shoulder',
      prompt:
        'A wrestler has locked internal rotation and a "light bulb" sign on AP. Best confirmatory view?',
      options: [
        { id: 'a', text: 'AP external rotation' },
        { id: 'b', text: 'Axillary or Velpeau' },
        { id: 'c', text: 'AC joint view' },
        { id: 'd', text: 'Stryker notch view' },
      ],
      correctOptionId: 'b',
      explanation: 'Posterior dislocation needs a true axillary or Velpeau substitute.',
    },
    {
      id: 'shoulder-post-q2',
      moduleId: 'shoulder',
      domain: 'shoulder',
      prompt: 'In suspected anterior shoulder instability, what most influences surgical planning?',
      options: [
        { id: 'a', text: 'Os acromiale' },
        { id: 'b', text: 'Calcific tendinopathy' },
        { id: 'c', text: 'Glenoid bone loss / bony Bankart on axillary or CT' },
        { id: 'd', text: 'AC joint widening' },
      ],
      correctOptionId: 'c',
      explanation: 'Glenoid bone loss > ~15-20% can shift the surgical plan.',
    },
    {
      id: 'shoulder-post-q3',
      moduleId: 'shoulder',
      domain: 'shoulder',
      prompt:
        'AC separation grading depends most on:',
      options: [
        { id: 'a', text: 'Patient age' },
        { id: 'b', text: 'Coracoclavicular distance and clavicle elevation vs. contralateral' },
        { id: 'c', text: 'Acromiohumeral interval' },
        { id: 'd', text: 'Greater tuberosity profile' },
      ],
      correctOptionId: 'b',
      explanation: 'Compare CC distance to the opposite side and grade with Rockwood.',
    },
  ],
  elbow: [
    {
      id: 'elbow-post-q1',
      moduleId: 'elbow',
      domain: 'elbow',
      prompt: 'In a child, the anterior humeral line should normally:',
      options: [
        { id: 'a', text: 'Bisect the middle third of the capitellum on lateral' },
        { id: 'b', text: 'Intersect the femoral head' },
        { id: 'c', text: 'Outline the ankle mortise' },
        { id: 'd', text: 'Measure the scapholunate interval' },
      ],
      correctOptionId: 'a',
      explanation:
        'Posterior displacement of the capitellum relative to the anterior humeral line suggests pediatric supracondylar fracture.',
    },
    {
      id: 'elbow-post-q2',
      moduleId: 'elbow',
      domain: 'do-not-miss',
      prompt: 'A posterior fat pad with no obvious fracture line in an adult is most classically associated with:',
      options: [
        { id: 'a', text: 'Occult radial head or neck fracture' },
        { id: 'b', text: 'Normal exam finding' },
        { id: 'c', text: 'SCFE' },
        { id: 'd', text: 'Posterior shoulder dislocation' },
      ],
      correctOptionId: 'a',
      explanation:
        'In adults, occult radial head/neck fracture is the classic posterior-fat-pad scenario.',
    },
    {
      id: 'elbow-post-q3',
      moduleId: 'elbow',
      domain: 'pediatric',
      prompt: 'Medial elbow pain in a young thrower with physeal widening most suggests:',
      options: [
        { id: 'a', text: 'Medial epicondyle apophysitis or avulsion spectrum' },
        { id: 'b', text: 'Perilunate dislocation' },
        { id: 'c', text: 'Lisfranc injury' },
        { id: 'd', text: 'Femoral neck stress fracture' },
      ],
      correctOptionId: 'a',
      explanation:
        'Little League elbow and medial epicondyle avulsion are high-yield pediatric throwing injuries.',
    },
  ],
  'wrist-hand': [
    {
      id: 'wrist-hand-post-q1',
      moduleId: 'wrist-hand',
      domain: 'occult',
      prompt: 'FOOSH + snuffbox tenderness + normal initial wrist x-rays should be managed with:',
      options: [
        { id: 'a', text: 'Thumb spica immobilization plus repeat films or MRI when indicated' },
        { id: 'b', text: 'Immediate reassurance and return to play' },
        { id: 'c', text: 'No immobilization unless displaced' },
        { id: 'd', text: 'Only elbow x-rays' },
      ],
      correctOptionId: 'a',
      explanation:
        'Occult scaphoid fracture is a high-yield “normal x-ray, abnormal patient” scenario.',
    },
    {
      id: 'wrist-hand-post-q2',
      moduleId: 'wrist-hand',
      domain: 'wrist-hand',
      prompt: 'Which finding most suggests carpal instability/perilunate injury?',
      options: [
        { id: 'a', text: 'Broken Gilula arcs or loss of radius-lunate-capitate stacking' },
        { id: 'b', text: 'Normal smooth Gilula arcs' },
        { id: 'c', text: 'Normal scapholunate angle' },
        { id: 'd', text: 'Normal AP shoulder alignment' },
      ],
      correctOptionId: 'a',
      explanation:
        'Carpal alignment lines prevent high-morbidity misses when an obvious fracture distracts the reader.',
    },
    {
      id: 'wrist-hand-post-q3',
      moduleId: 'wrist-hand',
      domain: 'wrist-hand',
      prompt: 'The normal scapholunate angle on lateral wrist is roughly:',
      options: [
        { id: 'a', text: '30 to 60 degrees' },
        { id: 'b', text: '0 to 10 degrees' },
        { id: 'c', text: '90 to 120 degrees' },
        { id: 'd', text: 'Always irrelevant' },
      ],
      correctOptionId: 'a',
      explanation:
        'A scapholunate angle around 30 to 60 degrees is a useful lateral-view anchor when assessing carpal alignment.',
    },
  ],
  'pelvis-hip': [
    {
      id: 'pelvis-hip-post-q1',
      moduleId: 'pelvis-hip',
      domain: 'views',
      prompt: 'Initial radiographs for non-fracture hip pain usually include:',
      options: [
        { id: 'a', text: 'AP pelvis and frog-leg lateral of the symptomatic hip' },
        { id: 'b', text: 'AP wrist and clenched-fist view' },
        { id: 'c', text: 'Only a single AP hip' },
        { id: 'd', text: 'Ankle mortise and oblique foot' },
      ],
      correctOptionId: 'a',
      explanation:
        'AP pelvis plus frog-leg lateral is the standard non-fracture hip pain starting point.',
    },
    {
      id: 'pelvis-hip-post-q2',
      moduleId: 'pelvis-hip',
      domain: 'pelvis-hip',
      prompt: 'Which landmark helps screen hip congruity and proximal femur alignment on AP pelvis?',
      options: [
        { id: 'a', text: "Shenton's line" },
        { id: 'b', text: 'Anterior humeral line' },
        { id: 'c', text: 'Gilula arc' },
        { id: 'd', text: 'Medial clear space' },
      ],
      correctOptionId: 'a',
      explanation:
        "Shenton's line is a key AP pelvis landmark for femoral head/neck relationship and alignment.",
    },
    {
      id: 'pelvis-hip-post-q3',
      moduleId: 'pelvis-hip',
      domain: 'pediatric',
      prompt: 'Unstable or acute SCFE should be imaged with:',
      options: [
        { id: 'a', text: 'AP plus cross-table lateral of the involved side' },
        { id: 'b', text: 'Painful frog-leg lateral as the only view' },
        { id: 'c', text: 'Wrist scaphoid view' },
        { id: 'd', text: 'No imaging if knee films are normal' },
      ],
      correctOptionId: 'a',
      explanation:
        'Unstable SCFE needs a safer lateral strategy; avoid forcing frog-leg positioning.',
    },
  ],
  knee: [
    {
      id: 'knee-post-q1',
      moduleId: 'knee',
      domain: 'knee',
      prompt: 'Bipartite patella vs patellar fracture is best distinguished by:',
      options: [
        { id: 'a', text: 'Effusion' },
        { id: 'b', text: 'Smooth corticated margins (bipartite) vs irregular sharp edges (fracture)' },
        { id: 'c', text: 'Patient age' },
        { id: 'd', text: 'Presence of pain' },
      ],
      correctOptionId: 'b',
      explanation: 'Bipartite patella has smooth corticated margins, typically superolateral.',
    },
    {
      id: 'knee-post-q2',
      moduleId: 'knee',
      domain: 'knee',
      prompt: 'Subtle depression of the lateral tibial plateau on AP knee is best evaluated next with:',
      options: [
        { id: 'a', text: 'Watchful waiting and re-image in 2 weeks' },
        { id: 'b', text: 'CT for fragment characterization and surgical planning' },
        { id: 'c', text: 'MRI of the lumbar spine' },
        { id: 'd', text: 'Bone scan' },
      ],
      correctOptionId: 'b',
      explanation: 'Even subtle plateau depression changes the surgical plan; CT is standard.',
    },
    {
      id: 'knee-post-q3',
      moduleId: 'knee',
      domain: 'knee',
      prompt: 'Patella alta is most associated with:',
      options: [
        { id: 'a', text: 'Patellofemoral OA only' },
        { id: 'b', text: 'Patellar instability' },
        { id: 'c', text: 'Bipartite patella' },
        { id: 'd', text: 'Tibial plateau fracture' },
      ],
      correctOptionId: 'b',
      explanation: 'Patella height is a known risk factor for instability.',
    },
  ],
  'ankle-foot': [
    {
      id: 'ankle-foot-post-q1',
      moduleId: 'ankle-foot',
      domain: 'ankle-foot',
      prompt: 'A high-energy ankle injury with deltoid tenderness and proximal fibula tenderness suggests:',
      options: [
        { id: 'a', text: 'Isolated lateral ankle sprain' },
        { id: 'b', text: 'Maisonneuve fracture' },
        { id: 'c', text: 'Talar dome lesion' },
        { id: 'd', text: 'Os trigonum' },
      ],
      correctOptionId: 'b',
      explanation:
        'Maisonneuve = proximal fibula fracture with deltoid disruption; full-length tib/fib films and ortho referral.',
    },
    {
      id: 'ankle-foot-post-q2',
      moduleId: 'ankle-foot',
      domain: 'ankle-foot',
      prompt: 'Persistent ankle pain with mechanical clicking 8 weeks after a "sprain" warrants:',
      options: [
        { id: 'a', text: 'Reassurance and PT' },
        { id: 'b', text: 'MRI ankle' },
        { id: 'c', text: 'CT abdomen/pelvis' },
        { id: 'd', text: 'Bone scan' },
      ],
      correctOptionId: 'b',
      explanation: 'Talar dome / OCD is the classic "post-sprain pain" scenario; MRI is the test of choice.',
    },
    {
      id: 'ankle-foot-post-q3',
      moduleId: 'ankle-foot',
      domain: 'ankle-foot',
      prompt: 'Avulsion vs Jones vs proximal-diaphyseal stress fracture of the 5th MT:',
      options: [
        { id: 'a', text: 'They are managed identically' },
        { id: 'b', text: 'Location determines management' },
        { id: 'c', text: 'Only the avulsion needs surgery' },
        { id: 'd', text: 'Only the proximal diaphyseal stress fracture needs imaging' },
      ],
      correctOptionId: 'b',
      explanation: 'The fracture zone (tuberosity, metaphyseal-diaphyseal junction, proximal diaphysis) drives management.',
    },
  ],
  spine: [
    {
      id: 'spine-post-q1',
      moduleId: 'spine',
      domain: 'spine',
      prompt: 'Initial imaging for adolescent scoliosis evaluation is generally:',
      options: [
        { id: 'a', text: 'Complete-spine radiography' },
        { id: 'b', text: 'Single lateral wrist view' },
        { id: 'c', text: 'Ankle mortise view' },
        { id: 'd', text: 'No imaging ever' },
      ],
      correctOptionId: 'a',
      explanation:
        'Complete-spine radiography is the standard starting imaging study for scoliosis evaluation.',
    },
    {
      id: 'spine-post-q2',
      moduleId: 'spine',
      domain: 'spine',
      prompt: 'Scheuermann kyphosis classically shows:',
      options: [
        { id: 'a', text: 'Anterior wedging of three consecutive vertebrae with endplate irregularity' },
        { id: 'b', text: 'Broken Gilula arcs' },
        { id: 'c', text: 'Posterior fat pad only' },
        { id: 'd', text: 'Medial clear space widening' },
      ],
      correctOptionId: 'a',
      explanation:
        'Scheuermann disease is a spine pattern: consecutive anterior vertebral wedging plus endplate changes.',
    },
    {
      id: 'spine-post-q3',
      moduleId: 'spine',
      domain: 'escalation',
      prompt: 'Which pediatric back pain feature should prompt further evaluation?',
      options: [
        { id: 'a', text: 'Night pain, neurologic findings, systemic symptoms, or symptoms lasting more than four weeks' },
        { id: 'b', text: 'Mild improving soreness only' },
        { id: 'c', text: 'Normal exam and one day of symptoms' },
        { id: 'd', text: 'Pain only during a new workout and resolving' },
      ],
      correctOptionId: 'a',
      explanation:
        'Pediatric spine red flags include night pain, systemic symptoms, neurologic signs, bowel/bladder symptoms, and prolonged symptoms.',
    },
  ],
  'pediatric-adolescent': [
    {
      id: 'pediatric-adolescent-post-q1',
      moduleId: 'pediatric-adolescent',
      domain: 'pediatric',
      prompt: 'A smooth, corticated structure at a predictable age/location is more likely:',
      options: [
        { id: 'a', text: 'Normal apophysis or ossification center' },
        { id: 'b', text: 'Acute displaced fracture in every case' },
        { id: 'c', text: 'Posterior shoulder dislocation' },
        { id: 'd', text: 'Lisfranc injury' },
      ],
      correctOptionId: 'a',
      explanation:
        'Normal pediatric ossification centers and apophyses often have smooth corticated margins and predictable locations.',
    },
    {
      id: 'pediatric-adolescent-post-q2',
      moduleId: 'pediatric-adolescent',
      domain: 'pediatric',
      prompt: 'Hip pathology in children and adolescents can present as:',
      options: [
        { id: 'a', text: 'Knee pain' },
        { id: 'b', text: 'Only wrist pain' },
        { id: 'c', text: 'Only shoulder pain' },
        { id: 'd', text: 'No referred symptoms ever' },
      ],
      correctOptionId: 'a',
      explanation:
        'SCFE and other hip pathology can refer pain to the thigh or knee, so knee pain can still require hip review.',
    },
    {
      id: 'pediatric-adolescent-post-q3',
      moduleId: 'pediatric-adolescent',
      domain: 'occult',
      prompt: 'A child refuses to bear weight, has systemic symptoms, and initial radiographs are unrevealing. Best mindset?',
      options: [
        { id: 'a', text: 'Negative x-rays do not reassure; escalate based on the clinical story' },
        { id: 'b', text: 'Discharge because x-rays are normal' },
        { id: 'c', text: 'Ignore fever if the film is negative' },
        { id: 'd', text: 'Only repeat imaging in six months' },
      ],
      correctOptionId: 'a',
      explanation:
        'Septic arthritis, osteomyelitis, early Perthes, stress fracture, and toddler fracture can have subtle or initially normal radiographs.',
    },
  ],
  'xray-foundations': [
    {
      id: 'xray-foundations-post-q1',
      moduleId: 'xray-foundations',
      domain: 'foundations',
      prompt:
        'Which of the following best characterizes a sports medicine impression on an x-ray?',
      options: [
        { id: 'a', text: 'A lengthy descriptive paragraph' },
        { id: 'b', text: 'Most likely diagnosis only' },
        { id: 'c', text: 'Diagnosis + important negatives + clinical correlation + next step' },
        { id: 'd', text: 'A copy-paste of the radiology report' },
      ],
      correctOptionId: 'c',
      explanation: 'Concise, clinically actionable impressions matter more than radiology-style prose.',
    },
    {
      id: 'xray-foundations-post-q2',
      moduleId: 'xray-foundations',
      domain: 'foundations',
      prompt: 'Apophyses can be distinguished from avulsion fractures by:',
      options: [
        { id: 'a', text: 'Location alone' },
        { id: 'b', text: 'Smooth corticated margins and predictable age of appearance' },
        { id: 'c', text: 'Always being painful' },
        { id: 'd', text: 'Always being bilateral' },
      ],
      correctOptionId: 'b',
      explanation: 'Apophyses appear at predictable ages with smooth corticated margins.',
    },
    {
      id: 'xray-foundations-post-q3',
      moduleId: 'xray-foundations',
      domain: 'foundations',
      prompt: 'Image adequacy means:',
      options: [
        { id: 'a', text: 'The film looks "fine enough"' },
        { id: 'b', text: 'Right patient, right side, right view, right exposure, no clipping' },
        { id: 'c', text: 'The film has been signed off by radiology' },
        { id: 'd', text: 'The DICOM viewer opens' },
      ],
      correctOptionId: 'b',
      explanation: 'Confirming adequacy is step zero before any interpretation.',
    },
  ],
};

export function getPreCheck(module: ModuleContent): QuizQuestionData[] {
  return module.preCheck ?? specificPreChecks[module.id] ?? genericPreCheck(module.id);
}

export function getPostCheck(module: ModuleContent): QuizQuestionData[] {
  return module.postCheck ?? specificPostChecks[module.id] ?? genericPostCheck(module.id);
}

// Make sure we surface the helpers from a single export point.
export const checks = {
  pre: (id: string) => {
    const m = moduleContents.find((x) => x.id === id);
    return m ? getPreCheck(m) : genericPreCheck(id);
  },
  post: (id: string) => {
    const m = moduleContents.find((x) => x.id === id);
    return m ? getPostCheck(m) : genericPostCheck(id);
  },
};
