/**
 * GameLoop - Manages the animation frame loop for the besearch canvas
 */
export class GameLoop {
  constructor(updateCallback, renderCallback) {
    this.updateCallback = updateCallback;
    this.renderCallback = renderCallback;

    this.isRunning = false;
    this.frameId = null;
    this.lastTime = 0;
    this.deltaTime = 0;
    this.fps = 0;
    this.frameCount = 0;
    this.fpsUpdateTime = 0;

    // Target 15 FPS for better browser performance
    this.targetFPS = 15;
    this.frameInterval = 1000 / this.targetFPS;
    this.lastFrameTime = 0;

    this.bindMethods();
  }

  /**
   * Bind methods to maintain context
   */
  bindMethods() {
    this.loop = this.loop.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  /**
   * Start the game loop
   */
  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastTime = performance.now();
    this.lastFrameTime = this.lastTime;

    // Listen for visibility changes to pause/resume
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    this.frameId = requestAnimationFrame(this.loop);
  }

  /**
   * Stop the game loop
   */
  stop() {
    this.isRunning = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  /**
   * Handle visibility change to pause/resume loop
   */
  handleVisibilityChange() {
    if (document.hidden) {
      // Pause the loop when tab is not visible
      if (this.frameId) {
        cancelAnimationFrame(this.frameId);
        this.frameId = null;
      }
    } else {
      // Resume the loop when tab becomes visible
      if (this.isRunning && !this.frameId) {
        this.lastTime = performance.now();
        this.frameId = requestAnimationFrame(this.loop);
      }
    }
  }

  /**
   * Main game loop
   */
  loop(currentTime) {
    if (!this.isRunning) return;

    // Calculate delta time
    this.deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Cap delta time to prevent large jumps (e.g., when tab is inactive)
    this.deltaTime = Math.min(this.deltaTime, 100); // Max 100ms delta

    // Update FPS counter
    this.frameCount++;
    if (currentTime - this.fpsUpdateTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.fpsUpdateTime));
      this.frameCount = 0;
      this.fpsUpdateTime = currentTime;
    }

    // Always update and render for now, but could be optimized later
    // Update game state
    if (this.updateCallback) {
      this.updateCallback(this.deltaTime);
    }

    // Render
    if (this.renderCallback) {
      this.renderCallback();
    }

    // Continue the loop at target FPS
    this.frameId = requestAnimationFrame(this.loop);
  }

  /**
   * Set target FPS
   */
  setTargetFPS(fps) {
    this.targetFPS = fps;
    this.frameInterval = 1000 / this.targetFPS;
  }

  /**
   * Get current FPS
   */
  getFPS() {
    return this.fps;
  }

  /**
   * Get delta time
   */
  getDeltaTime() {
    return this.deltaTime;
  }

  /**
   * Check if loop is running
   */
  isLoopRunning() {
    return this.isRunning;
  }

  /**
   * Force a render frame (useful for non-animated updates)
   */
  forceRender() {
    if (this.renderCallback) {
      this.renderCallback();
    }
  }

  /**
   * Update callbacks
   */
  setUpdateCallback(callback) {
    this.updateCallback = callback;
  }

  setRenderCallback(callback) {
    this.renderCallback = callback;
  }
}

export default GameLoop;