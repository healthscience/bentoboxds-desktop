// src/models/statistics/auto-regression.js
import BaseModel from '../base/base-model.js';

export default class AutoRegressionModel extends BaseModel {
  constructor() {
    super();
    this.signature.type = 'auto-regression';
    this.signature.hash = this.generateHash();
  }

  async verifyIntegrity() {
    return true;
  }

  async compute(data, options = {}) {
    if (!Array.isArray(data) || data.length < 2) {
      return { error: 'Insufficient data for auto-regression' };
    }

    const { lag = 1, order = 1 } = options;

    // Validate parameters
    if (lag < 1 || order < 1) {
      return { error: 'Lag and order must be positive integers' };
    }

    // Prepare data for auto-regression
    const preparedData = this.prepareData(data, lag, order);
    if (!preparedData) {
      return { error: 'Failed to prepare data for auto-regression' };
    }

    // Calculate coefficients
    const coefficients = this.calculateCoefficients(preparedData);
    if (!coefficients) {
      return { error: 'Failed to calculate auto-regression coefficients' };
    }

    // Generate future predictions
    const futureData = this.generateFutureData(data, coefficients, options);

    return {
      result: {
        coefficients,
        futureData
      },
      metadata: {
        count: data.length,
        lag,
        order,
        timestamp: Date.now(),
        options
      }
    };
  }

  prepareData(data, lag, order) {
    const prepared = [];
    const n = data.length;

    // Create lagged values
    for (let i = lag; i < n; i++) {
      const row = [];
      for (let j = 0; j < order; j++) {
        row.push(data[i - (j + 1)]);
      }
      row.push(data[i]);
      prepared.push(row);
    }

    return prepared;
  }

  calculateCoefficients(preparedData) {
    try {
      // Transpose the data matrix
      const transposed = preparedData[0].map((_, colIndex) => 
        preparedData.map(row => row[colIndex])
      );

      // Split into X (predictors) and Y (response)
      const X = transposed.slice(0, -1);
      const Y = transposed[transposed.length - 1];

      // Add intercept term
      X.unshift(Array(X[0].length).fill(1));

      // Calculate coefficients using least squares
      const XTX = X.map(row => 
        X.map(col => 
          row.reduce((sum, val, i) => sum + val * col[i], 0)
        )
      );

      const XTY = X.map(row => 
        row.reduce((sum, val, i) => sum + val * Y[i], 0)
      );

      // Solve the system of equations
      const coefficients = this.solveLinearSystem(XTX, XTY);
      return coefficients;
    } catch (error) {
      console.error('Error calculating coefficients:', error);
      return null;
    }
  }

  solveLinearSystem(A, b) {
    try {
      // Create augmented matrix
      const n = A.length;
      const augmented = A.map((row, i) => [...row, b[i]]);

      // Perform Gaussian elimination
      for (let i = 0; i < n; i++) {
        // Find pivot
        let maxRow = i;
        for (let j = i + 1; j < n; j++) {
          if (Math.abs(augmented[j][i]) > Math.abs(augmented[maxRow][i])) {
            maxRow = j;
          }
        }

        // Swap rows
        [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

        // Eliminate
        for (let j = i + 1; j < n; j++) {
          const factor = augmented[j][i] / augmented[i][i];
          for (let k = i; k <= n; k++) {
            augmented[j][k] -= factor * augmented[i][k];
          }
        }
      }

      // Back substitution
      const x = new Array(n);
      for (let i = n - 1; i >= 0; i--) {
        x[i] = augmented[i][n];
        for (let j = i + 1; j < n; j++) {
          x[i] -= augmented[i][j] * x[j];
        }
        x[i] /= augmented[i][i];
      }

      return x;
    } catch (error) {
      console.error('Error solving linear system:', error);
      return null;
    }
  }

  generateFutureData(data, coefficients, options) {
    const { futurePoints = 10 } = options;
    const lastX = data[data.length - 1];
    const lag = options.lag || 1;
    const order = options.order || 1;

    const futureData = [];
    let currentValues = data.slice(-lag);

    for (let i = 0; i < futurePoints; i++) {
      // Calculate next value using coefficients
      let nextValue = coefficients[0]; // Intercept
      for (let j = 0; j < order; j++) {
        nextValue += coefficients[j + 1] * currentValues[currentValues.length - (j + 1)];
      }

      // Add to future data
      futureData.push({
        x: lastX + i + 1,
        y: nextValue,
        predicted: true
      });

      // Update current values
      currentValues.push(nextValue);
      currentValues.shift();
    }

    return futureData;
  }
}