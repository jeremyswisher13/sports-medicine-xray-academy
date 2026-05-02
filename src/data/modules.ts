import type { ModuleContent, ModuleSummary, SystematicChecklistItem } from '../types';

export const systematicRead: SystematicChecklistItem[] = [
  {
    step: 'Confirm',
    prompts: [
      'Patient name and MRN',
      'Side (left vs right)',
      'Date of study',
      'Views obtained',
      'Image quality and adequacy',
    ],
  },
  {
    step: 'Alignment',
    prompts: [
      'Joint congruity',
      'Dislocation or subluxation',
      'Malalignment of the long bone axis',
      'Growth plate alignment in pediatric patients',
    ],
  },
  {
    step: 'Bone',
    prompts: [
      'Cortical disruption',
      'Trabecular disruption',
      'Avulsion fragments',
      'Stress injury signs (periosteal reaction, sclerotic line)',
      'Bone lesions or red flags',
    ],
  },
  {
    step: 'Cartilage',
    prompts: [
      'Joint space narrowing',
      'Osteophytes',
      'Subchondral sclerosis',
      'Subchondral cysts',
      'Effusion clues when visible',
    ],
  },
  {
    step: 'Soft Tissues',
    prompts: [
      'Swelling pattern',
      'Effusion or fat pad signs',
      'Calcifications',
      'Foreign bodies',
      'Tendon insertion changes',
    ],
  },
  {
    step: 'Impression',
    prompts: [
      'Most likely diagnosis',
      'Important negatives',
      'Clinical correlation',
      'Next step if x-ray is negative but suspicion remains high',
    ],
  },
];

const placeholderModule = (
  id: string,
  title: string,
  shortTitle: string,
  region: ModuleSummary['region'],
  description: string,
  emphasis: string[],
  estimatedMinutes: number,
): ModuleContent => ({
  id,
  title,
  shortTitle,
  region,
  description,
  estimatedMinutes,
  status: 'placeholder',
  emphasis,
  overview: [
    'This module is structured and ready to expand with the full Swisher / UCLA curriculum.',
    'Use the systematic read framework as your scaffolding while content is built out.',
  ],
  views: [],
  systematicNotes: [
    'Apply the Systematic X-Ray Read: Confirm → Alignment → Bone → Cartilage → Soft Tissues → Impression.',
  ],
  systematicChecklist: systematicRead,
  anatomy: [],
  pathology: [],
  doNotMiss: [],
  pitfalls: [],
  pearls: [],
  cases: [],
  quiz: [],
  keyTakeaways: [
    'Full content for this module is in development.',
    'In the interim, apply the systematic framework and use supplemental AMSSM videos.',
  ],
  whenToEscalate: [
    'High clinical suspicion despite a normal x-ray often warrants MRI or repeat imaging.',
    'Unstable or neurovascular findings warrant urgent referral regardless of x-ray result.',
  ],
});

// ---------- Module 1: X-Ray Foundations -----------------------------------

const xrayFoundations: ModuleContent = {
  id: 'xray-foundations',
  title: 'X-Ray Foundations',
  shortTitle: 'Foundations',
  region: 'Foundations',
  description:
    'A reproducible, clinic-ready approach to any musculoskeletal radiograph for sports medicine learners.',
  estimatedMinutes: 35,
  status: 'full',
  emphasis: ['Systematic read', 'Views and adequacy', 'When x-ray is not enough'],
  overview: [
    'Build a single mental model you can apply to any MSK x-ray in clinic.',
    'Recognize when films answer the clinical question and when MRI, CT, ultrasound, or repeat radiographs are warranted.',
    'Learn the difference between accessory ossicles, normal variants, and true fractures.',
  ],
  views: [
    {
      name: 'Standard two-view minimum',
      why: 'Almost every MSK injury requires orthogonal views — pathology hides on a single projection.',
      whenToOrder: 'Any acute MSK complaint after a focused exam.',
    },
    {
      name: 'Weightbearing views',
      why: 'Reveal joint space narrowing, syndesmotic widening, and Lisfranc injuries that look normal non-weightbearing.',
      whenToOrder: 'Knee OA, suspected Lisfranc, syndesmosis concern, midfoot pain in adults able to bear weight.',
    },
    {
      name: 'Comparison views',
      why: 'Useful in pediatrics and accessory ossicle questions.',
      whenToOrder: 'Open physis with subtle asymmetry, or suspected accessory ossicle vs avulsion.',
    },
  ],
  systematicNotes: [
    'Confirm patient, side, date, views, and image quality before assessing pathology.',
    'Always trace the cortex around every bone in every view.',
    'Use soft-tissue clues (swelling, effusion, fat pads) as a tiebreaker when bone looks unremarkable.',
  ],
  systematicChecklist: systematicRead,
  anatomy: [
    {
      label: 'Cortical bone',
      description: 'A continuous, thin white line at the edge of every bone.',
      pearl: 'A sudden step-off or buckle is a fracture until proven otherwise.',
    },
    {
      label: 'Physis (growth plate)',
      description: 'Lucent line between metaphysis and epiphysis in skeletally immature patients.',
      pearl: 'Should be symmetric and smoothly contoured. Asymmetric widening = Salter-Harris.',
    },
    {
      label: 'Soft tissue planes',
      description: 'Fat lines and stripes parallel to bones provide effusion and swelling clues.',
      pearl: 'A displaced fat pad is often the only sign of an occult fracture.',
    },
  ],
  pathology: [
    {
      finding: 'Cortical step-off',
      normal: 'Smooth continuous cortex on every view',
      pathologic: 'A discrete break or angular deformity in cortex',
      keyClue: 'Persistent abnormality on two orthogonal views',
      pitfall: 'Nutrient foramina mimic small fractures — they have smooth, sclerotic margins',
      nextStep: 'CT for occult cortical fractures with high clinical suspicion',
    },
    {
      finding: 'Stress injury',
      normal: 'Uniform cortex and trabeculae',
      pathologic: 'Focal periosteal reaction, sclerotic line, or cortical thickening',
      keyClue: 'Activity-related pain in a runner, jumper, or military recruit',
      pitfall: 'Early stress injuries are often radiographically occult',
      nextStep: 'MRI is the test of choice when films are normal but suspicion remains',
    },
    {
      finding: 'Effusion',
      normal: 'Crisp fat pads, no joint distention',
      pathologic: 'Displaced fat pads (e.g., posterior elbow fat pad) or joint distention',
      keyClue: 'Effusion after acute trauma raises suspicion for fracture or internal derangement',
      pitfall: 'A normal anterior fat pad does not exclude a posterior fat pad sign',
      nextStep: 'MRI when a clinically significant effusion has no obvious cause',
    },
  ],
  doNotMiss: [
    {
      title: 'Occult scaphoid fracture',
      why: 'Missed fractures lead to nonunion and avascular necrosis.',
      imagingNext: 'Splint, repeat x-ray in 10–14 days or get MRI for high suspicion.',
    },
    {
      title: 'Lisfranc injury',
      why: 'Weightbearing films may be the only way to see widening.',
      imagingNext: 'Weightbearing AP foot or CT if NWB and high suspicion.',
    },
    {
      title: 'Femoral neck stress fracture',
      why: 'Tension-side fractures can complete catastrophically.',
      imagingNext: 'Urgent MRI; protect weightbearing in the meantime.',
    },
  ],
  pitfalls: [
    {
      title: 'Accessory ossicles look like avulsions',
      body: 'Accessory ossicles (os trigonum, os peroneum, accessory navicular, bipartite patella) have smooth, corticated margins and predictable locations.',
    },
    {
      title: 'Treating "normal x-ray" as "no injury"',
      body: 'A negative x-ray does not exclude scaphoid fracture, Lisfranc, femoral neck stress, or early osteochondral injury — let clinical suspicion drive escalation.',
    },
    {
      title: 'Skipping image adequacy',
      body: 'Inadequate axillary views miss posterior shoulder dislocations; non-weightbearing foot films miss Lisfranc.',
    },
  ],
  pearls: [
    {
      title: 'Cortex first, soft tissue second, alignment always',
      body: 'A repeatable habit beats trying to memorize hundreds of fracture patterns.',
    },
    {
      title: 'A negative x-ray is data, not a diagnosis',
      body: 'Document your suspicion, your safety net, and your follow-up plan.',
    },
  ],
  cases: [
    {
      id: 'foundations-case-1',
      moduleId: 'xray-foundations',
      title: 'Snowboarder with persistent wrist pain',
      patientAge: '24-year-old',
      sportOrActivity: 'Snowboarding (FOOSH 6 days ago)',
      mechanism: 'Fall on outstretched hand',
      symptoms: 'Anatomic snuffbox tenderness, normal sensation, full grip',
      viewsObtained: ['PA wrist', 'Lateral wrist', 'Scaphoid view'],
      initialPrompt:
        'Films are reported normal by the radiologist. What do you do next?',
      diagnosisOptions: [
        { id: 'a', label: 'Reassure, no immobilization, return if pain persists' },
        { id: 'b', label: 'Thumb spica splint, repeat radiographs in 10–14 days or MRI' },
        { id: 'c', label: 'NSAIDs and physical therapy referral' },
        { id: 'd', label: 'Order CT scan today regardless of suspicion' },
      ],
      correctOptionId: 'b',
      explanation:
        'Snuffbox tenderness with FOOSH mechanism and normal initial films is the classic occult scaphoid scenario. Standard of care is thumb spica immobilization plus delayed imaging or MRI when continued suspicion exists.',
      teachingPearl:
        'A negative scaphoid film never rules out the fracture in this clinical context.',
      nextStep:
        'Thumb spica splint, follow up in 10–14 days with repeat films or earlier MRI based on patient context.',
      amssmVideoId: 'amssm-msk-radiology-intro',
      imagePanels: [
        { view: 'AP', imageKey: 'wrist:scaphoid-waist-fracture' },
      ],
    },
  ],
  quiz: [
    {
      id: 'foundations-q1',
      domain: 'systematic',
      moduleId: 'xray-foundations',
      prompt:
        'Which step of the Systematic X-Ray Read is most likely to catch a posterior shoulder dislocation?',
      options: [
        { id: 'a', text: 'Bone (cortical disruption)' },
        { id: 'b', text: 'Alignment (joint congruity)' },
        { id: 'c', text: 'Soft tissues (effusion)' },
        { id: 'd', text: 'Cartilage (joint space)' },
      ],
      correctOptionId: 'b',
      explanation:
        'Posterior dislocations are typically alignment problems. The humeral head can look "normal" on AP but the alignment with the glenoid is lost — best seen on the axillary or adequate scapular Y view.',
      whyOthersWrong: {
        a: 'Cortex may be intact in pure dislocations.',
        c: 'Effusion is non-specific and frequently absent on x-ray.',
        d: 'Joint space changes are chronic, not acute dislocation findings.',
      },
    },
    {
      id: 'foundations-q2',
      domain: 'occult',
      moduleId: 'xray-foundations',
      prompt:
        'A college runner has 3 weeks of progressive groin pain and normal AP pelvis radiographs. Which is the best next step?',
      options: [
        { id: 'a', text: 'Reassure and continue training' },
        { id: 'b', text: 'Order CT pelvis with contrast' },
        { id: 'c', text: 'MRI hip to evaluate for femoral neck stress fracture' },
        { id: 'd', text: 'Repeat radiographs in 6 weeks' },
      ],
      correctOptionId: 'c',
      explanation:
        'Femoral neck stress fractures can be radiographically occult and may complete catastrophically. MRI is the test of choice when suspicion is high.',
    },
    {
      id: 'foundations-q3',
      domain: 'views',
      moduleId: 'xray-foundations',
      prompt:
        'Which view is most likely to detect a subtle Lisfranc injury that is invisible on a non-weightbearing AP foot?',
      options: [
        { id: 'a', text: 'Lateral foot, NWB' },
        { id: 'b', text: 'Oblique foot, NWB' },
        { id: 'c', text: 'Weightbearing AP foot, comparison views helpful' },
        { id: 'd', text: 'Calcaneal axial view' },
      ],
      correctOptionId: 'c',
      explanation:
        'Weightbearing views unmask diastasis between the first and second metatarsals that can be invisible on NWB films.',
    },
  ],
  keyTakeaways: [
    'Always confirm side, views, and adequacy before interpreting pathology.',
    'Alignment abnormalities are often the fastest way to detect dislocation, instability, or subtle injury.',
    'Trace the cortex carefully on every view.',
    'Soft tissue swelling and effusion can be the clue when the fracture is occult.',
    'A normal x-ray does not exclude stress fracture, early osteochondral injury, scaphoid fracture, Lisfranc injury, or femoral neck stress fracture.',
    'Escalate imaging when clinical suspicion remains high.',
  ],
  whenToEscalate: [
    'Persistent pain after a "normal" x-ray with high pre-test probability.',
    'Suspected femoral neck stress fracture, Lisfranc injury, scaphoid fracture, or osteochondral injury.',
    'Mechanical symptoms, locking, or recurrent instability.',
  ],
};

