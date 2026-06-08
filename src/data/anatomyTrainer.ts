/**
 * Interactive "master normal first" anatomy trainer — the X-ray analogue of the
 * Knee MRI course's Normal MRI workstation. Each region supplies a Guided Tour
 * (labeled structures + teaching notes) and a Knowledge Check (a marker on the
 * film → "what is the marked structure?").
 *
 * Unlike MRI (scrollable slice stacks), each X-ray VIEW is a single image, so a
 * step/question references an image registry key instead of a slice index.
 *
 * Marker coordinates are PERCENTAGES of the displayed image (x = left, y = top).
 *
 * SEED / FIRST PASS: structure NAMES, teaching notes, and answer keys are
 * clinically correct; marker POSITIONS are a first pass to be confirmed and
 * nudged onto the films by the course director via the in-app Adjust tool.
 */

import { generatedTrainers } from './anatomyTrainerGenerated';

export interface AnatomyMarker {
  x: number; // % from left
  y: number; // % from top
  label?: string;
}

export interface TrainerTourStep {
  imageKey: string;
  markers: AnatomyMarker[];
  title: string;
  note: string;
}

export interface TrainerCheckItem {
  id: string;
  imageKey: string;
  marker: { x: number; y: number };
  prompt: string;
  options: string[];
  answer: number; // index into options
  explanation: string;
}

export interface ModuleTrainerData {
  tour: TrainerTourStep[];
  check: TrainerCheckItem[];
}

const WHAT = 'What is the marked structure?';

const shoulder: ModuleTrainerData = {
  tour: [
    {
      imageKey: 'normal:shoulder-grashey',
      markers: [],
      title: 'Get oriented — Grashey (true AP)',
      note: 'The Grashey is a true AP of the glenohumeral joint: the beam is angled down the scapular plane so the joint is seen in profile with a clean, concentric joint space. If you cannot see a clear space, it is not a true Grashey. Scan head → tuberosity → joint → glenoid → acromion/clavicle.',
    },
    {
      imageKey: 'normal:shoulder-grashey',
      markers: [{ x: 47, y: 28, label: 'Humeral head' }],
      title: 'Humeral head',
      note: 'The rounded proximal humerus with a smooth cortical margin and even trabecular bone. Its articular surface faces the glenoid. Loss of the normal round contour (a "light bulb") suggests posterior dislocation.',
    },
    {
      imageKey: 'normal:shoulder-grashey',
      markers: [{ x: 29, y: 31, label: 'Greater tuberosity' }],
      title: 'Greater tuberosity',
      note: 'The lateral prominence of the proximal humerus and the supraspinatus/infraspinatus footprint. Amorphous calcium here = calcific tendinopathy; a displaced fragment = greater tuberosity fracture.',
    },
    {
      imageKey: 'normal:shoulder-grashey',
      markers: [{ x: 65, y: 32, label: 'Glenohumeral joint space' }],
      title: 'Glenohumeral joint space',
      note: 'The clear, concentric lucency between the humeral head and glenoid — the whole point of the Grashey. It should be uniform; overlap or asymmetry means dislocation or a non-true AP.',
    },
    {
      imageKey: 'normal:shoulder-grashey',
      markers: [{ x: 68, y: 34, label: 'Glenoid' }],
      title: 'Glenoid',
      note: 'The shallow scapular socket. Trace its rim — an anteroinferior bony fragment is a bony Bankart, and rim bone loss changes the surgical plan after instability.',
    },
    {
      imageKey: 'normal:shoulder-grashey',
      markers: [{ x: 33, y: 13, label: 'Acromion' }],
      title: 'Acromion',
      note: 'The flat lateral projection of the scapular spine forming the roof of the shoulder. The acromiohumeral interval (AHI, the gap between acromion and humeral head) beneath it should be ≥ 7 mm; a high-riding head means chronic cuff insufficiency.',
    },
    {
      imageKey: 'normal:shoulder-grashey',
      markers: [{ x: 72, y: 10, label: 'Distal clavicle / AC joint' }],
      title: 'Distal clavicle & AC joint',
      note: 'Where the clavicle meets the acromion. Compare the coracoclavicular distance to the other side to grade AC separation; distal clavicle erosion in a lifter is osteolysis.',
    },
    {
      imageKey: 'normal:shoulder-grashey',
      markers: [{ x: 62, y: 22, label: 'Coracoid process' }],
      title: 'Coracoid process',
      note: 'The anterior "hook" of the scapula, the anchor for the conjoint tendon and coracoclavicular ligaments. A useful landmark for grading AC injuries and the donor in a Latarjet (a coracoid bone-block stabilization for instability).',
    },
    {
      imageKey: 'normal:shoulder-y',
      markers: [],
      title: 'Get oriented — scapular Y',
      note: 'The Y is formed by three scapular limbs: coracoid (anterior), acromion (posterior), and the scapular body (inferior). On a normal film the humeral head sits centered over the glenoid at the convergence of the Y. Anterior head = anterior dislocation; posterior = posterior.',
    },
    {
      imageKey: 'normal:shoulder-y',
      markers: [{ x: 32, y: 22, label: 'Coracoid (anterior limb)' }],
      title: 'Coracoid — anterior limb',
      note: 'The anterior arm of the Y points forward. If the humeral head drifts toward the coracoid, suspect an anterior dislocation.',
    },
    {
      imageKey: 'normal:shoulder-y',
      markers: [{ x: 60, y: 14, label: 'Acromion (posterior limb)' }],
      title: 'Acromion — posterior limb',
      note: 'The posterior arm of the Y. A head sitting under the acromion (posteriorly) is a posterior dislocation — the easily-missed one.',
    },
    {
      imageKey: 'normal:shoulder-y',
      markers: [{ x: 48, y: 35, label: 'Humeral head over glenoid' }],
      title: 'Humeral head over the glenoid',
      note: 'Normal: the head is centered over the convergence of the Y (the glenoid). This is the single most useful check on the Y view for dislocation.',
    },
  ],
  check: [
    {
      id: 'sh-ck-head',
      imageKey: 'normal:shoulder-grashey',
      marker: { x: 47, y: 28 },
      prompt: WHAT,
      options: ['Humeral head', 'Glenoid', 'Acromion', 'Coracoid process'],
      answer: 0,
      explanation: 'The rounded proximal humerus with smooth cortex — the humeral head.',
    },
    {
      id: 'sh-ck-gt',
      imageKey: 'normal:shoulder-grashey',
      marker: { x: 29, y: 31 },
      prompt: WHAT,
      options: ['Greater tuberosity', 'Lesser tuberosity', 'Coracoid process', 'Acromion'],
      answer: 0,
      explanation: 'The lateral prominence of the proximal humerus — the greater tuberosity, the supraspinatus footprint.',
    },
    {
      id: 'sh-ck-joint',
      imageKey: 'normal:shoulder-grashey',
      marker: { x: 65, y: 32 },
      prompt: WHAT,
      options: ['Glenohumeral joint space', 'AC joint', 'Subacromial space', 'Scapular notch'],
      answer: 0,
      explanation: 'The concentric lucency between head and glenoid — the glenohumeral joint space the Grashey is designed to profile.',
    },
    {
      id: 'sh-ck-acromion',
      imageKey: 'normal:shoulder-grashey',
      marker: { x: 33, y: 13 },
      prompt: WHAT,
      options: ['Acromion', 'Coracoid process', 'Distal clavicle', 'Greater tuberosity'],
      answer: 0,
      explanation: 'The flat lateral projection of the scapular spine forming the roof of the shoulder — the acromion.',
    },
    {
      id: 'sh-ck-coracoid',
      imageKey: 'normal:shoulder-grashey',
      marker: { x: 62, y: 22 },
      prompt: WHAT,
      options: ['Coracoid process', 'Acromion', 'Glenoid', 'Humeral head'],
      answer: 0,
      explanation: 'The anterior scapular hook — the coracoid process.',
    },
    {
      id: 'sh-ck-y-head',
      imageKey: 'normal:shoulder-y',
      marker: { x: 48, y: 35 },
      prompt: WHAT,
      options: ['Humeral head', 'Coracoid process', 'Acromion', 'Scapular body'],
      answer: 0,
      explanation: 'On the Y, the rounded humeral head should sit centered over the glenoid at the convergence of the limbs.',
    },
    {
      id: 'sh-ck-y-coracoid',
      imageKey: 'normal:shoulder-y',
      marker: { x: 32, y: 22 },
      prompt: WHAT,
      options: ['Coracoid (anterior limb)', 'Acromion (posterior limb)', 'Clavicle', 'Humeral head'],
      answer: 0,
      explanation: 'The anterior arm of the Y is the coracoid; the head drifting toward it indicates anterior dislocation.',
    },
  ],
};

