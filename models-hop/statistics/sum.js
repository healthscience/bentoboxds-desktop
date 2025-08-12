import os from 'os';
import path from 'path';

// home folder independent of OS
let homedir = os.homedir();
let splitLast = homedir.split(`\\`)
homedir = splitLast[2]

let BaseModel;

async function loadBaseModel() {
  try {
    if (os.platform() === 'win32') {
      BaseModel = '/Users/' + homedir +'/hop-models/base/base-model.js';
      BaseModel = (await import(baseModelUrl)).default;
    } else {
      BaseModel = (await import('../base/base-model.js')).default;
    }
  } catch (error) {
    console.error('Error loading BaseModel:', error);
    throw error; // Re-throw the error to ensure the test fails
  }
}

await loadBaseModel()

export default class SumModel extends BaseModel {
  constructor() {
    super();
    this.signature.type = 'average';
    this.signature.version = '1.0.0';
    this.signature.hash = this.generateHash();
  }

  async computeNormal(data, options = {}) {
    if (!Array.isArray(data) || data.length === 0) {
      return { error: 'No data provided' };
    }

    const sum = data.reduce((a, b) => a + b, 0);
    
    return {
      result: sum,
      metadata: {
        count: data.length,
        timestamp: Date.now(),
        options
      }
    };
  }

  async computeWasm(data, options = {}) {
    const wasmLive = await this.initWasm();
    const values = data.map(item => item.value || item);
    // two option call direct or via export short cut
    // one
    // const result = await wasmLive.average(values);
    // two
    const result =  await wasmLive.callFunction('sum-statistics', 'average', values);
    // const result = await wasmLive.callFunction('average-statistics', values);
    return {
      result: result,
      metadata: {
        count: data.length,
        timestamp: Date.now(),
        options
      }
    };
  }
}
