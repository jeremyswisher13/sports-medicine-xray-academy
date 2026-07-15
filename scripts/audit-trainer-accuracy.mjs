import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const root = process.cwd();
const requireFromRoot = createRequire(path.join(root, 'package.json'));
const ts = requireFromRoot('typescript');
const moduleCache = new Map();

function resolveLocal(fromFile, spec) {
  const base = path.resolve(path.dirname(fromFile), spec);
  for (const candidate of [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
  ]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  throw new Error(`Cannot resolve ${spec} from ${fromFile}`);
}

function loadTs(relOrAbs) {
  const abs = path.isAbsolute(relOrAbs) ? relOrAbs : path.join(root, relOrAbs);
  if (moduleCache.has(abs)) return moduleCache.get(abs).exports;

  const source = fs.readFileSync(abs, 'utf8');
  const loadedModule = { exports: {} };
  moduleCache.set(abs, loadedModule);
  const output = ts.transpileModule(source, {
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
    output,
    {
      exports: loadedModule.exports,
      module: loadedModule,
      require: localRequire,
      console,
      URL,
      setTimeout,
      clearTimeout,
    },
    { filename: abs },
  );
  return loadedModule.exports;
}

const { moduleTrainers } = loadTs('src/data/anatomyTrainer.ts');
const { imageRegistry } = loadTs('src/data/images.ts');
const issues = [];

function addIssue(severity, moduleId, item, message) {
  issues.push({ severity, moduleId, item, message });
}

function validCoordinate(value) {
  return Number.isFinite(value) && value >= 0 && value <= 100;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

const criticalMarkerBounds = [
  {
    moduleId: 'shoulder',
    imageKey: 'normal:shoulder-grashey',
    tourTitle: 'Distal clavicle & AC joint',
    x: [50, 60],
    y: [8, 18],
  },
  {
    moduleId: 'elbow',
    imageKey: 'normal:elbow-lateral',
    tourTitle: 'Radial head',
    x: [52, 64],
    y: [69, 81],
  },
  {
    moduleId: 'elbow',
    imageKey: 'normal:elbow-lateral',
    tourTitle: 'Coronoid process',
    x: [49, 59],
    y: [69, 79],
  },
  {
    moduleId: 'elbow',
    imageKey: 'normal:elbow-lateral',
    tourTitle: 'Olecranon',
    x: [68, 78],
    y: [76, 88],
  },
  {
    moduleId: 'pelvis-hip',
    imageKey: 'normal:hip',
    tourTitle: 'Femoral neck',
    x: [32, 44],
    y: [33, 45],
  },
  {
    moduleId: 'pelvis-hip',
    imageKey: 'normal:hip',
    tourTitle: 'Femoral head-neck junction / offset',
    x: [26, 36],
    y: [22, 32],
  },
  {
    moduleId: 'pelvis-hip',
    imageKey: 'normal:hip',
    tourTitle: 'Lesser trochanter',
    x: [41, 51],
    y: [44, 55],
  },
  {
    moduleId: 'knee',
    imageKey: 'normal:patella-skyline',
    tourTitle: 'Trochlear groove (sulcus)',
    x: [47, 59],
    y: [70, 82],
  },
  {
    moduleId: 'pediatric-adolescent',
    imageKey: 'normal:pelvis-ap-pediatric',
    tourTitle: 'Iliac crest',
    x: [7, 20],
    y: [20, 32],
  },
  {
    moduleId: 'do-not-miss',
    imageKey: 'foot:lisfranc-injury',
    tourTitle: 'Lisfranc injury — tarsometatarsal diastasis',
    x: [44, 56],
    y: [59, 71],
  },
  {
    moduleId: 'do-not-miss',
    imageKey: 'foot:jones-fracture',
    tourTitle: 'Jones fracture — 5th metatarsal metaphyseal-diaphyseal junction',
    x: [12, 27],
    y: [65, 80],
  },
];

const synchronizedTourChecks = [
  ['elbow', 'Olecranon', 'elbow-ck-4'],
  ['elbow', 'Coronoid process', 'elbow-ck-5'],
  ['elbow', 'Anterior fat pad', 'elbow-ck-6'],
  ['wrist-hand', 'Lunate', 'wrist-hand-ck-7', 'normal:wrist-lateral'],
  ['pelvis-hip', 'Lesser trochanter', 'pelvis-hip-ck-3'],
  ['pelvis-hip', 'Femoral neck', 'pelvis-hip-ck-5'],
  ['knee', 'Trochlear groove (sulcus)', 'knee-ck-8'],
  ['pediatric-adolescent', 'Ischial tuberosity region', 'pediatric-adolescent-ck-10'],
  ['do-not-miss', 'Lisfranc injury — tarsometatarsal diastasis', 'dnm-ck-5'],
  ['do-not-miss', 'Bipartite patella — NORMAL VARIANT (do not call a fracture)', 'dnm-ck-7'],
  [
    'do-not-miss',
    'Jones fracture — 5th metatarsal metaphyseal-diaphyseal junction',
    'dnm-ck-8',
  ],
  ['do-not-miss', 'Perilunate dislocation — carpus displaced around the lunate', 'dnm-ck-9'],
];

const seenCheckIds = new Set();
const intentionallyIndependentChecks = new Set([
  // Tests whether the distal femur is included, rather than repeating the
  // tour's central adequacy marker.
  'fnd-ck-10',
]);
for (const [moduleId, trainer] of Object.entries(moduleTrainers)) {
  const markerLocations = new Map();

  for (const [index, step] of trainer.tour.entries()) {
    const item = `tour[${index}] ${step.title}`;
    const image = imageRegistry[step.imageKey];
    if (!image) {
      addIssue('error', moduleId, item, `unknown image key ${step.imageKey}`);
      continue;
    }
    if (image.src?.startsWith('/')) {
      const imagePath = path.join(root, 'public', image.src.slice(1));
      if (!fs.existsSync(imagePath)) {
        addIssue('error', moduleId, item, `missing local image ${image.src}`);
      }
    }

    const isOrientation = /^(?:get oriented|orient:)/i.test(step.title);
    if (!isOrientation && step.markers.length === 0) {
      addIssue('error', moduleId, item, 'teaching step has no marker');
    }
    for (const [markerIndex, marker] of step.markers.entries()) {
      if (!validCoordinate(marker.x) || !validCoordinate(marker.y)) {
        addIssue(
          'error',
          moduleId,
          item,
          `marker ${markerIndex + 1} is outside the image (${marker.x}, ${marker.y})`,
        );
        continue;
      }
      if (marker.x < 3 || marker.x > 97 || marker.y < 3 || marker.y > 97) {
        addIssue(
          'warn',
          moduleId,
          item,
          `marker ${markerIndex + 1} is close to an image edge (${marker.x}, ${marker.y})`,
        );
      }
      if (!marker.label?.trim()) {
        addIssue('warn', moduleId, item, `marker ${markerIndex + 1} has no learner label`);
      }

      const locationKey = `${step.imageKey}:${marker.x}:${marker.y}`;
      const prior = markerLocations.get(locationKey);
      if (prior && prior !== step.title) {
        addIssue(
          'warn',
          moduleId,
          item,
          `shares the exact marker location with "${prior}"`,
        );
      } else {
        markerLocations.set(locationKey, step.title);
      }
    }
  }

  for (const [index, check] of trainer.check.entries()) {
    const item = `check[${index}] ${check.id}`;
    if (seenCheckIds.has(check.id)) {
      addIssue('error', moduleId, item, 'duplicate check id');
    }
    seenCheckIds.add(check.id);
    if (!imageRegistry[check.imageKey]) {
      addIssue('error', moduleId, item, `unknown image key ${check.imageKey}`);
    }
    if (!validCoordinate(check.marker.x) || !validCoordinate(check.marker.y)) {
      addIssue(
        'error',
        moduleId,
        item,
        `marker is outside the image (${check.marker.x}, ${check.marker.y})`,
      );
    }
    if (check.answer < 0 || check.answer >= check.options.length) {
      addIssue('error', moduleId, item, `answer index ${check.answer} is invalid`);
    }
    if (new Set(check.options.map((option) => option.trim().toLowerCase())).size !== check.options.length) {
      addIssue('error', moduleId, item, 'answer options are not unique');
    }

    const sameImageMarkers = trainer.tour
      .filter((step) => step.imageKey === check.imageKey)
      .flatMap((step) => step.markers.map((marker) => ({ marker, title: step.title })));
    if (sameImageMarkers.length > 0 && !intentionallyIndependentChecks.has(check.id)) {
      const nearest = sameImageMarkers
        .map((candidate) => ({ ...candidate, distance: distance(check.marker, candidate.marker) }))
        .sort((a, b) => a.distance - b.distance)[0];
      if (nearest.distance > 2.1) {
        addIssue(
          'warn',
          moduleId,
          item,
          `check marker is ${nearest.distance.toFixed(1)}% from nearest tour marker (${nearest.title})`,
        );
      }
    }
  }
}

for (const expectation of criticalMarkerBounds) {
  const trainer = moduleTrainers[expectation.moduleId];
  const step = trainer?.tour.find(
    (candidate) =>
      candidate.imageKey === expectation.imageKey &&
      candidate.title === expectation.tourTitle,
  );
  const marker = step?.markers[0];
  const item = `critical target ${expectation.tourTitle}`;
  if (!marker) {
    addIssue('error', expectation.moduleId, item, 'missing expected tour marker');
    continue;
  }
  if (
    marker.x < expectation.x[0] ||
    marker.x > expectation.x[1] ||
    marker.y < expectation.y[0] ||
    marker.y > expectation.y[1]
  ) {
    addIssue(
      'error',
      expectation.moduleId,
      item,
      `marker (${marker.x}, ${marker.y}) left its verified image region`,
    );
  }
}

for (const [moduleId, tourTitle, checkId, imageKey] of synchronizedTourChecks) {
  const trainer = moduleTrainers[moduleId];
  const check = trainer?.check.find((candidate) => candidate.id === checkId);
  const step = trainer?.tour.find(
    (candidate) =>
      candidate.title === tourTitle &&
      (!imageKey || candidate.imageKey === imageKey),
  );
  const marker = step?.markers[0];
  if (!check || !marker) {
    addIssue('error', moduleId, checkId, `missing synchronized tour/check pair for ${tourTitle}`);
    continue;
  }
  if (distance(check.marker, marker) > 0.1) {
    addIssue(
      'error',
      moduleId,
      checkId,
      `check marker (${check.marker.x}, ${check.marker.y}) no longer matches tour marker (${marker.x}, ${marker.y})`,
    );
  }
}

const relevantImageKeys = new Set(
  Object.values(moduleTrainers).flatMap((trainer) => [
    ...trainer.tour.map((step) => step.imageKey),
    ...trainer.check.map((check) => check.imageKey),
  ]),
);
const exportArgIndex = process.argv.indexOf('--export');
if (exportArgIndex >= 0) {
  const outputPath = process.argv[exportArgIndex + 1];
  if (!outputPath) throw new Error('--export requires a file path');
  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        moduleTrainers,
        images: Object.fromEntries(
          [...relevantImageKeys].map((key) => [key, imageRegistry[key]]),
        ),
      },
      null,
      2,
    ),
  );
}

const summary = {
  modules: Object.keys(moduleTrainers).length,
  tourSteps: Object.values(moduleTrainers).flatMap((trainer) => trainer.tour).length,
  checks: Object.values(moduleTrainers).flatMap((trainer) => trainer.check).length,
  images: relevantImageKeys.size,
  issuesBySeverity: issues.reduce((counts, issue) => {
    counts[issue.severity] = (counts[issue.severity] ?? 0) + 1;
    return counts;
  }, {}),
};

console.log(JSON.stringify({ summary, issues }, null, 2));
if (issues.some((issue) => issue.severity === 'error')) process.exitCode = 1;
