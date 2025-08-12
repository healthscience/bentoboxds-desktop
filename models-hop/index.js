import os from 'os'
import path from 'path';

// home folder independent of OS
let homedir = os.homedir();
let splitLast = homedir.split(`\\`)
homedir = splitLast[2]

let exports = {};

if (os.platform() === 'win32') {
  console.log('window path');
  const avgPath = '/Users/' + homedir +'/hop-models/statistics/average.js';
  const sumPath = '/Users/' + homedir +'/hop-models/statistics/sum.js';
  const linregPath = '/Users/' + homedir +'/hop-models/statistics/linear-regression.js';
  const autoregPath = '/Users/' + homedir +'/hop-models/statistics/auto-regression.js';

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