// ---------- Module 2: Shoulder --------------------------------------------

const shoulder: ModuleContent = {
  id: 'shoulder',
  title: 'Shoulder',
  shortTitle: 'Shoulder',
  region: 'Upper Extremity',
  description:
    'Glenohumeral, AC joint, clavicle, and proximal humerus radiograph interpretation for sports medicine.',
  estimatedMinutes: 40,
  status: 'full',
  emphasis: ['Posterior dislocation', 'AC separation grading', 'Bony Bankart and Hill-Sachs'],
  overview: [
    'Build a reliable shoulder x-ray read that catches posterior dislocation and instability findings.',
    'Grade AC separations using coracoclavicular distance and clavicle elevation.',
    'Know which findings demand MRI for cuff, labrum, or occult fracture.',
  ],
  views: [
    {
      name: 'AP internal rotation',
      why: 'Profiles the lesser tuberosity and reveals greater tuberosity calcific tendinopathy.',
      whenToOrder: 'Routine shoulder series.',
    },
    {
      name: 'AP external rotation (Grashey when possible)',
      why: 'True AP of the glenohumeral joint shows joint space and Hill-Sachs lesions.',
      whenToOrder: 'Routine shoulder series, especially after instability.',
    },
    {
      name: 'Scapular Y',
      why: 'Shows alignment of humeral head relative to glenoid — anterior/posterior dislocation.',
      whenToOrder: 'Always for trauma or suspected dislocation.',
    },
    {
      name: 'Axillary view',
      why: 'Critical for instability and posterior dislocation.',
      whenToOrder: 'Mandatory for dislocation/instability evaluation; obtain a Velpeau if pain limits abduction.',
    },
    {
      name: 'AC joint views',
      why: 'Dedicated soft beam for the AC joint with weighted/unweighted comparison when grading separation.',
      whenToOrder: 'Direct AC pain or visible asymmetry.',
    },
  ],
  systematicNotes: [
    'On the AP, confirm a smooth glenohumeral joint space — if you cannot see it, you do not have a Grashey.',
    'On the scapular Y, the humeral head should sit at the center of the Y (over the glenoid).',
    'On the axillary, the humeral head should be cradled by the glenoid and surrounded by the coracoid and acromion.',
  ],
  systematicChecklist: systematicRead,
  anatomy: [
    {
      label: 'Glenohumeral joint',
      description: 'Concentric joint space on Grashey view.',
      pearl: 'Light bulb sign on AP suggests posterior dislocation.',
    },
    {
      label: 'Coracoclavicular distance',
      description: 'Normally 11–13 mm.',
      pearl: 'Increased CC distance > 25–50% over the contralateral side suggests Type III+ AC separation.',
    },
    {
      label: 'Acromiohumeral interval',
      description: 'Normal ≥ 7 mm.',
      pearl: '< 7 mm suggests chronic rotator cuff insufficiency.',
    },
  ],
  pathology: [
    {
      finding: 'Posterior shoulder dislocation',
      normal: 'Concentric glenohumeral joint on AP, humeral head over glenoid on scapular Y',
      pathologic: 'Light bulb sign on AP, humeral head posterior to glenoid on Y/axillary',
      keyClue: 'Mechanism: seizure, electrocution, posteriorly directed trauma',
      pitfall: 'AP alone is unreliable — get a true axillary or Velpeau',
      nextStep: 'Closed reduction; CT if questionable',
    },
    {
      finding: 'AC separation',
      normal: 'CC distance similar to contralateral, AC joint aligned',
      pathologic: 'Increased CC distance and superior clavicle displacement',
      keyClue: 'Compare CC distance to the opposite side',
      pitfall: 'Type III separations can be missed on supine films',
      nextStep: 'Grade with Rockwood; surgical consult for IV–VI',
    },
    {
      finding: 'Hill-Sachs / bony Bankart',
      normal: 'Smooth articular surfaces',
      pathologic: 'Posterolateral humeral head impaction (Hill-Sachs) or glenoid rim fragment (bony Bankart)',
      keyClue: 'Recurrent anterior instability',
      pitfall: 'Small bony Bankart fragments are easy to miss without an axillary view',
      nextStep: 'MRI or CT to characterize bone loss before surgical decision-making',
    },
    {
      finding: 'Calcific tendinopathy',
      normal: 'No mineralization at cuff insertion',
      pathologic: 'Amorphous mineralization adjacent to greater tuberosity',
      keyClue: 'Pain disproportionate to exam, often around supraspinatus insertion',
      pitfall: 'May be incidental — correlate clinically',
      nextStep: 'NSAIDs, PT; consider US-guided lavage if persistent',
    },
  ],
  doNotMiss: [
    {
      title: 'Posterior shoulder dislocation',
      why: 'Frequently missed without an axillary view.',
      imagingNext: 'Axillary or Velpeau view; CT if still unclear.',
    },
    {
      title: 'Distal clavicle osteolysis',
      why: 'Activity-modifiable in weightlifters before surgical thresholds are reached.',
      imagingNext: 'Targeted AC views; MRI if persistent.',
    },
    {
      title: 'Glenoid rim fracture (bony Bankart)',
      why: 'Bone loss > 20% changes surgical plan.',
      imagingNext: 'CT for glenoid bone loss quantification.',
    },
  ],
  pitfalls: [
    {
      title: 'Reading the AP alone',
      body: 'A scapular Y plus axillary is the bare minimum for a credible shoulder dislocation read.',
    },
    {
      title: 'Calling the lesser tuberosity a fragment',
      body: 'Lesser tuberosity is profiled in internal rotation — easy to mistake for a fragment if you do not recognize the view.',
    },
  ],
  pearls: [
    {
      title: 'Axillary view is non-negotiable',
      body: 'If patient cannot tolerate axillary, get a Velpeau or trauma axial substitute. Never accept an inadequate post-reduction film.',
    },
    {
      title: 'High-riding humerus = chronic cuff problem',
      body: 'Acromiohumeral distance < 7 mm signals chronic rotator cuff insufficiency, even if the cuff has not been imaged with MRI yet.',
    },
  ],
  cases: [
    {
      id: 'shoulder-case-1',
      moduleId: 'shoulder',
      title: 'Wrestler with arm "stuck in internal rotation"',
      patientAge: '21-year-old',
      sportOrActivity: 'Wrestling',
      mechanism: 'Forced internal rotation and adduction',
      symptoms: 'Cannot externally rotate, severe pain, no neurovascular deficit',
      viewsObtained: ['AP shoulder', 'Scapular Y', 'Axillary'],
      initialPrompt:
        'AP shoulder appears to show a "light bulb" sign with the humeral head fixed in internal rotation. What is the most likely diagnosis?',
      diagnosisOptions: [
        { id: 'a', label: 'Anterior shoulder dislocation' },
        { id: 'b', label: 'Posterior shoulder dislocation' },
        { id: 'c', label: 'Acromioclavicular separation Type III' },
        { id: 'd', label: 'Greater tuberosity fracture' },
      ],
      correctOptionId: 'b',
      explanation:
        'The light bulb sign on AP plus an arm locked in internal rotation is classic for posterior shoulder dislocation. Confirm with scapular Y or axillary view.',
      teachingPearl:
        'Posterior dislocations are notoriously missed because the AP can look near-normal — always image the axillary axis.',
      nextStep:
        'Closed reduction in the appropriate setting; post-reduction axillary view; outpatient MRI for reverse Hill-Sachs and labral injury.',
      amssmVideoId: 'amssm-shoulder-radiology',
      imagePanels: [
        { view: 'Special', imageKey: 'shoulder:posterior-dislocation' },
        { view: 'Special', imageKey: 'shoulder:posterior-dislocation-y-view' },
      ],
    },
  ],
  quiz: [
    {
      id: 'shoulder-q1',
      domain: 'shoulder',
      moduleId: 'shoulder',
      prompt:
        'A college quarterback has recurrent anterior shoulder dislocations. AP and Grashey views look unremarkable. What x-ray finding most influences surgical planning?',
      options: [
        { id: 'a', text: 'AC joint widening' },
        { id: 'b', text: 'Glenoid rim bony Bankart lesion on axillary view' },
        { id: 'c', text: 'Humeral head osteophyte' },
        { id: 'd', text: 'Os acromiale' },
      ],
      correctOptionId: 'b',
      explanation:
        'A bony Bankart, especially with > 15–20% glenoid bone loss, alters the surgical decision (e.g., Latarjet vs. soft tissue Bankart repair). MRI/CT often follow.',
    },
    {
      id: 'shoulder-q2',
      domain: 'shoulder',
      moduleId: 'shoulder',
      prompt:
        'Which view is most essential for diagnosing posterior shoulder dislocation?',
      options: [
        { id: 'a', text: 'AP internal rotation' },
        { id: 'b', text: 'AP external rotation' },
        { id: 'c', text: 'Scapular Y or axillary' },
        { id: 'd', text: 'AC joint view' },
      ],
      correctOptionId: 'c',
      explanation:
        'AP can be deceptively normal. A true axillary or adequate scapular Y is required to assess glenohumeral alignment.',
    },
  ],
  keyTakeaways: [
    'Axillary view is critical for shoulder instability and posterior dislocation.',
    'AC joint widening and CC distance help grade AC separation.',
    'Posterior shoulder dislocation can be missed without axillary or adequate scapular Y view.',
    'Calcific tendinopathy appears as mineralization near cuff insertion.',
    'High-riding humeral head suggests chronic rotator cuff insufficiency.',
  ],
  whenToEscalate: [
    'MRI for suspected labrum, rotator cuff, or occult fracture.',
    'CT for glenoid bone loss quantification.',
    'Urgent ortho referral for irreducible dislocations or neurovascular compromise.',
  ],
};

