import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const root = process.cwd();
const requireFromRoot = createRequire(path.join(root, 'package.json'));
const ts = requireFromRoot('typescript');
const cache = new Map();

function resolveLocal(fromFile, spec) {
  const base = path.resolve(path.dirname(fromFile), spec);
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  throw new Error(`Cannot resolve ${spec} from ${fromFile}`);
}

function loadTs(relOrAbs) {
  const abs = path.isAbsolute(relOrAbs) ? relOrAbs : path.join(root, relOrAbs);
  if (cache.has(abs)) return cache.get(abs).exports;

  const src = fs.readFileSync(abs, 'utf8');
  const module = { exports: {} };
  cache.set(abs, module);

  const out = ts.transpileModule(src, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      skipLibCheck: true,
    },
    fileName: abs,
  }).outputText;

  const localRequire = (spec) => {
    if (spec.startsWith('.')) return loadTs(resolveLocal(abs, spec));
    return requireFromRoot(spec);
  };

  vm.runInNewContext(
    out,
    {
      exports: module.exports,
      module,
      require: localRequire,
      console,
      URL,
      setTimeout,
      clearTimeout,
    },
    { filename: abs },
  );
  return module.exports;
}

function addIssue(issues, severity, area, id, message) {
  issues.push({ severity, area, id, message });
}

function assertUnique(issues, area, items, getId) {
  const seen = new Map();
  for (const item of items) {
    const id = getId(item);
    if (!id) {
      addIssue(issues, 'error', area, '(blank)', 'blank id');
      continue;
    }
    if (seen.has(id)) {
      addIssue(issues, 'error', area, id, `duplicate id also seen in ${seen.get(id)}`);
    } else {
      seen.set(id, item.moduleId ?? item.key ?? item.id ?? area);
    }
  }
}

function questionIssues(issues, area, q) {
  const optionIds = new Set((q.options ?? []).map((option) => option.id));
  if (!q.id) addIssue(issues, 'error', area, '(blank)', 'blank question id');
  if (!q.prompt || q.prompt.trim().length < 10) {
    addIssue(issues, 'warn', area, q.id, 'very short or blank prompt');
  }
  if (!q.explanation || q.explanation.trim().length < 10) {
    addIssue(issues, 'warn', area, q.id, 'very short or blank explanation');
  }
  if ((q.options ?? []).length < 2) addIssue(issues, 'error', area, q.id, 'fewer than 2 options');
  if (!optionIds.has(q.correctOptionId)) {
    addIssue(issues, 'error', area, q.id, `correctOptionId ${q.correctOptionId} not in options`);
  }
}

