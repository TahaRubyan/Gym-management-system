/**
 * MONSTER'S GYM — Comprehensive Cross-Testing Suite Runner
 * Owner: DASTGIR KANTH
 * Runs Unit, Integration, Feature Workflow, and Business Rule Verification suites.
 */

import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const suites = [
  { name: 'Unit Tests', file: 'unit.test.mjs' },
  { name: 'Integration Tests', file: 'integration.test.mjs' },
  { name: 'Feature & Workflow Tests', file: 'feature_workflow.test.mjs' },
  { name: 'Domain Business Rules Verification', file: 'verify_business_rules.mjs' },
];

console.log('===============================================================');
console.log("   MONSTER'S GYM — AUTOMATED CROSS-TESTING SUITE EXECUTION    ");
console.log('   Owner: DASTGIR KANTH | Architecture: PWA + IndexedDB       ');
console.log('===============================================================\n');

let totalSuitesPassed = 0;
let totalSuitesFailed = 0;

for (const suite of suites) {
  console.log(`\n>>>>>>>>>> RUNNING: ${suite.name} (${suite.file}) >>>>>>>>>>`);
  const relativePath = path.join('test', suite.file);
  const result = spawnSync(process.execPath, ['--experimental-strip-types', relativePath], {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
  });

  if (result.status === 0) {
    console.log(`<<<<<<<<<< PASSED: ${suite.name} <<<<<<<<<<\n`);
    totalSuitesPassed++;
  } else {
    console.error(`<<<<<<<<<< FAILED: ${suite.name} (exit code: ${result.status}) <<<<<<<<<<\n`);
    totalSuitesFailed++;
  }
}

console.log('===============================================================');
console.log(`CROSS-TESTING SUMMARY: ${totalSuitesPassed}/${suites.length} SUITES PASSED`);
if (totalSuitesFailed > 0) {
  console.error(`FAILURE: ${totalSuitesFailed} test suite(s) failed!`);
  console.log('===============================================================');
  process.exit(1);
} else {
  console.log('ALL CROSS-TESTING SUITES PASSED FLAWLESSLY WITH 100% SUCCESS!');
  console.log('===============================================================');
}
