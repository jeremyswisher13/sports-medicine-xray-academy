export type LearnerRole = 'resident' | 'fellow' | 'attending' | 'admin' | 'guest';

export type LearnerLevel = 'Resident' | 'Fellow' | 'Advanced Fellow';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: LearnerRole;
  createdAt: number;
  lastLogin: number;
  photoURL?: string;
}

export interface ModuleSummary {
  id: string;
  title: string;
  shortTitle: string;
  region: ModuleRegion;
  description: string;
  estimatedMinutes: number;
  status: 'full' | 'placeholder';
  emphasis: string[];
}

export type ModuleRegion =
  | 'Foundations'
  | 'Upper Extremity'
  | 'Lower Extremity'
  | 'Axial'
  | 'Pediatric'
  | 'High-Yield Cases';

export interface ImagingView {
  name: string;
  why: string;
  whenToOrder: string;
}

export interface AnatomyLandmark {
  label: string;
  description: string;
  pearl?: string;
}

export interface PathologyComparison {
  finding: string;
  normal: string;
  pathologic: string;
  keyClue: string;
  pitfall: string;
  nextStep: string;
}

export interface DoNotMissItem {
  title: string;
  why: string;
  imagingNext: string;
}

export interface ClinicalPearl {
  title: string;
  body: string;
}

export interface Pitfall {
  title: string;
  body: string;
}

export interface SystematicChecklistItem {
  step: 'Confirm' | 'Alignment' | 'Bone' | 'Cartilage' | 'Soft Tissues' | 'Impression';
  prompts: string[];
}

export interface CaseScenario {
  id: string;
  moduleId: string;
  title: string;
  patientAge: string;
  sportOrActivity: string;
  mechanism: string;
  symptoms: string;
  viewsObtained: string[];
  initialPrompt: string;
  diagnosisOptions: { id: string; label: string }[];
  correctOptionId: string;
  explanation: string;
  teachingPearl: string;
  nextStep: string;
  amssmVideoId?: string;
  imagePanels?: {
    view: 'AP' | 'Lateral' | 'Oblique' | 'Special' | 'Annotated' | 'Comparison';
    caption?: string;
    imageKey?: string;
  }[];
}

export interface QuizQuestionData {
  id: string;
  domain:
    | 'systematic'
    | 'views'
    | 'do-not-miss'
    | 'occult'
    | 'pediatric'
    | 'escalation'
    | 'shoulder'
    | 'elbow'
    | 'wrist-hand'
    | 'pelvis-hip'
    | 'knee'
    | 'ankle-foot'
    | 'spine'
    | 'foundations';
  prompt: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  whyOthersWrong?: Record<string, string>;
  moduleId?: string;
}

export interface ModuleContent extends ModuleSummary {
  overview: string[];
  views: ImagingView[];
  systematicNotes: string[];
  systematicChecklist: SystematicChecklistItem[];
  anatomy: AnatomyLandmark[];
  pathology: PathologyComparison[];
  doNotMiss: DoNotMissItem[];
  pitfalls: Pitfall[];
  pearls: ClinicalPearl[];
  cases: CaseScenario[];
  quiz: QuizQuestionData[];
  preCheck?: QuizQuestionData[];
  postCheck?: QuizQuestionData[];
  keyTakeaways: string[];
  whenToEscalate: string[];
  imageCaptions?: { view: 'AP' | 'Lateral' | 'Oblique' | 'Special' | 'Annotated' | 'Comparison'; caption: string }[];
}

export interface VideoResource {
  id: string;
  moduleId: string;
  title: string;
  source: string;
  youtubeId: string;
  learnerLevel: LearnerLevel;
  durationLabel?: string;
  summary: string;
  clinicalWhy: string;
  reflectionPrompt?: string;
}

export interface VideoProgress {
  userId: string;
  videoId: string;
  moduleId: string;
  title: string;
  source: string;
  watched: boolean;
  markedComplete: boolean;
  completedAt?: number;
  reflectionText?: string;
  createdAt: number;
  updatedAt: number;
}

export type QuizScope =
  | 'pre'
  | 'post'
  | 'module'
  | 'module-pre'
  | 'module-post'
  | 'video'
  | 'module-coach'
  | 'systematic-read'
  | 'atlas-practice';

export interface Flashcard {
  id: string;
  moduleId: string;
  front: string;
  back: string;
  pearl?: string;
  domain?: string;
}

export interface FlashcardReview {
  userId: string;
  cardId: string;
  moduleId: string;
  outcome: 'got-it' | 'review' | 'skip';
  reviewedAt: number;
}

export interface XRayImageEntry {
  id: string;
  src: string;
  alt: string;
  view: 'AP' | 'Lateral' | 'Oblique' | 'Special' | 'Annotated' | 'Comparison' | 'Diagram';
  caption?: string;
  source?: string;
  sourceUrl?: string;
  license?: string;
  attribution?: string;
  moduleId?: string;
  caseId?: string;
  isDiagram?: boolean;
  isNormal?: boolean;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  scope: QuizScope;
  moduleId?: string;
  startedAt: number;
  submittedAt?: number;
  answers: { questionId: string; selectedOptionId: string; correct: boolean }[];
  scorePercent: number;
}

export type ConfidenceScope =
  | 'pre'
  | 'post'
  | 'module'
  | 'module-pre'
  | 'module-post'
  | 'module-coach'
  | 'case';

export interface ConfidenceRating {
  id: string;
  userId: string;
  scope: ConfidenceScope;
  moduleId?: string;
  domain?: string;
  value: 1 | 2 | 3 | 4 | 5;
  createdAt: number;
}

export interface CaseAttempt {
  id: string;
  userId: string;
  caseId: string;
  moduleId: string;
  selectedOptionId: string;
  correct: boolean;
  checklistChecked: string[];
  freeTextNotes?: string;
  managementChoiceId?: string;
  confidence?: number;
  submittedAt: number;
}

export interface ModuleProgress {
  userId: string;
  moduleId: string;
  visited: boolean;
  completedTabs: string[];
  completed: boolean;
  completedAt?: number;
  lastViewedAt: number;
  preCheckAt?: number;
  postCheckAt?: number;
  preCheckScore?: number;
  postCheckScore?: number;
  preCheckConfidence?: number;
  postCheckConfidence?: number;
}

export type AuditEventType =
  | 'login'
  | 'logout'
  | 'module_viewed'
  | 'tab_viewed'
  | 'quiz_started'
  | 'quiz_submitted'
  | 'case_attempted'
  | 'module_completed'
  | 'confidence_submitted'
  | 'video_viewed'
  | 'video_completed'
  | 'reflection_submitted'
  | 'bookmark_added'
  | 'bookmark_removed'
  | 'active_learning_completed'
  | 'systematic_read_step_answered'
  | 'atlas_practice_answered'
  | 'flashcard_reviewed';

export interface AuditEvent {
  id: string;
  userId: string;
  type: AuditEventType;
  moduleId?: string;
  refId?: string;
  details?: Record<string, string | number | boolean>;
  createdAt: number;
}

export interface Bookmark {
  id: string;
  userId: string;
  type?: 'module' | 'tab' | 'case' | 'video' | 'image';
  moduleId: string;
  tabId?: string;
  caseId?: string;
  videoId?: string;
  imageId?: string;
  title?: string;
  note?: string;
  createdAt: number;
}
