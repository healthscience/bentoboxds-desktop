// src/components/dataspace/upload/utils/jsonExtractor.js

export class JsonExtractor {
  constructor(rawData) {
    this.raw = rawData
    this.parsed = typeof rawData === 'string' ? JSON.parse(rawData) : rawData
  }

  /**
   * Safely resolves a dot-notation path (e.g., 'overlayData.cues') against the parsed JSON.
   */
  resolvePath(pathString) {
    if (!pathString || !this.parsed) return this.parsed
    const segments = pathString.split('.').filter(Boolean)
    let current = this.parsed

    for (const segment of segments) {
      if (current && typeof current === 'object' && segment in current) {
        current = current[segment]
      } else {
        return null // Path does not exist
      }
    }
    return current
  }

  /**
   * Discovers structural keys and columns from a resolved target path.
   * Handles both arrays of objects and deep key-value maps (like radix camera cues).
   */
  extractSchema(pathString = '') {
    const target = this.resolvePath(pathString)
    if (!target) return { columns: [], sampleRows: [], type: 'empty' }

    // Case 1: Array of objects (standard tabular JSON)
    if (Array.isArray(target)) {
      const sampleRows = target.slice(0, 10)
      const columnSet = new Set()
      target.slice(0, 50).forEach(row => {
        if (row && typeof row === 'object') {
          Object.keys(row).forEach(k => columnSet.add(k))
        }
      })
      return {
        columns: Array.from(columnSet),
        sampleRows,
        type: 'array'
      }
    }

    // Case 2: Object map (e.g., nested telemetry segments like torso, head, limbs)
    if (target !== null && typeof target === 'object') {
      const keys = Object.keys(target)
      const sampleRows = keys.slice(0, 10).map(k => ({ key: k, value: target[k] }))
      
      // Look deeper into the first entry to find sub-keys (e.g., hex keys or axes)
      let subKeys = []
      if (keys.length > 0 && typeof target[keys[0]] === 'object' && target[keys[0]] !== null) {
        subKeys = Object.keys(target[keys[0]])
      }

      return {
        columns: keys,
        subColumns: subKeys,
        sampleRows,
        type: 'object-map'
      }
    }

    return { columns: [], sampleRows: [target], type: 'primitive' }
  }
}