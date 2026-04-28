import peerImage from '../../assets/peerlogo.png';

/**
 * Peer - Represents the player character in the besearch canvas
 */
export class Peer {
  constructor(config = {}) {
    this.id = 'peer';
    this.x = config.x || 100;
    this.y = config.y || 100;
    this.width = config.width || 20;
    this.height = config.height || 20;
    this.speed = config.speed || 5;

    // Movement state
    this.isMoving = false;
    this.direction = { x: 0, y: 0 };
    this.targetDirection = { x: 0, y: 0 };

    // Visual state
    this.image = null;
    this.imageLoaded = false;

    // World bounds for collision
    this.worldBounds = config.worldBounds || { width: 5000, height: 5000 };

    this.loadImage(config.imageSrc || peerImage);
  }

  /**
   * Load peer image
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
   * Update peer position and state
   */
  update(deltaTime) {
    if (this.isMoving) {
      // Update position based on direction
      const newX = this.x + this.direction.x * this.speed;
      const newY = this.y + this.direction.y * this.speed;

      // Keep within world bounds
      this.x = Math.max(0, Math.min(this.worldBounds.width - this.width, newX));
      this.y = Math.max(0, Math.min(this.worldBounds.height - this.height, newY));
    }
  }

  /**
   * Set movement direction
   */
  setDirection(direction) {
    // Handle both object and string formats for backward compatibility
    if (typeof direction === 'string') {
      switch(direction) {
        case 'up':
          this.direction = { x: 0, y: -1 };
          break;
        case 'down':
          this.direction = { x: 0, y: 1 };
          break;
        case 'left':
          this.direction.x = -1;
          this.direction.y = 0;
          break;
        case 'right':
          this.direction.x = 1;
          this.direction.y = 0;
          break;
        default:
          this.direction = { x: 0, y: 0 };
      }
    } else if (direction && typeof direction === 'object') {
      this.direction = { ...direction };
    } else {
      this.direction = { x: 0, y: 0 };
    }

    // Update moving state
    this.isMoving = this.direction.x !== 0 || this.direction.y !== 0;
  }

  /**
   * Set position directly
   */
  setPosition(x, y) {
    this.x = Math.max(0, Math.min(this.worldBounds.width - this.width, x));
    this.y = Math.max(0, Math.min(this.worldBounds.height - this.height, y));
  }

  /**
   * Move to specific position
   */
  moveTo(x, y) {
    this.setPosition(x, y);
  }

  /**
   * Stop movement
   */
  stop() {
    this.isMoving = false;
    this.direction = { x: 0, y: 0 };
  }

  /**
   * Render the peer
   */
  render(ctx, viewport, zoom = 1) {
    // Save context
    ctx.save();

    // Apply viewport transformation
    ctx.translate(-viewport.x, -viewport.y);

    // Apply zoom
    ctx.scale(zoom, zoom);

    if (this.imageLoaded && this.image) {
      // Draw the image
      ctx.drawImage(
        this.image,
        this.x,
        this.y,
        this.width,
        this.height
      );
    } else {
      // Fallback: draw a simple rectangle
      ctx.fillStyle = '#007bff';
      ctx.fillRect(this.x, this.y, this.width, this.height);

      // Add a simple face
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(this.x + 5, this.y + 5, 5, 5); // Left eye
      ctx.fillRect(this.x + 20, this.y + 5, 5, 5); // Right eye
      ctx.fillRect(this.x + 10, this.y + 15, 10, 3); // Mouth
    }

    // Restore context
    ctx.restore();
  }

  /**
   * Check if point is inside peer bounds
   */
  containsPoint(x, y) {
    return x >= this.x &&
           x <= this.x + this.width &&
           y >= this.y &&
           y <= this.y + this.height;
  }

  /**
   * Get peer bounds
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
   * Get peer center position
   */
  getCenter() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    };
  }

  /**
   * Get peer position
   */
  getPosition() {
    return { x: this.x, y: this.y };
  }

  /**
   * Get state for serialization
   */
  getState() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      direction: { ...this.direction },
      isMoving: this.isMoving
    };
  }

  /**
   * Set state from serialized data
   */
  setState(state) {
    if (state.x !== undefined) this.x = state.x;
    if (state.y !== undefined) this.y = state.y;
    if (state.direction) this.direction = { ...state.direction };
    if (state.isMoving !== undefined) this.isMoving = state.isMoving;
  }
}

export default Peer;