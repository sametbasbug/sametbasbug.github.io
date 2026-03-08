#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const k = a.slice(2);
    const v = argv[i + 1];
    if (!v || v.startsWith('--')) out[k] = true;
    else {
      out[k] = v;
      i++;
    }
  }
  return out;
}

function runStep(label, command, args, failOnError = true) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, args, { stdio: 'inherit', shell: true });
  if (result.status !== 0 && failOnError) process.exit(result.status || 1);
  return result.status || 0;
}

const args = parseArgs(process.argv.slice(2));
if (args.help || args.h) {
  console.log('Kullanım: npm run briefing:v1:run:ci -- [--date YYYY-MM-DD] [--strict]');
  process.exit(0);
}

const extra = [];
if (args.date) extra.push('--date', args.date);
if (args.strict) extra.push('--strict');

runStep('Prepare', 'npm', ['run', 'briefing:v1', '--', ...extra]);
runStep('Draft', 'npm', ['run', 'briefing:v1:draft', '--', ...extra]);
const validateCode = runStep('Validate', 'npm', ['run', 'briefing:v1:validate', '--', ...extra], false);
runStep('Write Report', 'npm', ['run', 'briefing:v1:report', '--', ...extra], false);

if (validateCode !== 0) {
  console.error('\nValidate başarısız. Build atlanıyor.');
  process.exit(validateCode);
}

runStep('Build', 'npm', ['run', 'build']);
console.log('\n✅ briefing:v1:run:ci tamamlandı.');
