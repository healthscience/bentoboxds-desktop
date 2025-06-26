import { join } from 'path';
import { homedir } from 'os';

const avgPath = join(homedir(), '.hop-models', 'statistics', 'average.js');
const sumPath = join(homedir(), '.hop-models', 'statistics', 'sum.js');
const linregPath = join(homedir(), '.hop-models', 'statistics', 'linear-regression.js');
const autoregPath = join(homedir(), '.hop-models', 'statistics', 'auto-regression.js');

const { default: AverageModel } = await import(avgPath);
const { default: SumModel } = await import(sumPath);
const { default: LinearRegression } = await import(linregPath);
const { default: AutoRegression } = await import(autoregPath);

export {
  AverageModel,
  SumModel,
  LinearRegression,
  AutoRegression
};