// ---------- Module 3: Elbow (placeholder) ----------------------------------

const elbow: ModuleContent = {
  ...placeholderModule(
    'elbow',
    'Elbow',
    'Elbow',
    'Upper Extremity',
    'Elbow radiograph interpretation including fat pad signs, radial head fractures, and pediatric elbow.',
    ['Fat pad signs', 'Radial head fracture', 'Pediatric medial epicondyle avulsion'],
    30,
  ),
  overview: [
    'Master the anterior humeral line and radiocapitellar line on every elbow x-ray.',
    'Use posterior fat pad sign as a surrogate for occult fracture in adults.',
    'Recognize pediatric apophyseal avulsions and Little League elbow.',
  ],
  views: [
    {
      name: 'AP elbow',
      why: 'Evaluate medial/lateral structures and physes.',
      whenToOrder: 'Standard elbow series.',
    },
    {
      name: 'Lateral elbow',
      why: 'Best for fat pad signs and anterior humeral line.',
      whenToOrder: 'Standard elbow series.',
    },
    {
      name: 'Oblique views',
      why: 'Profile radial head and coronoid.',
      whenToOrder: 'Suspected radial head or coronoid fracture.',
    },
  ],
  doNotMiss: [
    {
      title: 'Posterior fat pad sign',
      why: 'Never normal — implies occult intra-articular fracture (radial head in adult, supracondylar in child).',
      imagingNext: 'Splint, follow-up films; CT if high suspicion.',
    },
    {
      title: 'Pediatric medial epicondyle avulsion',
      why: 'Entrapped fragment can be intra-articular and missed on AP alone.',
      imagingNext: 'Compare to contralateral elbow; MRI when indicated.',
    },
  ],
  pearls: [
    {
      title: 'Anterior humeral line',
      body: 'Should bisect the middle third of the capitellum on lateral. Posterior position suggests supracondylar fracture in pediatric patients.',
    },
    {
      title: 'Radiocapitellar line',
      body: 'A line through the radial neck should bisect the capitellum on every view.',
    },
  ],
};

