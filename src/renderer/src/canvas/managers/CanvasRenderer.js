/**
 * CanvasRenderer - Handles all canvas rendering operations for Besearch
 * Manages the HTML5 Canvas context and provides methods for drawing entities
 */
export class CanvasRenderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.width = canvasElement.width;
    this.height = canvasElement.height;

    // Rendering state
    this.isRendering = false;
    this.frameId = null;

    // Performance monitoring
    this.fps = 0;
    this.frameCount = 0;
    this.lastFpsUpdate = Date.now();

    // Images for backgrounds
    this.images = {};
    this.loadImages();

    // Bind methods
    this.render = this.render.bind(this);
    this.clear = this.clear.bind(this);
    this.resize = this.resize.bind(this);
    
    // Setup canvas immediately to get DPR
    this.setupCanvas();
  }

  /**
   * Load background images
   */
  loadImages() {
    // Body diagram removed for 3D integration
    // this.images.body = new Image();
    // this.images.body.src = '/src/assets/human-diagram.png';

    // Earth map (placeholder for now)
    // this.images.earth = new Image();
    // this.images.earth.src = '/src/assets/world-map.png';
  }

  /**
   * Initialize the renderer
   */
  init() {
    this.setupCanvas();
    this.startRenderLoop();
  }

  /**
   * Setup canvas properties
   */
  setupCanvas() {
    // Force a reflow to ensure we get the latest dimensions
    void this.canvas.offsetHeight;
    // Enable high DPI support
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Validate dimensions
    if (width === 0 || height === 0) {
      // Set minimum dimensions to prevent complete failure
      const fallbackWidth = Math.max(width, 800);
      const fallbackHeight = Math.max(height, 600);
      console.warn('CanvasRender--Using fallback dimensions:', { fallbackWidth, fallbackHeight });
      
      this.canvas.width = fallbackWidth * dpr;
      this.canvas.height = fallbackHeight * dpr;
      this.canvas.style.width = fallbackWidth + 'px';
      this.canvas.style.height = fallbackHeight + 'px';
    } else {
      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.canvas.style.width = width + 'px';
      this.canvas.style.height = height + 'px';
    }

    // Configure context
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    // Store DPR for coordinate conversion
    this.dpr = dpr;
    // Store actual dimensions for reference
    this.width = this.canvas.width / dpr;
    this.height = this.canvas.height / dpr;
  }

  /**
   * Start the render loop
   */
  startRenderLoop() {
    if (!this.isRendering) {
      this.isRendering = true;
      this.render();
    }
  }

  /**
   * Stop the render loop
   */
  stopRenderLoop() {
    this.isRendering = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  /**
   * Main render method - called each frame
   */
  render() {
    if (!this.isRendering) return;
    // Clear canvas
    this.clear();
    // Update FPS counter
    this.updateFPS();
    // Render entities (to be implemented by subclasses or through composition)
    this.renderEntities();
    // Continue render loop
    this.frameId = requestAnimationFrame(this.render);
  }

  /**
   * Clear the entire canvas
   */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Render all entities - specific to besearch implementation
   */
  renderEntities(entities, viewport, zoom, animationAngle, config) {
    // Save context and apply DPR scaling
    this.ctx.save();
    this.ctx.scale(this.dpr, this.dpr);
    
    // Render besearch cycles first (background layer)
    entities.cycles?.forEach(cycle => {
      cycle.render(this.ctx, viewport, zoom, animationAngle, config);
    });

    // Render interventions
    entities.interventions?.forEach(intervention => {
      intervention.render(this.ctx, viewport, zoom, config);
    });

    // Render peer last (foreground layer)
    if (entities.peer) {
      entities.peer.render(this.ctx, viewport, zoom);
    }

    // Render connection lines between interventions and cycles
    this.renderConnections(entities, viewport, zoom, config);
    
    // Restore context
    this.ctx.restore();
  }

  /**
   * Render mode-specific background
   */
  renderBackground(mode, viewport, zoom, config) {
    this.ctx.save();
    this.ctx.scale(this.dpr, this.dpr);
    this.ctx.translate(-viewport.x * zoom, -viewport.y * zoom);
    this.ctx.scale(zoom, zoom);
    switch (mode) {
      case 'cues':
        this.drawCuesBackground(viewport, config);
        break;
      case 'body':
        this.drawBodyBackground(viewport, config);
        break;
      case 'earth':
        this.drawEarthBackground(viewport, config);
        break;
    }
    this.ctx.restore();
  }

  /**
   * Render connection lines between linked entities
   */
  renderConnections(entities, viewport, zoom, config) {
    if (!entities.interventions || !entities.cycles) return;

    this.ctx.save();
    this.ctx.translate(-viewport.x, -viewport.y);
    this.ctx.scale(zoom, zoom);

    entities.interventions.forEach(intervention => {
      if (intervention.linkedCycles.length > 0) {
        const interventionCenter = intervention.getCenter();

        intervention.linkedCycles.forEach(cycleId => {
          const cycle = entities.cycles.find(c => c.id === cycleId);
          if (cycle) {
            // Draw connection line
            this.ctx.globalAlpha = 0.3;
            this.ctx.strokeStyle = intervention.getStatusColor(config);
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(interventionCenter.x, interventionCenter.y);
            this.ctx.lineTo(cycle.x, cycle.y);
            this.ctx.stroke();
          }
        });
      }
    });

    this.ctx.setLineDash([]);
    this.ctx.restore();
  }

  /**
   * Draw cues mode background (grid)
   */
  drawCuesBackground(viewport, config) {
    const gridSize = config.rendering.gridSize || 20;
    const startX = Math.floor(viewport.x / gridSize) * gridSize;
    const startY = Math.floor(viewport.y / gridSize) * gridSize;
    const endX = viewport.x + viewport.width;
    const endY = viewport.y + viewport.height;

    this.ctx.strokeStyle = '#e0e0e0';
    this.ctx.lineWidth = 1;

    // Vertical lines
    for (let x = startX; x <= endX; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, startY);
      this.ctx.lineTo(x, endY);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = startY; y <= endY; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(startX, y);
      this.ctx.lineTo(endX, y);
      this.ctx.stroke();
    }
  }

  /**
   * Draw body mode background (human diagram)
   */
  drawBodyBackground(viewport, config) {
    // Intentionally left blank to allow 3D canvas to show through
  }

  /**
   * Draw earth mode background (simple world representation)
   */
  drawEarthBackground(viewport, config) {
    const bounds = config.modeSettings.earth.worldBounds;
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    const radius = Math.min(bounds.width, bounds.height) / 3;

    // Draw simple earth circle
    this.ctx.fillStyle = '#4A90E2';
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    this.ctx.fill();

    // Add some continents (simplified)
    this.ctx.fillStyle = '#228B22';
    // Simple landmasses
    this.ctx.beginPath();
    this.ctx.arc(centerX - radius * 0.3, centerY, radius * 0.4, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(centerX + radius * 0.2, centerY - radius * 0.2, radius * 0.3, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * Update FPS calculation
   */
  updateFPS() {
    this.frameCount++;
    const now = Date.now();
    const delta = now - this.lastFpsUpdate;

    if (delta >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / delta);
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }
  }

  /**
   * Handle canvas resize
   */
  resize() {
    this.setupCanvas();
  }

  /**
   * Draw a rectangle
   */
  drawRect(x, y, width, height, color = '#000000', filled = true) {
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;

    if (filled) {
      this.ctx.fillRect(x, y, width, height);
    } else {
      this.ctx.strokeRect(x, y, width, height);
    }
  }

  /**
   * Draw a circle
   */
  drawCircle(x, y, radius, color = '#000000', filled = true) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;

    if (filled) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }

  /**
   * Draw text
   */
  drawText(text, x, y, options = {}) {
    const {
      font = '16px Arial',
      color = '#000000',
      align = 'left',
      baseline = 'top',
      isUI = false // Default to world text that respects zoom/DPR
    } = options;

    this.ctx.save();

    // For UI text, scale coordinates to device pixels
    if (isUI) {
      x *= this.dpr;
      y *= this.dpr;
    }

    this.ctx.font = font;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = baseline;

    this.ctx.fillText(text, x, y);

    this.ctx.restore();
  }

  /**
   * Draw a line
   */
  drawLine(x1, y1, x2, y2, color = '#000000', width = 1) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  /**
   * Get current FPS
   */
  getFPS() {
    return this.fps;
  }

  /**
   * Cleanup resources
   */
  destroy() {
    this.stopRenderLoop();
    this.ctx = null;
    this.canvas = null;
  }
}