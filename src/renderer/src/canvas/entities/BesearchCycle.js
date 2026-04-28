/**
 * BesearchCycle - Represents a besearch cycle entity in the canvas
 */
export class BesearchCycle {
  constructor(data = {}) {
    this.id = data.id || `cycle-${Date.now()}`;
    this.name = data.name || 'New Cycle';
    this.description = data.description || '';
    this.x = data.x || 200;
    this.y = data.y || 200;
    this.active = data.active !== false;
    this.cueSpace = data.cueSpace || {};

    // Visual properties
    this.radius = 60;
    this.image = null;
    this.imageLoaded = false;
    this.animationOffset = Math.random() * Math.PI * 2; // Random starting position

    // Interaction state
    this.isHovered = false;
    this.isDragging = false;
    this.isSelected = false;

    // Linked interventions
    this.linkedInterventions = data.linkedInterventions || [];

    this.loadImage(data.imageSrc);
  }

  /**
   * Load cycle image
   */
  loadImage(src) {
    if (src) {
      this.image = new Image();
      this.image.onload = () => {
        this.imageLoaded = true;
      };
      this.image.src = src;
    }
  }

  /**
   * Update cycle animation
   */
  update(deltaTime, animationAngle) {
    // Animation is handled by the global animation angle
    // Individual offset creates variety
  }

  /**
   * Render the besearch cycle
   */
  render(ctx, viewport, zoom = 1, animationAngle = 0, config = {}) {
    // Save context
    ctx.save();

    // Apply viewport transformation
    ctx.translate(-viewport.x, -viewport.y);
    ctx.scale(zoom, zoom);

    const centerX = this.x;
    const centerY = this.y;
    const radius = config.cycle?.clickRadius || 60;

    // Draw colored rings for linked interventions
    if (this.linkedInterventions.length > 0) {
      ctx.save();

      this.linkedInterventions.forEach((intervention, index) => {
        const statusColor = this.getStatusColor(intervention.status, config);
        ctx.strokeStyle = statusColor;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + (index * 10), 0, 2 * Math.PI);
        ctx.stroke();
      });

      ctx.restore();
    }

    // Draw the main cycle circle background
    ctx.fillStyle = this.active ? '#e3f2fd' : '#f5f5f5';
    ctx.strokeStyle = this.active ? '#2196f3' : '#bdbdbd';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Draw the text
    ctx.fillStyle = config.colors?.ui?.text || '#140d6b';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.name, centerX, centerY);

    // Draw animated image if loaded
    if (this.imageLoaded && this.image) {
      const imageSize = 40;
      const angle = animationAngle + this.animationOffset;
      const imageX = centerX + (config.animation?.cycleRadius || 100) * 0.3 * Math.cos(angle);
      const imageY = centerY + (config.animation?.cycleRadius || 100) * 0.3 * Math.sin(angle);

      ctx.drawImage(
        this.image,
        imageX - imageSize/2,
        imageY - imageSize/2,
        imageSize,
        imageSize
      );
    }

    // Draw edit button (top-right)
    this.drawButton(ctx, centerX, centerY, radius, -Math.PI / 4, '✎',
                   config.colors?.ui?.editButtonBg || '#007bff',
                   config.colors?.ui?.editButton || '#ffffff');

    // Draw remove button (top-left)
    this.drawButton(ctx, centerX, centerY, radius, 3 * Math.PI / 4, '✕',
                   config.colors?.ui?.removeButtonBg || '#dc3545',
                   config.colors?.ui?.removeButton || '#ffffff');

    // Draw selection indicator
    if (this.isSelected) {
      ctx.strokeStyle = '#ff6b35';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Restore context
    ctx.restore();
  }

  /**
   * Draw a button on the cycle
   */
  drawButton(ctx, centerX, centerY, radius, angle, text, bgColor, textColor) {
    const buttonX = centerX + radius * Math.cos(angle);
    const buttonY = centerY + radius * Math.sin(angle);
    const buttonRadius = 12;

    // Button background
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.arc(buttonX, buttonY, buttonRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Button text
    ctx.fillStyle = textColor;
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, buttonX, buttonY);
  }

  /**
   * Check if point is inside cycle
   */
  containsPoint(x, y) {
    const dx = x - this.x;
    const dy = y - this.y;
    return Math.sqrt(dx * dx + dy * dy) <= this.radius;
  }

  /**
   * Check if point is on edit button
   */
  isEditButton(x, y) {
    return this.isButton(x, y, -Math.PI / 4);
  }

  /**
   * Check if point is on remove button
   */
  isRemoveButton(x, y) {
    return this.isButton(x, y, 3 * Math.PI / 4);
  }

  /**
   * Check if point is on a specific button
   */
  isButton(x, y, angle) {
    const buttonX = this.x + this.radius * Math.cos(angle);
    const buttonY = this.y + this.radius * Math.sin(angle);
    const dx = x - buttonX;
    const dy = y - buttonY;
    return Math.sqrt(dx * dx + dy * dy) <= 12;
  }

  /**
   * Get status color for intervention
   */
  getStatusColor(status, config) {
    return config.colors?.status?.[status] || '#9E9E9E';
  }

  /**
   * Set position
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Move by delta
   */
  move(deltaX, deltaY) {
    this.x += deltaX;
    this.y += deltaY;
  }

  /**
   * Add linked intervention
   */
  addLinkedIntervention(interventionId) {
    if (!this.linkedInterventions.includes(interventionId)) {
      this.linkedInterventions.push(interventionId);
    }
  }

  /**
   * Remove linked intervention
   */
  removeLinkedIntervention(interventionId) {
    const index = this.linkedInterventions.indexOf(interventionId);
    if (index !== -1) {
      this.linkedInterventions.splice(index, 1);
    }
  }

  /**
   * Get bounds for collision detection
   */
  getBounds() {
    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2
    };
  }

  /**
   * Get state for serialization
   */
  getState() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      x: this.x,
      y: this.y,
      active: this.active,
      cueSpace: { ...this.cueSpace },
      linkedInterventions: [...this.linkedInterventions]
    };
  }

  /**
   * Set state from serialized data
   */
  setState(state) {
    if (state.name !== undefined) this.name = state.name;
    if (state.description !== undefined) this.description = state.description;
    if (state.x !== undefined) this.x = state.x;
    if (state.y !== undefined) this.y = state.y;
    if (state.active !== undefined) this.active = state.active;
    if (state.cueSpace) this.cueSpace = { ...state.cueSpace };
    if (state.linkedInterventions) this.linkedInterventions = [...state.linkedInterventions];
  }
}

export default BesearchCycle;