// ---------- Module 4: Wrist and Hand (placeholder) ------------------------

const wristHand: ModuleContent = {
  ...placeholderModule(
    'wrist-hand',
    'Wrist and Hand',
    'Wrist & Hand',
    'Upper Extremity',
    'Distal radius, scaphoid, carpal alignment, and hand-specific injury patterns.',
    ['Scaphoid fracture', 'Scapholunate widening', 'Mallet/jersey/gamekeeper'],
    35,
  ),
  overview: [
    'Be obsessive about scaphoid fractures and scapholunate widening.',
    'Use lateral wrist to assess carpal alignment and perilunate dislocation.',
    'Recognize tendon-avulsion patterns: mallet, jersey, gamekeeper thumb.',
  ],
  doNotMiss: [
    {
      title: 'Occult scaphoid fracture',
      why: 'High risk of nonunion and AVN.',
      imagingNext: 'Thumb spica + repeat in 10–14 days or MRI.',
    },
    {
      title: 'Perilunate dislocation',
      why: 'Lateral view shows disrupted Gilula arcs.',
      imagingNext: 'Urgent reduction and hand surgery referral.',
    },
  ],
  pearls: [
    {
      title: 'Scapholunate widening',
      body: 'A gap > 3 mm ("Terry Thomas sign") suggests SL ligament injury.',
    },
    {
      title: 'Hamate hook fracture',
      body: 'Often missed on standard views; carpal tunnel view or CT confirms.',
    },
  ],
};

// ---------- Module 5: Pelvis and Hip (placeholder) ------------------------

const pelvisHip: ModuleContent = {
  ...placeholderModule(
    'pelvis-hip',
    'Pelvis and Hip',
    'Pelvis & Hip',
    'Lower Extremity',
    'AP pelvis, frog-leg lateral, Dunn views, and femoroacetabular impingement basics.',
    ['Femoral neck stress', 'FAI morphology', 'SCFE red flags'],
    35,
  ),
  overview: [
    'Use AP pelvis for global alignment, joint space, and apophyseal injuries.',
    'Recognize cam and pincer morphology suggestive of FAI.',
    'Catch SCFE: subtle Klein line abnormality on the AP.',
  ],
  doNotMiss: [
    {
      title: 'SCFE',
      why: 'Subtle Klein line slip can be the only sign.',
      imagingNext: 'Frog-leg lateral; emergent ortho referral.',
    },
    {
      title: 'Femoral neck stress fracture (tension side)',
      why: 'Risk of catastrophic completion.',
      imagingNext: 'NWB and urgent MRI.',
    },
  ],
  pearls: [
    {
      title: "Klein's line",
      body: 'A line along the superior femoral neck on AP should intersect the lateral femoral epiphysis. If it does not, suspect SCFE.',
    },
  ],
};

// ---------- Module 6: Knee -------------------------------------------------

const knee: ModuleContent = {
  id: 'knee',
  title: 'Knee',
  shortTitle: 'Knee',
  region: 'Lower Extremity',
  description:
    'Knee radiograph interpretation for fractures, alignment, OA, patellofemoral pathology, and pediatric apophyseal injuries.',
  estimatedMinutes: 40,
  status: 'full',
  emphasis: ['Effusion as a clue', 'Segond fracture', 'Patella alta and bipartite patella'],
  overview: [
    'Effusion after acute trauma is a high-yield clue for internal derangement or occult fracture.',
    'Recognize avulsion patterns (Segond, tibial spine) that imply ligament injury.',
    'Use weightbearing views for OA and sunrise/Merchant for patellofemoral evaluation.',
  ],
  views: [
    { name: 'AP knee', why: 'Alignment, joint space, fractures.', whenToOrder: 'Standard.' },
    { name: 'Lateral knee', why: 'Effusion, patellar alignment, posterior tibial slope.', whenToOrder: 'Standard.' },
    {
      name: 'Sunrise / Merchant',
      why: 'Patellofemoral alignment, patellar tilt, and trochlear morphology.',
      whenToOrder: 'Anterior knee pain, patellar instability.',
    },
    {
      name: 'Tunnel / notch',
      why: 'Tibial spines, intercondylar notch, OCD lesions.',
      whenToOrder: 'Mechanical symptoms, suspected OCD.',
    },
    {
      name: 'Weightbearing PA flexion (Rosenberg)',
      why: 'Reveals posterior compartment OA invisible on standard AP.',
      whenToOrder: 'OA evaluation in adults > 40.',
    },
  ],
  systematicNotes: [
    'Always look at the suprapatellar recess on the lateral for effusion.',
    'Trace tibial spines for avulsion fractures.',
    'Compare medial and lateral compartment heights.',
  ],
  systematicChecklist: systematicRead,
  anatomy: [
    {
      label: 'Suprapatellar recess',
      description: 'Lucent fat-density structure superior to patella on lateral.',
      pearl: 'Distention of this recess is a knee effusion until proven otherwise.',
    },
    {
      label: 'Tibial spines',
      description: 'Two bony peaks at the central tibial plateau.',
      pearl: 'Avulsion of tibial spine in pediatrics = ACL avulsion equivalent.',
    },
    {
      label: 'Blumensaat line',
      description: 'Roof of the intercondylar notch on lateral.',
      pearl: 'Patella inferior pole below = patella baja; well above = patella alta.',
    },
  ],
  pathology: [
    {
      finding: 'Segond fracture',
      normal: 'Smooth lateral tibial cortex',
      pathologic: 'Small avulsion fragment along lateral tibial plateau',
      keyClue: 'Pivot-shift mechanism, often with effusion',
      pitfall: 'Easy to dismiss as minor avulsion',
      nextStep: 'MRI — Segond is highly associated with ACL tear',
    },
    {
      finding: 'Bipartite patella vs fracture',
      normal: 'Single patella with smooth cortex',
      pathologic: 'Two pieces with corticated edges (bipartite) vs sharp irregular edges (fracture)',
      keyClue: 'Bipartite is typically superolateral with smooth corticated margins',
      pitfall: 'Bilateral views can clarify',
      nextStep: 'MRI if symptomatic and unclear',
    },
    {
      finding: 'Lateral patellar dislocation',
      normal: 'Patella centered in trochlea on Merchant',
      pathologic: 'Patella laterally displaced or with osteochondral fragment',
      keyClue: 'Effusion, medial-sided pain, history of "knee popped out"',
      pitfall: 'Often spontaneously reduces before films',
      nextStep: 'MRI to evaluate MPFL and chondral injury',
    },
    {
      finding: 'Tibial plateau fracture',
      normal: 'Smooth tibial plateau, level joint surface',
      pathologic: 'Depression, split, or step-off in the plateau',
      keyClue: 'Fall from height, lateral force injury',
      pitfall: 'Subtle depression on AP — get oblique or CT',
      nextStep: 'CT for surgical planning, MRI for ligament evaluation',
    },
  ],
  doNotMiss: [
    {
      title: 'Segond fracture',
      why: 'Highly associated with ACL injury.',
      imagingNext: 'MRI knee.',
    },
    {
      title: 'Tibial plateau fracture',
      why: 'Even subtle depression alters management.',
      imagingNext: 'CT knee for surgical planning.',
    },
    {
      title: 'Patellar sleeve avulsion (pediatric)',
      why: 'Cartilage sleeve avulsion can have minimal bony fragment.',
      imagingNext: 'MRI; orthopedic referral.',
    },
  ],
  pitfalls: [
    {
      title: 'Calling bipartite patella a fracture',
      body: 'Bipartite patella has smooth corticated edges and is typically superolateral.',
    },
    {
      title: 'Missing patella alta on standing lateral',
      body: 'Patella height matters in instability — use Insall-Salvati or Blackburne-Peel.',
    },
    {
      title: 'Skipping weightbearing for OA',
      body: 'Non-weightbearing films underestimate joint space narrowing.',
    },
  ],
  pearls: [
    {
      title: 'Effusion is a tiebreaker',
      body: 'Acute trauma + large effusion + "normal" x-ray = MRI to evaluate ACL, meniscus, or osteochondral lesion.',
    },
    {
      title: 'Segond means ACL until proven otherwise',
      body: 'A 3–5 mm avulsion off the lateral tibia in a pivot injury is rarely innocent.',
    },
  ],
  cases: [
    {
      id: 'knee-case-1',
      moduleId: 'knee',
      title: 'Basketball player with pivot-shift injury',
      patientAge: '22-year-old',
      sportOrActivity: 'Basketball',
      mechanism: 'Landed awkwardly, knee gave way',
      symptoms: 'Lateral knee pain, large effusion, unable to continue play',
      viewsObtained: ['AP knee', 'Lateral knee', 'Sunrise'],
      initialPrompt:
        'AP knee shows a small avulsion fragment adjacent to the lateral tibial plateau. What injury pattern should this raise concern for?',
      diagnosisOptions: [
        { id: 'a', label: 'Isolated lateral collateral ligament strain' },
        { id: 'b', label: 'Segond fracture associated with ACL injury' },
        { id: 'c', label: 'Tibial tubercle apophysitis' },
        { id: 'd', label: 'Lateral meniscus posterior root tear in isolation' },
      ],
      correctOptionId: 'b',
      explanation:
        'A Segond fracture is a lateral capsular avulsion injury that should raise concern for ACL rupture and associated internal derangement. MRI is typically indicated.',
      teachingPearl:
        'A small avulsion on the lateral tibial plateau is rarely the whole story — image the soft tissue.',
      nextStep:
        'Hinged knee brace, crutches, MRI knee, and sports medicine / orthopedic referral.',
      amssmVideoId: 'amssm-knee-radiology',
      imagePanels: [{ view: 'AP', imageKey: 'knee:segond-fracture' }],
    },
  ],
  quiz: [
    {
      id: 'knee-q1',
      domain: 'knee',
      moduleId: 'knee',
      prompt:
        'A 16-year-old soccer player has anterior knee pain after a fall. Lateral knee shows the inferior pole of the patella well above Blumensaat line. What does this represent?',
      options: [
        { id: 'a', text: 'Patella alta' },
        { id: 'b', text: 'Patella baja' },
        { id: 'c', text: 'Bipartite patella' },
        { id: 'd', text: 'Sinding-Larsen-Johansson syndrome' },
      ],
      correctOptionId: 'a',
      explanation:
        'Patella positioned well above Blumensaat line on lateral represents patella alta, which is associated with patellar instability.',
    },
    {
      id: 'knee-q2',
      domain: 'knee',
      moduleId: 'knee',
      prompt:
        'Which finding most reliably distinguishes a bipartite patella from a patellar fracture?',
      options: [
        { id: 'a', text: 'Location in the inferior pole' },
        { id: 'b', text: 'Smooth, corticated margins' },
        { id: 'c', text: 'Presence of an effusion' },
        { id: 'd', text: 'Bilateral involvement on imaging' },
      ],
      correctOptionId: 'b',
      explanation:
        'Bipartite patella has smooth, corticated margins and is most often superolateral. Bilateral involvement is supportive but not required.',
    },
  ],
  keyTakeaways: [
    'Effusion after acute trauma should raise suspicion for internal derangement or occult fracture.',
    'Segond fracture should trigger concern for ACL injury.',
    'Sunrise/Merchant views help assess patellar alignment and patellofemoral arthritis.',
    'Bipartite patella has smooth corticated margins and is commonly superolateral.',
    'Weightbearing views are important for osteoarthritis severity.',
  ],
  whenToEscalate: [
    'MRI for suspected ACL/meniscus/osteochondral injury or Segond fracture.',
    'CT for tibial plateau fracture surgical planning.',
    'Urgent referral for locked knee or neurovascular compromise.',
  ],
};