const clinicalTextPatterns = [
  {
    severity: 'error',
    pattern: /\b(?:normal|negative)\s+(?:x-?rays?|radiographs?|films?)\s+(?:rules?\s+out|excludes?)\b/i,
    message: 'unsafe absolute negative-radiograph phrasing',
  },
  {
    severity: 'error',
    pattern: /\b(?:x-?rays?|radiographs?|films?)\s+(?:rules?\s+out|excludes?)\s+(?:fracture|injury|scfe|dislocation|physeal|stress)/i,
    message: 'radiographs should not be framed as excluding high-risk injury',
  },
  {
    severity: 'warn',
    pattern: /\bno\s+(?:advanced imaging|follow-?up|immobilization|referral|further imaging)\s+(?:is\s+)?(?:needed|required)\b/i,
    message: 'absolute no-further-care language needs clinical review',
  },
  {
    severity: 'error',
    pattern: /radiocapitellar.{0,80}\bbisect(?:s|ing)?\b/i,
    message: 'radiocapitellar line should intersect, not be required to bisect, the capitellum',
  },
  {
    severity: 'error',
    pattern: /posterior fat pad.{0,60}\b(?:never normal|diagnostic of|proves?)\b/i,
    message: 'posterior fat pad sign should be taught as an abnormal fracture clue, not a certain diagnosis',
  },
  {
    severity: 'error',
    pattern: /cam morphology.{0,80}\bcauses?\s+(?:femoroacetabular impingement|FAI)\b/i,
    message: 'cam morphology can be asymptomatic and does not alone establish FAI syndrome',
  },
  {
    severity: 'error',
    pattern: /distal fibular.{0,100}\b(?:is (?:the )?classic|presume(?:d)?(?: to be)?|diagnos(?:e|ed|ing) as)\b.{0,60}\bSalter-Harris I\b/i,
    message: 'radiograph-negative distal fibular tenderness should not be presumed to be Salter-Harris I',
  },
  {
    severity: 'error',
    pattern: /femoral neck (?:bone )?stress (?:fracture|injury)\s+is\s+(?:a\s+)?tension-side/i,
    message: 'do not generalize every femoral neck stress injury as tension-side',
  },
  {
    severity: 'error',
    pattern: /(?:dorsal.{0,60}spilled[ -]teacup|spilled[ -]teacup.{0,60}(?:signals?|indicates?).{0,60}perilunate)/i,
    message: 'spilled-teacup sign should describe volar lunate dislocation, not dorsal tilt or perilunate dislocation',
  },
  {
    severity: 'error',
    pattern: /medial-cuneiform\/second-metatarsal/i,
    message: 'AP Lisfranc alignment pairs the second-metatarsal base with the middle cuneiform',
  },
  {
    severity: 'error',
    pattern: /proximal fibular epiphysis.{0,100}traction apophysis/i,
    message: 'the proximal fibular ossification center is an epiphysis, not a traction apophysis',
  },
  {
    severity: 'error',
    pattern: /widening suggests.{0,100}cartilage loss/i,
    message: 'joint-space widening suggests instability; cartilage loss narrows the joint space',
  },
  {
    severity: 'error',
    pattern: /\blateral patellar corner\b/i,
    message: 'classic bipartite patella location should be described as superolateral',
  },
  {
    severity: 'error',
    pattern: /loss of this line indicates DISI\/VISI/i,
    message: 'DISI/VISI require angular assessment rather than a collinearity screen alone',
  },
  {
    severity: 'error',
    pattern: /lunate.{0,80}loses? (?:its )?normal alignment.{0,120}perilunate/i,
    message: 'in perilunate dislocation the lunate generally remains seated against the radius',
  },
  {
    severity: 'error',
    pattern: /(?:Gilula arcs.{0,30}\bon (?:a )?lateral|lateral(?: wrist)?(?: x-ray)?.{0,20}(?:shows|demonstrates).{0,30}(?:disrupted|broken|disruption of) Gilula arcs)/i,
    message: 'Gilula arcs are assessed on the PA wrist, while the lateral assesses carpal stacking',
  },
  {
    severity: 'error',
    pattern: /Blumensaat.{0,100}(?:above|below).{0,60}(?:represents|=).{0,30}patella (?:alta|baja)/i,
    message: 'Blumensaat-line position alone should not diagnose patella alta or baja',
  },
  {
    severity: 'error',
    pattern: /<\s*7\s*mm\s*=\s*chronic rotator cuff/i,
    message: 'acromiohumeral interval is technique dependent and not diagnostic by itself',
  },
  {
    severity: 'error',
    pattern: /asymmetric widening\s*=\s*Salter-Harris/i,
    message: 'asymmetric physeal widening raises concern but is not a standalone diagnosis',
  },
  {
    severity: 'error',
    pattern: /(?:zone 3(?:(?!zone [12]).){0,80}watershed|watershed.{0,30}zone 3)/i,
    message: 'the fifth-metatarsal vascular watershed is associated with zone 2, not zone 3',
  },
  {
    severity: 'error',
    pattern: /Maisonneuve\s*=\s*proximal fibula fracture with deltoid disruption/i,
    message: 'Maisonneuve teaching must include syndesmotic disruption and may include deltoid or medial-malleolar injury',
  },
  {
    severity: 'error',
    pattern: /even subtle.{0,80}plateau depression.{0,80}(?:changes|alters).{0,40}(?:operative|surgical) plan/i,
    message: 'plateau depression can affect classification and planning but should not be framed as universally operative',
  },
  {
    severity: 'error',
    pattern: /MRI characterizes stability.{0,60}drives operative/i,
    message: 'MRI features inform OCD management but do not alone dictate operative care',
  },
  {
    severity: 'error',
    pattern: /internal rotation.{0,80}reveals greater tuberosity/i,
    message: 'internal rotation profiles the lesser tuberosity; external rotation profiles the greater tuberosity',
  },
];

