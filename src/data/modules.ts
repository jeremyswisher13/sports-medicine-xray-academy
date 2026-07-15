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

const moduleScaffold = (
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
  status: 'full',
  emphasis,
  overview: [
    'Use the Systematic X-Ray Read framework as the scaffold for this region.',
    'Focus on normal anatomy, do-not-miss patterns, and escalation decisions.',
  ],
  views: [
    {
      name: 'Standard orthogonal views',
      why: 'Two-plane imaging protects against missed malalignment, subtle fracture, and projection artifact.',
      whenToOrder: 'Initial trauma or focal pain evaluation for the region.',
      teachingView: true,
    },
    {
      name: 'Targeted special view',
      why: 'Profiles the structure that answers the clinical question when standard views are incomplete.',
      whenToOrder: 'Instability, occult fracture concern, or a region-specific structure that needs better visualization.',
    },
    {
      name: 'Weightbearing or comparison view',
      why: 'Can reveal load-dependent alignment or help distinguish normal variation from injury.',
      whenToOrder: 'Chronic joint-space questions, suspected subtle instability, or selected pediatric normal-variant uncertainty.',
    },
  ],
  systematicNotes: [
    'Apply the Systematic X-Ray Read: Confirm → Alignment → Bone → Cartilage → Soft Tissues → Impression.',
  ],
  systematicChecklist: systematicRead,
  anatomy: [
    {
      label: 'Alignment anchor',
      description:
        'Confirm the expected bone and joint relationship before searching for small cortical findings.',
      pearl: 'Alignment first keeps subtle instability from being buried by a more obvious finding.',
    },
    {
      label: 'Cortical contour',
      description:
        'Trace the cortex and key landmarks in a consistent order to avoid skipping hidden corners.',
      pearl: 'A systematic contour trace is faster than re-checking after a miss.',
    },
    {
      label: 'Soft-tissue clue',
      description:
        'Use swelling, effusion, displacement of fat pads, and calcification as indirect signs of injury.',
      pearl: 'Soft tissues often tell you where to look again.',
    },
  ],
  pathology: [
    {
      finding: 'Occult fracture pattern',
      normal: 'Cortices are smooth, joint alignment is congruent, and no indirect effusion or soft-tissue clue is present.',
      pathologic: 'Pain localization, effusion, subtle cortical interruption, or persistent high suspicion keeps fracture on the table.',
      keyClue: 'The clinical story is more focal or dangerous than the radiograph appears.',
      pitfall: 'Letting a normal initial film end the workup when symptoms remain high-risk.',
      nextStep: 'Immobilize or protect activity, repeat films, or escalate to MRI/CT based on the injury pattern.',
    },
    {
      finding: 'Subtle instability',
      normal: 'Expected lines, spaces, and joint relationships stay symmetric across adequate views.',
      pathologic: 'Widening, subluxation, load-dependent malalignment, or disrupted arcs/lines implies structural injury.',
      keyClue: 'A small alignment abnormality can matter more than the absence of a fracture line.',
      pitfall: 'Reading bones only and missing the joint relationship.',
      nextStep: 'Add the missing view, weightbearing film, or advanced imaging and refer when instability changes management.',
    },
  ],
  doNotMiss: [],
  pitfalls: [],
  pearls: [],
  cases: [],
  quiz: [],
  keyTakeaways: [
    'Use a consistent read pattern before searching for pathology.',
    'Escalate when the x-ray does not answer a high-risk clinical question.',
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
      teachingView: true,
    },
    {
      name: 'Comparison views',
      why: 'Can clarify selected pediatric symmetry and accessory-ossicle questions.',
      whenToOrder: 'Use selectively when side-to-side comparison will answer a specific management-relevant question.',
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
      pearl: 'A sudden cortical step-off or buckle is suspicious for fracture and should be confirmed across views.',
    },
    {
      label: 'Physis (growth plate)',
      description: 'Lucent line between metaphysis and epiphysis in skeletally immature patients.',
      pearl: 'Asymmetric widening or contour change raises concern for physeal injury; correlate with age, positioning, mechanism, and focal tenderness.',
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
      nextStep: 'Reassess the full series and examination; select follow-up radiographs, CT, or MRI according to the joint and suspected injury',
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
      why: 'Tension-side fractures have greater risk of progression and displacement.',
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
      questionType: 'management',
      diagnosisOptions: [
        { id: 'a', label: 'Reassure, no immobilization, return if pain persists' },
        { id: 'b', label: 'Thumb spica splint, repeat radiographs in 10–14 days or MRI' },
        { id: 'c', label: 'NSAIDs and physical therapy referral' },
        { id: 'd', label: 'Order CT scan today regardless of suspicion' },
      ],
      correctOptionId: 'b',
      recommendedManagementChoiceIds: ['immobilize-protect', 'advanced-imaging'],
      explanation:
        'Snuffbox tenderness after a FOOSH with normal initial films keeps occult scaphoid fracture on the differential. An accepted pathway is wrist immobilization with repeat radiographs in 10–14 days or earlier MRI/CT when clinical suspicion and patient context warrant it.',
      teachingPearl:
        'A negative initial scaphoid series does not by itself exclude fracture when clinical suspicion remains high.',
      nextStep:
        'Thumb spica splint, follow up in 10–14 days with repeat films or earlier MRI based on patient context.',
      amssmVideoId: 'amssm-msk-radiology-intro',
      imagePanels: [
        {
          view: 'AP',
          imageKey: 'wrist:scaphoid-waist-fracture',
          revealAfterSubmit: true,
        },
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
        'Femoral neck stress fractures can be radiographically occult and may progress to displacement. MRI is the preferred next test when suspicion is high.',
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
      why: 'Profiles the lesser tuberosity and can help localize rotator-cuff calcification when interpreted with the other AP rotation view.',
      whenToOrder: 'Routine shoulder series.',
    },
    {
      name: 'AP external rotation',
      why: 'Profiles the greater tuberosity and proximal humeral cortex.',
      whenToOrder: 'Routine shoulder series when positioning is safe.',
    },
    {
      name: 'Grashey (true AP glenoid)',
      why: 'Opens the glenohumeral joint space and profiles the glenoid rim.',
      whenToOrder: 'Joint-space, instability, or glenoid-rim assessment.',
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
      teachingView: true,
    },
    {
      name: 'Bilateral Zanca / AC joint views',
      why: 'Dedicated low-penetration comparison for AC alignment and coracoclavicular distance.',
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
      description: 'Interpret with technique and side-to-side comparison; about 11–13 mm in many adults.',
      pearl: 'A roughly 25–100% side-to-side increase fits a type III pattern when the rest of the Rockwood features agree.',
    },
    {
      label: 'Acromiohumeral interval',
      description: 'Usually at least about 7 mm on an adequately positioned AP view.',
      pearl: 'Narrowing suggests chronic superior migration and rotator cuff insufficiency; it is not diagnostic by itself.',
    },
  ],
  pathology: [
    {
      finding: 'Posterior shoulder dislocation',
      normal: 'Concentric glenohumeral joint on AP, humeral head over glenoid on scapular Y',
      pathologic: 'Light bulb sign on AP, humeral head posterior to glenoid on Y/axillary',
      keyClue: 'Mechanism: seizure, electrocution, posteriorly directed trauma',
      pitfall: 'AP alone is unreliable — get a true axillary or Velpeau',
      nextStep: 'Document neurovascular status, arrange urgent reduction in an appropriate setting, and obtain post-reduction imaging; CT when bony injury needs definition',
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
      why: 'Clinically important glenoid bone loss can change stabilization planning.',
      imagingNext: 'CT for glenoid bone loss quantification.',
    },
  ],
  pitfalls: [
    {
      title: 'Reading the AP alone',
      body: 'Do not exclude dislocation from the AP alone. Obtain an adequate orthogonal view that demonstrates the humeral-head relationship to the glenoid, using an axillary/Velpeau view when feasible.',
    },
    {
      title: 'Calling the lesser tuberosity a fragment',
      body: 'Lesser tuberosity is profiled in internal rotation — easy to mistake for a fragment if you do not recognize the view.',
    },
  ],
  pearls: [
    {
      title: 'Axillary view is non-negotiable',
      body: 'If the patient cannot tolerate a standard axillary view, use a Velpeau or trauma axial substitute. Confirm reduction on an adequate orthogonal view.',
    },
    {
      title: 'High-riding humerus = chronic cuff problem',
      body: 'An acromiohumeral interval below about 7 mm suggests chronic superior migration and rotator cuff insufficiency when technique is adequate.',
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
      questionType: 'diagnosis',
      diagnosisOptions: [
        { id: 'a', label: 'Anterior shoulder dislocation' },
        { id: 'b', label: 'Posterior shoulder dislocation' },
        { id: 'c', label: 'Acromioclavicular separation Type III' },
        { id: 'd', label: 'Greater tuberosity fracture' },
      ],
      correctOptionId: 'b',
      recommendedManagementChoiceIds: ['urgent-referral'],
      explanation:
        'The light bulb sign on AP plus an arm locked in internal rotation is classic for posterior shoulder dislocation. Confirm with scapular Y or axillary view.',
      teachingPearl:
        'Posterior dislocations are notoriously missed because the AP can look near-normal — obtain an axillary/Velpeau view when this diagnosis is suspected.',
      nextStep:
        'Document neurovascular status, arrange urgent reduction in an appropriate setting, and obtain post-reduction orthogonal imaging; use CT for associated bony injury and MRI later when soft-tissue findings will change care.',
      amssmVideoId: 'amssm-shoulder-radiology',
      imagePanels: [
        { view: 'Special', imageKey: 'shoulder:posterior-dislocation' },
        { view: 'Special', imageKey: 'shoulder:posterior-dislocation-axillary' },
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
        'A bony Bankart and clinically important glenoid bone loss can alter stabilization planning. CT is commonly used to quantify bone loss; MRI helps characterize associated soft-tissue injury.',
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

// ---------- Module 3: Elbow ----------------------------------

const elbow: ModuleContent = {
  ...moduleScaffold(
    'elbow',
    'Elbow',
    'Elbow',
    'Upper Extremity',
    'Elbow radiograph interpretation including fat pad signs, radial head fractures, and pediatric elbow.',
    ['Fat pad signs', 'Radial head fracture', 'Pediatric medial epicondyle avulsion'],
    30,
  ),
  status: 'full',
  overview: [
    'Use the anterior humeral and radiocapitellar relationships as alignment checks while accounting for age and positioning.',
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
      teachingView: true,
    },
    {
      name: 'Oblique views',
      why: 'Profile radial head and coronoid.',
      whenToOrder: 'Suspected radial head or coronoid fracture.',
    },
  ],
  systematicNotes: [
    'On lateral, confirm a true lateral before trusting fat pads or the anterior humeral line.',
    'Trace the radial head/neck carefully; nondisplaced fractures often hide behind an effusion.',
    'In children, read ossification centers and alignment lines before calling a fragment abnormal.',
  ],
  anatomy: [
    {
      label: 'Radiocapitellar line',
      description: 'A line through the radial neck should intersect the capitellum on adequately positioned views.',
      pearl: 'If it clearly misses on more than one adequate view, look for radial head dislocation or a Monteggia-pattern injury; mild apparent misses can reflect rotation or age.',
    },
    {
      label: 'Anterior humeral line',
      description: 'On a true lateral pediatric elbow, it should intersect the capitellum; the middle third is typical from about age 5 onward.',
      pearl: 'In younger children it may pass through the anterior third. A clear posterior shift still raises concern for supracondylar fracture.',
    },
    {
      label: 'Fat pads',
      description: 'Anterior fat pad may be small; posterior fat pad should not be visible.',
      pearl: 'A visible posterior fat pad after trauma is abnormal and strongly suggests an occult intra-articular injury; manage as a possible fracture.',
    },
  ],
  pathology: [
    {
      finding: 'Radial head fracture',
      normal: 'Smooth radial head/neck cortex with no effusion',
      pathologic: 'Subtle cortical step-off or effusion with focal radial head tenderness',
      keyClue: 'Adult fall on outstretched hand with limited pronation/supination',
      pitfall: 'The fracture line may be occult; the posterior fat pad may be the finding.',
      nextStep: 'Immobilize briefly, early ROM when stable, CT if mechanical block or surgical planning question.',
    },
    {
      finding: 'Medial epicondyle avulsion',
      normal: 'Expected apophysis location with symmetric alignment for age',
      pathologic: 'Displaced medial epicondyle fragment, sometimes incarcerated in the joint',
      keyClue: 'Thrower, gymnast, or elbow dislocation mechanism in an adolescent',
      pitfall: 'Mistaking a displaced apophysis for a normal ossification center.',
      nextStep: 'Compare views when needed and refer when displaced, entrapped, or unstable.',
    },
    {
      finding: 'Supracondylar fracture',
      normal: 'Anterior humeral line intersects the capitellum on a true lateral and no posterior fat pad is present',
      pathologic: 'Posterior capitellar displacement, effusion, or cortical buckle',
      keyClue: 'Pediatric fall with swollen painful elbow',
      pitfall: 'Ossification centers can distract from the alignment abnormality.',
      nextStep: 'Splint and urgent ortho for displaced fractures or neurovascular concern.',
    },
  ],
  doNotMiss: [
    {
      title: 'Posterior fat pad sign',
      why: 'Abnormal after trauma and strongly raises concern for an occult intra-articular fracture; common patterns include radial head fracture in adults and supracondylar fracture in children.',
      imagingNext: 'Manage as a possible fracture with appropriate immobilization and follow-up; use CT selectively when the result will change care.',
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
      body: 'On a true lateral it should intersect the capitellum. The middle third is typical at age 5 and older, while younger children may normally intersect more anteriorly.',
    },
    {
      title: 'Radiocapitellar line',
      body: 'A line through the radial neck should intersect the capitellum on adequately positioned views. Confirm a suspected miss across views because rotation and age introduce variability.',
    },
  ],
  pitfalls: [
    {
      title: 'Calling a normal anterior fat pad a fracture',
      body: 'A small anterior fat pad can be normal. The posterior fat pad, sail sign with trauma, or focal exam makes the finding meaningful.',
    },
    {
      title: 'Ignoring the proximal forearm',
      body: 'Elbow dislocation and radial head findings should trigger a look for coronoid fracture, Monteggia pattern, and wrist/forearm symptoms.',
    },
  ],
  cases: [
    {
      id: 'elbow-occult-radial-head',
      moduleId: 'elbow',
      title: 'Adult fall with elbow effusion',
      patientAge: '42-year-old',
      sportOrActivity: 'Pickleball',
      mechanism: 'Fall on outstretched hand with immediate lateral elbow pain',
      symptoms: 'Pain with rotation, mild swelling, no gross deformity',
      viewsObtained: ['AP', 'Lateral', 'Oblique'],
      initialPrompt: 'The cortex looks nearly normal. What soft-tissue sign changes your read?',
      questionType: 'diagnosis',
      diagnosisOptions: [
        { id: 'a', label: 'Normal elbow radiographs' },
        { id: 'b', label: 'Occult radial head fracture with effusion' },
        { id: 'c', label: 'Medial epicondyle apophysitis' },
        { id: 'd', label: 'Olecranon bursitis only' },
      ],
      correctOptionId: 'b',
      recommendedManagementChoiceIds: ['immobilize-protect', 'advanced-imaging'],
      explanation:
        'A traumatic elbow effusion, especially a posterior fat pad, strongly suggests occult intra-articular injury in an adult and should be managed as a possible fracture.',
      teachingPearl:
        'In adult elbow trauma, a posterior fat pad is often the x-ray finding that matters most.',
      nextStep: 'Protect the elbow, assess motion block, arrange follow-up imaging or CT if the exam suggests displacement.',
      imagePanels: [{ view: 'Lateral', imageKey: 'elbow:fat-pad-sign' }],
    },
  ],
  quiz: [
    {
      id: 'elbow-q1',
      moduleId: 'elbow',
      domain: 'elbow',
      prompt: 'A posterior fat pad after adult elbow trauma most often implies what?',
      options: [
        { id: 'a', text: 'Normal variant' },
        { id: 'b', text: 'Occult intra-articular fracture' },
        { id: 'c', text: 'Olecranon bursitis' },
        { id: 'd', text: 'Medial epicondylitis' },
      ],
      correctOptionId: 'b',
      explanation:
        'A posterior fat pad is not normal after trauma. In adults it commonly signals an occult radial head fracture.',
    },
    {
      id: 'elbow-q2',
      moduleId: 'elbow',
      domain: 'elbow',
      prompt: 'The radiocapitellar line should intersect which structure on adequately positioned views?',
      options: [
        { id: 'a', text: 'Olecranon' },
        { id: 'b', text: 'Trochlea' },
        { id: 'c', text: 'Capitellum' },
        { id: 'd', text: 'Medial epicondyle' },
      ],
      correctOptionId: 'c',
      explanation:
        'A line through the radial neck should intersect the capitellum on adequately positioned views. A reproducible miss raises concern for radial head dislocation or a Monteggia pattern.',
    },
  ],
  keyTakeaways: [
    'Posterior fat pad after trauma is an occult fracture clue.',
    'Radiocapitellar alignment should be checked across adequate views, with age and rotation in mind.',
    'Anterior humeral line helps detect pediatric supracondylar fractures, but its normal intersection varies in younger children.',
    'Medial epicondyle avulsions can be missed or mistaken for ossification centers.',
  ],
  whenToEscalate: [
    'Urgent ortho for neurovascular findings, unstable dislocation, or displaced pediatric supracondylar fracture.',
    'CT for mechanical block, unclear radial head/coronoid fracture, or surgical planning.',
    'MRI for suspected capitellar OCD or throwing athlete symptoms with nondiagnostic films.',
  ],
};

// ---------- Module 4: Wrist and Hand ------------------------

const wristHand: ModuleContent = {
  ...moduleScaffold(
    'wrist-hand',
    'Wrist and Hand',
    'Wrist & Hand',
    'Upper Extremity',
    'Distal radius, scaphoid, carpal alignment, and hand-specific injury patterns.',
    ['Scaphoid fracture', 'Scapholunate widening', 'Mallet/jersey/gamekeeper'],
    35,
  ),
  status: 'full',
  overview: [
    'Be obsessive about scaphoid fractures and scapholunate widening.',
    'Use lateral wrist to assess carpal alignment and perilunate dislocation.',
    'Recognize tendon-avulsion patterns: mallet, jersey, gamekeeper thumb.',
  ],
  views: [
    {
      name: 'PA wrist and hand',
      why: 'Profiles distal radius, carpal rows, metacarpals, and joint spacing.',
      whenToOrder: 'Standard wrist or hand trauma series.',
    },
    {
      name: 'True lateral',
      why: 'Best view for lunate/capitate alignment, perilunate injury, and dorsal tilt.',
      whenToOrder: 'Any wrist injury, especially fall on outstretched hand or deformity.',
    },
    {
      name: 'Oblique hand/wrist',
      why: 'Separates metacarpals, phalanges, and carpal contours.',
      whenToOrder: 'Hand fractures, metacarpal injuries, and subtle cortical findings.',
    },
    {
      name: 'Scaphoid view',
      why: 'Elongates the scaphoid and improves detection of waist fractures.',
      whenToOrder: 'Snuffbox tenderness, axial thumb load pain, or radial-sided wrist pain.',
      teachingView: true,
    },
  ],
  systematicNotes: [
    'Trace Gilula arcs on PA before focusing on a single painful bone.',
    'On lateral, check whether radius, lunate, capitate, and third metacarpal align.',
    'Treat a convincing scaphoid exam seriously even if the initial x-ray is normal.',
  ],
  anatomy: [
    {
      label: 'Gilula arcs',
      description: 'Three smooth arcs outline proximal and distal carpal row alignment on PA wrist.',
      pearl: 'Broken arcs suggest carpal instability even before a fracture is obvious.',
    },
    {
      label: 'Scapholunate interval',
      description: 'Space between scaphoid and lunate should remain narrow and symmetric.',
      pearl: 'Widening around or above 3 mm is a ligament injury clue.',
    },
    {
      label: 'Lateral carpal alignment',
      description: 'Radius, lunate, capitate, and third metacarpal should stack in a smooth column.',
      pearl: 'Loss of this stack is the emergency pattern in perilunate/lunate dislocations.',
    },
  ],
  pathology: [
    {
      finding: 'Scaphoid fracture',
      normal: 'Continuous scaphoid cortex with no waist lucency',
      pathologic: 'Waist lucency, cortical break, or exam-positive occult injury',
      keyClue: 'Snuffbox tenderness after fall on outstretched hand',
      pitfall: 'Initial x-rays can be normal; do not clear a high-risk exam.',
      nextStep: 'Thumb spica and repeat imaging or early MRI/CT depending on urgency.',
    },
    {
      finding: 'Perilunate dislocation',
      normal: 'Capitate sits in the lunate cup on lateral',
      pathologic: 'Capitate displaced dorsally relative to lunate with disrupted carpal alignment',
      keyClue: 'High-energy wrist trauma, median nerve symptoms, severe pain',
      pitfall: 'PA view may look deceptively subtle compared with lateral.',
      nextStep: 'Urgent reduction and hand surgery.',
    },
    {
      finding: 'Scapholunate injury',
      normal: 'Preserved scapholunate interval and smooth Gilula arcs',
      pathologic: 'Terry Thomas widening, cortical ring sign, or DISI pattern',
      keyClue: 'Dorsal wrist pain/clicking after extension load',
      pitfall: 'Static widening may be absent early; clenched-fist or stress views may help.',
      nextStep: 'Hand referral when instability is suspected.',
    },
  ],
  doNotMiss: [
    {
      title: 'Occult scaphoid fracture',
      why: 'High risk of nonunion and AVN.',
      imagingNext: 'Thumb spica + repeat in 10–14 days or MRI.',
    },
    {
      title: 'Perilunate dislocation',
      why: 'Lateral shows the capitate dislocated dorsally off the lunate (loss of the radius–lunate–capitate column); the PA shows disrupted Gilula arcs.',
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
      body: 'Often missed on standard views; a carpal tunnel view can improve detection, and CT can define a suspected fracture.',
    },
  ],
  pitfalls: [
    {
      title: 'Clearing the scaphoid too early',
      body: 'A negative first x-ray does not rule out scaphoid fracture. Immobilize or obtain advanced imaging when the exam is convincing.',
    },
    {
      title: 'Missing rotation in hand fractures',
      body: 'X-rays show angulation and shortening, but clinical cascade and finger rotation determine functional urgency.',
    },
  ],
  cases: [
    {
      id: 'wrist-scaphoid-occult',
      moduleId: 'wrist-hand',
      title: 'FOOSH with snuffbox tenderness',
      patientAge: '19-year-old',
      sportOrActivity: 'Snowboarding',
      mechanism: 'Fall on an extended wrist',
      symptoms: 'Radial-sided wrist pain and anatomic snuffbox tenderness',
      viewsObtained: ['PA', 'Lateral', 'Scaphoid'],
      initialPrompt: 'The first films can be subtle. What diagnosis cannot be dismissed?',
      questionType: 'diagnosis',
      diagnosisOptions: [
        { id: 'a', label: 'Cleared wrist sprain' },
        { id: 'b', label: 'Occult scaphoid fracture' },
        { id: 'c', label: 'Jersey finger' },
        { id: 'd', label: 'Olecranon fracture' },
      ],
      correctOptionId: 'b',
      recommendedManagementChoiceIds: ['immobilize-protect', 'advanced-imaging'],
      explanation:
        'Snuffbox tenderness after FOOSH is high risk even when early x-rays are negative or subtle.',
      teachingPearl:
        'Scaphoid management follows the exam as much as the first radiograph because proximal pole blood supply is tenuous.',
      nextStep: 'Thumb spica immobilization with repeat films in 10-14 days or early MRI/CT.',
      imagePanels: [{ view: 'AP', imageKey: 'wrist:scaphoid-waist-fracture' }],
    },
  ],
  quiz: [
    {
      id: 'wrist-hand-q1',
      moduleId: 'wrist-hand',
      domain: 'wrist-hand',
      prompt: 'What is the safest initial management for snuffbox tenderness with negative initial wrist x-rays?',
      options: [
        { id: 'a', text: 'Return to play if grip strength is normal' },
        { id: 'b', text: 'Thumb spica and repeat imaging or early MRI/CT' },
        { id: 'c', text: 'Treat as carpal tunnel syndrome' },
        { id: 'd', text: 'No follow-up imaging is needed' },
      ],
      correctOptionId: 'b',
      explanation:
        'Occult scaphoid fracture can be missed on initial radiographs. Immobilize and reassess with repeat or advanced imaging.',
    },
    {
      id: 'wrist-hand-q2',
      moduleId: 'wrist-hand',
      domain: 'wrist-hand',
      prompt: 'On a lateral wrist x-ray, perilunate dislocation is suggested by what?',
      options: [
        { id: 'a', text: 'Capitate no longer aligned with the lunate' },
        { id: 'b', text: 'Posterior elbow fat pad' },
        { id: 'c', text: 'Patella alta' },
        { id: 'd', text: 'Medial clear space widening' },
      ],
      correctOptionId: 'a',
      explanation:
        'The lateral wrist is critical: capitate-lunate malalignment is the key emergency clue.',
    },
  ],
  keyTakeaways: [
    'Snuffbox tenderness keeps scaphoid fracture on the table even with normal first films.',
    'Gilula arcs and lateral carpal alignment are the quickest carpal-instability checks.',
    'Perilunate dislocation is a lateral-view emergency.',
    'Hand fracture management depends on clinical rotation, not x-ray alone.',
  ],
  whenToEscalate: [
    'Hand surgery for perilunate/lunate dislocation, neurovascular symptoms, or rotational deformity.',
    'MRI or CT for high-risk occult scaphoid fracture.',
    'CT for hook of hamate concern when standard views are negative.',
  ],
};

// ---------- Module 5: Pelvis and Hip ------------------------

const pelvisHip: ModuleContent = {
  ...moduleScaffold(
    'pelvis-hip',
    'Pelvis and Hip',
    'Pelvis & Hip',
    'Lower Extremity',
    'AP pelvis, frog-leg lateral, Dunn views, and femoroacetabular impingement basics.',
    ['Femoral neck stress', 'FAI morphology', 'SCFE red flags'],
    35,
  ),
  status: 'full',
  overview: [
    'Use AP pelvis for global alignment, joint space, and apophyseal injuries.',
    'Recognize cam and pincer morphology that may support FAI syndrome when symptoms and examination agree.',
    'Catch SCFE: subtle Klein line abnormality on the AP.',
  ],
  views: [
    {
      name: 'AP pelvis',
      why: 'Compares hips, pelvic ring, SI joints, apophyses, and gross alignment.',
      whenToOrder: 'Hip/groin pain, trauma, adolescent limp, and suspected apophyseal avulsion.',
      teachingView: true,
    },
    {
      name: 'Frog-leg lateral',
      why: 'Profiles the femoral head-neck relationship and can reveal a stable SCFE or FAI morphology.',
      whenToOrder: 'Non-traumatic hip pain, stable ambulatory SCFE evaluation, and FAI assessment when fracture or unstable SCFE is not suspected.',
    },
    {
      name: 'Cross-table lateral',
      why: 'Lateral hip view that avoids moving a potentially fractured hip.',
      whenToOrder: 'Trauma or femoral neck fracture concern.',
    },
    {
      name: 'Dunn view',
      why: 'Profiles cam morphology at the femoral head-neck junction.',
      whenToOrder: 'FAI evaluation when local protocol supports it.',
    },
  ],
  systematicNotes: [
    'Start with pelvic ring symmetry and Shenton line before zooming into the painful hip.',
    'In adolescents, knee pain can be referred hip pathology; look for SCFE.',
    'Femoral neck stress injuries can be radiographically occult and should not be worked up casually.',
  ],
  anatomy: [
    {
      label: 'Shenton line',
      description: 'Smooth arc from inferior femoral neck to superior obturator foramen.',
      pearl: 'Disruption suggests femoral neck/hip alignment abnormality or developmental asymmetry.',
    },
    {
      label: 'Klein line',
      description: 'Line along superior femoral neck should intersect the lateral femoral epiphysis.',
      pearl: 'Failure to intersect is a classic SCFE clue, but a normal line does not exclude an early slip; compare both hips and the full clinical picture.',
    },
    {
      label: 'Femoral head-neck offset',
      description: 'Normal concavity at the head-neck junction allows motion without impingement.',
      pearl: 'Loss of offset supports cam morphology when symptoms match.',
    },
  ],
  pathology: [
    {
      finding: 'SCFE',
      normal: 'Klein line intersects the lateral epiphysis with symmetric physes',
      pathologic: 'Epiphysis slips posterior/inferior, often subtle on AP and clearer on lateral',
      keyClue: 'Adolescent limp, hip/groin/thigh/knee pain, limited internal rotation',
      pitfall: 'Knee pain presentation can delay hip imaging.',
      nextStep: 'Non-weightbearing and urgent orthopedic referral.',
    },
    {
      finding: 'Femoral neck stress fracture',
      normal: 'No sclerosis, lucency, or cortical tension-side abnormality',
      pathologic: 'Subtle sclerosis/lucency or normal x-ray with convincing runner history',
      keyClue: 'Progressive groin pain with impact activity',
      pitfall: 'Tension-side injuries have greater risk of progression and displacement.',
      nextStep: 'Protect weightbearing and obtain urgent MRI when suspicion remains.',
    },
    {
      finding: 'Apophyseal avulsion',
      normal: 'Smooth apophysis in expected location for age',
      pathologic: 'Displaced fragment at ASIS, AIIS, ischial tuberosity, iliac crest, or lesser trochanter',
      keyClue: 'Adolescent sprint/kick/jump with sudden focal pain',
      pitfall: 'Calling it a muscle strain without palpating the apophysis.',
      nextStep: 'Activity restriction and ortho/sports follow-up depending on displacement and site.',
    },
  ],
  doNotMiss: [
    {
      title: 'SCFE',
      why: 'Subtle Klein line slip can be the only sign.',
      imagingNext: 'Immediate non-weightbearing and urgent orthopedic referral; use bilateral AP/frog-leg views only when stable, and AP plus cross-table lateral without frog-leg positioning when unstable.',
    },
    {
      title: 'Femoral neck stress fracture (tension side)',
      why: 'Greater risk of progression and displacement.',
      imagingNext: 'NWB and urgent MRI.',
    },
  ],
  pearls: [
    {
      title: "Klein's line",
      body: 'A line along the superior femoral neck on AP should intersect the lateral femoral epiphysis. If it does not, suspect SCFE.',
    },
  ],
  pitfalls: [
    {
      title: 'Accepting knee pain as a knee problem',
      body: 'Adolescent knee pain with limp or limited hip motion should trigger hip imaging for SCFE.',
    },
    {
      title: 'Missing femoral neck stress fracture on a normal x-ray',
      body: 'Plain films may lag behind symptoms. Progressive runner groin pain needs MRI when clinical suspicion is high.',
    },
  ],
  cases: [
    {
      id: 'hip-runner-groin-pain',
      moduleId: 'pelvis-hip',
      title: 'Runner with progressive groin pain',
      patientAge: '28-year-old',
      sportOrActivity: 'Distance running',
      mechanism: 'Increasing mileage with insidious anterior groin pain',
      symptoms: 'Pain with hopping and internal rotation; no single traumatic event',
      viewsObtained: ['AP pelvis', 'Lateral hip'],
      initialPrompt: 'The x-ray may be subtle. What injury changes weightbearing immediately?',
      questionType: 'diagnosis',
      diagnosisOptions: [
        { id: 'a', label: 'Hip flexor strain only' },
        { id: 'b', label: 'Femoral neck stress fracture risk' },
        { id: 'c', label: 'Lumbar radiculopathy' },
        { id: 'd', label: 'Greater trochanteric bursitis' },
      ],
      correctOptionId: 'b',
      recommendedManagementChoiceIds: ['immobilize-protect', 'advanced-imaging'],
      explanation:
        'Progressive activity-related groin pain in a runner keeps femoral neck stress fracture high on the differential even if radiographs are subtle or normal.',
      teachingPearl:
        'Femoral neck stress injuries are high stakes because tension-side or progressing fractures can complete.',
      nextStep: 'Protect weightbearing and obtain MRI urgently if suspicion remains.',
      imagePanels: [{ view: 'AP', imageKey: 'hip:femoral-neck-stress-fracture' }],
    },
  ],
  quiz: [
    {
      id: 'pelvis-hip-q1',
      moduleId: 'pelvis-hip',
      domain: 'pelvis-hip',
      prompt: 'Adolescent knee pain with limp and limited hip internal rotation should trigger concern for what?',
      options: [
        { id: 'a', text: 'SCFE' },
        { id: 'b', text: 'Bipartite patella' },
        { id: 'c', text: 'Olecranon fracture' },
        { id: 'd', text: 'Talar dome lesion' },
      ],
      correctOptionId: 'a',
      explanation:
        'SCFE often presents as thigh or knee pain. Image the hip when gait and hip motion are abnormal.',
    },
    {
      id: 'pelvis-hip-q2',
      moduleId: 'pelvis-hip',
      domain: 'pelvis-hip',
      prompt: 'Progressive runner groin pain with normal x-rays should usually be escalated to what test?',
      options: [
        { id: 'a', text: 'No imaging follow-up' },
        { id: 'b', text: 'MRI of the hip/pelvis' },
        { id: 'c', text: 'Elbow ultrasound' },
        { id: 'd', text: 'Standing ankle mortise' },
      ],
      correctOptionId: 'b',
      explanation:
        'MRI is the key test for suspected femoral neck stress fracture when radiographs are negative or equivocal.',
    },
  ],
  keyTakeaways: [
    'AP pelvis provides comparison and global alignment before zooming into one hip.',
    'SCFE can present as knee pain; image the hip when the gait or hip exam is abnormal.',
    'Femoral neck stress fracture suspicion overrides a normal x-ray.',
    'Adolescent apophyseal avulsions are bony injuries, not just strains.',
  ],
  whenToEscalate: [
    'Urgent ortho and non-weightbearing for SCFE.',
    'Urgent MRI/protected weightbearing for suspected femoral neck stress fracture.',
    'CT for fracture characterization after traumatic hip/pelvic injury when x-rays are insufficient.',
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
      teachingView: true,
    },
    {
      name: 'Tunnel / notch',
      why: 'Tibial spines, intercondylar notch, OCD lesions.',
      whenToOrder: 'Mechanical symptoms, suspected OCD.',
    },
    {
      name: 'Weightbearing PA flexion (Rosenberg)',
      why: 'Loads the posterior weightbearing zone of the femoral condyles, revealing medial/lateral tibiofemoral joint-space narrowing missed on a standard extended AP.',
      whenToOrder: 'Suspected tibiofemoral osteoarthritis or joint-space narrowing when weightbearing is appropriate.',
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
      description: 'Potential joint recess superior to the patella, outlined by adjacent fat pads on a lateral view.',
      pearl: 'Fluid distends the recess and displaces the adjacent fat planes; interpret it as an effusion in the clinical context.',
    },
    {
      label: 'Tibial spines',
      description: 'Two bony peaks at the central tibial plateau.',
      pearl: 'Avulsion of tibial spine in pediatrics = ACL avulsion equivalent.',
    },
    {
      label: 'Blumensaat line',
      description: 'Roof of the intercondylar notch on lateral.',
      pearl: 'Its relationship to the patella varies with knee flexion and projection; use a validated patellar-height ratio rather than this line alone to diagnose alta or baja.',
    },
  ],
  pathology: [
    {
      finding: 'Segond fracture',
      normal: 'Smooth lateral tibial cortex',
      pathologic: 'Small avulsion fragment along lateral tibial plateau',
      keyClue: 'Pivot-shift mechanism, often with effusion',
      pitfall: 'Easy to dismiss as minor avulsion',
      nextStep: 'Evaluate for ACL and associated internal derangement; MRI is usually appropriate when it will guide management',
    },
    {
      finding: 'Tibial plateau fracture',
      normal: 'Smooth tibial plateau, level joint surface',
      pathologic: 'Depression, split, or step-off in the plateau',
      keyClue: 'Fall from height, lateral force injury',
      pitfall: 'Subtle depression on AP — get oblique or CT',
      nextStep: 'CT for surgical planning, MRI for ligament evaluation',
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
      nextStep: 'MRI when osteochondral or soft-tissue characterization will change care',
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
      why: 'Subtle depression can change fracture classification and management.',
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
      body: 'A large acute traumatic effusion despite no visible fracture should prompt reassessment for occult fracture or internal derangement and consideration of MRI based on the examination.',
    },
    {
      title: 'Segond is an internal-derangement clue',
      body: 'A small lateral tibial-rim avulsion in a pivot injury is strongly associated with ACL injury and warrants evaluation for associated internal derangement.',
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
      questionType: 'associated-injury',
      diagnosisOptions: [
        { id: 'a', label: 'Isolated lateral collateral ligament strain' },
        { id: 'b', label: 'Segond fracture associated with ACL injury' },
        { id: 'c', label: 'Tibial tubercle apophysitis' },
        { id: 'd', label: 'Lateral meniscus posterior root tear in isolation' },
      ],
      correctOptionId: 'b',
      recommendedManagementChoiceIds: ['immobilize-protect', 'advanced-imaging'],
      explanation:
        'A Segond fracture is a lateral tibial-rim avulsion injury that should raise concern for ACL rupture and associated internal derangement. MRI is usually appropriate when the result will guide management.',
      teachingPearl:
        'A small avulsion on the lateral tibial plateau is rarely the whole story — image the soft tissue.',
      nextStep:
        'Protect weightbearing and brace as the examination requires; arrange MRI and sports medicine or orthopedic follow-up for the suspected internal derangement.',
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
        'A 16-year-old soccer player has recurrent patellar instability. On a true lateral knee, the Insall-Salvati ratio is 1.35. What does this represent?',
      options: [
        { id: 'a', text: 'Patella alta' },
        { id: 'b', text: 'Patella baja' },
        { id: 'c', text: 'Bipartite patella' },
        { id: 'd', text: 'Sinding-Larsen-Johansson syndrome' },
      ],
      correctOptionId: 'a',
      explanation:
        'An elevated Insall-Salvati ratio on a true lateral supports patella alta, a risk factor for patellar instability. Blumensaat-line position alone is too dependent on flexion and projection for this diagnosis.',
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
    'The mortise view is essential for ankle congruity, but it must be read with AP and lateral orthogonal views.',
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
      teachingView: true,
    },
    {
      name: 'Weightbearing foot AP/lateral/oblique',
      why: 'Reveal Lisfranc widening and midfoot alignment.',
      whenToOrder: 'Midfoot pain with ability to bear weight.',
    },
  ],
  systematicNotes: [
    'Use the Ottawa ankle and foot rules in eligible acute injuries; a positive criterion supports radiography but is not a diagnosis, and clinical judgment still applies.',
    'On a well-positioned mortise, the medial clear space should generally not exceed the superior clear space; rotation, stress, and measurement technique matter.',
    'Check the entire fibula on a high ankle injury — Maisonneuve fractures can be at the proximal fibula.',
  ],
  systematicChecklist: systematicRead,
  anatomy: [
    {
      label: 'Medial clear space',
      description: 'Distance between medial talus and medial malleolus on mortise.',
      pearl: 'Asymmetric widening relative to the superior clear space raises concern for deltoid injury or instability; confirm positioning and the complete series before applying a numeric threshold.',
    },
    {
      label: 'Tib-fib clear space',
      description: 'Distance between tibia and fibula 1 cm above plafond.',
      pearl: 'About 6 mm or greater suggests syndesmotic widening, but rotation and technique affect the measurement.',
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
      normal: 'Tib-fib clear space is generally < 6 mm at 1 cm above the plafond on an adequate view',
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
      nextStep: 'MRI to characterize cartilage and subchondral injury and inform management',
    },
  ],
  doNotMiss: [
    {
      title: 'Lisfranc injury',
      why: 'Missed Lisfranc → chronic midfoot collapse.',
      imagingNext: 'Weightbearing bilateral comparison when safe and tolerated; CT or MRI if the patient cannot bear weight or films are equivocal.',
    },
    {
      title: 'Maisonneuve fracture',
      why: 'Proximal fibula fracture can accompany syndesmotic and medial-sided ankle injury.',
      imagingNext: 'Examine the entire fibula; obtain full-length tib-fib films when indicated and arrange orthopedic follow-up for instability.',
    },
    {
      title: 'Talar dome lesion',
      why: 'Persistent deep pain or mechanical symptoms after a "sprain" can reflect osteochondral injury.',
      imagingNext: 'MRI ankle when characterization will guide management.',
    },
  ],
  pitfalls: [
    {
      title: 'Ottawa rules misuse',
      body: 'Ottawa criteria reduce unnecessary x-rays — but a positive criterion is not a diagnosis.',
    },
    {
      title: 'Reading non-weightbearing for Lisfranc',
      body: 'NWB films can look benign. Obtain weightbearing comparison views when safe and tolerated; use CT or MRI when suspicion remains high or weightbearing is not possible.',
    },
    {
      title: 'Os trigonum mistaken for fracture',
      body: 'Posterior accessory ossicle behind talus — corticated margin and predictable location.',
    },
  ],
  pearls: [
    {
      title: 'Mortise is essential, not solitary',
      body: 'Use the mortise to assess congruity and clear spaces, then confirm fractures and alignment on the AP and lateral views.',
    },
    {
      title: 'Plantar ecchymosis raises Lisfranc concern',
      body: 'With midfoot pain, plantar bruising warrants weightbearing comparison views when tolerated or advanced imaging when it is not.',
    },
  ],
  cases: [
    {
      id: 'ankle-case-1',
      moduleId: 'ankle-foot',
      title: 'Athlete with acute lateral foot pain',
      patientAge: '28-year-old',
      sportOrActivity: 'Recreational running',
      mechanism: 'Acute forefoot adduction/inversion while stepping off a curb',
      symptoms: 'Immediate lateral foot pain with point tenderness at the proximal 5th metatarsal',
      viewsObtained: ['AP foot', 'Oblique foot', 'Lateral foot'],
      initialPrompt:
        'Films show a transverse fracture at the metaphyseal-diaphyseal junction of the 5th metatarsal. Which is the most appropriate next step?',
      questionType: 'management',
      diagnosisOptions: [
        { id: 'a', label: 'Weightbearing as tolerated, hard-soled shoe' },
        { id: 'b', label: 'Non-weightbearing immobilization and early ortho/sports referral for Jones fracture' },
        { id: 'c', label: 'Reassure, avulsion fracture — treat symptomatically' },
        { id: 'd', label: 'Discharge with Tylenol; return if pain persists' },
      ],
      correctOptionId: 'b',
      recommendedManagementChoiceIds: ['immobilize-protect'],
      explanation:
        'Jones fractures at the metaphyseal-diaphyseal junction have a higher nonunion risk than zone 1 avulsions. Initial management uses non-weightbearing immobilization and early follow-up; surgical fixation is often considered for high-demand athletes.',
      teachingPearl:
        'The location of the 5th MT fracture (zone) determines management — not just the presence of a fracture.',
      nextStep:
        'Non-weightbearing immobilization, early orthopedic/sports referral, and discussion of operative fixation based on displacement and activity demands.',
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
        'On an adequately positioned mortise view, asymmetric medial widening relative to the superior clear space raises concern for deltoid injury and possible syndesmotic instability, even without an obvious fracture. Confirm technique and the complete series.',
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
        'Plantar ecchymosis raises concern for Lisfranc injury. Obtain weightbearing comparison radiographs when safe and tolerated; use CT or MRI when the patient cannot bear weight or films are equivocal.',
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
    'Weightbearing comparison views when tolerated, or CT/MRI for suspected Lisfranc with inability to bear weight or equivocal films.',
    'MRI for persistent ankle pain after "sprain" — talar dome, OCD, occult fracture.',
    'Orthopedic referral for unstable fractures or athletic Jones fractures.',
  ],
};

// ---------- Module 8: Spine ---------------------------------

const spine: ModuleContent = {
  ...moduleScaffold(
    'spine',
    'Spine for Sports Medicine',
    'Spine',
    'Axial',
    'Cervical and lumbar spine basics for sports medicine: alignment, spondylolysis, compression fractures.',
    ['Spondylolysis', 'Cervical instability', 'Compression fracture'],
    25,
  ),
  status: 'full',
  overview: [
    'Sports medicine spine x-rays focus on alignment and red flags.',
    'Plain films often miss disc and cord pathology — escalate to MRI when neurologic.',
    'Use x-rays for bony alignment questions, not to clear concerning neurologic symptoms.',
  ],
  views: [
    {
      name: 'AP and lateral cervical spine',
      why: 'Screens alignment, vertebral body height, prevertebral soft tissue, and gross bony injury.',
      whenToOrder: 'Low-risk neck pain when x-ray is appropriate by clinical decision rule.',
      teachingView: true,
    },
    {
      name: 'Odontoid open-mouth',
      why: 'Profiles C1-C2 and lateral mass symmetry.',
      whenToOrder: 'Cervical series when adequate and clinically appropriate.',
    },
    {
      name: 'AP and lateral lumbar spine',
      why: 'Assesses vertebral height, spondylolisthesis, and gross alignment.',
      whenToOrder: 'Persistent focal bony pain, trauma, or suspected pars/stress pattern when x-ray is appropriate.',
    },
    {
      name: 'Oblique lumbar views',
      why: 'Can show pars defects but adds radiation and is less favored in many protocols.',
      whenToOrder: 'Selective use when local protocol supports it; MRI often better for early stress injury.',
    },
  ],
  systematicNotes: [
    'Trace alignment lines first: smooth lines matter more than isolated degenerative findings.',
    'Confirm cervical films include C7-T1 before calling them adequate.',
    'Neurologic deficits, infection/cancer concern, or high-energy trauma require escalation beyond plain films.',
  ],
  anatomy: [
    {
      label: 'Cervical alignment lines',
      description: 'Anterior vertebral, posterior vertebral, and spinolaminar lines should be smooth.',
      pearl: 'A step-off or focal widening is an instability clue.',
    },
    {
      label: 'C7-T1 junction',
      description: 'Adequate lateral cervical radiographs must show through the cervicothoracic junction.',
      pearl: 'If C7-T1 is not visible, the study cannot clear the lower cervical spine.',
    },
    {
      label: 'Pars interarticularis',
      description: 'Posterior element region vulnerable to stress injury in extension athletes.',
      pearl: 'Early pars stress injury is often better detected by MRI than plain films.',
    },
  ],
  pathology: [
    {
      finding: 'Cervical instability',
      normal: 'Smooth alignment lines, preserved vertebral body height, no focal widening',
      pathologic: 'Step-off, abnormal widening, prevertebral swelling, or inadequate visualization in trauma',
      keyClue: 'Trauma mechanism, neurologic symptoms, or midline tenderness',
      pitfall: 'Using inadequate plain films to reassure a high-risk patient.',
      nextStep: 'CT for bony trauma concern; MRI for neurologic deficit, ligament, cord, infection, or tumor concern.',
    },
    {
      finding: 'Spondylolysis / pars stress injury',
      normal: 'No pars lucency, listhesis, or posterior element irregularity',
      pathologic: 'Pars lucency, sclerosis, or associated spondylolisthesis',
      keyClue: 'Adolescent extension athlete with focal low back pain',
      pitfall: 'Early stress reaction may not be visible on radiographs.',
      nextStep: 'Activity modification and MRI when early diagnosis changes management.',
    },
    {
      finding: 'Compression fracture',
      normal: 'Preserved vertebral body height and endplate contour',
      pathologic: 'Wedge deformity or focal height loss',
      keyClue: 'Trauma, osteoporosis risk, steroid use, or focal bony tenderness',
      pitfall: 'Attributing height loss to chronic change without clinical correlation.',
      nextStep: 'CT/MRI if acute injury, neurologic symptoms, or malignancy/infection concern.',
    },
  ],
  doNotMiss: [
    {
      title: 'Cervical instability red flags',
      why: 'Suspected cervical injury with neurologic findings requires emergency spine evaluation.',
      imagingNext: 'Use urgent CT and/or MRI according to the trauma and neurologic pathway; do not rely on plain films alone.',
    },
    {
      title: 'Spondylolysis',
      why: 'Adolescent extension-based athletes — pars defect can be subtle.',
      imagingNext: 'MRI for suspected active stress injury after unrevealing radiographs; CT when cortical detail or chronic bony union is the question. Avoid routine obliques and SPECT unless a local specialist pathway specifically calls for them.',
    },
  ],
  pearls: [
    {
      title: 'Plain films are screening, not definitive',
      body: 'A neurologic deficit or other high-risk red flag requires urgent evaluation and advanced imaging selected for the suspected bony, ligamentous, cord, infectious, or neoplastic process.',
    },
  ],
  pitfalls: [
    {
      title: 'Letting normal x-rays override neurologic symptoms',
      body: 'Plain radiographs do not evaluate cord, disc, nerve root, infection, or early stress reaction well.',
    },
    {
      title: 'Calling an inadequate cervical lateral adequate',
      body: 'If C7-T1 is not visible, lower cervical injury has not been assessed.',
    },
  ],
  cases: [
    {
      id: 'spine-extension-athlete-back-pain',
      moduleId: 'spine',
      title: 'Gymnast with extension low back pain',
      patientAge: '16-year-old',
      sportOrActivity: 'Gymnastics',
      mechanism: 'Progressive pain with back extension and landing',
      symptoms: 'Focal lumbar pain, no neurologic deficit, worse with single-leg extension',
      viewsObtained: ['AP lumbar', 'Lateral lumbar'],
      initialPrompt: 'What stress injury should stay on the differential even if early films are subtle?',
      questionType: 'diagnosis',
      diagnosisOptions: [
        { id: 'a', label: 'Pars stress injury / spondylolysis' },
        { id: 'b', label: 'Posterior shoulder dislocation' },
        { id: 'c', label: 'Scaphoid fracture' },
        { id: 'd', label: 'AC separation' },
      ],
      correctOptionId: 'a',
      recommendedManagementChoiceIds: ['advanced-imaging'],
      explanation:
        'Adolescent extension athletes with focal low back pain should raise concern for pars stress injury; early radiographs may be normal.',
      teachingPearl:
        'X-rays can screen alignment, but MRI is more useful for early active pars stress reaction.',
      nextStep: 'Activity modification, focused exam, and MRI when early diagnosis changes treatment.',
      imagePanels: [{ view: 'Lateral', imageKey: 'normal:lumbar-spine-lateral' }],
    },
  ],
  quiz: [
    {
      id: 'spine-q1',
      moduleId: 'spine',
      domain: 'spine',
      prompt: 'An adequate lateral cervical spine radiograph must show what?',
      options: [
        { id: 'a', text: 'Only C1-C3' },
        { id: 'b', text: 'C1 through the C7-T1 junction' },
        { id: 'c', text: 'Only the odontoid' },
        { id: 'd', text: 'The shoulder joint' },
      ],
      correctOptionId: 'b',
      explanation:
        'The lower cervical spine must be visible through C7-T1. Otherwise the study is incomplete.',
    },
    {
      id: 'spine-q2',
      moduleId: 'spine',
      domain: 'spine',
      prompt: 'Adolescent extension athlete with focal low back pain and normal early x-rays: best next imaging when suspicion remains high?',
      options: [
        { id: 'a', text: 'MRI for pars stress reaction' },
        { id: 'b', text: 'No follow-up' },
        { id: 'c', text: 'Wrist scaphoid view' },
        { id: 'd', text: 'Axillary shoulder view' },
      ],
      correctOptionId: 'a',
      explanation:
        'MRI can detect early pars stress reaction before a clear radiographic defect appears.',
    },
  ],
  keyTakeaways: [
    'Spine x-rays are alignment and bony-screening tools, not neurologic clearance tools.',
    'Cervical lateral adequacy requires visualization through C7-T1.',
    'Adolescent extension back pain should raise concern for pars stress injury.',
    'Red flags and neurologic findings escalate to CT/MRI regardless of plain film appearance.',
  ],
  whenToEscalate: [
    'CT for high-risk cervical trauma or inadequate trauma radiographs.',
    'MRI for neurologic deficit, infection, malignancy concern, cord/disc concern, or early pars stress injury.',
    'Urgent referral for progressive neurologic symptoms or bowel/bladder dysfunction.',
  ],
};

// ---------- Module 9: Pediatric & Adolescent ----------------

const pediatricAdolescent: ModuleContent = {
  ...moduleScaffold(
    'pediatric-adolescent',
    'Pediatric and Adolescent Sports X-Ray Pearls',
    'Pediatric Pearls',
    'Pediatric',
    'Apophyses, growth plates, Salter-Harris, traction apophysitis, and adolescent red flags.',
    ['Salter-Harris', 'Apophysitis vs avulsion', 'SCFE'],
    30,
  ),
  status: 'full',
  overview: [
    'Pediatric x-rays demand awareness of normal physes, apophyses, and accessory ossicles.',
    'Apophysitis is overuse — apophyseal avulsion is acute. Treat them differently.',
    'Use age, mechanism, focal tenderness, and symmetry to avoid both overcalling variants and missing growth-plate injury.',
  ],
  views: [
    {
      name: 'Region-specific AP and lateral',
      why: 'Orthogonal views are still the foundation; open physes make one-view interpretation unsafe.',
      whenToOrder: 'When mechanism, examination, validated decision rules, or inability to use the limb warrants radiography.',
    },
    {
      name: 'Oblique views',
      why: 'Can profile subtle pediatric elbow, hand, foot, and ankle injuries.',
      whenToOrder: 'When standard views do not explain a focal exam.',
    },
    {
      name: 'Comparison view',
      why: 'Can clarify normal ossification centers and physeal symmetry.',
      whenToOrder: 'Selective use when the answer will change management.',
    },
    {
      name: 'Frog-leg pelvis',
      why: 'Improves detection of SCFE when safe and clinically appropriate.',
      whenToOrder: 'Adolescent hip/groin/thigh/knee pain or limp without acute fracture concern.',
      teachingView: true,
    },
  ],
  systematicNotes: [
    'Confirm skeletal maturity first; the normal read changes with open physes.',
    'Compare the point of maximal tenderness to a physis, apophysis, or expected ossification center.',
    'Some physeal injuries are radiographically occult, but focal tenderness alone does not prove Salter-Harris I; integrate age, site, mechanism, function, and follow-up.',
  ],
  anatomy: [
    {
      label: 'Physis',
      description: 'Growth plate lucency between metaphysis and epiphysis.',
      pearl: 'A normal-appearing physis does not exclude injury, but the diagnosis should not be made from tenderness alone.',
    },
    {
      label: 'Apophysis',
      description: 'Traction growth center at tendon attachment sites.',
      pearl: 'Overuse apophysitis is chronic; avulsion is acute and often displaced.',
    },
    {
      label: 'Ossification centers',
      description: 'Predictable age-dependent centers that can mimic fragments.',
      pearl: 'Smooth corticated margins and expected location help distinguish normal from injury.',
    },
  ],
  pathology: [
    {
      finding: 'Salter-Harris injury',
      normal: 'Symmetric physis without widening, displacement, or metaphyseal fragment',
      pathologic: 'Physeal widening, a Thurston-Holland fragment, displacement, or other age-inappropriate asymmetry',
      keyClue: 'Compatible mechanism plus focal symptoms at an open growth plate',
      pitfall: 'Either excluding physeal injury from a negative film or diagnosing Salter-Harris I from tenderness alone.',
      nextStep: 'Protect and follow according to the site-specific pathway; refer displacement, joint involvement, neurovascular findings, or a high-risk physis.',
    },
    {
      finding: 'SCFE',
      normal: 'Klein line intersects lateral epiphysis and physes are symmetric',
      pathologic: 'Posteroinferior epiphyseal slip, widened physis, or abnormal Klein line',
      keyClue: 'Adolescent limp with hip, thigh, or knee pain',
      pitfall: 'Imaging only the knee when the hip exam is abnormal.',
      nextStep: 'Non-weightbearing and urgent orthopedic referral.',
    },
    {
      finding: 'Apophyseal avulsion',
      normal: 'Smooth apophysis at expected location',
      pathologic: 'Displaced fragment at tendon origin/insertion after explosive contraction',
      keyClue: 'Adolescent sprint, kick, jump, or throw with sudden focal pain',
      pitfall: 'Treating it like a simple muscle strain.',
      nextStep: 'Activity restriction and sports/ortho follow-up; urgent referral for major displacement or high-risk site.',
    },
  ],
  doNotMiss: [
    {
      title: 'SCFE',
      why: 'Klein line abnormality on AP can be subtle.',
      imagingNext: 'Immediate non-weightbearing and urgent orthopedic referral; frog-leg lateral only for a stable presentation, with cross-table lateral for unstable SCFE.',
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
      body: 'Use comparison imaging selectively when a symmetry or normal-variant question will change management.',
    },
  ],
  pitfalls: [
    {
      title: 'Overcalling every lucency',
      body: 'Open physes and ossification centers are expected. Use location, cortication, tenderness, and symmetry.',
    },
    {
      title: 'Treating tenderness as a diagnosis',
      body: 'Radiographs can miss physeal injury, but focal tenderness is not specific. Use the injury site, mechanism, age, function, and expected recovery.',
    },
  ],
  cases: [
    {
      id: 'peds-physeal-ankle-pain',
      moduleId: 'pediatric-adolescent',
      title: 'Radiograph-negative pediatric lateral ankle injury',
      patientAge: '12-year-old',
      sportOrActivity: 'Soccer',
      mechanism: 'Inversion injury with lateral ankle pain',
      symptoms: 'Point tenderness over distal fibular physis, mild swelling, able to walk with limp',
      viewsObtained: ['AP', 'Lateral', 'Mortise'],
      initialPrompt: 'The x-ray looks normal. What is the most evidence-aligned interpretation?',
      questionType: 'interpretation',
      diagnosisOptions: [
        { id: 'a', label: 'No injury because x-ray is normal' },
        { id: 'b', label: 'Low-risk lateral ankle injury; sprain or occult avulsion is more likely than Salter-Harris I' },
        { id: 'c', label: 'Femoral neck stress fracture' },
        { id: 'd', label: 'Perilunate dislocation' },
      ],
      correctOptionId: 'b',
      recommendedManagementChoiceIds: ['symptomatic-follow-up'],
      explanation:
        'MRI studies of children with radiograph-negative isolated lateral ankle injuries found true Salter-Harris I distal fibula fractures were uncommon; ligament sprains and occult avulsion injuries were much more frequent.',
      teachingPearl:
        'Do not call every tender distal fibular physis a Salter-Harris I fracture. Treat the child and expected recovery, with reassessment for atypical or persistent symptoms.',
      nextStep: 'Use a removable brace and self-regulated return to activity for an otherwise low-risk injury when consistent with local protocol; reassess persistent pain, inability to progress, or atypical findings.',
      imagePanels: [{ view: 'AP', imageKey: 'normal:ankle-pediatric' }],
    },
  ],
  quiz: [
    {
      id: 'pediatric-adolescent-q1',
      moduleId: 'pediatric-adolescent',
      domain: 'pediatric',
      prompt: 'A child has focal tenderness at an open physis after injury but normal x-rays. What is the safest interpretation?',
      options: [
        { id: 'a', text: 'Growth plates cannot be injured without x-ray changes' },
        { id: 'b', text: 'An occult physeal injury remains possible, but tenderness alone is not diagnostic' },
        { id: 'c', text: 'Always infection' },
        { id: 'd', text: 'Always malignancy' },
      ],
      correctOptionId: 'b',
      explanation:
        'Salter-Harris I injuries can be radiographically occult, but location matters: isolated radiograph-negative distal fibular tenderness is usually a sprain or occult avulsion. Use a site-specific pathway and reassess the clinical course.',
    },
    {
      id: 'pediatric-adolescent-q2',
      moduleId: 'pediatric-adolescent',
      domain: 'pediatric',
      prompt: 'Adolescent knee pain with limp should make you consider imaging what region?',
      options: [
        { id: 'a', text: 'Hip/pelvis for SCFE' },
        { id: 'b', text: 'Only the wrist' },
        { id: 'c', text: 'Only the elbow' },
        { id: 'd', text: 'No imaging under any circumstance' },
      ],
      correctOptionId: 'a',
      explanation:
        'SCFE can refer pain to the thigh or knee. Hip exam and pelvis/hip radiographs are essential when gait or hip motion is abnormal.',
    },
  ],
  keyTakeaways: [
    'Open physes and ossification centers require age-aware interpretation.',
    'Some physeal injuries are occult on x-ray, but isolated distal fibular tenderness should not be equated automatically with Salter-Harris I.',
    'Apophysitis and apophyseal avulsion are different clinical problems.',
    'SCFE can present as knee pain; hip exam drives the imaging choice.',
  ],
  whenToEscalate: [
    'Urgent ortho for SCFE, displaced physeal injury, neurovascular findings, or joint-involving fracture.',
    'MRI for persistent focal pain with normal x-rays when stress injury, infection, tumor, or occult fracture remains possible.',
    'Comparison views only when they will clarify a management-changing normal variant question.',
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
  views: [
    {
      name: 'Second orthogonal view',
      why: 'Most high-consequence misses hide when the joint or bone is judged from one plane.',
      whenToOrder: 'Trauma, instability, focal bony tenderness, or any film where alignment is not proven.',
      teachingView: true,
    },
    {
      name: 'Weightbearing comparison when tolerated',
      why: 'Midfoot and joint-space instability can disappear on non-weightbearing films.',
      whenToOrder: 'Suspected Lisfranc injury, subtle instability, or chronic weightbearing pain with equivocal non-weightbearing films.',
    },
    {
      name: 'Dedicated special view',
      why: 'Scaphoid, patellofemoral, AC-joint, and hip instability questions often need a targeted projection.',
      whenToOrder: 'When the clinical exam points to a structure not adequately profiled on the standard series.',
    },
  ],
  systematicNotes: [
    'Apply the systematic read to each case before answering.',
  ],
  systematicChecklist: systematicRead,
  anatomy: [
    {
      label: 'Alignment proof',
      description:
        'Every do-not-miss read starts by proving the joint relationship on adequate views before accepting a reassuring impression.',
      pearl: 'If the view cannot prove alignment, the read is not done.',
    },
    {
      label: 'Normal comparison anchor',
      description:
        'Name the expected normal line, space, or contour before deciding whether a subtle fragment or widening matters.',
      pearl: 'Normal-first thinking prevents both overcalling variants and undercalling subtle instability.',
    },
    {
      label: 'Soft-tissue consequence',
      description:
        'Effusion, swelling, plantar ecchymosis, and persistent focal tenderness can carry more weight than an obvious fracture line.',
      pearl: 'Clinical danger signs should override false reassurance from an equivocal film.',
    },
  ],
  pathology: [
    {
      finding: 'Occult instability or fracture',
      normal: 'Alignment is congruent and expected cortical, joint-space, and soft-tissue landmarks are preserved.',
      pathologic: 'A subtle line, widened interval, malalignment, effusion, or persistent high-risk clinical story changes the pathway.',
      keyClue: 'The film is either inadequate for the question or the clinical pattern is more dangerous than the x-ray looks.',
      pitfall: 'Stopping after “no obvious fracture” when the mechanism and exam still fit a consequential injury.',
      nextStep: 'Add the missing view, protect weightbearing, repeat imaging, or escalate to CT/MRI/specialty referral based on the pattern.',
    },
    {
      finding: 'Management-changing small fragment',
      normal: 'Small corticated ossicles or variants have smooth margins and fit the expected anatomy.',
      pathologic: 'Acute avulsion fragments, cortical breaks, or malalignment point to ligament injury, instability, or nonunion risk.',
      keyClue: 'Small radiographic findings can imply large soft-tissue or operative consequences.',
      pitfall: 'Calling the fragment incidental before checking mechanism, focal tenderness, and associated alignment.',
      nextStep: 'Treat the finding as a clue to the associated injury and arrange appropriate immobilization, MRI/CT, or urgent referral.',
    },
  ],
  doNotMiss: [
    { title: 'Posterior shoulder dislocation', why: 'Easy to miss without axillary view.', imagingNext: 'Axillary or Velpeau; CT if unclear.' },
    { title: 'Scaphoid fracture', why: 'Risk of nonunion and AVN.', imagingNext: 'Thumb spica + repeat films or MRI.' },
    { title: 'Perilunate dislocation', why: 'Capitate dislocated dorsally off the lunate on lateral; disrupted Gilula arcs on PA.', imagingNext: 'Urgent reduction and hand surgery.' },
    { title: 'Segond fracture', why: 'Implies ACL injury.', imagingNext: 'MRI knee.' },
    { title: 'Tibial plateau fracture', why: 'Subtle depression can change classification and management.', imagingNext: 'CT for fracture characterization and surgical planning.' },
    { title: 'Lisfranc injury', why: 'NWB films can look normal.', imagingNext: 'Weightbearing comparison when tolerated; CT or MRI if unable to bear weight or films are equivocal.' },
    { title: 'Talar dome lesion', why: 'Persistent post-sprain pain.', imagingNext: 'MRI ankle.' },
    { title: 'Jones fracture (5th MT)', why: 'Higher nonunion risk than a tuberosity avulsion.', imagingNext: 'Non-weightbearing immobilization and early orthopedic/sports follow-up; discuss fixation in high-demand athletes.' },
    { title: 'Femoral neck stress fracture', why: 'May be radiographically occult and can progress to displacement.', imagingNext: 'MRI; protect weightbearing.' },
    { title: 'SCFE', why: 'Klein line abnormality on AP.', imagingNext: 'Immediate non-weightbearing and urgent orthopedic referral; frog-leg only when stable, cross-table lateral when unstable.' },
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
      questionType: 'diagnosis',
      diagnosisOptions: [
        { id: 'a', label: 'Anterior dislocation' },
        { id: 'b', label: 'Posterior shoulder dislocation' },
        { id: 'c', label: 'Greater tuberosity fracture' },
        { id: 'd', label: 'Acromioclavicular separation' },
      ],
      correctOptionId: 'b',
      recommendedManagementChoiceIds: ['urgent-referral'],
      explanation: 'Mechanism (seizure) + light bulb sign + locked internal rotation = posterior dislocation.',
      teachingPearl: 'A seizure history with shoulder pain demands an axillary view.',
      nextStep: 'Document neurovascular status, obtain an axillary/Velpeau view, arrange urgent reduction in an appropriate setting, and obtain post-reduction imaging.',
      amssmVideoId: 'amssm-shoulder-radiology',
      imagePanels: [
        { view: 'Special', imageKey: 'shoulder:posterior-dislocation' },
        { view: 'Special', imageKey: 'shoulder:posterior-dislocation-axillary' },
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
      questionType: 'management',
      diagnosisOptions: [
        { id: 'a', label: 'Reassure and discharge' },
        { id: 'b', label: 'Thumb spica + repeat films in 10–14 days or MRI' },
        { id: 'c', label: 'Outpatient PT' },
        { id: 'd', label: 'Order CT chest' },
      ],
      correctOptionId: 'b',
      recommendedManagementChoiceIds: ['immobilize-protect', 'advanced-imaging'],
      explanation: 'Classic occult scaphoid presentation despite normal films.',
      teachingPearl: 'Snuffbox tenderness with negative initial films keeps occult scaphoid fracture in consideration; protect the wrist and arrange follow-up imaging according to the full examination and local protocol.',
      nextStep: 'Thumb spica splint; repeat imaging.',
      imagePanels: [
        {
          view: 'AP',
          imageKey: 'wrist:scaphoid-waist-fracture',
          revealAfterSubmit: true,
        },
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
      questionType: 'associated-injury',
      diagnosisOptions: [
        { id: 'a', label: 'Isolated LCL strain' },
        { id: 'b', label: 'ACL tear (Segond fracture)' },
        { id: 'c', label: 'Patellar tendon rupture' },
        { id: 'd', label: 'Tibial tubercle apophysitis' },
      ],
      correctOptionId: 'b',
      recommendedManagementChoiceIds: ['immobilize-protect', 'advanced-imaging'],
      explanation: 'Segond fractures are highly associated with ACL tears.',
      teachingPearl: 'A Segond fragment should trigger evaluation for ACL and associated internal derangement.',
      nextStep: 'Protect the knee as the examination requires; obtain MRI when it will guide care and arrange sports or orthopedic follow-up.',
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
      questionType: 'management',
      diagnosisOptions: [
        { id: 'a', label: 'Discharge — strain' },
        { id: 'b', label: 'Weightbearing foot films or CT' },
        { id: 'c', label: 'MRI lumbar spine' },
        { id: 'd', label: 'Repeat NWB films in 6 weeks' },
      ],
      correctOptionId: 'b',
      recommendedManagementChoiceIds: ['advanced-imaging'],
      explanation: 'Plantar ecchymosis + disproportionate pain demands weightbearing or CT.',
      teachingPearl: 'NWB films can hide Lisfranc injury; persistent clinical concern requires loading views or advanced imaging.',
      nextStep: 'Weightbearing comparison films when safe and tolerated, or CT/MRI if unable to bear weight; orthopedic referral for instability.',
      amssmVideoId: 'amssm-high-yield-foot-ankle',
      imagePanels: [
        {
          view: 'Annotated',
          imageKey: 'foot:lisfranc-injury',
          revealAfterSubmit: true,
        },
      ],
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
      questionType: 'management',
      diagnosisOptions: [
        { id: 'a', label: 'Reassure and continue PT' },
        { id: 'b', label: 'MRI ankle' },
        { id: 'c', label: 'CT abdomen/pelvis' },
        { id: 'd', label: 'Bone scan whole body' },
      ],
      correctOptionId: 'b',
      recommendedManagementChoiceIds: ['advanced-imaging'],
      explanation: 'Persistent symptoms after a "sprain" warrant MRI for talar dome OCD or occult injury.',
      teachingPearl: 'Persistent post-sprain pain is the classic OCD/talar dome scenario.',
      nextStep: 'MRI ankle; ortho referral if OCD confirmed.',
      amssmVideoId: 'amssm-ankle-radiology',
      imagePanels: [
        {
          view: 'AP',
          imageKey: 'ankle:talar-dome-ocd',
          revealAfterSubmit: true,
        },
      ],
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
      questionType: 'management',
      diagnosisOptions: [
        { id: 'a', label: 'WBAT in hard-sole shoe' },
        { id: 'b', label: 'Non-weightbearing immobilization and early ortho/sports referral' },
        { id: 'c', label: 'Reassure — avulsion' },
        { id: 'd', label: 'Discharge with NSAIDs' },
      ],
      correctOptionId: 'b',
      recommendedManagementChoiceIds: ['immobilize-protect'],
      explanation: 'A zone 2 Jones fracture has higher nonunion risk than a zone 1 avulsion; early specialty follow-up and surgical consideration are appropriate for high-demand athletes.',
      teachingPearl: 'Zone of fracture changes management.',
      nextStep: 'Non-weightbearing immobilization and early orthopedic/sports referral.',
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
      viewsObtained: ['AP pelvis', 'Cross-table lateral hip'],
      initialPrompt: 'Films "normal." Best next step?',
      questionType: 'management',
      diagnosisOptions: [
        { id: 'a', label: 'Reassure and continue training' },
        { id: 'b', label: 'Urgent MRI, protect weightbearing' },
        { id: 'c', label: 'PT for hip flexor strain' },
        { id: 'd', label: 'Oral steroids' },
      ],
      correctOptionId: 'b',
      recommendedManagementChoiceIds: ['immobilize-protect', 'advanced-imaging'],
      explanation: 'Femoral neck stress fracture risk warrants MRI and weightbearing protection.',
      teachingPearl: 'Tension-side femoral neck stress fractures can complete catastrophically.',
      nextStep: 'Urgent MRI; ortho consult based on results.',
      amssmVideoId: 'amssm-bone-stress-injuries',
      imagePanels: [
        {
          view: 'AP',
          imageKey: 'hip:femoral-neck-stress-fracture',
          revealAfterSubmit: true,
        },
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
      questionType: 'diagnosis',
      diagnosisOptions: [
        { id: 'a', label: 'Transient synovitis' },
        { id: 'b', label: 'SCFE' },
        { id: 'c', label: 'Legg-Calvé-Perthes' },
        { id: 'd', label: 'Apophysitis' },
      ],
      correctOptionId: 'b',
      recommendedManagementChoiceIds: ['urgent-referral'],
      explanation: 'Klein line abnormality on AP is the classic SCFE finding.',
      teachingPearl: 'Adolescent knee pain with a limp or restricted hip motion may be referred from the hip; keep SCFE high on the differential.',
      nextStep: 'Immediate non-weightbearing and urgent orthopedic referral. Choose the lateral projection by stability; do not force an unstable hip into frog-leg position.',
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
      questionType: 'management',
      diagnosisOptions: [
        { id: 'a', label: 'WBAT and follow up in 2 weeks' },
        { id: 'b', label: 'CT knee for surgical planning' },
        { id: 'c', label: 'MRI lumbar spine' },
        { id: 'd', label: 'Discharge with NSAIDs' },
      ],
      correctOptionId: 'b',
      recommendedManagementChoiceIds: ['advanced-imaging', 'urgent-referral'],
      explanation: 'Tibial plateau fractures often need CT for fragment evaluation and surgical planning.',
      teachingPearl: 'Subtle plateau depression can change fracture classification, weightbearing guidance, and operative planning.',
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
      initialPrompt: 'The PA shows disrupted Gilula arcs and the lateral shows the capitate dislocated dorsally off the lunate. Most likely diagnosis?',
      questionType: 'diagnosis',
      diagnosisOptions: [
        { id: 'a', label: 'Distal radius fracture' },
        { id: 'b', label: 'Perilunate dislocation' },
        { id: 'c', label: 'Scaphoid waist fracture' },
        { id: 'd', label: 'Triangular fibrocartilage tear' },
      ],
      correctOptionId: 'b',
      recommendedManagementChoiceIds: ['urgent-referral'],
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