// ---------- Module 7: Ankle and Foot ---------------------------------------

const ankleFoot: ModuleContent = {
  id: 'ankle-foot',
  title: 'Ankle and Foot',
  shortTitle: 'Ankle & Foot',
  region: 'Lower Extremity',
  description:
    'Ankle mortise, malleolar fractures, syndesmotic injury, Lisfranc, and high-yield foot fractures.',
  estimatedMinutes: 40,
  status: 'full',
  emphasis: ['Mortise integrity', 'Lisfranc injury', '5th metatarsal fracture types'],
  overview: [
    'The mortise view is the answer to most acute ankle questions.',
    'Use weightbearing views for Lisfranc and syndesmosis when patient can tolerate.',
    'Differentiate avulsion from Jones from diaphyseal stress fractures of the 5th MT.',
  ],
  views: [
    { name: 'AP ankle', why: 'Tibial plafond and joint space.', whenToOrder: 'Standard.' },
    { name: 'Lateral ankle', why: 'Posterior malleolus and talar dome.', whenToOrder: 'Standard.' },
    {
      name: 'Mortise (15° internal rotation)',
      why: 'Talar dome, syndesmosis, and joint congruity.',
      whenToOrder: 'All acute ankle injuries.',
    },
    {
      name: 'Weightbearing foot AP/lateral/oblique',
      why: 'Reveal Lisfranc widening and midfoot alignment.',
      whenToOrder: 'Midfoot pain with ability to bear weight.',
    },
  ],
  systematicNotes: [
    'Confirm Ottawa criteria are met before ordering.',
    'On the mortise, the medial clear space should equal the superior clear space (both ~ 2–4 mm).',
    'Check the entire fibula on a high ankle injury — Maisonneuve fractures can be at the proximal fibula.',
  ],
  systematicChecklist: systematicRead,
  anatomy: [
    {
      label: 'Medial clear space',
      description: 'Distance between medial talus and medial malleolus on mortise.',
      pearl: '> 4 mm or > superior clear space suggests deltoid/syndesmosis injury.',
    },
    {
      label: 'Tib-fib clear space',
      description: 'Distance between tibia and fibula 1 cm above plafond.',
      pearl: '> 5–6 mm suggests syndesmotic widening.',
    },
    {
      label: 'Base of 5th metatarsal',
      description: 'Tuberosity (avulsion zone), metaphyseal-diaphyseal junction (Jones zone), proximal diaphysis (stress zone).',
      pearl: 'Location of fracture determines management.',
    },
  ],
  pathology: [
    {
      finding: 'Lisfranc injury',
      normal: '2nd metatarsal base aligned with medial border of middle cuneiform',
      pathologic: 'Diastasis between 1st and 2nd MT bases, fleck sign in interspace',
      keyClue: 'Plantar bruising, midfoot pain disproportionate to exam',
      pitfall: 'Often invisible non-weightbearing',
      nextStep: 'Weightbearing films or CT; orthopedic referral if confirmed',
    },
    {
      finding: 'Syndesmotic widening',
      normal: 'Tib-fib clear space < 5 mm at 1 cm above plafond',
      pathologic: 'Widened tib-fib clear space, increased medial clear space',
      keyClue: 'External rotation mechanism, high ankle pain',
      pitfall: 'Normal-appearing static film does not exclude dynamic instability',
      nextStep: 'Stress views, weightbearing views, or MRI if persistent',
    },
    {
      finding: '5th metatarsal Jones fracture',
      normal: 'Smooth cortex at 4-5 intermetatarsal joint level',
      pathologic: 'Transverse fracture at metaphyseal-diaphyseal junction',
      keyClue: 'Lateral foot pain after inversion',
      pitfall: 'Easily confused with avulsion fracture (managed differently)',
      nextStep: 'NWB, ortho referral; surgical fixation often considered in athletes',
    },
    {
      finding: 'Talar dome osteochondral lesion',
      normal: 'Smooth talar dome contour',
      pathologic: 'Subchondral lucency or fragment on medial or lateral dome',
      keyClue: 'Persistent ankle pain after sprain, mechanical symptoms',
      pitfall: 'Often radiographically occult early',
      nextStep: 'MRI for grade, location, and stability',
    },
  ],
  doNotMiss: [
    {
      title: 'Lisfranc injury',
      why: 'Missed Lisfranc → chronic midfoot collapse.',
      imagingNext: 'Weightbearing or CT.',
    },
    {
      title: 'Maisonneuve fracture',
      why: 'Proximal fibula fracture with deltoid disruption.',
      imagingNext: 'Full-length tib-fib films; ortho consult.',
    },
    {
      title: 'Talar dome lesion',
      why: 'Persistent symptoms after "sprain" warrants MRI.',
      imagingNext: 'MRI ankle.',
    },
  ],
  pitfalls: [
    {
      title: 'Ottawa rules misuse',
      body: 'Ottawa criteria reduce unnecessary x-rays — but a positive criterion is not a diagnosis.',
    },
    {
      title: 'Reading non-weightbearing for Lisfranc',
      body: 'NWB films can look benign; weightbearing is required when the question is Lisfranc.',
    },
    {
      title: 'Os trigonum mistaken for fracture',
      body: 'Posterior accessory ossicle behind talus — corticated margin and predictable location.',
    },
  ],
  pearls: [
    {
      title: 'Mortise is the answer view',
      body: 'If you only have one ankle view, make it the mortise.',
    },
    {
      title: 'Plantar ecchymosis = Lisfranc until proven otherwise',
      body: 'Even with normal NWB films, plantar bruising warrants weightbearing films.',
    },
  ],
  cases: [
    {
      id: 'ankle-case-1',
      moduleId: 'ankle-foot',
      title: 'Distance runner with persistent lateral foot pain',
      patientAge: '28-year-old',
      sportOrActivity: 'Recreational running',
      mechanism: 'Insidious, increased mileage 4 weeks ago',
      symptoms: 'Lateral foot pain at the base of the 5th MT, worse with running',
      viewsObtained: ['AP foot', 'Oblique foot', 'Lateral foot'],
      initialPrompt:
        'Films show a transverse fracture at the metaphyseal-diaphyseal junction of the 5th metatarsal. Which is the most appropriate next step?',
      diagnosisOptions: [
        { id: 'a', label: 'Weightbearing as tolerated, hard-soled shoe' },
        { id: 'b', label: 'Non-weightbearing in CAM boot, urgent ortho referral for Jones fracture' },
        { id: 'c', label: 'Reassure, avulsion fracture — treat symptomatically' },
        { id: 'd', label: 'Discharge with Tylenol; return if pain persists' },
      ],
      correctOptionId: 'b',
      explanation:
        'Jones fractures (metaphyseal-diaphyseal junction) have a higher rate of nonunion than avulsion fractures. Standard initial management is NWB with ortho referral; surgical fixation is often considered in athletes.',
      teachingPearl:
        'The location of the 5th MT fracture (zone) determines management — not just the presence of a fracture.',
      nextStep:
        'NWB CAM boot; ortho referral; discuss surgical fixation given activity level.',
      amssmVideoId: 'amssm-high-yield-foot-ankle',
      imagePanels: [{ view: 'Oblique', imageKey: 'foot:jones-fracture' }],
    },
  ],
  quiz: [
    {
      id: 'ankle-q1',
      domain: 'ankle-foot',
      moduleId: 'ankle-foot',
      prompt:
        'On an ankle mortise view, the medial clear space measures 6 mm and the superior clear space measures 3 mm. What does this suggest?',
      options: [
        { id: 'a', text: 'Normal mortise' },
        { id: 'b', text: 'Deltoid ligament/syndesmotic injury' },
        { id: 'c', text: 'Lateral malleolar avulsion' },
        { id: 'd', text: 'Talar dome lesion' },
      ],
      correctOptionId: 'b',
      explanation:
        'Asymmetric medial > superior clear space implies deltoid disruption ± syndesmotic injury, even without an obvious fracture.',
    },
    {
      id: 'ankle-q2',
      domain: 'ankle-foot',
      moduleId: 'ankle-foot',
      prompt:
        'A weekend warrior has midfoot pain after a fall, plantar ecchymosis, and a normal-appearing non-weightbearing AP foot. Best next step?',
      options: [
        { id: 'a', text: 'Discharge with NSAIDs' },
        { id: 'b', text: 'Weightbearing AP foot or CT' },
        { id: 'c', text: 'MRI lumbar spine' },
        { id: 'd', text: 'Bone scan in 6 weeks' },
      ],
      correctOptionId: 'b',
      explanation:
        'Plantar ecchymosis is the Lisfranc bruise. NWB films can look normal — weightbearing or CT is needed.',
    },
  ],
  keyTakeaways: [
    'Mortise view is essential for ankle joint congruity.',
    'Syndesmotic widening may be subtle and should be correlated clinically.',
    'Base of fifth metatarsal fracture location changes management.',
    'Lisfranc injuries can be missed on non-weightbearing films.',
    'Talar dome lesions may require MRI if symptoms persist.',
  ],
  whenToEscalate: [
    'Weightbearing or CT for suspected Lisfranc.',
    'MRI for persistent ankle pain after "sprain" — talar dome, OCD, occult fracture.',
    'Orthopedic referral for unstable fractures or athletic Jones fractures.',
  ],
};

