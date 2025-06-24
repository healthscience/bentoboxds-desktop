// src/models/statistics/sum.js
import BaseModel from '../base/base-model.js';

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
















/*
export default class SumModel extends BaseModel {
  constructor() {
    super();
    this.signature.type = 'sum';
    this.signature.hash = this.generateHash();
  }

  async compute(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return { error: 'Invalid data' };
    }
    
    const sum = data.reduce((a, b) => a + b, 0);
    
    return {
      result: sum,
      metadata: {
        count: data.length,
        timestamp: Date.now()
      }
    };
  }
}
  */