function collectStrings(value, prefix = 'root', output = []) {
  if (typeof value === 'string') {
    output.push({ path: prefix, value });
    return output;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, `${prefix}[${index}]`, output));
    return output;
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      collectStrings(child, `${prefix}.${key}`, output);
    }
  }
  return output;
}

function clinicalTextIssues(issues, area, id, value) {
  for (const item of collectStrings(value)) {
    for (const rule of clinicalTextPatterns) {
      if (rule.pattern.test(item.value)) {
        addIssue(issues, rule.severity, area, id, `${rule.message} at ${item.path}: "${item.value}"`);
      }
    }
  }
}

const issues = [];

const { moduleSummaries } = loadTs('src/data/moduleSummaries.ts');
const { moduleContents } = loadTs('src/data/modules.ts');
const { imageRegistry } = loadTs('src/data/images.ts');
const { videoResources, getPrimaryVideoForModule } = loadTs('src/data/videoResources.ts');
const { quickChecks } = loadTs('src/data/quickChecks.ts');
const { getPreCheck, getPostCheck } = loadTs('src/data/moduleChecks.ts');
const { preCourseQuiz, postCourseQuiz, confidenceDomains } = loadTs('src/data/quizzes.ts');
const { videoQuestions } = loadTs('src/data/videoQuestions.ts');
const { flashcards } = loadTs('src/data/flashcards.ts');
const { moduleTrainers } = loadTs('src/data/anatomyTrainer.ts');
const { getClinicCheatSheetSpec } = loadTs('src/data/cheatSheetSpecs.ts');

const moduleIds = new Set(moduleSummaries.map((module) => module.id));
assertUnique(issues, 'moduleSummaries', moduleSummaries, (module) => module.id);
assertUnique(issues, 'moduleContents', moduleContents, (module) => module.id);

for (const summary of moduleSummaries) {
  const content = moduleContents.find((module) => module.id === summary.id);
  if (!content) {
    addIssue(issues, 'error', 'modules', summary.id, 'summary missing matching module content');
  }
  if (content && summary.title !== content.title) {
    addIssue(
      issues,
      'warn',
      'modules',
      summary.id,
      `summary title differs from content title (${summary.title} vs ${content.title})`,
    );
  }
}

