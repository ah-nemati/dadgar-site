import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const rootsToScan = [
  'app',
  'components',
  'data',
  'database',
  'lib',
  'scripts',
  'types',
  '.env.example',
  '.dev.vars.example',
  'package.json',
  'docker-compose.yml',
  'next.config.ts',
  'middleware.ts',
  'wrangler.jsonc',
];

// Fragments are assembled to keep the repository itself free from legacy import names.
const providerScope = `@${'aw' + 's'}-${'sd' + 'k'}/`;
const legacyPrefix = `${'S'}${'3'}_`;
const legacySymbols = [
  `${'S'}${'3'}Client`,
  `Put${'Object'}Command`,
  `Get${'Object'}Command`,
  `Delete${'Object'}Command`,
  `storage/${'s'}${'3'}`,
];

const extensions = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.sql', '.env', '.example', '.yml', '.yaml', '.md',
]);

const findings = [];

function checkLine(filePath, line, lineNumber) {
  const lower = line.toLowerCase();
  const matchesProvider = lower.includes(providerScope);
  const matchesPrefix = line.includes(legacyPrefix);
  const matchesSymbol = legacySymbols.some((symbol) => line.includes(symbol));

  if (matchesProvider || matchesPrefix || matchesSymbol) {
    findings.push(`${path.relative(root, filePath)}:${lineNumber}: ${line.trim()}`);
  }
}

function scanFile(filePath) {
  const ext = path.extname(filePath);
  if (!extensions.has(ext) && !filePath.endsWith('.env.example') && !filePath.endsWith('.dev.vars.example')) return;

  const body = fs.readFileSync(filePath, 'utf8');
  body.split(/\r?\n/).forEach((line, index) => checkLine(filePath, line, index + 1));
}

function walk(target) {
  if (!fs.existsSync(target)) return;
  const stat = fs.statSync(target);
  if (stat.isFile()) return scanFile(target);

  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (['node_modules', '.next', '.open-next', '.git', 'out', 'build'].includes(entry.name)) continue;
    walk(path.join(target, entry.name));
  }
}

for (const item of rootsToScan) walk(path.join(root, item));

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
for (const section of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
  for (const name of Object.keys(pkg[section] ?? {})) {
    if (name.startsWith(providerScope)) findings.push(`package.json: direct legacy dependency ${name}`);
  }
}

if (findings.length > 0) {
  console.error('Legacy storage references found:\n');
  console.error(findings.join('\n'));
  process.exit(1);
}

console.log('Storage audit passed: project source uses ImageKit only.');
