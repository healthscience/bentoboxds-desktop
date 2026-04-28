/**
 * Teaching Utility
 * Handles teaching data processing and validation
 */

class TeachingUtility {
  constructor() {
    this.sessionValidation = {
      minActions: 1,
      maxActions: 100,
      maxQueryLength: 500
    }
  }

  /**
   * Validate a teaching session
   */
  validateSession(session) {
    if (!session || !session.id) {
      return { valid: false, error: 'Invalid session structure' }
    }

    if (!session.query || session.query.trim().length === 0) {
      return { valid: false, error: 'Query cannot be empty' }
    }

    if (session.query.length > this.sessionValidation.maxQueryLength) {
      return { valid: false, error: 'Query too long' }
    }

    if (!session.actions || session.actions.length < this.sessionValidation.minActions) {
      return { valid: false, error: 'Session must have at least one action' }
    }

    if (session.actions.length > this.sessionValidation.maxActions) {
      return { valid: false, error: 'Too many actions in session' }
    }

    return { valid: true }
  }

  /**
   * Format session for export
   */
  formatSessionForExport(session) {
    return {
      id: session.id,
      peerId: session.peerId,
      query: session.query,
      actions: session.actions.map(action => ({
        component: action.component,
        method: action.method,
        args: this.sanitizeArgs(action.args),
        timestamp: action.timestamp,
        order: action.order
      })),
      startTime: session.startTime,
      endTime: session.endTime,
      duration: this.calculateDuration(session.startTime, session.endTime)
    }
  }

  /**
   * Sanitize arguments to remove sensitive data
   */
  sanitizeArgs(args) {
    if (!args) return null
    
    // Deep clone to avoid modifying original
    const sanitized = JSON.parse(JSON.stringify(args))
    
    // Remove any potential sensitive fields
    const sensitiveFields = ['password', 'token', 'secret', 'key']
    
    const removeSensitive = (obj) => {
      for (const key in obj) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          obj[key] = '[REDACTED]'
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          removeSensitive(obj[key])
        }
      }
    }
    
    if (typeof sanitized === 'object') {
      removeSensitive(sanitized)
    }
    
    return sanitized
  }

  /**
   * Calculate session duration in milliseconds
   */
  calculateDuration(startTime, endTime) {
    if (!startTime || !endTime) return 0
    return new Date(endTime).getTime() - new Date(startTime).getTime()
  }

  /**
   * Group actions by component
   */
  groupActionsByComponent(actions) {
    const grouped = {}
    
    actions.forEach(action => {
      if (!grouped[action.component]) {
        grouped[action.component] = []
      }
      grouped[action.component].push(action)
    })
    
    return grouped
  }

  /**
   * Generate session summary
   */
  generateSessionSummary(session) {
    const actionGroups = this.groupActionsByComponent(session.actions)
    const components = Object.keys(actionGroups)
    
    return {
      query: session.query,
      componentsUsed: components,
      totalActions: session.actions.length,
      actionsByComponent: Object.entries(actionGroups).map(([component, actions]) => ({
        component,
        count: actions.length,
        methods: [...new Set(actions.map(a => a.method))]
      })),
      duration: this.calculateDuration(session.startTime, session.endTime)
    }
  }

  /**
   * Check if session is similar to existing sessions
   */
  findSimilarSessions(session, existingSessions, threshold = 0.8) {
    const similar = []
    
    existingSessions.forEach(existing => {
      const similarity = this.calculateSimilarity(session, existing)
      if (similarity >= threshold) {
        similar.push({
          session: existing,
          similarity
        })
      }
    })
    
    return similar.sort((a, b) => b.similarity - a.similarity)
  }

  /**
   * Calculate similarity between two sessions
   */
  calculateSimilarity(session1, session2) {
    // Simple similarity based on query and actions
    const querySimilarity = this.stringSimilarity(session1.query, session2.query)
    
    // Compare action sequences
    const actions1 = session1.actions.map(a => `${a.component}.${a.method}`)
    const actions2 = session2.actions.map(a => `${a.component}.${a.method}`)
    
    const actionSimilarity = this.sequenceSimilarity(actions1, actions2)
    
    // Weighted average
    return (querySimilarity * 0.6) + (actionSimilarity * 0.4)
  }

  /**
   * Simple string similarity (Jaccard index on words)
   */
  stringSimilarity(str1, str2) {
    const words1 = new Set(str1.toLowerCase().split(/\s+/))
    const words2 = new Set(str2.toLowerCase().split(/\s+/))
    
    const intersection = new Set([...words1].filter(x => words2.has(x)))
    const union = new Set([...words1, ...words2])
    
    return union.size === 0 ? 0 : intersection.size / union.size
  }

  /**
   * Sequence similarity (longest common subsequence ratio)
   */
  sequenceSimilarity(seq1, seq2) {
    if (seq1.length === 0 || seq2.length === 0) return 0
    
    const lcs = this.longestCommonSubsequence(seq1, seq2)
    return (2 * lcs) / (seq1.length + seq2.length)
  }

  /**
   * Longest common subsequence length
   */
  longestCommonSubsequence(seq1, seq2) {
    const m = seq1.length
    const n = seq2.length
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (seq1[i - 1] === seq2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
        }
      }
    }
    
    return dp[m][n]
  }
}

export default TeachingUtility