// Shoulder is hand-authored above; the remaining regions are authored + verified
// by the trainer workflow and live in anatomyTrainerGenerated.ts.
export const moduleTrainers: Record<string, ModuleTrainerData> = {
  shoulder,
  ...generatedTrainers,
};

export function getTrainerForModule(moduleId: string): ModuleTrainerData | undefined {
  return moduleTrainers[moduleId];
}

export type TrainerKind = 'anatomy' | 'finding' | 'systematic';

export function trainerKind(moduleId: string): TrainerKind {
  if (moduleId === 'do-not-miss') return 'finding';
  if (moduleId === 'xray-foundations') return 'systematic';
  return 'anatomy';
}

export interface TrainerLabels {
  section: string;
  learnTab: string;
  learnIntro: string;
  testIntro: string;
}

// Most modules teach normal anatomy; do-not-miss teaches finding recognition and
// foundations teaches the systematic read, so the trainer's framing adapts.
export function trainerLabels(moduleId: string): TrainerLabels {
  switch (trainerKind(moduleId)) {
    case 'finding':
      return {
        section: "Spot the can't-miss findings",
        learnTab: 'Learn the findings',
        learnIntro:
          "Walk each can't-miss finding on a real abnormal film — what it is, why it's missed, and the next step.",
        testIntro: 'A marker lands on an abnormal film — name the finding. No labels this time.',
      };
    case 'systematic':
      return {
        section: 'The systematic read',
        learnTab: 'Learn the read',
        learnIntro:
          'Walk the systematic search pattern on real films — where you check each step, every time.',
        testIntro: "A marker lands on a film — name which read step you're performing there.",
      };
    default:
      return {
        section: 'Master the normal anatomy',
        learnTab: 'Learn the normal',
        learnIntro:
          'Walk each labeled structure on the normal film. Master normal first — pathology is just a deviation from what you see here.',
        testIntro: 'A marker lands on the film — name the structure. No labels this time.',
      };
  }
}
