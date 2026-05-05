import type { ModuleSummary } from '../types';

export const moduleSummaries: ModuleSummary[] = [
  {
    id: 'xray-foundations',
    title: 'X-Ray Foundations',
    shortTitle: 'Foundations',
    region: 'Foundations',
    description:
      'A reproducible, clinic-ready approach to any musculoskeletal radiograph for sports medicine learners.',
    estimatedMinutes: 35,
    status: 'full',
    emphasis: ['Systematic read', 'Views and adequacy', 'When x-ray is not enough'],
  },
  {
    id: 'shoulder',
    title: 'Shoulder',
    shortTitle: 'Shoulder',
    region: 'Upper Extremity',
    description:
      'Glenohumeral, AC joint, clavicle, and proximal humerus radiograph interpretation for sports medicine.',
    estimatedMinutes: 40,
    status: 'full',
    emphasis: ['Posterior dislocation', 'AC separation grading', 'Bony Bankart and Hill-Sachs'],
  },
  {
    id: 'elbow',
    title: 'Elbow',
    shortTitle: 'Elbow',
    region: 'Upper Extremity',
    description:
      'Elbow radiograph interpretation including fat pad signs, radial head fractures, and pediatric elbow.',
    estimatedMinutes: 30,
    status: 'full',
    emphasis: ['Fat pad signs', 'Radial head fracture', 'Pediatric medial epicondyle avulsion'],
  },
  {
    id: 'wrist-hand',
    title: 'Wrist and Hand',
    shortTitle: 'Wrist & Hand',
    region: 'Upper Extremity',
    description:
      'Distal radius, scaphoid, carpal alignment, and hand-specific injury patterns.',
    estimatedMinutes: 35,
    status: 'full',
    emphasis: ['Scaphoid fracture', 'Scapholunate widening', 'Mallet/jersey/gamekeeper'],
  },
  {
    id: 'pelvis-hip',
    title: 'Pelvis and Hip',
    shortTitle: 'Pelvis & Hip',
    region: 'Lower Extremity',
    description:
      'AP pelvis, frog-leg lateral, Dunn views, and femoroacetabular impingement basics.',
    estimatedMinutes: 35,
    status: 'full',
    emphasis: ['Femoral neck stress', 'FAI morphology', 'SCFE red flags'],
  },
  {
    id: 'knee',
    title: 'Knee',
    shortTitle: 'Knee',
    region: 'Lower Extremity',
    description:
      'Knee radiograph interpretation for fractures, alignment, OA, patellofemoral pathology, and pediatric apophyseal injuries.',
    estimatedMinutes: 40,
    status: 'full',
    emphasis: ['Effusion as a clue', 'Segond fracture', 'Patella alta and bipartite patella'],
  },
  {
    id: 'ankle-foot',
    title: 'Ankle and Foot',
    shortTitle: 'Ankle & Foot',
    region: 'Lower Extremity',
    description:
      'Ankle mortise, malleolar fractures, syndesmotic injury, Lisfranc, and high-yield foot fractures.',
    estimatedMinutes: 40,
    status: 'full',
    emphasis: ['Mortise integrity', 'Lisfranc injury', '5th metatarsal fracture types'],
  },
  {
    id: 'spine',
    title: 'Spine for Sports Medicine',
    shortTitle: 'Spine',
    region: 'Axial',
    description:
      'Cervical and lumbar spine basics for sports medicine: alignment, spondylolysis, compression fractures.',
    estimatedMinutes: 25,
    status: 'full',
    emphasis: ['Spondylolysis', 'Cervical instability', 'Compression fracture'],
  },
  {
    id: 'pediatric-adolescent',
    title: 'Pediatric and Adolescent Sports X-Ray Pearls',
    shortTitle: 'Pediatric Pearls',
    region: 'Pediatric',
    description:
      'Apophyses, growth plates, Salter-Harris, traction apophysitis, and adolescent red flags.',
    estimatedMinutes: 30,
    status: 'full',
    emphasis: ['Salter-Harris', 'Apophysitis vs avulsion', 'SCFE'],
  },
  {
    id: 'do-not-miss',
    title: 'Sports Medicine Do Not Miss Cases',
    shortTitle: 'Do Not Miss',
    region: 'High-Yield Cases',
    description:
      'A curated set of injuries that change management and outcomes when caught — and harm when missed.',
    estimatedMinutes: 30,
    status: 'full',
    emphasis: ['Catastrophic miss prevention', 'Pattern recognition', 'When to escalate'],
  },
];

export function getModuleSummary(id: string): ModuleSummary | undefined {
  return moduleSummaries.find((m) => m.id === id);
}