for (const module of moduleContents) {
  if (!moduleIds.has(module.id)) {
    addIssue(issues, 'error', 'modules', module.id, 'module content missing summary');
  }
  for (const field of [
    'views',
    'anatomy',
    'pathology',
    'cases',
    'quiz',
    'keyTakeaways',
    'whenToEscalate',
  ]) {
    if (!Array.isArray(module[field]) || module[field].length === 0) {
      addIssue(issues, 'error', 'modules', module.id, `${field} is empty`);
    }
  }
  if (module.status !== 'full') {
    addIssue(issues, 'warn', 'modules', module.id, `status is ${module.status}`);
  }

  for (const caseItem of module.cases) {
    if (caseItem.moduleId !== module.id) {
      addIssue(
        issues,
        'error',
        'cases',
        caseItem.id,
        `case moduleId ${caseItem.moduleId} does not match parent ${module.id}`,
      );
    }
    const optionIds = new Set((caseItem.diagnosisOptions ?? []).map((option) => option.id));
    if (!optionIds.has(caseItem.correctOptionId)) {
      addIssue(
        issues,
        'error',
        'cases',
        caseItem.id,
        `correctOptionId ${caseItem.correctOptionId} not in diagnosisOptions`,
      );
    }
    if (!['diagnosis', 'management', 'associated-injury', 'interpretation'].includes(caseItem.questionType)) {
      addIssue(issues, 'error', 'cases', caseItem.id, `invalid questionType ${caseItem.questionType}`);
    }
    const validManagementChoices = new Set([
      'symptomatic-follow-up',
      'immobilize-protect',
      'advanced-imaging',
      'urgent-referral',
    ]);
    if (
      !Array.isArray(caseItem.recommendedManagementChoiceIds) ||
      caseItem.recommendedManagementChoiceIds.length === 0 ||
      caseItem.recommendedManagementChoiceIds.some((id) => !validManagementChoices.has(id))
    ) {
      addIssue(issues, 'error', 'cases', caseItem.id, 'missing or invalid authored management choices');
    }
    for (const panel of caseItem.imagePanels ?? []) {
      if (panel.imageKey && !imageRegistry[panel.imageKey]) {
        addIssue(issues, 'error', 'case image key', caseItem.id, `missing image key ${panel.imageKey}`);
      }
    }
  }

  for (const q of module.quiz) questionIssues(issues, `module quiz:${module.id}`, q);
  const pre = getPreCheck(module);
  const post = getPostCheck(module);
  if (pre.length !== 3) addIssue(issues, 'error', 'moduleChecks', module.id, `pre check has ${pre.length} questions`);
  if (post.length !== 3) addIssue(issues, 'error', 'moduleChecks', module.id, `post check has ${post.length} questions`);
  pre.forEach((q) => questionIssues(issues, `module pre:${module.id}`, q));
  post.forEach((q) => questionIssues(issues, `module post:${module.id}`, q));

  try {
    const spec = getClinicCheatSheetSpec(module);
    for (const field of [
      'requiredViews',
      'addOnViews',
      'negativeXrayEscalation',
      'signs',
      'patterns',
      'doNotMiss',
      'pitfalls',
      'quickTips',
    ]) {
      if (!Array.isArray(spec?.[field]) || spec[field].length === 0) {
        addIssue(issues, 'error', 'cheatSheetSpec', module.id, `${field} is empty`);
      }
    }
    for (const field of ['viewAdequacyWarning', 'pearl']) {
      if (!spec?.[field] || spec[field].trim().length < 10) {
        addIssue(issues, 'error', 'cheatSheetSpec', module.id, `${field} is blank/short`);
      }
    }
  } catch (err) {
    addIssue(issues, 'error', 'cheatSheetSpec', module.id, err.message);
  }
}

const allQuestions = [
  ...preCourseQuiz,
  ...postCourseQuiz,
  ...moduleContents.flatMap((module) => [...module.quiz, ...getPreCheck(module), ...getPostCheck(module)]),
  ...Object.values(videoQuestions).flat(),
];
assertUnique(issues, 'quiz question ids', allQuestions, (q) => q.id);
allQuestions.forEach((q) => questionIssues(issues, 'all questions', q));

if (confidenceDomains.length !== 6) {
  addIssue(
    issues,
    'warn',
    'confidenceDomains',
    'count',
    `expected 6 confidence domains, saw ${confidenceDomains.length}`,
  );
}

const imageEntries = Object.entries(imageRegistry);
assertUnique(
  issues,
  'image entries',
  imageEntries.map(([key, value]) => ({ key, ...value })),
  (image) => image.id,
);

