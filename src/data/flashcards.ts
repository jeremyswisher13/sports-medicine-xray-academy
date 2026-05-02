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

const foundationsExpansionDeck: Flashcard[] = [
  {
    id: 'fc-fnd-9',
    moduleId: 'xray-foundations',
    front: 'What makes an x-ray finding clinically actionable?',
    back: 'It is reproducible, fits the history/exam, and changes management or follow-up.',
    pearl: 'Incidental findings still matter, but the impression should answer the clinical question first.',
  },
  {
    id: 'fc-fnd-10',
    moduleId: 'xray-foundations',
    front: 'How should you respond to focal pain with normal x-rays?',
    back: 'Protect the area, re-examine, and choose repeat films or advanced imaging based on the injury pattern.',
    pearl: 'Normal x-rays lower risk; they do not erase a convincing exam.',
  },
  {
    id: 'fc-fnd-11',
    moduleId: 'xray-foundations',
    front: 'Why trace cortex on both AP and lateral views?',
    back: 'A fracture, displacement, or angulation may be visible on only one projection.',
  },
  {
    id: 'fc-fnd-12',
    moduleId: 'xray-foundations',
    front: 'What is the most useful structure for a sports medicine x-ray note?',
    back: 'One-line impression + key negatives + next step when suspicion remains high.',
  },
];

const shoulderExpansionDeck: Flashcard[] = [
  {
    id: 'fc-shd-9',
    moduleId: 'shoulder',
    front: 'On a scapular Y view, where should the humeral head sit?',
    back: 'Centered over the glenoid at the intersection of the Y.',
    pearl: 'If it is anterior or posterior to the Y, think dislocation.',
  },
  {
    id: 'fc-shd-10',
    moduleId: 'shoulder',
    front: 'Distal clavicle osteolysis — classic x-ray clue?',
    back: 'Distal clavicle resorption or irregularity at the AC joint, often in weightlifters.',
  },
  {
    id: 'fc-shd-11',
    moduleId: 'shoulder',
    front: 'Greater tuberosity fracture after shoulder injury suggests what associated problem?',
    back: 'Rotator cuff injury or anterior dislocation mechanism.',
  },
  {
    id: 'fc-shd-12',
    moduleId: 'shoulder',
    front: 'What shoulder x-ray finding should trigger concern for chronic cuff tear arthropathy?',
    back: 'Superior humeral head migration with a narrowed acromiohumeral interval.',
  },
];

const kneeExpansionDeck: Flashcard[] = [
  {
    id: 'fc-knee-9',
    moduleId: 'knee',
    front: 'What does lipohemarthrosis on knee x-ray imply?',
    back: 'An intra-articular fracture until proven otherwise.',
    pearl: 'Look for a fat-fluid level on the horizontal-beam lateral.',
  },
  {
    id: 'fc-knee-10',
    moduleId: 'knee',
    front: 'Osgood-Schlatter vs acute tibial tubercle avulsion?',
    back: 'Osgood-Schlatter is chronic fragmentation/soft-tissue swelling; acute avulsion is displaced and traumatic.',
  },
  {
    id: 'fc-knee-11',
    moduleId: 'knee',
    front: 'Which view can reveal intercondylar notch, tibial spine, loose body, or OCD findings?',
    back: 'Tunnel / notch view.',
  },
  {
    id: 'fc-knee-12',
    moduleId: 'knee',
    front: 'Classic location for adolescent knee OCD?',
    back: 'Lateral aspect of the medial femoral condyle.',
  },
];

