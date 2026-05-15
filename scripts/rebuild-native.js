import { rebuild } from '@electron/rebuild';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const electronVersion = '34.0.0'; // Updated for stability with better-sqlite3

async function rebuildNativeModules(modulePath) {
  console.log(`Rebuilding native modules in ${modulePath}...`);
  try {
    await rebuild({
      buildPath: modulePath,
      electronVersion: electronVersion,
      force: true,
      onlyModules: ['better-sqlite3'],
    });
    console.log(`Successfully rebuilt better-sqlite3 in ${modulePath}`);
  } catch (error) {
    console.error(`Failed to rebuild better-sqlite3 in ${modulePath}:`, error);
    // Continue anyway as some nested modules might not actually have better-sqlite3
  }
}

async function main() {
  const hopPath = path.join(projectRoot, 'hop');
  
  // Rebuild in hop/
  await rebuildNativeModules(hopPath);

  // Find and rebuild in nested locations if they exist
  const nestedLocations = [
    path.join(hopPath, 'node_modules', 'location-hop'),
    path.join(hopPath, 'node_modules', 'heliclock-hop'),
  ];

  for (const loc of nestedLocations) {
    if (fs.existsSync(loc)) {
      await rebuildNativeModules(loc);
    }
  }
}

main().catch(console.error);
