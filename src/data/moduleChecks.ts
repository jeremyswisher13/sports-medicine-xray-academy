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
