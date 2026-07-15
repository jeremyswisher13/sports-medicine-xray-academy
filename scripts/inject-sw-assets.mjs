import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const assetsDir = path.join(root, 'dist', 'assets');
const serviceWorkerPath = path.join(root, 'dist', 'sw.js');
const marker = '/* __BUILT_ASSET_URLS__ */ []';

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(absolutePath) : [absolutePath];
    }),
  );
  return files.flat();
}

const assetPaths = (await walk(assetsDir))
  .filter((filePath) => /\.(?:css|js)$/.test(filePath))
  .map((filePath) => `/${path.relative(path.join(root, 'dist'), filePath).split(path.sep).join('/')}`)
  .sort();

if (assetPaths.length === 0) {
  throw new Error('No built JavaScript or CSS assets were found for offline precaching.');
}

const serviceWorker = await fs.readFile(serviceWorkerPath, 'utf8');
if (!serviceWorker.includes(marker)) {
  throw new Error('Service worker asset injection marker is missing.');
}

const injected = serviceWorker.replace(
  marker,
  `/* __BUILT_ASSET_URLS__ */ ${JSON.stringify(assetPaths, null, 2)}`,
);
await fs.writeFile(serviceWorkerPath, injected);

console.log(`Injected ${assetPaths.length} built assets into dist/sw.js for offline routes.`);