const ankleFootExpansionDeck: Flashcard[] = [
  {
    id: 'fc-af-9',
    moduleId: 'ankle-foot',
    front: 'Ottawa ankle rules: when are ankle radiographs indicated?',
    back: 'Malleolar pain plus posterior edge/tip malleolar tenderness or inability to take 4 steps.',
  },
  {
    id: 'fc-af-10',
    moduleId: 'ankle-foot',
    front: 'Ottawa foot rules: when are foot radiographs indicated?',
    back: 'Midfoot pain plus navicular/base of 5th metatarsal tenderness or inability to take 4 steps.',
  },
  {
    id: 'fc-af-11',
    moduleId: 'ankle-foot',
    front: 'Talar neck or body fracture — next imaging step?',
    back: 'CT to define the fracture and articular involvement.',
    pearl: 'Protect weightbearing because talar blood supply is unforgiving.',
  },
  {
    id: 'fc-af-12',
    moduleId: 'ankle-foot',
    front: 'Early metatarsal stress fracture x-rays are often…',
    back: 'Normal. Repeat films may show callus; MRI is best when the answer is urgent.',
  },
];

const doNotMissExpansionDeck: Flashcard[] = [
  {
    id: 'fc-dnm-9',
    moduleId: 'do-not-miss',
    front: 'Adolescent knee pain with limp should make you image what joint?',
    back: 'The hip. SCFE can present as thigh or knee pain.',
  },
  {
    id: 'fc-dnm-10',
    moduleId: 'do-not-miss',
    front: 'Open physis + focal bony tenderness + normal x-ray = ?',
    back: 'Treat as possible Salter-Harris I injury when the exam is convincing.',
  },
  {
    id: 'fc-dnm-11',
    moduleId: 'do-not-miss',
    front: 'High ankle sprain concern with normal mortise films — what next?',
    back: 'Immobilize/protect, assess proximal fibula, and consider stress imaging, weightbearing views, MRI, or ortho input.',
  },
  {
    id: 'fc-dnm-12',
    moduleId: 'do-not-miss',
    front: 'Aggressive bone lesion red flags on x-ray?',
    back: 'Permeative destruction, wide zone of transition, cortical breakthrough, soft-tissue mass, or aggressive periosteal reaction.',
    pearl: 'Do not inject through unexplained destructive bone pain.',
  },
];

const elbowDeck: Flashcard[] = [
  {
    id: 'fc-elbow-1',
    moduleId: 'elbow',
    front: 'Radiocapitellar line rule?',
    back: 'A line down the radial neck should intersect the capitellum on every view.',
    pearl: 'If it misses, think radial head dislocation or Monteggia pattern.',
  },
  {
    id: 'fc-elbow-2',
    moduleId: 'elbow',
    front: 'Anterior humeral line rule in children?',
    back: 'On the true lateral, it should pass through the middle third of the capitellum.',
  },
  {
    id: 'fc-elbow-3',
    moduleId: 'elbow',
    front: 'Posterior fat pad on elbow x-ray means…',
    back: 'Elbow effusion and occult fracture until proven otherwise.',
  },
  {
    id: 'fc-elbow-4',
    moduleId: 'elbow',
    front: 'Adult elbow effusion after fall with no visible fracture usually means…',
    back: 'Occult radial head fracture.',
  },
  {
    id: 'fc-elbow-5',
    moduleId: 'elbow',
    front: 'Pediatric elbow effusion after trauma with subtle films usually means…',
    back: 'Occult supracondylar fracture until proven otherwise.',
  },
  {
    id: 'fc-elbow-6',
    moduleId: 'elbow',
    front: 'Terrible triad of the elbow?',
    back: 'Elbow dislocation + radial head fracture + coronoid fracture.',
  },
  {
    id: 'fc-elbow-7',
    moduleId: 'elbow',
    front: 'Adolescent thrower with medial elbow pain — key x-ray concern?',
    back: 'Medial epicondyle apophysitis or avulsion; compare alignment and physeal widening.',
  },
  {
    id: 'fc-elbow-8',
    moduleId: 'elbow',
    front: 'Adolescent thrower/gymnast with lateral elbow pain — key diagnosis?',
    back: 'Capitellar OCD; x-rays can be subtle, MRI helps stage the lesion.',
  },
];

