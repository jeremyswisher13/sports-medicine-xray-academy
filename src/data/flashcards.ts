import type { Flashcard } from '../types';

// Active-recall flashcard decks. Each card forces retrieval of a high-yield
// fact, framework step, or clinical decision rule. Pearls are short and
// clinically actionable — never long textbook prose.

const foundationsDeck: Flashcard[] = [
  {
    id: 'fc-fnd-1',
    moduleId: 'xray-foundations',
    front: 'What are the six steps of the Systematic X-Ray Read?',
    back: 'Confirm → Alignment → Bone → Cartilage → Soft Tissues → Impression.',
    pearl: 'A repeatable habit beats memorizing fracture patterns.',
  },
  {
    id: 'fc-fnd-2',
    moduleId: 'xray-foundations',
    front: 'Why is a single-view x-ray almost never enough?',
    back: 'Pathology hides on a single projection. Get orthogonal views.',
    pearl: 'Two views = bare minimum. Add a special view when the question demands it.',
  },
  {
    id: 'fc-fnd-3',
    moduleId: 'xray-foundations',
    front: 'When should you order weightbearing views?',
    back: 'Knee OA, suspected Lisfranc, syndesmosis concern, or midfoot pain when patient can bear weight.',
    pearl: 'NWB films can hide Lisfranc and syndesmosis injuries.',
  },
  {
    id: 'fc-fnd-4',
    moduleId: 'xray-foundations',
    front: 'List 4 injuries that can be radiographically occult despite high suspicion.',
    back: 'Scaphoid fracture, Lisfranc, femoral neck stress fracture, talar dome osteochondral lesion.',
    pearl: 'Suspicion drives the workup, not radiologist sign-off alone.',
  },
  {
    id: 'fc-fnd-5',
    moduleId: 'xray-foundations',
    front: 'What soft-tissue cue often signals an occult fracture?',
    back: 'A displaced fat pad sign or focal soft-tissue swelling adjacent to bone.',
    pearl: 'Soft tissue is the tiebreaker when bone looks unremarkable.',
  },
  {
    id: 'fc-fnd-6',
    moduleId: 'xray-foundations',
    front: 'How do accessory ossicles differ from acute avulsion fractures?',
    back: 'Accessory ossicles have smooth, corticated margins and predictable locations; avulsions have sharp, irregular edges.',
  },
  {
    id: 'fc-fnd-7',
    moduleId: 'xray-foundations',
    front: 'What does a sports medicine impression include?',
    back: 'Most likely diagnosis, important negatives, clinical correlation, and next step.',
    pearl: 'Concise and clinically actionable beats radiology-style prose.',
  },
  {
    id: 'fc-fnd-8',
    moduleId: 'xray-foundations',
    front: 'Image adequacy means…',
    back: 'Right patient, right side, right view, right exposure, no clipping.',
    pearl: 'A bad film cannot rule anything out — repeat it.',
  },
];

const shoulderDeck: Flashcard[] = [
  {
    id: 'fc-shd-1',
    moduleId: 'shoulder',
    front: 'Most essential view to diagnose posterior shoulder dislocation?',
    back: 'Axillary view (or Velpeau substitute). AP can look near-normal.',
    pearl: 'Light bulb sign on AP + locked internal rotation = posterior dislocation until proven otherwise.',
  },
  {
    id: 'fc-shd-2',
    moduleId: 'shoulder',
    front: 'Normal coracoclavicular distance?',
    back: '11–13 mm. Always compare to the contralateral side.',
    pearl: 'CC distance increase >25–50% over the other side suggests Type III+ AC separation.',
  },
  {
    id: 'fc-shd-3',
    moduleId: 'shoulder',
    front: 'Acromiohumeral interval cutoff for chronic cuff insufficiency?',
    back: '< 7 mm = chronic rotator cuff insufficiency.',
  },
  {
    id: 'fc-shd-4',
    moduleId: 'shoulder',
    front: 'What is a Hill-Sachs lesion?',
    back: 'Posterolateral humeral head impaction fracture from anterior dislocation.',
    pearl: 'Look for it on Grashey or stryker notch view.',
  },
  {
    id: 'fc-shd-5',
    moduleId: 'shoulder',
    front: 'Bony Bankart lesion clinical relevance?',
    back: 'Glenoid rim fracture from anterior dislocation; >15–20% bone loss can shift surgery to a bone-block (e.g., Latarjet).',
  },
  {
    id: 'fc-shd-6',
    moduleId: 'shoulder',
    front: 'Calcific tendinopathy — typical x-ray finding?',
    back: 'Amorphous mineralization adjacent to the cuff insertion (often supraspinatus near the greater tuberosity).',
  },
  {
    id: 'fc-shd-7',
    moduleId: 'shoulder',
    front: 'When is MRI indicated despite normal shoulder x-rays?',
    back: 'Suspected rotator cuff tear, labral injury, occult fracture, or persistent instability.',
  },
  {
    id: 'fc-shd-8',
    moduleId: 'shoulder',
    front: 'On Grashey, what should the joint space look like?',
    back: 'A clean, concentric joint space — that is how you confirm an adequate film.',
  },
];

