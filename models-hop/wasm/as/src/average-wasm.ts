// Add debugging to track the values being read
export function average(offset: i32, length: i32): f64 {
  // Validate input parameters
  if (length === 0) return 0.0;
  if (offset < 0 || length < 0) {
    throw new Error('Invalid offset/length: must be non-negative');
  }

  // Check if we would overflow memory bounds
  const maxOffset = 256 * 65536; // 256 pages * 64KB per page
  if (offset + (length * 8) > maxOffset) {
    throw new Error('Memory access would overflow bounds');
  }

  let sum: f64 = 0.0;
  
  // Directly access memory using offset
  for (let i: i32 = 0; i < length; i++) {
    const value = load<f64>(offset + (i * 8)); // Each f64 is 8 bytes
    sum += value;
  }
  
  return sum / length;
}