import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const uploadsDir = path.join(root, 'public/uploads');
const outputDir = path.join(uploadsDir, 'previews');
const maxDimension = 1200;

fs.mkdirSync(outputDir, { recursive: true });

const files = fs
  .readdirSync(uploadsDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && /\.(?:jpe?g|png)$/i.test(entry.name))
  .map((entry) => entry.name)
  .sort();

let generated = 0;
for (const name of files) {
  const input = path.join(uploadsDir, name);
  const output = path.join(outputDir, `${path.parse(name).name}.webp`);
  if (
    fs.existsSync(output) &&
    fs.statSync(output).mtimeMs >= fs.statSync(input).mtimeMs
  ) {
    continue;
  }

  const info = spawnSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', input], {
    encoding: 'utf8',
  });
  if (info.status !== 0) {
    throw new Error(`Could not inspect ${name}: ${info.stderr || info.stdout}`);
  }
  const width = Number(info.stdout.match(/pixelWidth:\s*(\d+)/)?.[1]);
  const height = Number(info.stdout.match(/pixelHeight:\s*(\d+)/)?.[1]);
  if (!width || !height) throw new Error(`Could not read dimensions for ${name}`);

  const args = ['-quiet', '-q', '82', '-metadata', 'none'];
  if (Math.max(width, height) > maxDimension) {
    if (width >= height) args.push('-resize', String(maxDimension), '0');
    else args.push('-resize', '0', String(maxDimension));
  }
  args.push(input, '-o', output);

  const converted = spawnSync('cwebp', args, { encoding: 'utf8' });
  if (converted.status !== 0) {
    throw new Error(`Could not generate ${path.basename(output)}: ${converted.stderr}`);
  }
  generated += 1;
}

console.log(`Image previews ready: ${files.length} total, ${generated} generated.`);
