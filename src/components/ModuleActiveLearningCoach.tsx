import { useEffect, useMemo, useState } from 'react';
import { Icon } from './ui/Icon';
import { modulePhases } from '../data/learningFlow';
import { useAuth } from '../context/AuthContext';
import {
  ids,
  logAuditEvent,
  saveConfidenceRating,
  saveQuizAttempt,
} from '../services/firestore';
import type { CaseScenario, ImagingView, ModuleContent, PathologyComparison } from '../types';

type PhaseId = (typeof modulePhases)[number]['id'];
type CoachConfidenceValue = 1 | 2 | 3 | 4 | 5;

interface ChallengeOption {
  id: string;
  text: string;
}

interface PhaseChallenge {
  eyebrow: string;
  title: string;
  question: string;
  options: ChallengeOption[];
  correctOptionId: string;
  explanation: string;
  coaching: string[];
  confidencePrompt: string;
  exitCriteria: string[];
}

interface ResearchPrompt {
  question: string;
  correct: ChallengeOption;
  distractors: ChallengeOption[];
  explanation: string;
  coaching: string[];
}

interface ResearchModulePrompts {
  views?: ResearchPrompt;
  normal?: ResearchPrompt;
  miss?: ResearchPrompt;
}

interface CoachState {
  answers: Record<string, string>;
  confidence: Record<string, CoachConfidenceValue>;
  mastered: Record<string, boolean>;
}

interface Props {
  module: ModuleContent;
  activePhaseId: string;
  onPhaseChange: (id: string) => void;
  className?: string;
}

const defaultState: CoachState = {
  answers: {},
  confidence: {},
  mastered: {},
};

const confidenceCalibrationDomains = [
  'View adequacy',
  'Normal anatomy landmarks',
  'Abnormality detection',
  'Escalation threshold',
  'Disposition decision',
];

