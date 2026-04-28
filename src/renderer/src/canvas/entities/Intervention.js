/**
 * Intervention - Represents an intervention entity in the besearch canvas
 */
export class Intervention {
  constructor(data = {}) {
    this.id = data.id || `intervention-${Date.now()}`;
    this.interventionId = data.interventionId || data.id;
    this.name = data.name || 'New Intervention';
    this.description = data.description || '';
    this.status = data.status || 'pending';
    this.biomarkers = data.biomarkers || [];

    // Position and size
    this.x = data.x || 100;
    this.y = data.y || 100;
    this.width = data.width || 250;
    this.height = data.height || 120;
    this.dragBarHeight = data.dragBarHeight || 25;

    // Interaction state
    this.isDragging = false;
    this.isHovered = false;
    this.isSelected = false;

    // Linked cycles
    this.linkedCycles = data.linkedCycles || [];
  }

  /**
   * Update intervention state
   */
  update(deltaTime) {
    // Interventions don't have continuous updates, but this method
    // is here for consistency with the entity interface
  }

  /**
   * Render the intervention
   */
  render(ctx, viewport, zoom = 1, config = {}) {
    // Save context
    ctx.save();

    // Apply viewport transformation
    ctx.translate(-viewport.x, -viewport.y);
    ctx.scale(zoom, zoom);

    // Apply opacity if being dragged
    if (this.isDragging) {
      ctx.globalAlpha = 0.7;
    }

    // Draw shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Box background
    ctx.fillStyle = config.colors?.ui?.interventionBackground || '#ffffff';
    ctx.strokeStyle = this.getStatusColor(config);
    ctx.lineWidth = 3;

    // Draw rounded rectangle
    this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, 10);
    ctx.fill();
    ctx.stroke();

    // Clear shadow for text
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw drag bar at top
    ctx.fillStyle = config.colors?.ui?.dragBar || '#e0e0e0';
    ctx.fillRect(this.x, this.y, this.width, this.dragBarHeight);

    // Draw intervention name
    ctx.fillStyle = config.colors?.ui?.text || '#333';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(this.name, this.x + 10, this.y + 18);

    // Draw remove button (X) on the right side of drag bar
    ctx.fillStyle = config.colors?.ui?.removeButton || '#666';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('×', this.x + this.width - 20, this.y + 18);

    // Draw status badge
    const statusX = this.x + this.width - 80;
    ctx.fillStyle = this.getStatusColor(config);
    ctx.font = '12px Arial';
    ctx.fillText(this.status, statusX, this.y + 18);

    // Draw description (wrapped text)
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    const lines = this.wrapText(ctx, this.description, this.width - 20);
    lines.forEach((line, index) => {
      if (index < 2) { // Max 2 lines
        ctx.fillText(line, this.x + 10, this.y + 45 + (index * 15));
      }
    });

    // Draw biomarker count
    ctx.fillStyle = '#999';
    ctx.font = '11px Arial';
    ctx.fillText(`${this.biomarkers.length} biomarkers`, this.x + 10, this.y + this.height - 15);

    // Draw connection lines to linked cycles
    if (this.linkedCycles.length > 0) {
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = this.getStatusColor(config);
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);

      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;

      this.linkedCycles.forEach(cycleId => {
        // Note: The actual cycle position would need to be passed in
        // For now, we'll skip the connection lines in this entity render
        // They should be rendered by a higher-level system
      });

      ctx.setLineDash([]);
    }

    // Draw selection indicator
    if (this.isSelected) {
      ctx.strokeStyle = '#ff6b35';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      this.drawRoundedRect(ctx, this.x - 2, this.y - 2, this.width + 4, this.height + 4, 12);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Restore context
    ctx.restore();
  }

  /**
   * Draw a rounded rectangle
   */
  drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  /**
   * Wrap text to fit within max width
   */
  wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  /**
   * Get status color
   */
  getStatusColor(config) {
    return config.colors?.status?.[this.status] || '#9E9E9E';
  }

  /**
   * Check if point is inside intervention bounds
   */
  containsPoint(x, y) {
    return x >= this.x &&
           x <= this.x + this.width &&
           y >= this.y &&
           y <= this.y + this.height;
  }

  /**
   * Check if point is on drag bar
   */
  isDragBar(x, y) {
    return x >= this.x &&
           x <= this.x + this.width &&
           y >= this.y &&
           y <= this.y + this.dragBarHeight;
  }

  /**
   * Check if point is on remove button
   */
  isRemoveButton(x, y) {
    const buttonX = this.x + this.width - 30;
    const buttonY = this.y + 5;
    return x >= buttonX &&
           x <= buttonX + 20 &&
           y >= buttonY &&
           y <= buttonY + 20;
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
   * Add linked cycle
   */
  addLinkedCycle(cycleId) {
    if (!this.linkedCycles.includes(cycleId)) {
      this.linkedCycles.push(cycleId);
    }
  }

  /**
   * Remove linked cycle
   */
  removeLinkedCycle(cycleId) {
    const index = this.linkedCycles.indexOf(cycleId);
    if (index !== -1) {
      this.linkedCycles.splice(index, 1);
    }
  }

  /**
   * Get bounds for collision detection
   */
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  /**
   * Get center position
   */
  getCenter() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    };
  }

  /**
   * Get state for serialization
   */
  getState() {
    return {
      id: this.id,
      interventionId: this.interventionId,
      name: this.name,
      description: this.description,
      status: this.status,
      biomarkers: [...this.biomarkers],
      x: this.x,
      y: this.y,
      linkedCycles: [...this.linkedCycles]
    };
  }

  /**
   * Set state from serialized data
   */
  setState(state) {
    if (state.id !== undefined) this.id = state.id;
    if (state.interventionId !== undefined) this.interventionId = state.interventionId;
    if (state.name !== undefined) this.name = state.name;
    if (state.description !== undefined) this.description = state.description;
    if (state.status !== undefined) this.status = state.status;
    if (state.biomarkers) this.biomarkers = [...state.biomarkers];
    if (state.x !== undefined) this.x = state.x;
    if (state.y !== undefined) this.y = state.y;
    if (state.linkedCycles) this.linkedCycles = [...state.linkedCycles];
  }
}

export default Intervention;