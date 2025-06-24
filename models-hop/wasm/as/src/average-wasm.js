// src/models/wasm/average-wasm.js
export function average(values) {
  if (values.length === 0) return 0.0;
  
  let sum = 0.0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
  }
  
  return sum / values.length;
}