const researchModulePrompts: Record<string, ResearchModulePrompts> = {
  shoulder: {
    views: {
      question: 'A traumatic shoulder series has only AP images. What view is missing before you can safely call the direction of dislocation?',
      correct: option('axillary-velpeau-y', 'Axillary, Velpeau, or an adequate scapular Y view'),
      distractors: [
        option('zanca-only', 'Zanca view only'),
        option('single-ap', 'No additional view if the AP looks symmetric'),
        option('chest', 'Portable chest x-ray'),
      ],
      explanation:
        'Posterior dislocation is a classic AP-only miss. Do not call shoulder alignment without a second plane that proves the glenohumeral relationship.',
      coaching: [
        'Core trauma series: AP, scapular Y, and axillary or Velpeau.',
        'Zanca is for AC-joint detail, not dislocation direction.',
        'Document neurovascular status when instability or dislocation is suspected.',
      ],
    },
    normal: {
      question: 'Which normal relationship should you confirm before hunting for tuberosity fractures?',
      correct: option('glenohumeral-congruity', 'Glenohumeral congruity and humeral head centering on the glenoid'),
      distractors: [
        option('ac-only', 'AC joint width only'),
        option('calcification-only', 'Whether calcific tendinopathy is present'),
        option('clavicle-only', 'Distal clavicle contour only'),
      ],
      explanation:
        'Alignment comes early. A centered humeral head and congruent glenohumeral joint protect against missing posterior or anterior dislocation.',
      coaching: [
        'Name the view first.',
        'Check glenohumeral and AC alignment.',
        'Then trace the humeral head, glenoid rim, tuberosities, acromion, coracoid, and clavicle.',
      ],
    },
    miss: {
      question: 'The AP shoulder has a rounded “light-bulb” humeral head. What is the dangerous miss?',
      correct: option('posterior-dislocation', 'Posterior shoulder dislocation until proven otherwise'),
      distractors: [
        option('normal-ir', 'Normal internal rotation with no further views needed'),
        option('calcific', 'Calcific tendinopathy'),
        option('ac-separation', 'Isolated low-grade AC separation'),
      ],
      explanation:
        'The light-bulb sign can be subtle. The safer habit is to obtain an axillary, Velpeau, or adequate Y view before excluding posterior dislocation.',
      coaching: [
        'AP-only shoulder trauma is not enough.',
        'Locked internal rotation should raise suspicion.',
        'Escalate urgently for reduction/referral when dislocation is confirmed.',
      ],
    },
  },
  elbow: {
    views: {
      question: 'Which starting elbow views should you expect before interpreting trauma or acute pain?',
      correct: option('ap-lateral', 'AP and true lateral elbow radiographs'),
      distractors: [
        option('ap-only', 'AP only'),
        option('oblique-only', 'Oblique views only'),
        option('comparison-first', 'Contralateral comparison before orthogonal views'),
      ],
      explanation:
        'AP and lateral are the starting point. Obliques can add radial head, coronoid, or fracture-detail information.',
      coaching: [
        'Use the lateral for fat pads and anterior humeral line.',
        'Use AP for radiocapitellar and ulnohumeral alignment.',
        'Comparison views can help selected pediatric/throwing-athlete questions.',
      ],
    },
    normal: {
      question: 'Which two alignment lines should become automatic on every elbow film?',
      correct: option('elbow-lines', 'Anterior humeral line and radiocapitellar line'),
      distractors: [
        option('gilula', 'Gilula arcs and scapholunate interval'),
        option('shenton', 'Shenton line and iliopectineal line'),
        option('mortise', 'Medial clear space and talar dome line'),
      ],
      explanation:
        'The anterior humeral line and radiocapitellar line catch subtle pediatric distal humerus injury and radial head/capitellar malalignment.',
      coaching: [
        'Anterior humeral line should bisect the capitellum on lateral.',
        'Radiocapitellar line should intersect the capitellum on every view.',
        'Know ossification centers so variants do not masquerade as fragments.',
      ],
    },
    miss: {
      question: 'There is a posterior fat pad but no visible fracture line. What should you assume?',
      correct: option('occult-fracture', 'Occult intra-articular fracture until proven otherwise'),
      distractors: [
        option('normal', 'Normal elbow variant'),
        option('tendonitis', 'Tendinopathy only'),
        option('ignore', 'No injury if cortex is intact'),
      ],
      explanation:
        'A posterior fat pad is abnormal. In adults think radial head/neck fracture; in children think occult supracondylar or other fracture.',
      coaching: [
        'Treat fat-pad signs as evidence.',
        'Immobilize and arrange follow-up or additional imaging when clinically needed.',
        'Do not over-trust a “no fracture line” read.',
      ],
    },
  },
  'wrist-hand': {
    views: {
      question: 'A FOOSH patient has snuffbox tenderness and normal PA/lateral/oblique wrist films. What additional imaging path is most appropriate?',
      correct: option('scaphoid-path', 'Scaphoid views and/or thumb spica with repeat films or MRI'),
      distractors: [
        option('reassure', 'Reassure because initial x-rays are normal'),
        option('elbow', 'Elbow obliques'),
        option('no-immobilization', 'No immobilization unless a fracture line is seen'),
      ],
      explanation:
        'Scaphoid fractures can be occult early. The management-safe pathway is immobilization plus dedicated/repeat imaging or MRI when needed.',
      coaching: [
        'Standard wrist trauma series is PA, lateral, and oblique.',
        'Add scaphoid views for suspected scaphoid injury.',
        'Use stress/clenched-fist views when scapholunate instability is suspected.',
      ],
    },
    normal: {
      question: 'Which carpal alignment checks should be automatic on wrist radiographs?',
      correct: option('gilula-lateral', 'Gilula arcs on PA and radius-lunate-capitate alignment on lateral'),
      distractors: [
        option('ah-line', 'Anterior humeral line and radiocapitellar line'),
        option('klein', "Klein's line and Shenton line"),
        option('merchant', 'Merchant view tilt and patellar height'),
      ],
      explanation:
        'Perilunate injuries and scapholunate instability are missed when the reader focuses only on the obvious distal radius or metacarpal injury.',
      coaching: [
        'Trace Gilula arcs before leaving the PA view.',
        'On lateral, radius, lunate, and capitate should stack.',
        'Scapholunate interval widening is a ligament injury clue.',
      ],
    },
    miss: {
      question: 'The capitate no longer stacks on the lunate on the lateral wrist view. What is the dangerous diagnosis?',
      correct: option('perilunate', 'Perilunate or lunate dislocation'),
      distractors: [
        option('tfcc', 'TFCC sprain only'),
        option('boxer', 'Metacarpal neck fracture'),
        option('normal', 'Normal lateral wrist alignment'),
      ],
      explanation:
        'Perilunate/lunate dislocations are high-morbidity misses and need urgent reduction and hand surgery involvement.',
      coaching: [
        'Do not stop at the obvious fracture.',
        'Always check carpal alignment lines.',
        'Escalate same day when perilunate/lunate injury is suspected.',
      ],
    },
  },
  'pelvis-hip': {
    views: {
      question: 'Acute hip fracture is suspected. Which lateral view choice is safer?',
      correct: option('cross-table', 'AP pelvis plus cross-table lateral of the hip'),
      distractors: [
        option('frog-leg', 'Frog-leg lateral of the painful hip'),
        option('ap-only', 'AP pelvis only'),
        option('dunn-only', 'Dunn view only'),
      ],
      explanation:
        'Avoid frog-leg positioning when acute fracture is suspected because it can worsen pain or displace a nondisplaced fracture.',
      coaching: [
        'Non-fracture hip pain: AP pelvis plus frog-leg lateral.',
        'Suspected acute fracture: AP pelvis plus cross-table lateral.',
        'SCFE imaging depends on stable versus unstable presentation.',
      ],
    },
    normal: {
      question: 'Which pelvic landmarks help you decide whether the hip is normally aligned and covered?',
      correct: option('pelvic-lines', "Shenton's line, femoral head coverage, acetabular lines, and proximal femoral contour"),
      distractors: [
        option('fat-pad', 'Posterior fat pad only'),
        option('gilula', 'Gilula arcs only'),
        option('mortise', 'Medial clear space only'),
      ],
      explanation:
        'Hip/pelvis confidence comes from checking pelvic ring symmetry, femoral head coverage, Shenton’s line, acetabular landmarks, and femoral neck-head contour.',
      coaching: [
        'Knee pain in adolescents can be hip pathology.',
        'Negative x-rays do not exclude femoral neck stress fracture.',
        'Dunn/false-profile views can matter for hip preservation questions.',
      ],
    },
    miss: {
      question: 'An adolescent has hip, groin, thigh, or knee pain. What x-ray diagnosis must stay near the top?',
      correct: option('scfe', 'SCFE'),
      distractors: [
        option('transient', 'Transient synovitis as the only concern'),
        option('apophysitis-only', 'Benign apophysitis only'),
        option('oa', 'Primary hip osteoarthritis'),
      ],
      explanation:
        'SCFE can present with knee pain and subtle AP findings. Use Klein/Trethowan thinking and choose the lateral view safely.',
      coaching: [
        'Stable SCFE: bilateral AP and frog-leg lateral hips.',
        'Unstable SCFE: AP plus cross-table lateral of the involved side.',
        'Urgent orthopedic referral is the management implication.',
      ],
    },
  },
  knee: {
    views: {
      question: 'Acute patellar dislocation is suspected. Which view should you add to AP and lateral?',
      correct: option('merchant', 'Sunrise/Merchant patellofemoral view'),
      distractors: [
        option('ap-only', 'AP only'),
        option('pelvis', 'AP pelvis'),
        option('oblique-hand', 'Hand oblique view'),
      ],
      explanation:
        'Patellofemoral instability and patellar fracture are undercalled when skyline/Merchant-type views are omitted.',
      coaching: [
        'Ottawa-positive trauma: at least AP and lateral.',
        'Patellar concern: add Merchant/sunrise.',
        'Chronic OA concern: standing weightbearing films are more useful.',
      ],
    },
    normal: {
      question: 'On the lateral knee, what subtle soft-tissue sign can imply intra-articular fracture?',
      correct: option('lipohemarthrosis', 'Effusion or fat-fluid level/lipohemarthrosis'),
      distractors: [
        option('gilula', 'Gilula arc disruption'),
        option('lightbulb', 'Light-bulb sign'),
        option('klein', "Klein's line abnormality"),
      ],
      explanation:
        'The lateral view can reveal effusion or lipohemarthrosis even when the fracture line is subtle.',
      coaching: [
        'Inspect femorotibial alignment and tibial plateau contours.',
        'Check tibial spines and proximal fibula.',
        'Use the lateral to look for effusion/lipohemarthrosis.',
      ],
    },
    miss: {
      question: 'A tiny lateral proximal tibial avulsion after pivot injury should make you think of what?',
      correct: option('segond-acl', 'Segond fracture with associated ACL injury risk'),
      distractors: [
        option('benign', 'Incidental benign ossicle'),
        option('oa', 'Isolated osteoarthritis'),
        option('osgood', 'Osgood-Schlatter disease'),
      ],
      explanation:
        'A Segond fracture is small but not trivial. It is a major clue to ACL injury and internal derangement.',
      coaching: [
        'Small avulsion fragments can carry big implications.',
        'Tibial plateau injury can be subtle.',
        'MRI or urgent referral depends on instability, plateau concern, and exam.',
      ],
    },
  },
  'ankle-foot': {
    views: {
      question: 'Suspected Lisfranc injury has normal non-weightbearing foot films. What view/path is most useful next when tolerated?',
      correct: option('weightbearing', 'Weightbearing foot radiographs, with CT or MRI if equivocal'),
      distractors: [
        option('reassure', 'Reassure because non-weightbearing films are normal'),
        option('ankle-only', 'Repeat ankle AP only'),
        option('no-follow', 'No additional imaging unless deformity is obvious'),
      ],
      explanation:
        'Lisfranc instability is a classic miss when non-weightbearing films are treated as definitive.',
      coaching: [
        'Ankle trauma series: AP, lateral, and mortise.',
        'Foot trauma series: AP, lateral, and oblique.',
        'Midfoot instability often needs weightbearing views when tolerated.',
      ],
    },
    normal: {
      question: 'Which alignment targets belong in the normal ankle/foot read?',
      correct: option('mortise-lisfranc', 'Mortise congruity, medial clear space, talar dome, fifth metatarsal base, and Lisfranc lines'),
      distractors: [
        option('ah-line', 'Anterior humeral line and capitellum only'),
        option('glenoid', 'Glenoid rim and coracoid only'),
        option('scfe', "Klein's line only"),
      ],
      explanation:
        'Normal ankle/foot confidence depends on the mortise, talar dome, proximal fifth metatarsal, navicular, and tarsometatarsal alignment.',
      coaching: [
        'Apply Ottawa rules before ordering.',
        'Read the mortise carefully for syndesmotic/deltoid injury.',
        'Persistent pain despite negative films has a repeat/advanced imaging pathway.',
      ],
    },
    miss: {
      question: 'Plantar ecchymosis and difficulty weightbearing after midfoot injury should trigger concern for what?',
      correct: option('lisfranc', 'Lisfranc injury'),
      distractors: [
        option('simple-sprain', 'Simple ankle sprain only'),
        option('sever', 'Sever disease'),
        option('tfcc', 'TFCC injury'),
      ],
      explanation:
        'Lisfranc injuries can be radiographically subtle and clinically important. Weightbearing films, CT, or MRI may be needed.',
      coaching: [
        'Do not over-trust normal non-weightbearing films.',
        'Check tarsometatarsal alignment.',
        'Escalate if pain is disproportionate or weightbearing is difficult.',
      ],
    },
  },
  spine: {
    views: {
      question: 'Adult acute low back pain has no red flags. What is often the right imaging decision?',
      correct: option('no-imaging', 'No routine initial imaging'),
      distractors: [
        option('xray-all', 'Immediate lumbar x-rays for every episode'),
        option('mri-all', 'Immediate MRI for every episode'),
        option('ct-all', 'Immediate CT before exam'),
      ],
      explanation:
        'For adults without red flags, routine initial imaging is generally not indicated. The key skill is knowing when imaging is not helpful.',
      coaching: [
        'Red flags change the pathway.',
        'Adolescent spondylolysis starts with AP/lateral radiographs.',
        'MRI follows when active stress injury or neurologic pathology matters.',
      ],
    },
    normal: {
      question: 'Which normal spine targets should be checked before calling a film reassuring?',
      correct: option('alignment-height', 'Alignment, vertebral body height, disc spaces, posterior elements, and pars region'),
      distractors: [
        option('mortise', 'Mortise congruity and talar dome only'),
        option('gilula', 'Gilula arcs only'),
        option('fat-pad', 'Posterior fat pad only'),
      ],
      explanation:
        'Spine radiograph interpretation starts with alignment, body height, disc space, posterior elements, pars, and deformity patterns.',
      coaching: [
        'For scoliosis, complete-spine radiography is the standard initial exam.',
        'For suspected pars injury, AP and lateral are the starting point.',
        'Plain films do not assess cord or disc pathology well.',
      ],
    },
    miss: {
      question: 'Which finding changes disposition even if plain radiographs are not dramatic?',
      correct: option('red-flags', 'Progressive neurologic deficit, urinary retention, cancer/infection concern, or significant trauma'),
      distractors: [
        option('soreness', 'Mild soreness after exercise with normal exam'),
        option('no-red', 'No red flags and improving symptoms'),
        option('stable', 'Stable chronic mechanical pain only'),
      ],
      explanation:
        'Spinal red flags are disposition problems, not plain-film trivia. They warrant prompt advanced imaging or urgent evaluation.',
      coaching: [
        'Adult red flags include progressive motor/sensory loss, urinary retention, cancer, infection/procedure, and significant trauma.',
        'Pediatric red flags include age under five, symptoms over four weeks, night pain, systemic symptoms, bowel/bladder dysfunction, or neurologic findings.',
        'Do not let a normal x-ray overrule a dangerous clinical story.',
      ],
    },
  },
  'pediatric-adolescent': {
    views: {
      question: 'A limping child has hip/groin/thigh/knee pain. What is the safest radiographic mindset?',
      correct: option('hip-source', 'Image and read the hip deliberately, because hip disease can present as knee pain'),
      distractors: [
        option('knee-only', 'Only image the knee if knee pain is reported'),
        option('ignore-hip', 'Avoid hip films unless hip pain is volunteered'),
        option('adult-rules', 'Apply adult-only imaging rules without adjustment'),
      ],
      explanation:
        'Pediatric/adolescent hip disease, including SCFE, can present as thigh or knee pain. The hip must stay in the differential.',
      coaching: [
        'Use orthogonal views of the area of concern.',
        'Stable SCFE can use bilateral AP and frog-leg lateral.',
        'Unstable/acute SCFE needs a safer true lateral/cross-table strategy.',
      ],
    },
    normal: {
      question: 'What normal pediatric finding most commonly mimics fracture for trainees?',
      correct: option('growth-centers', 'Open physes, ossification centers, and unfused apophyses'),
      distractors: [
        option('oa', 'Primary osteoarthritis'),
        option('rotator-cuff', 'Chronic rotator cuff arthropathy'),
        option('bunion', 'Hallux valgus only'),
      ],
      explanation:
        'Pediatric normal variants are a core learning target. Learners need many normal examples, not only pathology.',
      coaching: [
        'Smooth corticated margins support normal variant/apophysis.',
        'Acute avulsion fragments are often sharper and clinically focal.',
        'Comparison views can help selected pediatric uncertainty.',
      ],
    },
    miss: {
      question: 'Which limping-child diagnosis is an orthopedic emergency?',
      correct: option('septic-arthritis', 'Septic arthritis'),
      distractors: [
        option('osgood', 'Osgood-Schlatter disease'),
        option('sever', 'Sever disease'),
        option('accessory', 'Accessory ossicle'),
      ],
      explanation:
        'Septic arthritis is a do-not-miss emergency. Early Perthes, stress fracture, osteomyelitis, and toddler fracture can also look normal initially.',
      coaching: [
        'Negative x-ray does not always reassure in the limping child.',
        'Systemic symptoms, night pain, neurologic signs, and refusal to bear weight matter.',
        'Escalate when the clinical story is dangerous.',
      ],
    },
  },
};