for (const [key, image] of imageEntries) {
  if (!image.src) addIssue(issues, 'error', 'images', key, 'missing src');
  const publicPath = image.src?.startsWith('/') ? path.join(root, 'public', image.src) : null;
  if (publicPath && !fs.existsSync(publicPath)) {
    addIssue(issues, 'error', 'images', key, `src file missing: ${image.src}`);
  }
  if (image.src?.startsWith('/uploads/') && /\.(?:jpe?g|png)$/i.test(image.src)) {
    const previewPath = path.join(
      root,
      'public/uploads/previews',
      `${path.parse(image.src).name}.webp`,
    );
    if (!fs.existsSync(previewPath)) {
      addIssue(issues, 'error', 'image previews', key, `preview missing: ${previewPath}`);
    }
  }
  if (image.moduleId && !moduleIds.has(image.moduleId)) {
    addIssue(issues, 'error', 'images', key, `unknown moduleId ${image.moduleId}`);
  }
  if (!image.alt || image.alt.trim().length < 8) {
    addIssue(issues, 'warn', 'images', key, 'short/blank alt text');
  }
  if (!image.source) addIssue(issues, 'warn', 'images', key, 'missing source');
  if (!image.license) addIssue(issues, 'warn', 'images', key, 'missing license');
  if (!image.isDiagram && !image.attribution) {
    addIssue(issues, 'warn', 'images', key, 'non-diagram missing attribution');
  }
}

for (const [moduleId, trainer] of Object.entries(moduleTrainers)) {
  if (!moduleIds.has(moduleId)) {
    addIssue(issues, 'error', 'trainers', moduleId, 'trainer has unknown module id');
  }
  for (const step of trainer.tour ?? []) {
    if (!imageRegistry[step.imageKey]) {
      addIssue(issues, 'error', 'trainer tour image', step.id, `missing image key ${step.imageKey}`);
    }
    if (!step.title || !step.note) {
      addIssue(issues, 'warn', 'trainer tour', step.title ?? '(untitled)', 'missing title/note');
    }
    for (const marker of step.markers ?? []) {
      const markerIsValid =
        typeof marker.x === 'number' &&
        marker.x >= 0 &&
        marker.x <= 100 &&
        typeof marker.y === 'number' &&
        marker.y >= 0 &&
        marker.y <= 100;
      if (!markerIsValid) {
        addIssue(issues, 'error', 'trainer tour', step.title, `marker outside image: ${marker.x},${marker.y}`);
      }
    }
  }
  for (const q of trainer.check ?? []) {
    if (!imageRegistry[q.imageKey]) {
      addIssue(issues, 'error', 'trainer check image', q.id, `missing image key ${q.imageKey}`);
    }
    if (q.answer < 0 || q.answer >= q.options.length) {
      addIssue(issues, 'error', 'trainer check', q.id, `answer index ${q.answer} outside ${q.options.length} options`);
    }
    if (!q.explanation || q.explanation.trim().length < 10) {
      addIssue(issues, 'warn', 'trainer check', q.id, 'short/blank explanation');
    }
  }
}

for (const [moduleId, questions] of Object.entries(quickChecks)) {
  if (!moduleIds.has(moduleId)) addIssue(issues, 'error', 'quickChecks', moduleId, 'unknown module id');
  for (const q of questions) {
    if (q.answer < 0 || q.answer >= q.options.length) {
      addIssue(issues, 'error', 'quickChecks', q.id, `answer index ${q.answer} outside ${q.options.length} options`);
    }
    if (q.options.length !== 4) {
      addIssue(issues, 'warn', 'quickChecks', q.id, `expected 4 options, saw ${q.options.length}`);
    }
    if (!q.explanation || q.explanation.trim().length < 10) {
      addIssue(issues, 'warn', 'quickChecks', q.id, 'short/blank explanation');
    }
  }
}
assertUnique(issues, 'quickChecks', Object.values(quickChecks).flat(), (q) => q.id);

assertUnique(issues, 'videos', videoResources, (video) => video.id);
for (const video of videoResources) {
  if (!moduleIds.has(video.moduleId)) {
    addIssue(issues, 'error', 'videos', video.id, `unknown moduleId ${video.moduleId}`);
  }
  if (!/^[\w-]{11}$/.test(video.youtubeId)) {
    addIssue(issues, 'error', 'videos', video.id, `youtubeId does not look 11 chars: ${video.youtubeId}`);
  }
  if (!video.title || !video.summary || !video.clinicalWhy) {
    addIssue(issues, 'warn', 'videos', video.id, 'missing title/summary/clinicalWhy');
  }
}
for (const moduleId of moduleIds) {
  const primary = getPrimaryVideoForModule(moduleId);
  if (!primary) addIssue(issues, 'warn', 'videos', moduleId, 'no primary video for module');
}
for (const videoId of Object.keys(videoQuestions)) {
  if (!videoResources.some((video) => video.id === videoId)) {
    addIssue(issues, 'error', 'videoQuestions', videoId, 'questions for unknown video');
  }
}

