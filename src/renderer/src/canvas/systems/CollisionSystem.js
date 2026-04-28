/**
 * CollisionSystem - Handles collision detection between canvas entities
 * Provides efficient hit detection for cycles, interventions, and peer interactions
 */
export class CollisionSystem {
  constructor() {
    this.entities = new Map()
    this.collisionLayers = new Map()
  }

  /**
   * Register an entity for collision detection
   * @param {string} id - Unique entity identifier
   * @param {Object} entity - Entity object with position and bounds
   * @param {string} layer - Collision layer (e.g., 'cycles', 'interventions', 'peer')
   */
  registerEntity(id, entity, layer = 'default') {
    if (!this.collisionLayers.has(layer)) {
      this.collisionLayers.set(layer, new Set())
    }

    this.entities.set(id, { entity, layer })
    this.collisionLayers.get(layer).add(id)
  }

  /**
   * Unregister an entity from collision detection
   * @param {string} id - Entity identifier to remove
   */
  unregisterEntity(id) {
    if (this.entities.has(id)) {
      const { layer } = this.entities.get(id)
      this.collisionLayers.get(layer).delete(id)
      this.entities.delete(id)
    }
  }

  /**
   * Check collision between two entities
   * @param {Object} entity1 - First entity with position and bounds
   * @param {Object} entity2 - Second entity with position and bounds
   * @returns {boolean} True if entities collide
   */
  checkCollision(entity1, entity2) {
    // Simple circle collision for cycles and interventions
    if (entity1.radius && entity2.radius) {
      const dx = entity1.x - entity2.x
      const dy = entity1.y - entity2.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      return distance < (entity1.radius + entity2.radius)
    }

    // Rectangle collision for other entities
    if (entity1.width && entity1.height && entity2.width && entity2.height) {
      return !(entity1.x + entity1.width < entity2.x ||
               entity2.x + entity2.width < entity1.x ||
               entity1.y + entity1.height < entity2.y ||
               entity2.y + entity2.height < entity1.y)
    }

    return false
  }

  /**
   * Get all entities colliding with the given entity
   * @param {string} entityId - ID of the entity to check
   * @param {string} targetLayer - Optional layer to check against
   * @returns {Array} Array of colliding entity IDs
   */
  getCollisions(entityId, targetLayer = null) {
    const sourceEntity = this.entities.get(entityId)
    if (!sourceEntity) return []

    const collisions = []
    const layersToCheck = targetLayer ? [targetLayer] : Array.from(this.collisionLayers.keys())

    layersToCheck.forEach(layer => {
      if (this.collisionLayers.has(layer)) {
        this.collisionLayers.get(layer).forEach(targetId => {
          if (targetId !== entityId) {
            const targetEntity = this.entities.get(targetId)
            if (targetEntity && this.checkCollision(sourceEntity.entity, targetEntity.entity)) {
              collisions.push(targetId)
            }
          }
        })
      }
    })

    return collisions
  }

  /**
   * Check if point is inside entity bounds
   * @param {number} x - Point x coordinate
   * @param {number} y - Point y coordinate
   * @param {Object} entity - Entity to check against
   * @returns {boolean} True if point is inside entity
   */
  pointInEntity(x, y, entity) {
    if (entity.radius) {
      // Circle bounds
      const dx = x - entity.x
      const dy = y - entity.y
      return Math.sqrt(dx * dx + dy * dy) <= entity.radius
    }

    if (entity.width && entity.height) {
      // Rectangle bounds
      return x >= entity.x && x <= entity.x + entity.width &&
             y >= entity.y && y <= entity.y + entity.height
    }

    return false
  }

  /**
   * Find entity at given point
   * @param {number} x - Point x coordinate
   * @param {number} y - Point y coordinate
   * @param {string} layer - Optional layer to search in
   * @returns {string|null} Entity ID or null if none found
   */
  getEntityAtPoint(x, y, layer = null) {
    const layersToCheck = layer ? [layer] : Array.from(this.collisionLayers.keys())

    for (const layerName of layersToCheck) {
      if (this.collisionLayers.has(layerName)) {
        for (const entityId of this.collisionLayers.get(layerName)) {
          const { entity } = this.entities.get(entityId)
          if (this.pointInEntity(x, y, entity)) {
            return entityId
          }
        }
      }
    }

    return null
  }

  /**
   * Clear all registered entities
   */
  clear() {
    this.entities.clear()
    this.collisionLayers.clear()
  }

  /**
   * Get all entities in a layer
   * @param {string} layer - Layer name
   * @returns {Array} Array of entity objects
   */
  getEntitiesInLayer(layer) {
    if (!this.collisionLayers.has(layer)) return []

    return Array.from(this.collisionLayers.get(layer)).map(id => ({
      id,
      ...this.entities.get(id)
    }))
  }
}