const wristHandDeck: Flashcard[] = [
  {
    id: 'fc-wh-1',
    moduleId: 'wrist-hand',
    front: 'Scaphoid waist fractures are dangerous because…',
    back: 'The proximal pole has tenuous blood supply and risk of nonunion/AVN.',
  },
  {
    id: 'fc-wh-2',
    moduleId: 'wrist-hand',
    front: 'Terry Thomas sign?',
    back: 'Scapholunate widening, classically >3 mm, suggesting scapholunate ligament injury.',
  },
  {
    id: 'fc-wh-3',
    moduleId: 'wrist-hand',
    front: 'Gilula arcs help detect what?',
    back: 'Carpal malalignment, especially perilunate/lunate instability patterns.',
  },
  {
    id: 'fc-wh-4',
    moduleId: 'wrist-hand',
    front: 'Perilunate dislocation x-ray clue?',
    back: 'Capitate no longer aligned with the lunate on lateral view; lunate usually still faces distal radius.',
  },
  {
    id: 'fc-wh-5',
    moduleId: 'wrist-hand',
    front: 'Hook of hamate fracture — best next imaging if standard views are negative?',
    back: 'Carpal tunnel view or CT.',
    pearl: 'Think bat, club, racket, or persistent ulnar-sided wrist pain.',
  },
  {
    id: 'fc-wh-6',
    moduleId: 'wrist-hand',
    front: 'Boxer fracture x-ray must be paired with what clinical check?',
    back: 'Finger rotation. Malrotation is not reliably judged from x-ray alone.',
  },
  {
    id: 'fc-wh-7',
    moduleId: 'wrist-hand',
    front: 'Mallet finger x-ray finding?',
    back: 'Dorsal avulsion fracture at the distal phalanx base, sometimes with DIP subluxation.',
  },
  {
    id: 'fc-wh-8',
    moduleId: 'wrist-hand',
    front: 'Skier thumb/gamekeeper thumb x-ray concern?',
    back: 'Ulnar collateral ligament avulsion at the thumb MCP; assess for displaced fragment or instability.',
  },
];

const pelvisHipDeck: Flashcard[] = [
  {
    id: 'fc-hip-1',
    moduleId: 'pelvis-hip',
    front: 'Minimum hip trauma series?',
    back: 'AP pelvis plus lateral hip view, often cross-table lateral when fracture is suspected.',
  },
  {
    id: 'fc-hip-2',
    moduleId: 'pelvis-hip',
    front: 'SCFE must be managed how at presentation?',
    back: 'Non-weightbearing and urgent orthopedic referral.',
  },
  {
    id: 'fc-hip-3',
    moduleId: 'pelvis-hip',
    front: 'Runner with groin pain and normal x-ray — high-risk diagnosis?',
    back: 'Femoral neck stress fracture; MRI is the key test.',
  },
  {
    id: 'fc-hip-4',
    moduleId: 'pelvis-hip',
    front: 'Adolescent pelvis avulsion fractures occur because…',
    back: 'Open apophyses are weaker than the tendon during explosive contraction.',
  },
  {
    id: 'fc-hip-5',
    moduleId: 'pelvis-hip',
    front: 'Common adolescent pelvic avulsion sites?',
    back: 'ASIS, AIIS, ischial tuberosity, iliac crest, and lesser trochanter.',
  },
  {
    id: 'fc-hip-6',
    moduleId: 'pelvis-hip',
    front: 'Cam-type FAI x-ray concept?',
    back: 'Loss of normal femoral head-neck offset, often seen as an aspherical bump.',
  },
  {
    id: 'fc-hip-7',
    moduleId: 'pelvis-hip',
    front: 'Pelvic ring fracture principle?',
    back: 'One break should make you search for a second ring injury.',
  },
  {
    id: 'fc-hip-8',
    moduleId: 'pelvis-hip',
    front: 'Hip dislocation after trauma — why get post-reduction imaging?',
    back: 'To confirm reduction and assess for fracture fragments or acetabular injury.',
  },
];

