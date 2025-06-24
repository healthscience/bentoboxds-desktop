// src/models/statistics/linear-regression.js
import BaseModel from '../base/base-model.js';
import { linearRegression, linearRegressionLine } from 'simple-statistics';

export default class LinearRegressionModel extends BaseModel {
  constructor() {
    super();
    this.signature.type = 'linear-regression';
    this.signature.hash = this.generateHash();
  }

  async compute(data, options = {}) {
    if (!Array.isArray(data) || data.length < 2) {
      return { error: 'Insufficient data for linear regression' };
    }

    // Format data for simple-statistics
    const formattedData = data.map(item => [
      item.x || item.timestamp,
      item.y || item.value
    ]);

    // Calculate regression
    const regression = linearRegression(formattedData);
    const regressionLine = linearRegressionLine(regression);

    // Generate future predictions
    const futureData = this.generateFutureData(data, regressionLine, options);

    return {
      result: {
        slope: regression.m,
        intercept: regression.b,
        futureData
      },
      metadata: {
        count: data.length,
        timestamp: Date.now(),
        options
      }
    };
  }

  generateFutureData(data, regressionLine, options) {
    const { futurePoints = 10 } = options;
    const lastX = data[data.length - 1].x || data[data.length - 1].timestamp;
    
    return Array.from({ length: futurePoints }, (_, i) => {
      const x = lastX + i + 1;
      const y = regressionLine(x);
      return {
        x,
        y,
        predicted: true
      };
    });
  }
}