const kneeDeck: Flashcard[] = [
  {
    id: 'fc-knee-1',
    moduleId: 'knee',
    front: 'Segond fracture is associated with…',
    back: 'ACL tear (in ~75–100% of cases). Always order MRI.',
    pearl: 'A 3–5 mm avulsion off the lateral tibial plateau in a pivot injury is rarely innocent.',
  },
  {
    id: 'fc-knee-2',
    moduleId: 'knee',
    front: 'Bipartite patella vs patellar fracture?',
    back: 'Bipartite has smooth corticated margins, typically superolateral. Fracture has sharp, irregular edges.',
  },
  {
    id: 'fc-knee-3',
    moduleId: 'knee',
    front: 'Patella alta is associated with…',
    back: 'Patellar instability.',
  },
  {
    id: 'fc-knee-4',
    moduleId: 'knee',
    front: 'Tibial plateau fracture next imaging step?',
    back: 'CT for fragment characterization and surgical planning. MRI if ligament concern.',
  },
  {
    id: 'fc-knee-5',
    moduleId: 'knee',
    front: 'Acute large knee effusion + normal x-ray = ?',
    back: 'Internal derangement until proven otherwise → MRI.',
  },
  {
    id: 'fc-knee-6',
    moduleId: 'knee',
    front: 'Best view for patellofemoral alignment?',
    back: 'Sunrise / Merchant.',
  },
  {
    id: 'fc-knee-7',
    moduleId: 'knee',
    front: 'When are weightbearing PA flexion (Rosenberg) views useful?',
    back: 'Adult OA evaluation — they reveal posterior compartment narrowing missed on standard AP.',
  },
  {
    id: 'fc-knee-8',
    moduleId: 'knee',
    front: 'Tibial spine avulsion in a pediatric patient implies…',
    back: 'ACL avulsion equivalent — refer to ortho.',
  },
];

const ankleFootDeck: Flashcard[] = [
  {
    id: 'fc-af-1',
    moduleId: 'ankle-foot',
    front: 'On a mortise view, what should medial vs superior clear space look like?',
    back: 'Equal — both ~2–4 mm. Medial > superior suggests deltoid/syndesmotic injury.',
  },
  {
    id: 'fc-af-2',
    moduleId: 'ankle-foot',
    front: 'Plantar ecchymosis with midfoot pain = ?',
    back: 'Lisfranc until proven otherwise → weightbearing AP foot or CT.',
  },
  {
    id: 'fc-af-3',
    moduleId: 'ankle-foot',
    front: 'Three zones of 5th metatarsal fracture?',
    back: 'Tuberosity (avulsion), metaphyseal-diaphyseal junction (Jones), proximal diaphysis (stress).',
    pearl: 'Zone determines management.',
  },
  {
    id: 'fc-af-4',
    moduleId: 'ankle-foot',
    front: 'Maisonneuve fracture?',
    back: 'Proximal fibula fracture with deltoid disruption — get full-length tib/fib films.',
  },
  {
    id: 'fc-af-5',
    moduleId: 'ankle-foot',
    front: 'Persistent ankle pain 6–8 weeks after a "sprain" — next step?',
    back: 'MRI for talar dome / OCD.',
  },
  {
    id: 'fc-af-6',
    moduleId: 'ankle-foot',
    front: 'Tib-fib clear space cutoff suggesting syndesmotic widening?',
    back: '> 5–6 mm at 1 cm above the plafond.',
  },
  {
    id: 'fc-af-7',
    moduleId: 'ankle-foot',
    front: 'Os trigonum vs talar fracture?',
    back: 'Os trigonum has smooth corticated margins behind the talus; fractures have sharp edges.',
  },
  {
    id: 'fc-af-8',
    moduleId: 'ankle-foot',
    front: 'When should a Jones fracture get NWB management?',
    back: 'Always at presentation; surgical fixation often considered in athletes due to nonunion risk.',
  },
];

const doNotMissDeck: Flashcard[] = [
  {
    id: 'fc-dnm-1',
    moduleId: 'do-not-miss',
    front: 'Klein line on AP pelvis fails to intersect the lateral epiphysis = ?',
    back: 'SCFE — emergent ortho referral, NWB.',
  },
  {
    id: 'fc-dnm-2',
    moduleId: 'do-not-miss',
    front: 'Disrupted Gilula arcs on lateral wrist = ?',
    back: 'Perilunate dislocation — urgent reduction and hand surgery.',
  },
  {
    id: 'fc-dnm-3',
    moduleId: 'do-not-miss',
    front: 'Snuffbox tenderness + "normal" wrist films = ?',
    back: 'Treat as occult scaphoid: thumb spica + repeat films in 10–14 days or MRI.',
  },
  {
    id: 'fc-dnm-4',
    moduleId: 'do-not-miss',
    front: 'Progressive groin pain in a runner with normal AP pelvis = ?',
    back: 'Femoral neck stress fracture risk → MRI, protect weightbearing.',
  },
  {
    id: 'fc-dnm-5',
    moduleId: 'do-not-miss',
    front: 'Subtle lateral tibial plateau depression — next step?',
    back: 'CT for surgical planning.',
  },
  {
    id: 'fc-dnm-6',
    moduleId: 'do-not-miss',
    front: 'Posterior shoulder dislocation — most reliable view?',
    back: 'Axillary or Velpeau (NOT AP alone).',
  },
  {
    id: 'fc-dnm-7',
    moduleId: 'do-not-miss',
    front: 'Lisfranc injury with normal NWB foot films — what to do?',
    back: 'Weightbearing AP foot or CT.',
  },
  {
    id: 'fc-dnm-8',
    moduleId: 'do-not-miss',
    front: 'Jones fracture in an athlete — initial management?',
    back: 'NWB CAM boot + ortho referral; surgical fixation often considered.',
  },
];

export const flashcards: Flashcard[] = [
  ...foundationsDeck,
  ...shoulderDeck,
  ...kneeDeck,
  ...ankleFootDeck,
  ...doNotMissDeck,
];

export function getFlashcardsForModule(moduleId: string): Flashcard[] {
  return flashcards.filter((f) => f.moduleId === moduleId);
}
