import os from 'os'
import { createHash } from 'crypto-browserify';

export default class BaseModel {
  constructor() {
    this.signature = {
      type: 'base',
      version: '1.0.0',
      hash: ''
    };
    this.wasmWrap = null;
    this.signature.hash = this.generateHash();
  }

  generateHash() {
    const data = `${this.signature.type}:${this.signature.version}`;
    return createHash('sha256')
      .update(data)
      .digest('hex');
  }

  async verify() {
    const currentHash = this.generateHash();
    return this.signature.hash === currentHash;
  }

  async initWasm() {
    if (!this.wasmWrap) {
      let wasmWrapper = {};
      if (os.platform() === 'win32') {
        let pathWrap = path.join(os.homedir(), 'hop-models', 'wasm', 'wasm-wrapper.js');
        wasmWrapper = await import(pathWrap);
      } else {
        wasmWrapper = await import('../wasm/wasm-wrapper.js');
      }
      this.wasmWrap = wasmWrapper.default;
    }
    return this.wasmWrap;
  }

  async compute(data, options = {}) {
    if (options.useWasm) {
      return await this.computeWasm(data, options);
    }
    return await this.computeNormal(data, options);
  }

  async computeNormal(data, options = {}) {
    throw new Error('computeNormal must be implemented by subclass');
  }

  async computeWasm(data, options = {}) {
    throw new Error('computeWasm must be implemented by subclass');
  }
}