// ---------- Module 8: Spine (placeholder) ---------------------------------

const spine: ModuleContent = {
  ...placeholderModule(
    'spine',
    'Spine for Sports Medicine',
    'Spine',
    'Axial',
    'Cervical and lumbar spine basics for sports medicine: alignment, spondylolysis, compression fractures.',
    ['Spondylolysis', 'Cervical instability', 'Compression fracture'],
    25,
  ),
  overview: [
    'Sports medicine spine x-rays focus on alignment and red flags.',
    'Plain films often miss disc and cord pathology — escalate to MRI when neurologic.',
  ],
  doNotMiss: [
    {
      title: 'Cervical instability red flags',
      why: 'Cervical injury with neurologic findings is a surgical emergency.',
      imagingNext: 'CT and MRI; do not rely on plain films alone.',
    },
    {
      title: 'Spondylolysis',
      why: 'Adolescent extension-based athletes — pars defect can be subtle.',
      imagingNext: 'Oblique or SPECT/MRI when high suspicion.',
    },
  ],
  pearls: [
    {
      title: 'Plain films are screening, not definitive',
      body: 'Any neurologic deficit or red flag warrants MRI regardless of film findings.',
    },
  ],
};

// ---------- Module 9: Pediatric & Adolescent (placeholder) ----------------

const pediatricAdolescent: ModuleContent = {
  ...placeholderModule(
    'pediatric-adolescent',
    'Pediatric and Adolescent Sports X-Ray Pearls',
    'Pediatric Pearls',
    'Pediatric',
    'Apophyses, growth plates, Salter-Harris, traction apophysitis, and adolescent red flags.',
    ['Salter-Harris', 'Apophysitis vs avulsion', 'SCFE'],
    30,
  ),
  overview: [
    'Pediatric x-rays demand awareness of normal physes, apophyses, and accessory ossicles.',
    'Apophysitis is overuse — apophyseal avulsion is acute. Treat them differently.',
  ],
  doNotMiss: [
    {
      title: 'SCFE',
      why: 'Klein line abnormality on AP can be subtle.',
      imagingNext: 'Frog-leg lateral; emergent ortho referral.',
    },
    {
      title: 'Pediatric medial epicondyle avulsion',
      why: 'Entrapped fragment can be intra-articular.',
      imagingNext: 'Compare to contralateral elbow.',
    },
  ],
  pearls: [
    {
      title: 'Apophysis vs fracture',
      body: 'Apophyses appear at predictable ages and have smooth corticated margins.',
    },
    {
      title: 'Compare both sides when in doubt',
      body: 'Bilateral imaging in pediatrics is high-yield for normal variant questions.',
    },
  ],
};

// ---------- Module 10: Sports Medicine Do Not Miss Cases -------------------

