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
  ? fs.readdirSync(uploadsDir).map((name) => `/uploads/${name}`)
  : [];
const registrySrcs = new Set(
  Object.values(imageRegistry)
    .filter((image) => image.src?.startsWith('/uploads/'))
    .map((image) => image.src),
);
for (const src of uploads) {
  if (!registrySrcs.has(src)) addIssue(issues, 'warn', 'uploads', src, 'file exists but is not registered');
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
  flashcards: flashcards.length,
  questions: allQuestions.length,
  issuesBySeverity: issues.reduce((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] ?? 0) + 1;
    return acc;
  }, {}),
};

console.log(JSON.stringify({ summary, issues }, null, 2));

if (issues.some((issue) => issue.severity === 'error')) {
  process.exitCode = 1;
}