const spineDeck: Flashcard[] = [
  {
    id: 'fc-spine-1',
    moduleId: 'spine',
    front: 'Adequate lateral cervical spine film must show…',
    back: 'C1 through the C7-T1 junction.',
  },
  {
    id: 'fc-spine-2',
    moduleId: 'spine',
    front: 'Three cervical alignment lines to trace?',
    back: 'Anterior vertebral line, posterior vertebral line, and spinolaminar line.',
  },
  {
    id: 'fc-spine-3',
    moduleId: 'spine',
    front: 'When is CT preferred over plain films in cervical trauma?',
    back: 'High-risk mechanism, neurologic findings, older patient, or inadequate radiographs.',
  },
  {
    id: 'fc-spine-4',
    moduleId: 'spine',
    front: 'Adolescent extension athlete with low back pain — key x-ray concern?',
    back: 'Pars stress injury / spondylolysis.',
  },
  {
    id: 'fc-spine-5',
    moduleId: 'spine',
    front: 'Spondylolisthesis is best appreciated on which view?',
    back: 'Lateral lumbar radiograph.',
  },
  {
    id: 'fc-spine-6',
    moduleId: 'spine',
    front: 'Compression fracture x-ray clue?',
    back: 'Wedge deformity or loss of vertebral body height.',
  },
  {
    id: 'fc-spine-7',
    moduleId: 'spine',
    front: 'Back pain red flags that should shift imaging urgency?',
    back: 'Trauma, cancer/infection concern, fever, neurologic deficit, or bowel/bladder symptoms.',
  },
  {
    id: 'fc-spine-8',
    moduleId: 'spine',
    front: 'Early inflammatory sacroiliitis can have what x-ray problem?',
    back: 'Radiographs may be normal early; MRI is more sensitive when suspicion remains high.',
  },
];

const pediatricAdolescentDeck: Flashcard[] = [
  {
    id: 'fc-ped-1',
    moduleId: 'pediatric-adolescent',
    front: 'Why are pediatric x-rays easy to overcall?',
    back: 'Growth plates, apophyses, and ossification centers can mimic fractures.',
  },
  {
    id: 'fc-ped-2',
    moduleId: 'pediatric-adolescent',
    front: 'Buckle fracture x-ray clue?',
    back: 'Subtle cortical bulge without a complete cortical break.',
  },
  {
    id: 'fc-ped-3',
    moduleId: 'pediatric-adolescent',
    front: 'Salter-Harris I injury can look like…',
    back: 'A normal x-ray with focal physeal tenderness.',
  },
  {
    id: 'fc-ped-4',
    moduleId: 'pediatric-adolescent',
    front: 'Little League shoulder x-ray finding?',
    back: 'Widening or irregularity of the proximal humeral physis.',
  },
  {
    id: 'fc-ped-5',
    moduleId: 'pediatric-adolescent',
    front: 'Toddler fracture x-ray pattern?',
    back: 'Subtle spiral fracture of the tibia; initial films may be negative.',
  },
  {
    id: 'fc-ped-6',
    moduleId: 'pediatric-adolescent',
    front: 'Adolescent apophyseal avulsion vs muscle strain?',
    back: 'Explosive mechanism plus bony tenderness at an apophysis should trigger pelvis/region x-rays.',
  },
  {
    id: 'fc-ped-7',
    moduleId: 'pediatric-adolescent',
    front: 'Pediatric ankle sprain with focal physeal tenderness?',
    back: 'Treat as possible physeal injury when x-rays are negative but the exam is convincing.',
  },
  {
    id: 'fc-ped-8',
    moduleId: 'pediatric-adolescent',
    front: 'Why use comparison views selectively in children?',
    back: 'They can clarify symmetry, but should be ordered only when the result will change interpretation.',
  },
];

export const flashcards: Flashcard[] = [
  ...foundationsDeck,
  ...foundationsExpansionDeck,
  ...shoulderDeck,
  ...shoulderExpansionDeck,
  ...elbowDeck,
  ...wristHandDeck,
  ...pelvisHipDeck,
  ...kneeDeck,
  ...kneeExpansionDeck,
  ...ankleFootDeck,
  ...ankleFootExpansionDeck,
  ...spineDeck,
  ...pediatricAdolescentDeck,
  ...doNotMissDeck,
  ...doNotMissExpansionDeck,
];

export function getFlashcardsForModule(moduleId: string): Flashcard[] {
  return flashcards.filter((f) => f.moduleId === moduleId);
}
