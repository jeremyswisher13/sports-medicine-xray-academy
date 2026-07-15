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
    pearl: 'Light-bulb appearance plus locked internal rotation is a strong clue; prove the joint relationship on an axial view.',
  },
  {
    id: 'fc-shd-2',
    moduleId: 'shoulder',
    front: 'Normal coracoclavicular distance?',
    back: 'About 11–13 mm in many adults; account for technique and compare to the contralateral side when available.',
    pearl: 'A roughly 25–100% side-to-side increase fits a type III pattern when the other Rockwood features agree.',
  },
  {
    id: 'fc-shd-3',
    moduleId: 'shoulder',
    front: 'What does a narrowed acromiohumeral interval suggest?',
    back: 'On an adequately positioned upright AP, an interval below about 7 mm supports chronic superior migration or large chronic cuff dysfunction; it is specific but not sensitive, and a normal interval does not exclude a tear.',
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
    back: 'A glenoid rim fracture from anterior dislocation; clinically important bone loss can shift stabilization planning toward a bony procedure.',
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
    back: 'ACL tear and associated internal derangement. MRI is usually the next study when clinically appropriate.',
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
    back: 'Reassess for occult fracture or internal derangement; consider MRI based on examination and management needs.',
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
    back: 'Adult OA evaluation — they load the posterior weightbearing zone of the femoral condyles, revealing tibiofemoral joint-space narrowing missed on a standard extended AP.',
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
    back: 'On a well-positioned mortise, the medial clear space should generally not exceed the superior clear space. Asymmetry raises concern for deltoid injury or instability, but rotation, stress, and technique matter.',
  },
  {
    id: 'fc-af-2',
    moduleId: 'ankle-foot',
    front: 'Plantar ecchymosis with midfoot pain = ?',
    back: 'High concern for Lisfranc injury → weightbearing comparison views when tolerated, or CT/MRI when not.',
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
    back: 'A proximal fibula fracture associated with syndesmotic disruption and a medial ankle injury, which may be deltoid rupture or a medial malleolar fracture. Examine the whole fibula and obtain full-length tib/fib views when indicated.',
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
    front: 'How should the tibiofibular clear space be used for syndesmosis assessment?',
    back: 'A value around 6 mm or greater at about 1 cm above the plafond raises concern, but projection, rotation, and the rest of the mortise assessment must be considered.',
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
    back: 'At initial presentation, use non-weightbearing immobilization and arrange early follow-up; fixation is often considered in high-demand athletes.',
  },
];

const doNotMissDeck: Flashcard[] = [
  {
    id: 'fc-dnm-1',
    moduleId: 'do-not-miss',
    front: 'Klein line on AP pelvis fails to intersect the lateral epiphysis = ?',
    back: 'SCFE concern — immediate non-weightbearing and urgent orthopedic referral; choose the lateral view by stability.',
  },
  {
    id: 'fc-dnm-2',
    moduleId: 'do-not-miss',
    front: 'Disrupted Gilula arcs on PA wrist plus abnormal capitate-lunate alignment on lateral = ?',
    back: 'Urgent concern for perilunate/lunate carpal injury; a perilunate dislocation requires emergency reduction and hand-surgery management.',
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
    back: 'Non-weightbearing immobilization plus early orthopedic/sports referral; surgical fixation is often considered for high-demand athletes.',
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
    back: 'Marrow fat in the joint, strongly indicating an intra-articular fracture.',
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
    back: 'Occult physeal injury remains possible, but tenderness alone is not diagnostic. Use the site-specific pathway and reassess the clinical course.',
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
    back: 'A line down the radial neck should intersect the capitellum on adequately positioned views.',
    pearl: 'A reproducible miss across views raises concern for radial head dislocation or a Monteggia pattern; rotation and age can create apparent misses.',
  },
  {
    id: 'fc-elbow-2',
    moduleId: 'elbow',
    front: 'Anterior humeral line rule in children?',
    back: 'On a true lateral it should intersect the capitellum; the middle third is typical at age 5 and older, while younger children may intersect more anteriorly.',
  },
  {
    id: 'fc-elbow-3',
    moduleId: 'elbow',
    front: 'Posterior fat pad on elbow x-ray means…',
    back: 'An abnormal elbow effusion after trauma that strongly suggests occult intra-articular injury; manage as a possible fracture.',
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
    back: 'Possible occult fracture, commonly supracondylar; immobilize and arrange appropriate follow-up when the clinical picture fits.',
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
    front: 'Cam morphology x-ray concept?',
    back: 'Loss of normal femoral head-neck offset, often seen as an aspherical bump. It supports FAI syndrome only when symptoms and examination also fit.',
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
    back: 'A normal x-ray despite a compatible mechanism and focal symptoms at an open physis; the diagnosis remains clinical and site-specific.',
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
    front: 'Radiograph-negative pediatric lateral ankle injury?',
    back: 'Most are ligament sprains or occult avulsions, not Salter-Harris I distal fibula. Use a removable brace/functional recovery pathway when low risk, with reassessment if recovery is atypical.',
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
