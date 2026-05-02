import type { QuizQuestionData } from '../types';

// Tightly-scoped 2-question post-video quizzes designed for retention. Keyed
// by videoId so each video gets a contextual recall check immediately after
// the learner marks it complete.

export const videoQuestions: Record<string, QuizQuestionData[]> = {
  'amssm-msk-radiology-intro': [
    {
      id: 'pv-msk-intro-q1',
      domain: 'systematic',
      prompt:
        'Why is a structured systematic approach valuable for primary care MSK x-ray reads?',
      options: [
        { id: 'a', text: 'It guarantees a correct radiologist-level read every time' },
        { id: 'b', text: 'It reduces missed findings by enforcing a repeatable habit' },
        { id: 'c', text: 'It eliminates the need for orthogonal views' },
        { id: 'd', text: 'It replaces the clinical exam' },
      ],
      correctOptionId: 'b',
      explanation:
        'Structured reads catch findings you would otherwise skip when in a clinic-time crunch.',
    },
    {
      id: 'pv-msk-intro-q2',
      domain: 'foundations',
      prompt: 'What is step zero before interpreting any MSK radiograph?',
      options: [
        { id: 'a', text: 'Order MRI' },
        { id: 'b', text: 'Confirm patient, side, date, views, and adequacy' },
        { id: 'c', text: 'Make a call from one view to save time' },
        { id: 'd', text: 'Compare to a textbook image' },
      ],
      correctOptionId: 'b',
      explanation: 'Confirming basics prevents the most common avoidable errors.',
    },
  ],
  'amssm-radiographic-terms': [
    {
      id: 'pv-rad-terms-q1',
      domain: 'foundations',
      prompt:
        'Why does precise radiographic language matter clinically?',
      options: [
        { id: 'a', text: 'It does not — clinicians can be informal' },
        { id: 'b', text: 'It enables consistent communication with consultants and the chart' },
        { id: 'c', text: 'It replaces the need for imaging' },
        { id: 'd', text: 'It is required for billing only' },
      ],
      correctOptionId: 'b',
      explanation:
        'Precise terms reduce miscommunication and clarify the clinical picture in handoffs and notes.',
    },
    {
      id: 'pv-rad-terms-q2',
      domain: 'foundations',
      prompt: 'A "buckle fracture" is best described as:',
      options: [
        { id: 'a', text: 'A complete cortical break' },
        { id: 'b', text: 'A focal cortical bulge from impaction without complete cortical disruption' },
        { id: 'c', text: 'A spiral fracture' },
        { id: 'd', text: 'An avulsion fragment' },
      ],
      correctOptionId: 'b',
      explanation:
        'Buckle (torus) fractures are pediatric impaction injuries with focal cortical bulging.',
    },
  ],
  'amssm-high-yield-shoulder-clavicle-elbow': [
    {
      id: 'pv-yhs-q1',
      domain: 'shoulder',
      prompt:
        'Which view is most likely to reveal a posterior shoulder dislocation that AP misses?',
      options: [
        { id: 'a', text: 'AP internal rotation' },
        { id: 'b', text: 'Axillary' },
        { id: 'c', text: 'AC joint dedicated' },
        { id: 'd', text: 'Stryker notch' },
      ],
      correctOptionId: 'b',
      explanation: 'The axillary axis is the disambiguator for posterior dislocation.',
    },
    {
      id: 'pv-yhs-q2',
      domain: 'shoulder',
      prompt:
        'A posterior fat pad sign on a lateral elbow x-ray most strongly implies:',
      options: [
        { id: 'a', text: 'Normal variant' },
        { id: 'b', text: 'Occult intra-articular fracture (radial head adult; supracondylar pediatric)' },
        { id: 'c', text: 'Olecranon bursitis' },
        { id: 'd', text: 'Triceps tendinopathy' },
      ],
      correctOptionId: 'b',
      explanation: 'Posterior fat pad is never normal in the right clinical context.',
    },
  ],
  'amssm-shoulder-radiology': [
    {
      id: 'pv-shd-q1',
      domain: 'shoulder',
      prompt: 'Acromiohumeral interval < 7 mm suggests:',
      options: [
        { id: 'a', text: 'Calcific tendinopathy' },
        { id: 'b', text: 'Chronic rotator cuff insufficiency' },
        { id: 'c', text: 'Os acromiale' },
        { id: 'd', text: 'AC joint OA' },
      ],
      correctOptionId: 'b',
      explanation: 'High-riding humeral head implies chronic cuff dysfunction.',
    },
    {
      id: 'pv-shd-q2',
      domain: 'shoulder',
      prompt:
        'On Grashey, a clean concentric joint space confirms:',
      options: [
        { id: 'a', text: 'A normal cuff' },
        { id: 'b', text: 'An adequate film' },
        { id: 'c', text: 'No bony Bankart' },
        { id: 'd', text: 'No instability' },
      ],
      correctOptionId: 'b',
      explanation: 'Adequate Grashey is the prerequisite for downstream interpretation.',
    },
  ],
  'amssm-elbow-radiology': [
    {
      id: 'pv-elbow-q1',
      domain: 'foundations',
      prompt:
        'On a pediatric lateral elbow x-ray, the anterior humeral line should:',
      options: [
        { id: 'a', text: 'Pass anterior to the capitellum' },
        { id: 'b', text: 'Bisect the middle third of the capitellum' },
        { id: 'c', text: 'Pass posterior to the capitellum' },
        { id: 'd', text: 'Be irrelevant in adults' },
      ],
      correctOptionId: 'b',
      explanation:
        'Anterior humeral line should bisect the middle third — posterior position suggests supracondylar fracture.',
    },
    {
      id: 'pv-elbow-q2',
      domain: 'foundations',
      prompt:
        'Adolescent thrower with medial elbow pain and a fragment near the medial epicondyle most concerning for:',
      options: [
        { id: 'a', text: 'Olecranon apophysitis' },
        { id: 'b', text: 'Capitellar OCD' },
        { id: 'c', text: 'Medial epicondyle avulsion (UCL injury)' },
        { id: 'd', text: 'Radial head fracture' },
      ],
      correctOptionId: 'c',
      explanation: 'Medial-sided pain + epicondyle fragment in a thrower = UCL injury until proven otherwise.',
    },
  ],
  'amssm-hand-radiology': [
    {
      id: 'pv-hand-q1',
      domain: 'foundations',
      prompt: 'A volar plate avulsion fragment is best seen on:',
      options: [
        { id: 'a', text: 'PA hand' },
        { id: 'b', text: 'Lateral finger' },
        { id: 'c', text: 'Oblique hand' },
        { id: 'd', text: 'Wrist mortise (n/a)' },
      ],
      correctOptionId: 'b',
      explanation: 'Lateral finger profiles the volar surface where the avulsion lies.',
    },
    {
      id: 'pv-hand-q2',
      domain: 'foundations',
      prompt: 'Mallet finger radiographic clue?',
      options: [
        { id: 'a', text: 'Avulsion fragment at the dorsal base of the distal phalanx' },
        { id: 'b', text: 'Avulsion fragment at the volar base of the distal phalanx' },
        { id: 'c', text: 'Boutonniere deformity at the PIP' },
        { id: 'd', text: 'Spiral phalanx fracture' },
      ],
      correctOptionId: 'a',
      explanation: 'Mallet = extensor tendon avulsion at the dorsal base of the distal phalanx.',
    },
  ],
  'amssm-high-yield-hip-knee': [
    {
      id: 'pv-hk-q1',
      domain: 'knee',
      prompt: 'Segond fracture on AP knee implies:',
      options: [
        { id: 'a', text: 'Isolated LCL strain' },
        { id: 'b', text: 'ACL tear' },
        { id: 'c', text: 'Patellar dislocation' },
        { id: 'd', text: 'Tibial tubercle apophysitis' },
      ],
      correctOptionId: 'b',
      explanation: 'Segond → ACL until proven otherwise.',
    },
    {
      id: 'pv-hk-q2',
      domain: 'foundations',
      prompt:
        'A college runner with progressive groin pain and normal AP pelvis warrants:',
      options: [
        { id: 'a', text: 'Continued training' },
        { id: 'b', text: 'MRI hip and protected weightbearing' },
        { id: 'c', text: 'PT only' },
        { id: 'd', text: 'NSAIDs and recheck in 6 weeks' },
      ],
      correctOptionId: 'b',
      explanation: 'Femoral neck stress fracture risk needs MRI and protection.',
    },
  ],
  'amssm-hip-radiology': [
    {
      id: 'pv-hip-q1',
      domain: 'foundations',
      prompt: 'Klein line abnormality on AP pelvis suggests:',
      options: [
        { id: 'a', text: 'Apophysitis' },
        { id: 'b', text: 'SCFE' },
        { id: 'c', text: 'Transient synovitis' },
        { id: 'd', text: 'Greater trochanter fracture' },
      ],
      correctOptionId: 'b',
      explanation: 'Klein line failing to intersect the lateral epiphysis is the SCFE signature.',
    },
    {
      id: 'pv-hip-q2',
      domain: 'foundations',
      prompt: 'Cam morphology classically presents as:',
      options: [
        { id: 'a', text: 'Aspherical femoral head-neck junction' },
        { id: 'b', text: 'Acetabular over-coverage' },
        { id: 'c', text: 'Femoral neck stress reaction' },
        { id: 'd', text: 'AVN crescent sign' },
      ],
      correctOptionId: 'a',
      explanation: 'Cam = aspherical head-neck junction; pincer = acetabular over-coverage.',
    },
  ],
  'amssm-knee-radiology': [
    {
      id: 'pv-knee-q1',
      domain: 'knee',
      prompt: 'A large suprapatellar effusion with no fracture after acute trauma warrants:',
      options: [
        { id: 'a', text: 'Reassurance' },
        { id: 'b', text: 'MRI for internal derangement / occult fracture' },
        { id: 'c', text: 'CT lumbar spine' },
        { id: 'd', text: 'Casting' },
      ],
      correctOptionId: 'b',
      explanation: 'Effusion is the tiebreaker for soft-tissue injury when bone is unremarkable.',
    },
    {
      id: 'pv-knee-q2',
      domain: 'knee',
      prompt: 'Best view for patellar tilt and trochlear morphology?',
      options: [
        { id: 'a', text: 'Lateral knee' },
        { id: 'b', text: 'Sunrise / Merchant' },
        { id: 'c', text: 'AP knee' },
        { id: 'd', text: 'Tunnel / notch' },
      ],
      correctOptionId: 'b',
      explanation: 'Sunrise / Merchant profiles the patella in the trochlear groove.',
    },
  ],
  'amssm-high-yield-foot-ankle': [
    {
      id: 'pv-fa-q1',
      domain: 'ankle-foot',
      prompt: 'Plantar ecchymosis + midfoot pain + normal NWB film = ?',
      options: [
        { id: 'a', text: 'Reassure' },
        { id: 'b', text: 'Weightbearing AP foot or CT (Lisfranc concern)' },
        { id: 'c', text: 'Lumbar MRI' },
        { id: 'd', text: 'Bone scan' },
      ],
      correctOptionId: 'b',
      explanation: 'NWB films can hide Lisfranc; weightbearing or CT clarifies.',
    },
    {
      id: 'pv-fa-q2',
      domain: 'ankle-foot',
      prompt: 'Jones fracture is at which 5th MT zone?',
      options: [
        { id: 'a', text: 'Tuberosity' },
        { id: 'b', text: 'Metaphyseal-diaphyseal junction' },
        { id: 'c', text: 'Proximal diaphysis' },
        { id: 'd', text: 'Distal shaft' },
      ],
      correctOptionId: 'b',
      explanation: 'Jones = metaphyseal-diaphyseal junction; high nonunion risk.',
    },
  ],
  'amssm-ankle-radiology': [
    {
      id: 'pv-ank-q1',
      domain: 'ankle-foot',
      prompt: 'Mortise: medial clear space 6 mm, superior 3 mm =',
      options: [
        { id: 'a', text: 'Normal mortise' },
        { id: 'b', text: 'Deltoid / syndesmotic injury' },
        { id: 'c', text: 'Lateral malleolar avulsion only' },
        { id: 'd', text: 'Posterior malleolar fracture' },
      ],
      correctOptionId: 'b',
      explanation: 'Asymmetric medial > superior implies deltoid disruption.',
    },
    {
      id: 'pv-ank-q2',
      domain: 'ankle-foot',
      prompt: 'Os trigonum location?',
      options: [
        { id: 'a', text: 'Anterior to talar dome' },
        { id: 'b', text: 'Posterior to talus' },
        { id: 'c', text: 'Lateral malleolar tip' },
        { id: 'd', text: 'Subtalar joint' },
      ],
      correctOptionId: 'b',
      explanation: 'Os trigonum sits posterior to the talus with smooth corticated margins.',
    },
  ],
  'amssm-growth-plate-injuries': [
    {
      id: 'pv-gp-q1',
      domain: 'pediatric',
      prompt: 'Salter-Harris II involves:',
      options: [
        { id: 'a', text: 'Through the physis only' },
        { id: 'b', text: 'Through physis + metaphysis' },
        { id: 'c', text: 'Through physis + epiphysis' },
        { id: 'd', text: 'Crush injury of the physis' },
      ],
      correctOptionId: 'b',
      explanation: 'SH-II is the most common pattern: through the physis with a metaphyseal fragment.',
    },
    {
      id: 'pv-gp-q2',
      domain: 'pediatric',
      prompt: 'Asymmetric widening of a physis on x-ray suggests:',
      options: [
        { id: 'a', text: 'Normal variant' },
        { id: 'b', text: 'Salter-Harris injury' },
        { id: 'c', text: 'Bone cyst' },
        { id: 'd', text: 'Apophysitis' },
      ],
      correctOptionId: 'b',
      explanation: 'Symmetric physes are normal; asymmetric widening is a fracture pattern.',
    },
  ],
  'amssm-ocd-lesions': [
    {
      id: 'pv-ocd-q1',
      domain: 'pediatric',
      prompt: 'Most common location of capitellar OCD?',
      options: [
        { id: 'a', text: 'Medial capitellum' },
        { id: 'b', text: 'Anterolateral capitellum' },
        { id: 'c', text: 'Olecranon' },
        { id: 'd', text: 'Radial head' },
      ],
      correctOptionId: 'b',
      explanation: 'Capitellar OCD typically affects the anterolateral capitellum in young throwers.',
    },
    {
      id: 'pv-ocd-q2',
      domain: 'pediatric',
      prompt: 'OCD lesion with persistent symptoms — best next imaging?',
      options: [
        { id: 'a', text: 'Repeat plain films at 6 weeks' },
        { id: 'b', text: 'MRI for stability and grade' },
        { id: 'c', text: 'CT chest' },
        { id: 'd', text: 'Bone scan' },
      ],
      correctOptionId: 'b',
      explanation: 'MRI characterizes stability — drives operative vs non-op decision.',
    },
  ],
  'amssm-bone-stress-injuries': [
    {
      id: 'pv-bsi-q1',
      domain: 'occult',
      prompt: 'Why are early stress injuries often radiographically occult?',
      options: [
        { id: 'a', text: 'Cortical changes appear before clinical pain' },
        { id: 'b', text: 'Cortical changes lag behind clinical pain by 2–4 weeks' },
        { id: 'c', text: 'X-rays detect them before MRI' },
        { id: 'd', text: 'They never appear on x-ray' },
      ],
      correctOptionId: 'b',
      explanation: 'Periosteal/cortical signs lag pain by weeks; MRI is the early test of choice.',
    },
    {
      id: 'pv-bsi-q2',
      domain: 'occult',
      prompt: 'Most catastrophic stress injury to miss?',
      options: [
        { id: 'a', text: 'Posterior tibial' },
        { id: 'b', text: 'Femoral neck (tension side)' },
        { id: 'c', text: 'Metatarsal' },
        { id: 'd', text: 'Pars interarticularis' },
      ],
      correctOptionId: 'b',
      explanation: 'Tension-side femoral neck stress fractures can complete catastrophically.',
    },
  ],
};

export function getQuestionsForVideo(videoId: string): QuizQuestionData[] {
  return videoQuestions[videoId] ?? [];
}