const doNotMiss: ModuleContent = {
  id: 'do-not-miss',
  title: 'Sports Medicine Do Not Miss Cases',
  shortTitle: 'Do Not Miss',
  region: 'High-Yield Cases',
  description:
    'A curated set of injuries that change management and outcomes when caught — and harm when missed.',
  estimatedMinutes: 30,
  status: 'full',
  emphasis: ['Catastrophic miss prevention', 'Pattern recognition', 'When to escalate'],
  overview: [
    'These injuries are commonly tested, commonly missed, and commonly change management.',
    'Each case combines clinical history with a teaching point and an imaging next step.',
  ],
  views: [],
  systematicNotes: [
    'Apply the systematic read to each case before answering.',
  ],
  systematicChecklist: systematicRead,
  anatomy: [],
  pathology: [],
  doNotMiss: [
    { title: 'Posterior shoulder dislocation', why: 'Easy to miss without axillary view.', imagingNext: 'Axillary or Velpeau; CT if unclear.' },
    { title: 'Scaphoid fracture', why: 'Risk of nonunion and AVN.', imagingNext: 'Thumb spica + repeat films or MRI.' },
    { title: 'Perilunate dislocation', why: 'Disrupted Gilula arcs on lateral.', imagingNext: 'Urgent reduction and hand surgery.' },
    { title: 'Segond fracture', why: 'Implies ACL injury.', imagingNext: 'MRI knee.' },
    { title: 'Tibial plateau fracture', why: 'Subtle depression matters.', imagingNext: 'CT for surgical planning.' },
    { title: 'Lisfranc injury', why: 'NWB films can look normal.', imagingNext: 'Weightbearing or CT.' },
    { title: 'Talar dome lesion', why: 'Persistent post-sprain pain.', imagingNext: 'MRI ankle.' },
    { title: 'Jones fracture (5th MT)', why: 'High nonunion rate.', imagingNext: 'NWB CAM boot, ortho referral.' },
    { title: 'Femoral neck stress fracture', why: 'Tension-side completion risk.', imagingNext: 'MRI; protect weightbearing.' },
    { title: 'SCFE', why: 'Klein line abnormality on AP.', imagingNext: 'Frog-leg lateral; emergent ortho referral.' },
  ],
  pitfalls: [
    { title: 'Anchoring on a normal x-ray', body: 'Suspicion drives the workup, not radiologist sign-off alone.' },
    { title: 'Skipping image adequacy checks', body: 'A bad film cannot rule anything out.' },
  ],
  pearls: [
    { title: 'Treat the patient, document the safety net', body: 'Always document the contingency plan and what would change management.' },
  ],
  cases: [
    {
      id: 'dnm-case-shoulder-posterior',
      moduleId: 'do-not-miss',
      title: 'Seizure patient with arm "stuck in"',
      patientAge: '35-year-old',
      sportOrActivity: 'N/A — recent generalized tonic-clonic seizure',
      mechanism: 'Forced internal rotation during seizure',
      symptoms: 'Cannot externally rotate, severe pain, AP shoulder shows light bulb sign',
      viewsObtained: ['AP shoulder', 'Scapular Y'],
      initialPrompt: 'Most likely diagnosis?',
      diagnosisOptions: [
        { id: 'a', label: 'Anterior dislocation' },
        { id: 'b', label: 'Posterior shoulder dislocation' },
        { id: 'c', label: 'Greater tuberosity fracture' },
        { id: 'd', label: 'Acromioclavicular separation' },
      ],
      correctOptionId: 'b',
      explanation: 'Mechanism (seizure) + light bulb sign + locked internal rotation = posterior dislocation.',
      teachingPearl: 'A seizure history with shoulder pain demands an axillary view.',
      nextStep: 'Axillary view to confirm; closed reduction; post-reduction imaging.',
      amssmVideoId: 'amssm-shoulder-radiology',
      imagePanels: [
        { view: 'Special', imageKey: 'shoulder:posterior-dislocation' },
        { view: 'Special', imageKey: 'shoulder:posterior-dislocation-y-view' },
      ],
    },
    {
      id: 'dnm-case-scaphoid',
      moduleId: 'do-not-miss',
      title: 'College FOOSH with snuffbox tenderness',
      patientAge: '20-year-old',
      sportOrActivity: 'Skateboarding',
      mechanism: 'FOOSH',
      symptoms: 'Anatomic snuffbox tenderness; films "normal"',
      viewsObtained: ['PA wrist', 'Lateral wrist', 'Scaphoid view'],
      initialPrompt: 'Best next step?',
      diagnosisOptions: [
        { id: 'a', label: 'Reassure and discharge' },
        { id: 'b', label: 'Thumb spica + repeat films in 10–14 days or MRI' },
        { id: 'c', label: 'Outpatient PT' },
        { id: 'd', label: 'Order CT chest' },
      ],
      correctOptionId: 'b',
      explanation: 'Classic occult scaphoid presentation despite normal films.',
      teachingPearl: 'Suspicion + tenderness + normal films = treat as fracture until proven otherwise.',
      nextStep: 'Thumb spica splint; repeat imaging.',
      imagePanels: [
        { view: 'AP', imageKey: 'wrist:scaphoid-waist-fracture' },
      ],
    },
    {
      id: 'dnm-case-segond',
      moduleId: 'do-not-miss',
      title: 'Pivot-shift basketball injury',
      patientAge: '19-year-old',
      sportOrActivity: 'Basketball',
      mechanism: 'Pivot-shift / valgus rotation',
      symptoms: 'Large effusion, lateral knee pain',
      viewsObtained: ['AP knee', 'Lateral knee'],
      initialPrompt: 'Small avulsion off lateral tibial plateau — most likely associated injury?',
      diagnosisOptions: [
        { id: 'a', label: 'Isolated LCL strain' },
        { id: 'b', label: 'ACL tear (Segond fracture)' },
        { id: 'c', label: 'Patellar tendon rupture' },
        { id: 'd', label: 'Tibial tubercle apophysitis' },
      ],
      correctOptionId: 'b',
      explanation: 'Segond fractures are highly associated with ACL tears.',
      teachingPearl: 'Segond on x-ray → MRI knee.',
      nextStep: 'Hinged brace, MRI, sports referral.',
      amssmVideoId: 'amssm-knee-radiology',
      imagePanels: [{ view: 'AP', imageKey: 'knee:segond-fracture' }],
    },
    {
      id: 'dnm-case-lisfranc',
      moduleId: 'do-not-miss',
      title: 'Equestrian with midfoot pain after fall',
      patientAge: '32-year-old',
      sportOrActivity: 'Equestrian',
      mechanism: 'Foot caught in stirrup, axial load',
      symptoms: 'Plantar ecchymosis, midfoot pain disproportionate to NWB films',
      viewsObtained: ['NWB AP foot', 'NWB lateral foot', 'NWB oblique foot'],
      initialPrompt: 'NWB films appear normal. Best next step?',
      diagnosisOptions: [
        { id: 'a', label: 'Discharge — strain' },
        { id: 'b', label: 'Weightbearing foot films or CT' },
        { id: 'c', label: 'MRI lumbar spine' },
        { id: 'd', label: 'Repeat NWB films in 6 weeks' },
      ],
      correctOptionId: 'b',
      explanation: 'Plantar ecchymosis + disproportionate pain demands weightbearing or CT.',
      teachingPearl: 'NWB films can hide Lisfranc — never accept them as the final word here.',
      nextStep: 'Weightbearing films or CT; ortho referral if confirmed.',
      amssmVideoId: 'amssm-high-yield-foot-ankle',
      imagePanels: [{ view: 'Annotated', imageKey: 'foot:lisfranc-injury' }],
    },
    {
      id: 'dnm-case-talar-dome',
      moduleId: 'do-not-miss',
      title: 'Persistent ankle pain 8 weeks after "sprain"',
      patientAge: '17-year-old',
      sportOrActivity: 'Volleyball',
      mechanism: 'Inversion injury 8 weeks ago',
      symptoms: 'Mechanical clicking, persistent pain',
      viewsObtained: ['AP ankle', 'Lateral ankle', 'Mortise'],
      initialPrompt: 'X-rays "normal." Best next step?',
      diagnosisOptions: [
        { id: 'a', label: 'Reassure and continue PT' },
        { id: 'b', label: 'MRI ankle' },
        { id: 'c', label: 'CT abdomen/pelvis' },
        { id: 'd', label: 'Bone scan whole body' },
      ],
      correctOptionId: 'b',
      explanation: 'Persistent symptoms after a "sprain" warrant MRI for talar dome OCD or occult injury.',
      teachingPearl: 'Persistent post-sprain pain is the classic OCD/talar dome scenario.',
      nextStep: 'MRI ankle; ortho referral if OCD confirmed.',
      amssmVideoId: 'amssm-ankle-radiology',
      imagePanels: [{ view: 'AP', imageKey: 'ankle:talar-dome-ocd' }],
    },
    {
      id: 'dnm-case-jones',
      moduleId: 'do-not-miss',
      title: 'Soccer player with lateral foot pain',
      patientAge: '21-year-old',
      sportOrActivity: 'Soccer',
      mechanism: 'Inversion mechanism in cleats',
      symptoms: 'Lateral foot pain, point tenderness over base of 5th MT',
      viewsObtained: ['AP foot', 'Oblique foot', 'Lateral foot'],
      initialPrompt: 'Transverse fracture at MT-diaphyseal junction. Best next step?',
      diagnosisOptions: [
        { id: 'a', label: 'WBAT in hard-sole shoe' },
        { id: 'b', label: 'NWB CAM boot, ortho referral' },
        { id: 'c', label: 'Reassure — avulsion' },
        { id: 'd', label: 'Discharge with NSAIDs' },
      ],
      correctOptionId: 'b',
      explanation: 'Jones fracture has high nonunion risk; surgical consideration in athletes.',
      teachingPearl: 'Zone of fracture changes management.',
      nextStep: 'NWB CAM boot, ortho referral.',
      amssmVideoId: 'amssm-high-yield-foot-ankle',
      imagePanels: [{ view: 'Oblique', imageKey: 'foot:jones-fracture' }],
    },
    {
      id: 'dnm-case-femoral-neck',
      moduleId: 'do-not-miss',
      title: 'College runner with progressive groin pain',
      patientAge: '20-year-old',
      sportOrActivity: 'Cross-country running',
      mechanism: 'Insidious, increased mileage',
      symptoms: '3 weeks of progressive groin pain, worse with weightbearing',
      viewsObtained: ['AP pelvis', 'Frog-leg lateral'],
      initialPrompt: 'Films "normal." Best next step?',
      diagnosisOptions: [
        { id: 'a', label: 'Reassure and continue training' },
        { id: 'b', label: 'Urgent MRI, protect weightbearing' },
        { id: 'c', label: 'PT for hip flexor strain' },
        { id: 'd', label: 'Oral steroids' },
      ],
      correctOptionId: 'b',
      explanation: 'Femoral neck stress fracture risk warrants MRI and weightbearing protection.',
      teachingPearl: 'Tension-side femoral neck stress fractures can complete catastrophically.',
      nextStep: 'Urgent MRI; ortho consult based on results.',
      amssmVideoId: 'amssm-bone-stress-injuries',
      imagePanels: [
        { view: 'AP', imageKey: 'hip:femoral-neck-stress-fracture' },
      ],
    },
    {
      id: 'dnm-case-scfe',
      moduleId: 'do-not-miss',
      title: 'Adolescent with knee pain',
      patientAge: '12-year-old',
      sportOrActivity: 'Recreational',
      mechanism: 'Insidious onset, recent growth spurt',
      symptoms: 'Vague knee/hip pain, antalgic gait, externally rotated leg',
      viewsObtained: ['AP pelvis', 'Frog-leg lateral'],
      initialPrompt: 'Klein line on AP does not intersect lateral epiphysis. Most concerning diagnosis?',
      diagnosisOptions: [
        { id: 'a', label: 'Transient synovitis' },
        { id: 'b', label: 'SCFE' },
        { id: 'c', label: 'Legg-Calvé-Perthes' },
        { id: 'd', label: 'Apophysitis' },
      ],
      correctOptionId: 'b',
      explanation: 'Klein line abnormality on AP is the classic SCFE finding.',
      teachingPearl: 'Adolescent knee pain is hip pain until proven otherwise.',
      nextStep: 'NWB; emergent orthopedic referral.',
      amssmVideoId: 'amssm-growth-plate-injuries',
      imagePanels: [
        { view: 'AP', imageKey: 'hip:scfe' },
        { view: 'Special', imageKey: 'hip:scfe-frog-leg' },
      ],
    },
    {
      id: 'dnm-case-tibial-plateau',
      moduleId: 'do-not-miss',
      title: 'Cyclist after high-energy fall',
      patientAge: '40-year-old',
      sportOrActivity: 'Road cycling',
      mechanism: 'Fall from height onto flexed knee',
      symptoms: 'Effusion, severe knee pain, unable to bear weight',
      viewsObtained: ['AP knee', 'Lateral knee'],
      initialPrompt: 'Subtle depression of lateral tibial plateau. Best next step?',
      diagnosisOptions: [
        { id: 'a', label: 'WBAT and follow up in 2 weeks' },
        { id: 'b', label: 'CT knee for surgical planning' },
        { id: 'c', label: 'MRI lumbar spine' },
        { id: 'd', label: 'Discharge with NSAIDs' },
      ],
      correctOptionId: 'b',
      explanation: 'Tibial plateau fractures often need CT for fragment evaluation and surgical planning.',
      teachingPearl: 'Even subtle plateau depression changes the operative plan.',
      nextStep: 'CT knee; orthopedic consultation.',
      amssmVideoId: 'amssm-high-yield-hip-knee',
      imagePanels: [{ view: 'Annotated', imageKey: 'knee:tibial-plateau-fracture' }],
    },
    {
      id: 'dnm-case-perilunate',
      moduleId: 'do-not-miss',
      title: 'Snowboarder with deformed wrist',
      patientAge: '27-year-old',
      sportOrActivity: 'Snowboarding',
      mechanism: 'High-energy FOOSH',
      symptoms: 'Severe wrist pain, paresthesias in median distribution',
      viewsObtained: ['PA wrist', 'Lateral wrist'],
      initialPrompt: 'Lateral shows disrupted Gilula arcs. Most likely diagnosis?',
      diagnosisOptions: [
        { id: 'a', label: 'Distal radius fracture' },
        { id: 'b', label: 'Perilunate dislocation' },
        { id: 'c', label: 'Scaphoid waist fracture' },
        { id: 'd', label: 'Triangular fibrocartilage tear' },
      ],
      correctOptionId: 'b',
      explanation: 'Disrupted Gilula arcs with lunate-capitate disrelationship is classic perilunate dislocation.',
      teachingPearl: 'Median nerve symptoms with FOOSH and a deformed lateral = perilunate.',
      nextStep: 'Urgent reduction, hand surgery referral.',
      imagePanels: [{ view: 'Lateral', imageKey: 'wrist:perilunate-dislocation' }],
    },
  ],
  quiz: [
    {
      id: 'dnm-q1',
      domain: 'do-not-miss',
      moduleId: 'do-not-miss',
      prompt:
        'Which of the following injuries is most likely to be missed on a non-weightbearing AP foot?',
      options: [
        { id: 'a', text: 'Calcaneal fracture' },
        { id: 'b', text: 'Lisfranc injury' },
        { id: 'c', text: 'Talar neck fracture' },
        { id: 'd', text: 'Os trigonum' },
      ],
      correctOptionId: 'b',
      explanation: 'Lisfranc widening can be radiographically silent without weightbearing.',
    },
  ],
  keyTakeaways: [
    'These ten patterns drive the bulk of consequential MSK x-ray misses in sports medicine.',
    'Each has a clear "next step" — knowing the pattern is half; knowing the imaging plan is the other half.',
  ],
  whenToEscalate: [
    'Any of the do-not-miss diagnoses with persistent symptoms warrant advanced imaging or specialty referral.',
  ],
};

export const moduleContents: ModuleContent[] = [
  xrayFoundations,
  shoulder,
  elbow,
  wristHand,
  pelvisHip,
  knee,
  ankleFoot,
  spine,
  pediatricAdolescent,
  doNotMiss,
];

export { moduleSummaries } from './moduleSummaries';

export function getModule(id: string): ModuleContent | undefined {
  return moduleContents.find((m) => m.id === id);
}
