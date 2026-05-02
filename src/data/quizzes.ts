import type { QuizQuestionData } from '../types';

export const preCourseQuiz: QuizQuestionData[] = [
  {
    id: 'pre-q1',
    domain: 'systematic',
    prompt:
      'Which step of a systematic MSK x-ray read is most likely to detect a posterior shoulder dislocation?',
    options: [
      { id: 'a', text: 'Bone (cortical disruption)' },
      { id: 'b', text: 'Alignment (joint congruity)' },
      { id: 'c', text: 'Soft tissues (effusion)' },
      { id: 'd', text: 'Cartilage (joint space)' },
    ],
    correctOptionId: 'b',
    explanation:
      'Posterior dislocation is an alignment problem. The AP can look near-normal — the axillary or scapular Y is what reveals the malalignment.',
  },
  {
    id: 'pre-q2',
    domain: 'views',
    prompt:
      'A weekend warrior has midfoot pain after a fall and plantar bruising. NWB AP foot is unremarkable. Best next step?',
    options: [
      { id: 'a', text: 'Discharge home with NSAIDs' },
      { id: 'b', text: 'Weightbearing AP foot or CT' },
      { id: 'c', text: 'Bone scan' },
      { id: 'd', text: 'Lumbar MRI' },
    ],
    correctOptionId: 'b',
    explanation:
      'Plantar ecchymosis = Lisfranc until proven otherwise. NWB films often miss the diastasis.',
  },
  {
    id: 'pre-q3',
    domain: 'do-not-miss',
    prompt:
      'A pivoting basketball player has a small lateral tibial plateau avulsion fragment. What does this most strongly imply?',
    options: [
      { id: 'a', text: 'Patellar tendon rupture' },
      { id: 'b', text: 'Tibial spine apophysitis' },
      { id: 'c', text: 'ACL tear (Segond fracture)' },
      { id: 'd', text: 'Lateral meniscus root tear in isolation' },
    ],
    correctOptionId: 'c',
    explanation:
      'Segond fracture is highly associated with ACL injury — MRI is the next step.',
  },
  {
    id: 'pre-q4',
    domain: 'occult',
    prompt:
      'A college runner with progressive groin pain has normal AP pelvis radiographs. What is the most appropriate next step?',
    options: [
      { id: 'a', text: 'Reassure and continue training' },
      { id: 'b', text: 'CT pelvis with contrast' },
      { id: 'c', text: 'MRI hip and protect weightbearing' },
      { id: 'd', text: 'Repeat radiographs in 3 months' },
    ],
    correctOptionId: 'c',
    explanation:
      'Femoral neck stress fracture is a tension-side injury with completion risk. MRI is test of choice.',
  },
  {
    id: 'pre-q5',
    domain: 'pediatric',
    prompt:
      'A 12-year-old presents with vague knee pain and limp. Klein line on AP pelvis does not intersect the lateral epiphysis. Diagnosis?',
    options: [
      { id: 'a', text: 'Transient synovitis' },
      { id: 'b', text: 'SCFE' },
      { id: 'c', text: 'Apophysitis' },
      { id: 'd', text: 'Legg-Calvé-Perthes' },
    ],
    correctOptionId: 'b',
    explanation:
      'Klein line abnormality on AP is classic for SCFE; emergent ortho referral is required.',
  },
  {
    id: 'pre-q6',
    domain: 'escalation',
    prompt:
      'A 17-year-old volleyball player has persistent ankle pain and clicking 8 weeks after a "sprain." Initial x-rays were normal. Best next step?',
    options: [
      { id: 'a', text: 'Reassure and continue PT' },
      { id: 'b', text: 'MRI ankle' },
      { id: 'c', text: 'Bone scan' },
      { id: 'd', text: 'CT chest' },
    ],
    correctOptionId: 'b',
    explanation:
      'Persistent symptoms after a "sprain" — think talar dome OCD or occult osteochondral injury. MRI is the test of choice.',
  },
  {
    id: 'pre-q7',
    domain: 'foundations',
    prompt:
      'On an ankle mortise view, the medial clear space is 6 mm and the superior clear space is 3 mm. What does this suggest?',
    options: [
      { id: 'a', text: 'Normal mortise' },
      { id: 'b', text: 'Deltoid/syndesmotic injury' },
      { id: 'c', text: 'Lateral malleolar avulsion only' },
      { id: 'd', text: 'Posterior malleolar fracture' },
    ],
    correctOptionId: 'b',
    explanation:
      'Asymmetric medial > superior clear space indicates deltoid disruption ± syndesmosis injury.',
  },
];

