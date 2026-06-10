import os from 'os'
import path from 'path';

import { pathToFileURL } from 'url';

// home folder independent of OS
let homedir = os.homedir();

let exports = {};

if (os.platform() === 'win32') {
  console.log('window path');
  const avgPath = pathToFileURL(path.join(homedir, 'hop-models', 'statistics', 'average.js')).href;
  const sumPath = pathToFileURL(path.join(homedir, 'hop-models', 'statistics', 'sum.js')).href;
  const linregPath = pathToFileURL(path.join(homedir, 'hop-models', 'statistics', 'linear-regression.js')).href;
  const autoregPath = pathToFileURL(path.join(homedir, 'hop-models', 'statistics', 'auto-regression.js')).href;

  exports = {
    AverageModel: (await import(avgPath)).default,
    SumModel: (await import(sumPath)).default,
    LinearRegression: (await import(linregPath)).default,
    AutoRegression: (await import(autoregPath)).default
  };
} else {
  console.log('non windows');
  exports = {
    AverageModel: (await import('./statistics/average.js')).default,
    SumModel: (await import('./statistics/sum.js')).default,
    LinearRegression: (await import('./statistics/linear-regression.js')).default,
    AutoRegression: (await import('./statistics/auto-regression.js')).default
  };
}

export default exports;