export function ModuleActiveLearningCoach({
  module,
  activePhaseId,
  onPhaseChange,
  className = '',
}: Props) {
  const { user, learnerPreview } = useAuth();
  const phaseId = normalizePhaseId(activePhaseId);
  const phaseIndex = modulePhases.findIndex((phase) => phase.id === phaseId);
  const nextPhase = modulePhases[phaseIndex + 1];
  const challenge = useMemo(() => buildChallenge(module, phaseId), [module, phaseId]);
  const [state, setState] = useState<CoachState>(() => readCoachState(module.id));
  const [saving, setSaving] = useState(false);
  const selectedOptionId = state.answers[phaseId];
  const selectedConfidence = state.confidence[phaseId];
  const mastered = Boolean(state.mastered[phaseId]);
  const answered = selectedOptionId !== undefined;
  const correct = selectedOptionId === challenge.correctOptionId;

  useEffect(() => {
    setState(readCoachState(module.id));
    setSaving(false);
  }, [module.id]);

  function persist(next: CoachState) {
    try {
      localStorage.setItem(`sxra:module-coach:${module.id}`, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  function updateState(updater: (prev: CoachState) => CoachState) {
    setState((prev) => {
      const next = updater(prev);
      persist(next);
      return next;
    });
  }

  function answer(optionId: string) {
    updateState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [phaseId]: optionId },
      mastered: { ...prev.mastered, [phaseId]: false },
    }));
  }

  function setConfidence(value: CoachConfidenceValue) {
    updateState((prev) => ({
      ...prev,
      confidence: { ...prev.confidence, [phaseId]: value },
      mastered: { ...prev.mastered, [phaseId]: false },
    }));
  }

  async function markMastered() {
    if (!selectedOptionId || selectedConfidence === undefined) return;
    setSaving(true);
    updateState((prev) => ({
      ...prev,
      mastered: { ...prev.mastered, [phaseId]: true },
    }));
    if (user && !learnerPreview) {
      const now = Date.now();
      await saveQuizAttempt({
        id: ids.newId(),
        userId: user.uid,
        scope: 'module-coach',
        moduleId: module.id,
        startedAt: now,
        submittedAt: now,
        answers: [
          {
            questionId: `${module.id}:${phaseId}:coach`,
            selectedOptionId,
            correct,
          },
        ],
        scorePercent: correct ? 100 : 0,
      });
      await saveConfidenceRating({
        id: ids.newId(),
        userId: user.uid,
        scope: 'module-coach',
        moduleId: module.id,
        domain: phaseId,
        value: selectedConfidence,
        createdAt: now,
      });
      await logAuditEvent({
        userId: user.uid,
        type: 'active_learning_completed',
        moduleId: module.id,
        refId: phaseId,
        details: {
          phaseId,
          correct,
          confidence: selectedConfidence,
        },
      });
    }
    setSaving(false);
  }

  return (
    <section
      className={[
        'rounded-2xl border border-ucla-100 bg-white p-4 shadow-card sm:p-5',
        className,
      ].join(' ')}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
            Active learning coach
          </div>
          <h2 className="mt-1 text-lg text-ucla-900">{challenge.title}</h2>
          <p className="mt-1 max-w-prose text-sm leading-relaxed text-slate-600">
            Answer first, then use the coaching to calibrate what you know.
          </p>
        </div>
        <span
          className={[
            'pill',
            mastered
              ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
              : answered
                ? 'border-ucla-100 bg-ucla-50 text-ucla-800'
                : 'border-slate-200 bg-slate-50 text-slate-600',
          ].join(' ')}
        >
          <Icon name={mastered ? 'check-circle' : answered ? 'sparkles' : 'circle'} size={14} />
          {mastered ? 'Phase mastered' : answered ? 'Committed' : 'Commit first'}
        </span>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ucla-900">
            <Icon name="lightning" size={16} className="text-ucla-700" />
            {challenge.eyebrow}
          </div>
          <p className="mt-3 text-base font-semibold leading-snug text-slate-950">
            {challenge.question}
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {challenge.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isCorrectOption = option.id === challenge.correctOptionId;
              const revealCorrect = answered && isCorrectOption;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => answer(option.id)}
                  className={[
                    'flex min-h-[4rem] items-start gap-2.5 rounded-2xl border p-3 text-left text-sm font-semibold leading-snug transition-colors',
                    revealCorrect
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : isSelected
                        ? 'border-amber-200 bg-amber-50 text-amber-950'
                        : 'border-white bg-white text-slate-700 shadow-soft hover:border-ucla-200 hover:bg-ucla-50',
                  ].join(' ')}
                  aria-pressed={isSelected}
                >
                  <span
                    className={[
                      'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                      revealCorrect
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : isSelected
                          ? 'border-amber-600 bg-amber-600 text-white'
                          : 'border-slate-300 bg-white text-transparent',
                    ].join(' ')}
                  >
                    <Icon name={revealCorrect ? 'check' : isSelected ? 'alert' : 'check'} size={12} />
                  </span>
                  <span>{option.text}</span>
                </button>
              );
            })}
          </div>

          {answered && (
            <div
              className={[
                'mt-4 rounded-2xl border p-3',
                correct ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50',
              ].join(' ')}
            >
              <div
                className={[
                  'flex items-center gap-2 text-sm font-semibold',
                  correct ? 'text-emerald-900' : 'text-amber-950',
                ].join(' ')}
              >
                <Icon name={correct ? 'check-circle' : 'alert'} size={16} />
                {correct ? 'Good clinical read' : 'Re-calibrate before moving on'}
              </div>
              <p
                className={[
                  'mt-1 text-sm leading-relaxed',
                  correct ? 'text-emerald-900' : 'text-amber-950',
                ].join(' ')}
              >
                {challenge.explanation}
              </p>
            </div>
          )}
        </div>

        <aside className="rounded-2xl border border-ucla-100 bg-gradient-to-br from-ucla-50 via-white to-sky-50 p-4">
          <div className="text-sm font-semibold text-ucla-900">Phase exit check</div>
          <ul className="mt-3 space-y-2">
            {challenge.exitCriteria.map((criterion) => (
              <li key={criterion} className="flex items-start gap-2 text-sm text-slate-700">
                <Icon name="check" size={14} className="mt-0.5 text-ucla-700" />
                <span>{criterion}</span>
              </li>
            ))}
          </ul>

          {answered && (
            <div className="mt-4 rounded-2xl border border-white bg-white/85 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
                Coaching
              </div>
              <ul className="mt-2 space-y-1.5">
                {challenge.coaching.map((line) => (
                  <li key={line} className="text-sm leading-relaxed text-slate-700">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <div className="label">{challenge.confidencePrompt}</div>
            <div className="mt-2 grid grid-cols-5 gap-1.5">
              {([1, 2, 3, 4, 5] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setConfidence(value)}
                  className={[
                    'h-9 rounded-xl border text-sm font-bold transition-colors',
                    selectedConfidence === value
                      ? 'border-ucla-700 bg-ucla-700 text-white'
                      : 'border-ucla-100 bg-white text-ucla-800 hover:bg-ucla-50',
                  ].join(' ')}
                  aria-pressed={selectedConfidence === value}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white bg-white/85 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
              Calibrate against
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {confidenceCalibrationDomains.map((domain) => (
                <span
                  key={domain}
                  className="rounded-full border border-ucla-100 bg-ucla-50 px-2 py-1 text-[11px] font-semibold text-ucla-800"
                >
                  {domain}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-primary"
              onClick={() => void markMastered()}
              disabled={!answered || selectedConfidence === undefined || saving}
            >
              <Icon name="check-circle" size={14} />
              {saving ? 'Saving…' : 'Mark phase ready'}
            </button>
            {nextPhase && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => onPhaseChange(nextPhase.id)}
              >
                Next: {nextPhase.label}
                <Icon name="chevron-right" size={14} />
              </button>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

function normalizePhaseId(activePhaseId: string): PhaseId {
  const phase = modulePhases.find((candidate) => candidate.id === activePhaseId);
  return phase?.id ?? 'learn';
}

function readCoachState(moduleId: string): CoachState {
  try {
    const raw = localStorage.getItem(`sxra:module-coach:${moduleId}`);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<CoachState>;
    return {
      answers: parsed.answers ?? {},
      confidence: parsed.confidence ?? {},
      mastered: parsed.mastered ?? {},
    };
  } catch {
    return defaultState;
  }
}

function buildChallenge(module: ModuleContent, phaseId: PhaseId): PhaseChallenge {
  if (phaseId === 'views') return buildViewChallenge(module);
  if (phaseId === 'images') return buildImageChallenge(module);
  if (phaseId === 'practice') return buildPracticeChallenge(module);
  if (phaseId === 'quiz') return buildQuizReadinessChallenge(module);
  if (phaseId === 'takeaways') return buildTakeawaysChallenge(module);
  return buildLearnChallenge(module);
}

function buildLearnChallenge(module: ModuleContent): PhaseChallenge {
  return {
    eyebrow: 'Orientation commitment',
    title: `Make ${module.shortTitle} active from the start`,
    question: `Before leaving ${module.shortTitle}, what should you be able to do?`,
    options: [
      option('framework', 'Use a normal-first Systematic X-Ray Read and decide what needs escalation.'),
      option('memorize', 'Memorize pathology names without practicing the read sequence.'),
      option('skip-normal', 'Skip normal anatomy and focus only on obvious fractures.'),
      option('mri-default', 'Recommend advanced imaging before making an x-ray impression.'),
    ],
    correctOptionId: 'framework',
    explanation:
      'The goal is a repeatable read pattern: know normal, identify the key abnormal clue, and decide the safest next step.',
    coaching: takeOrFallback(module.overview, [
      'Start with normal anatomy before pathology.',
      'Use the same read sequence every time.',
    ]),
    confidencePrompt: 'How ready are you to start this module?',
    exitCriteria: [
      'I know why this module matters clinically.',
      'I can name the module emphasis areas.',
      'I know what findings should trigger escalation.',
    ],
  };
}

function buildViewChallenge(module: ModuleContent): PhaseChallenge {
  const researchPrompt = researchModulePrompts[module.id]?.views;
  if (researchPrompt) {
    return researchPromptChallenge({
      prompt: researchPrompt,
      eyebrow: 'View selection challenge',
      title: 'Order the view with intent',
      confidencePrompt: 'How confident are you choosing adequate views?',
      exitCriteria: [
        'I can connect each view to a clinical reason.',
        'I know when additional views matter.',
        'I can say when the series is not enough.',
      ],
    });
  }

  const target = module.views[0];
  if (!target) {
    return {
      eyebrow: 'View selection',
      title: 'Choose views from the clinical question',
      question: 'What is the best habit before interpreting a musculoskeletal x-ray?',
      options: [
        option('confirm-views', 'Confirm the views are adequate for the clinical question.'),
        option('single-view', 'Trust one view if the finding looks obvious.'),
        option('skip-view', 'Ignore view adequacy and start with the impression.'),
        option('mri', 'Assume MRI is required before reading the x-ray.'),
      ],
      correctOptionId: 'confirm-views',
      explanation:
        'View selection controls what you can safely see. Inadequate views can hide instability, subtle fracture, and joint-space disease.',
      coaching: module.systematicNotes.slice(0, 3),
      confidencePrompt: 'How confident are you choosing views?',
      exitCriteria: [
        'I can connect each view to a clinical reason.',
        'I know when extra or weightbearing views matter.',
        'I can say when the series is not enough.',
      ],
    };
  }

  const options = makeViewOptions(module.views, target);
  return {
    eyebrow: 'View selection challenge',
    title: 'Order the view with intent',
    question: `Which view best fits this reason: ${target.whenToOrder}`,
    options,
    correctOptionId: idFor(target.name),
    explanation: target.why,
    coaching: module.views.slice(0, 3).map((view) => `${view.name}: ${view.why}`),
    confidencePrompt: 'How confident are you choosing views?',
    exitCriteria: [
      'I can name the standard views.',
      'I can explain what each view adds.',
      'I can recognize when the ordered views are inadequate.',
    ],
  };
}

function buildImageChallenge(module: ModuleContent): PhaseChallenge {
  const researchPrompt = researchModulePrompts[module.id]?.normal;
  if (researchPrompt) {
    return researchPromptChallenge({
      prompt: researchPrompt,
      eyebrow: 'Normal-first challenge',
      title: 'Anchor normal before abnormal',
      confidencePrompt: 'How confident are you recognizing normal landmarks?',
      exitCriteria: [
        'I can identify the normal landmarks.',
        'I can compare normal against common pathology.',
        'I can name the clue that changes management.',
      ],
    });
  }

  const pathology = module.pathology[0];
  if (pathology) return pathologyChallenge(module, pathology);

  const landmark = module.anatomy[0];
  return {
    eyebrow: 'Normal-first challenge',
    title: 'Anchor normal before abnormal',
    question: 'Which item belongs on the normal-first checklist for this module?',
    options: [
      option('landmark', landmark?.label ?? 'Expected alignment, cortex, joint space, and soft tissues'),
      option('diagnosis', 'The final diagnosis before the read sequence'),
      option('mri', 'The MRI protocol before x-ray review'),
      option('rare', 'Rare pathology names before common normal anatomy'),
    ],
    correctOptionId: 'landmark',
    explanation:
      landmark?.description ??
      'A confident x-ray read starts by recognizing expected normal anatomy, then comparing subtle abnormalities against that anchor.',
    coaching: takeOrFallback(
      module.anatomy.map((item) => `${item.label}: ${item.description}`),
      ['Read normal anatomy before pathology.', 'Use landmarks to avoid missing subtle malalignment.'],
    ),
    confidencePrompt: 'How confident are you recognizing normal?',
    exitCriteria: [
      'I can identify the normal landmarks.',
      'I can compare normal against common pathology.',
      'I can name the clue that changes management.',
    ],
  };
}

function pathologyChallenge(
  module: ModuleContent,
  pathology: PathologyComparison,
): PhaseChallenge {
  return {
    eyebrow: 'Normal vs pathology',
    title: 'Spot the decisive clue',
    question: `What is the key clue for ${pathology.finding}?`,
    options: [
      option('key-clue', pathology.keyClue),
      option('pitfall', pathology.pitfall),
      option('normal', pathology.normal),
      option('next-step', pathology.nextStep),
    ],
    correctOptionId: 'key-clue',
    explanation: `Compare against normal: ${pathology.normal} Pathologic pattern: ${pathology.pathologic}`,
    coaching: takeOrFallback(
      module.pathology.slice(0, 3).map((item) => `${item.finding}: ${item.keyClue}`),
      module.systematicNotes,
    ),
    confidencePrompt: 'How confident are you distinguishing normal from pathology?',
    exitCriteria: [
      'I can identify normal anatomy first.',
      'I can name the key abnormal clue.',
      'I can avoid the common pitfall.',
    ],
  };
}

function buildPracticeChallenge(module: ModuleContent): PhaseChallenge {
  const researchPrompt = researchModulePrompts[module.id]?.miss;
  if (researchPrompt) {
    return researchPromptChallenge({
      prompt: researchPrompt,
      eyebrow: 'Do-not-miss drill',
      title: 'Commit to the dangerous implication',
      confidencePrompt: 'How confident are you choosing escalation or disposition?',
      exitCriteria: [
        'I can state the dangerous diagnosis.',
        'I can name the management implication.',
        'I can choose the next action today.',
      ],
    });
  }

  const scenario = module.cases[0];
  if (scenario) return caseChallenge(scenario);

  const doNotMiss = module.doNotMiss[0];
  return {
    eyebrow: 'Practice commitment',
    title: 'Make a management-safe read',
    question: doNotMiss
      ? `Why is ${doNotMiss.title} a do-not-miss finding?`
      : 'What should you commit to before looking at case feedback?',
    options: [
      option('safe-read', doNotMiss?.why ?? 'A diagnosis, key negative, confidence rating, and next step.'),
      option('wait', 'Wait for the explanation before making an impression.'),
      option('guess', 'Guess quickly without using the systematic read.'),
      option('ignore', 'Ignore next steps if the x-ray is abnormal.'),
    ],
    correctOptionId: 'safe-read',
    explanation:
      doNotMiss?.imagingNext ??
      'Case practice works best when the learner commits first, then compares their read to feedback.',
    coaching: takeOrFallback(
      module.doNotMiss.slice(0, 3).map((item) => `${item.title}: ${item.imagingNext}`),
      module.whenToEscalate,
    ),
    confidencePrompt: 'How confident are you applying this in cases?',
    exitCriteria: [
      'I can commit to an impression before feedback.',
      'I can explain the next step.',
      'I can identify do-not-miss patterns.',
    ],
  };
}

function caseChallenge(scenario: CaseScenario): PhaseChallenge {
  return {
    eyebrow: 'Case warm-up',
    title: 'Commit before the reveal',
    question: `${scenario.patientAge} ${scenario.sportOrActivity}: ${scenario.mechanism} Which impression is most likely?`,
    options: scenario.diagnosisOptions.map((item) => option(item.id, item.label)),
    correctOptionId: scenario.correctOptionId,
    explanation: scenario.explanation,
    coaching: [scenario.teachingPearl, `Next step: ${scenario.nextStep}`],
    confidencePrompt: 'How confident are you making a case impression?',
    exitCriteria: [
      'I can state the likely diagnosis.',
      'I can name the imaging clue.',
      'I can choose the next step.',
    ],
  };
}

function buildQuizReadinessChallenge(module: ModuleContent): PhaseChallenge {
  return {
    eyebrow: 'Quiz readiness',
    title: 'Test without the training wheels',
    question: `What should be true before you submit the ${module.shortTitle} module quiz?`,
    options: [
      option('ready', 'I can answer from the read pattern first, then use feedback to calibrate.'),
      option('peek', 'I should reveal explanations before choosing an answer.'),
      option('memory', 'I only need to remember one classic finding.'),
      option('skip', 'I can skip confidence because only score matters.'),
    ],
    correctOptionId: 'ready',
    explanation:
      'The quiz should measure whether the read pattern is usable. Commit to each answer before using feedback.',
    coaching: takeOrFallback(module.keyTakeaways, module.systematicNotes),
    confidencePrompt: 'How ready are you for the module quiz?',
    exitCriteria: [
      'I can answer without immediate coaching.',
      'I can explain why wrong choices are wrong.',
      'I can identify what to review if I miss a question.',
    ],
  };
}

function buildTakeawaysChallenge(module: ModuleContent): PhaseChallenge {
  return {
    eyebrow: 'Post-check loop',
    title: 'Close the learning loop',
    question: `What is the best final step for ${module.shortTitle}?`,
    options: [
      option('post-check', 'Complete the post-check and confidence rating, then review weak areas.'),
      option('leave', 'Leave after reading the takeaways without measuring confidence.'),
      option('only-score', 'Focus only on the score and ignore confidence calibration.'),
      option('restart', 'Restart the whole course instead of targeted review.'),
    ],
    correctOptionId: 'post-check',
    explanation:
      'The module is strongest when knowledge and confidence are both measured before and after learning.',
    coaching: takeOrFallback(module.keyTakeaways, module.whenToEscalate),
    confidencePrompt: 'How confident are you that you can read this x-ray type?',
    exitCriteria: [
      'I can summarize the key takeaways.',
      'I can complete the post-check.',
      'I know what to review next.',
    ],
  };
}

function makeViewOptions(views: ImagingView[], target: ImagingView): ChallengeOption[] {
  const viewOptions = views.slice(0, 4).map((view) => option(idFor(view.name), view.name));
  if (viewOptions.length >= 2) return ensureIncludesCorrect(viewOptions, option(idFor(target.name), target.name));
  return [
    option(idFor(target.name), target.name),
    option('single-ap', 'Single AP view only'),
    option('mri-first', 'MRI before x-ray review'),
    option('unrelated', 'Unrelated contralateral comparison only'),
  ];
}

function researchPromptChallenge({
  prompt,
  eyebrow,
  title,
  confidencePrompt,
  exitCriteria,
}: {
  prompt: ResearchPrompt;
  eyebrow: string;
  title: string;
  confidencePrompt: string;
  exitCriteria: string[];
}): PhaseChallenge {
  return {
    eyebrow,
    title,
    question: prompt.question,
    options: [prompt.correct, ...prompt.distractors].slice(0, 4),
    correctOptionId: prompt.correct.id,
    explanation: prompt.explanation,
    coaching: prompt.coaching,
    confidencePrompt,
    exitCriteria,
  };
}

function ensureIncludesCorrect(
  options: ChallengeOption[],
  correctOption: ChallengeOption,
): ChallengeOption[] {
  if (options.some((item) => item.id === correctOption.id)) return options;
  return [correctOption, ...options].slice(0, 4);
}

function takeOrFallback(items: string[], fallback: string[]) {
  const combined = items.length > 0 ? items : fallback;
  return combined.slice(0, 3);
}

function option(id: string, text: string): ChallengeOption {
  return { id, text };
}

function idFor(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
