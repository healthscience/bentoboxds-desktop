import { createRequire } from 'module';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Use the require bridge to maintain internal library integrity
const require = createRequire(import.meta.url);
const jsdoc2md = require('jsdoc-to-markdown');

const OUTPUT_DIR = './docs';
const OUTPUT_FILE = join(OUTPUT_DIR, 'api-reference.md');

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function pulse() {
  console.log('--- Initiating Local Documentation Pulse (Bridge) ---');

  try {
    // Calling .render() via the required bridge to fix the internal state
    const output = await jsdoc2md.render({ 
      files: ['./*.js', './src/**/*.js'],
      'no-cache': true 
    });

    if (output) {
      writeFileSync(OUTPUT_FILE, output);
      console.log(`[SUCCESS]: Documentation distilled to ${OUTPUT_FILE}`);
    } else {
      console.log('[WARNING]: No JSDoc comments found. Verify your comments start with /**');
    }
  } catch (error) {
    console.error('[ERROR]: Conduction failed:', error.message);
    
    // Fallback info for the CC
    if (error.message.includes('getTemplateData')) {
      console.log('[TIP]: This usually means a file path is incorrect or a file is empty.');
    }
  }
}

pulse();