export const postCourseQuiz: QuizQuestionData[] = [
  {
    id: 'post-q1',
    domain: 'systematic',
    prompt:
      'You receive a wet read on a shoulder x-ray for a wrestler with locked internal rotation. The AP shows a "light bulb" sign. What view should you insist on next?',
    options: [
      { id: 'a', text: 'AP internal rotation' },
      { id: 'b', text: 'AP external rotation' },
      { id: 'c', text: 'Axillary or Velpeau' },
      { id: 'd', text: 'AC joint dedicated view' },
    ],
    correctOptionId: 'c',
    explanation:
      'Posterior dislocation requires a true axillary or Velpeau substitute — AP and Y are not enough.',
  },
  {
    id: 'post-q2',
    domain: 'views',
    prompt:
      'A 28-year-old runner has lateral foot pain. Films show a transverse fracture at the metaphyseal-diaphyseal junction of the 5th MT. Best management?',
    options: [
      { id: 'a', text: 'WBAT in hard-sole shoe' },
      { id: 'b', text: 'NWB CAM boot, ortho referral (Jones)' },
      { id: 'c', text: 'Reassure — avulsion' },
      { id: 'd', text: 'Discharge with NSAIDs' },
    ],
    correctOptionId: 'b',
    explanation:
      'Jones fractures have high nonunion risk and often warrant surgical consideration in athletes.',
  },
  {
    id: 'post-q3',
    domain: 'do-not-miss',
    prompt:
      'A snowboarder has a deformed wrist with median paresthesias. Lateral x-ray shows disruption of Gilula arcs. Diagnosis?',
    options: [
      { id: 'a', text: 'Distal radius fracture' },
      { id: 'b', text: 'Perilunate dislocation' },
      { id: 'c', text: 'Scaphoid fracture' },
      { id: 'd', text: 'Triangular fibrocartilage tear' },
    ],
    correctOptionId: 'b',
    explanation:
      'Perilunate dislocation requires urgent reduction and hand surgery referral.',
  },
  {
    id: 'post-q4',
    domain: 'occult',
    prompt:
      'A 24-year-old has snuffbox tenderness 6 days after a FOOSH. Films are read as normal. Best next step?',
    options: [
      { id: 'a', text: 'Reassure, no immobilization' },
      { id: 'b', text: 'Thumb spica + repeat films in 10–14 days or MRI' },
      { id: 'c', text: 'Long arm cast' },
      { id: 'd', text: 'PT for wrist sprain' },
    ],
    correctOptionId: 'b',
    explanation:
      'Occult scaphoid fracture is the rule, not the exception, in this clinical setting.',
  },
  {
    id: 'post-q5',
    domain: 'pediatric',
    prompt:
      'A 14-year-old gymnast has medial elbow pain after a pop. AP elbow shows asymmetric widening of the medial epicondyle physis with a small fragment. Most appropriate concern?',
    options: [
      { id: 'a', text: 'Olecranon apophysitis' },
      { id: 'b', text: 'Capitellar OCD' },
      { id: 'c', text: 'Medial epicondyle avulsion (UCL injury)' },
      { id: 'd', text: 'Radial head fracture' },
    ],
    correctOptionId: 'c',
    explanation:
      'Medial epicondyle avulsion in a throwing/upper-extremity athlete suggests UCL/medial structures injury and may need ortho referral.',
  },
  {
    id: 'post-q6',
    domain: 'escalation',
    prompt:
      'A cyclist has subtle depression of the lateral tibial plateau on AP knee. Best next step?',
    options: [
      { id: 'a', text: 'WBAT and follow up in 2 weeks' },
      { id: 'b', text: 'CT knee for surgical planning' },
      { id: 'c', text: 'MRI lumbar spine' },
      { id: 'd', text: 'Discharge with NSAIDs' },
    ],
    correctOptionId: 'b',
    explanation:
      'Even small plateau depressions affect the surgical decision; CT is standard for fragment characterization.',
  },
  {
    id: 'post-q7',
    domain: 'foundations',
    prompt:
      'Which scenario is the strongest indication for MRI despite a normal x-ray?',
    options: [
      { id: 'a', text: 'Mild lateral ankle pain after rolling on a curb 2 days ago' },
      { id: 'b', text: 'Adolescent with vague pelvis pain and a normal AP' },
      { id: 'c', text: 'A college runner with progressive groin pain over 3 weeks' },
      { id: 'd', text: 'Acute snuffbox tenderness with documented scaphoid fracture' },
    ],
    correctOptionId: 'c',
    explanation:
      'Femoral neck stress fracture risk is the prototypical "MRI despite normal x-ray" scenario.',
  },
];

export const confidenceDomains: { id: string; label: string }[] = [
  { id: 'systematic', label: 'Performing a systematic x-ray read' },
  { id: 'views', label: 'Choosing the right views to order' },
  { id: 'do-not-miss', label: 'Recognizing not-to-miss injuries' },
  { id: 'occult', label: 'Reasoning about occult fractures' },
  { id: 'pediatric', label: 'Interpreting pediatric/adolescent x-rays' },
  { id: 'escalation', label: 'Knowing when to escalate to MRI/CT/US' },
];