assertUnique(issues, 'flashcards', flashcards, (card) => card.id);
for (const card of flashcards) {
  if (!moduleIds.has(card.moduleId)) {
    addIssue(issues, 'error', 'flashcards', card.id, `unknown moduleId ${card.moduleId}`);
  }
  if (!card.front || !card.back) {
    addIssue(issues, 'error', 'flashcards', card.id, 'blank front/back');
  }
}

const uploadsDir = path.join(root, 'public/uploads');
const uploads = fs.existsSync(uploadsDir)
  ? fs
      .readdirSync(uploadsDir, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => `/uploads/${entry.name}`)
  : [];
const registrySrcs = new Set(
  Object.values(imageRegistry)
    .filter((image) => image.src?.startsWith('/uploads/'))
    .map((image) => image.src),
);
for (const src of uploads) {
  if (!registrySrcs.has(src)) addIssue(issues, 'warn', 'uploads', src, 'file exists but is not registered');
}

for (const module of moduleContents) {
  clinicalTextIssues(issues, 'clinical text:module', module.id, module);
  try {
    clinicalTextIssues(
      issues,
      'clinical text:cheatSheetSpec',
      module.id,
      getClinicCheatSheetSpec(module),
    );
  } catch {
    // cheat sheet construction is already reported above
  }
}
clinicalTextIssues(issues, 'clinical text:course quizzes', 'pre-course', preCourseQuiz);
clinicalTextIssues(issues, 'clinical text:course quizzes', 'post-course', postCourseQuiz);
clinicalTextIssues(issues, 'clinical text:quickChecks', 'all', quickChecks);
clinicalTextIssues(issues, 'clinical text:videoQuestions', 'all', videoQuestions);
clinicalTextIssues(issues, 'clinical text:flashcards', 'all', flashcards);
clinicalTextIssues(issues, 'clinical text:videos', 'all', videoResources);
clinicalTextIssues(issues, 'clinical text:trainers', 'all', moduleTrainers);

const diagramsDir = path.join(root, 'public/diagrams');
const diagramFiles = fs.existsSync(diagramsDir)
  ? fs.readdirSync(diagramsDir).filter((name) => name.endsWith('.svg'))
  : [];
for (const name of diagramFiles) {
  const svg = fs.readFileSync(path.join(diagramsDir, name), 'utf8');
  const visibleText = Array.from(
    svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/gi),
    (match) => match[1].replace(/<[^>]+>/g, ' '),
  ).join(' ');
  clinicalTextIssues(issues, 'clinical text:diagram', name, visibleText);
}

const summary = {
  modules: moduleContents.length,
  summaries: moduleSummaries.length,
  images: imageEntries.length,
  videos: videoResources.length,
  quickChecks: Object.values(quickChecks).flat().length,
  trainerModules: Object.keys(moduleTrainers).length,
  trainerTourSteps: Object.values(moduleTrainers).flatMap((trainer) => trainer.tour ?? []).length,
  trainerChecks: Object.values(moduleTrainers).flatMap((trainer) => trainer.check ?? []).length,
  diagramsScanned: diagramFiles.length,
  flashcards: flashcards.length,
  questions: allQuestions.length,
  clinicalTextPatterns: clinicalTextPatterns.length,
  issuesBySeverity: issues.reduce((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] ?? 0) + 1;
    return acc;
  }, {}),
};

console.log(JSON.stringify({ summary, issues }, null, 2));

if (issues.some((issue) => issue.severity === 'error')) {
  process.exitCode = 1;
}
