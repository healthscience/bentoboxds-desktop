/**
 * BesearchCanvasManager - Main orchestrator for the besearch canvas system
 * Coordinates between all canvas components for besearch functionality
 */

import { CanvasRenderer } from './CanvasRenderer.js';
import { CanvasInputHandler } from './CanvasInputHandler.js';
import { CanvasStateManager } from './CanvasStateManager.js';
import { GameLoop } from '../systems/GameLoop.js';
import { HOPDataBridge } from '../systems/HOPDataBridge.js';
import { Peer } from '../entities/Peer.js';
import { BesearchCycle } from '../entities/BesearchCycle.js';
import { Intervention } from '../entities/Intervention.js';
import { CanvasConfig } from '../config/CanvasConfig.js';

export class BesearchCanvasManager {

  constructor(canvasElement, besearchStore, config = {}) {
    this.canvas = canvasElement;
    this.besearchStore = besearchStore;
    this.config = { ...CanvasConfig, ...config };
    this.lastValidCanvasSize = {
      width: this.config.width,
      height: this.config.height
    };

    // Core components
    this.renderer = null;
    this.inputHandler = null;
    this.stateManager = null;
    this.gameLoop = null;
    this.dataBridge = null;

    // Entities
    this.peer = null;
    this.cycles = new Map(); // cycleId -> BesearchCycle
    this.interventions = new Map(); // interventionId -> Intervention

    // Interaction state
    this.draggingEntity = null;
    this.dragOffset = { x: 0, y: 0 };

    // Event callbacks
    this.eventCallbacks = new Map();

    this.initializeComponents();
    this.setupEventHandlers();
    this.loadInitialData();
  }

  /**
   * Initialize all canvas components
   */
  initializeComponents() {
    // Get actual canvas dimensions FIRST before creating any managers
    const rect = this.canvas.getBoundingClientRect();
    // Validate dimensions
    if (rect.width === 0 || rect.height === 0) {
      console.error('BesearchCanvasManager: Canvas has zero dimensions!', rect);
      throw new Error('Canvas initialization failed: zero dimensions');
    }
    // Create renderer to setup canvas (this may change canvas dimensions due to DPR)
    this.renderer = new CanvasRenderer(this.canvas);
    // Pass canvas element to config for dynamic viewport dimensions
    this.config.canvasElement = this.canvas;
    // Create state manager with canvas element reference for dynamic dimensions
    this.stateManager = new CanvasStateManager(this.config);
    // Create input handler
    this.inputHandler = new CanvasInputHandler(this.canvas, this, this.config.input);
    // Create game loop
    this.gameLoop = new GameLoop(
      this.update.bind(this),
      this.render.bind(this)
    );
    // Create data bridge
    this.dataBridge = new HOPDataBridge(this.besearchStore);
    // Set up input event callbacks
    this.inputHandler.setEventCallback(this.handleInputEvent.bind(this));
    // Set up state change callbacks
    this.stateManager.setStateChangeCallback(this.handleStateChange.bind(this));
    // Set up data bridge event listeners
    this.dataBridge.on('cycles-updated', this.handleCyclesUpdated.bind(this));
    this.dataBridge.on('intervention-selected', this.handleInterventionSelected.bind(this));
    this.dataBridge.on('category-selected', this.handleCategorySelected.bind(this));
    this.dataBridge.on('canvas-state-updated', this.handleCanvasStateUpdated.bind(this));
  }

  /**
   * Set up event handlers
   */
  setupEventHandlers() {
    // Window resize handler
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  /**
   * Handle resize events
   */
  handleResize() {
    // Update canvas dimensions
    if (this.renderer) {
      this.renderer.resize();
    }
    // Re-center viewport on peer if peer exists
    if (this.peer) {
      this.stateManager.centerOn(this.peer);
    }
  }

  /**
   * Load initial data from store
   */
  loadInitialData() {
    // Load canvas state
    const canvasState = this.dataBridge.getCanvasState();
    // Restore zoom and panOffset from saved state if available
    if (canvasState.zoom !== undefined) {
      this.stateManager.zoom = canvasState.zoom;
    } else {
      this.stateManager.zoom = 1.0;
    }
    
    if (canvasState.panOffset) {
      this.stateManager.panOffset = { ...canvasState.panOffset };
    } else {
      this.stateManager.panOffset = { x: 0, y: 0 };
    }
    
    // Restore current mode if available
    if (canvasState.currentMode) {
      this.stateManager.setMode(canvasState.currentMode);
    } else {
    }
    
    // Create peer at saved position or center of the world bounds
    let peerX = canvasState.peerPosition ? canvasState.peerPosition.x : this.config.worldBounds.width / 2;
    let peerY = canvasState.peerPosition ? canvasState.peerPosition.y : this.config.worldBounds.height / 2;
    
    this.peer = new Peer({
      x: peerX,
      y: peerY,
      direction: canvasState.peerDirection || { x: 0, y: 0 },
      worldBounds: this.config.worldBounds
    });
    
    // Set viewport position from saved state or center on peer
    if (canvasState.viewport) {
      this.stateManager.setViewport(canvasState.viewport.x, canvasState.viewport.y);
    } else {
      // Center viewport on peer if no saved viewport position
      this.stateManager.centerOn(this.peer);
    }
    
    // Load cycles
    const cycles = this.dataBridge.getBesearchCycles();
    cycles.forEach(cycleData => {
      this.addCycle(cycleData);
    });
    
    // Load interventions
    const interventions = this.dataBridge.getInterventions();
    interventions.forEach(interventionData => {
      this.addIntervention(interventionData);
    });
  }

  /**
   * Start the canvas system
   */
  start() {
    this.gameLoop.start();
  }

  /**
   * Stop the canvas system
   */
  stop() {
    this.gameLoop.stop();
  }

  /**
   * Update game state
   */
  update(deltaTime) {
    // Update peer
    if (this.peer) {
      this.peer.update(deltaTime);
      // Center viewport on peer
      this.stateManager.centerOn(this.peer);
    }
    // Update cycles
    this.cycles.forEach(cycle => {
      cycle.update(deltaTime, this.stateManager.animationAngle);
    });
    // Update interventions
    this.interventions.forEach(intervention => {
      intervention.update(deltaTime);
    });
    // Update state manager animation
    this.stateManager.updateAnimation(deltaTime);
  }

  /**
   * Render the canvas
   */
  render() {
    // Clear canvas
    this.renderer.clear();
    // Get current viewport
    const viewport = this.stateManager.viewport;
    const zoom = this.stateManager.zoom;
    // Render background for current mode
    this.renderer.renderBackground(this.stateManager.currentMode, viewport, zoom, this.config);
    // Render entities (common for all modes)
    this.renderer.renderEntities({
      peer: this.peer,
      cycles: Array.from(this.cycles.values()),
      interventions: Array.from(this.interventions.values())
    }, viewport, zoom, this.stateManager.animationAngle, this.config);
    // Render mode-specific UI elements
    switch (this.stateManager.currentMode) {
      case 'cues':
        this.renderCuesUI(viewport, zoom);
        break;
      case 'body':
        this.renderBodyUI(viewport, zoom);
        break;
      case 'earth':
        this.renderEarthUI(viewport, zoom);
        break;
    }
  }

  /**
   * Render cues mode UI
   */
  renderCuesUI(viewport, zoom) {
    // Mode title is displayed via HTML element
  }

  /**
   * Render body mode UI
   */
  renderBodyUI(viewport, zoom) {
    // Mode title is displayed via HTML element
  }

  /**
   * Render earth mode UI
   */
  renderEarthUI(viewport, zoom) {
    // Mode title is displayed via HTML element
  }

  /**
   * Handle input events
   */
  handleInputEvent(eventType, data) {
    switch (eventType) {
      case 'mousedown':
        this.handleMouseDown(data);
        break;
      case 'mousemove':
        this.handleMouseMove(data);
        break;
      case 'mouseup':
        this.handleMouseUp(data);
        break;
      case 'dragstart':
        this.draggingEntity = data?.entity || null;
        if (this.draggingEntity && data?.position) {
          const worldPos = this.stateManager.screenToWorld(data.position);

          if (this.draggingEntity instanceof Intervention) {
            if (this.draggingEntity.isRemoveButton(worldPos.x, worldPos.y)) {
              this.removeIntervention(this.draggingEntity.id);
              this.draggingEntity = null;
              return;
            }

            if (!this.draggingEntity.isDragBar(worldPos.x, worldPos.y)) {
              this.draggingEntity = null;
              return;
            }

            this.draggingEntity.isDragging = true;
          }

          if (this.draggingEntity instanceof BesearchCycle) {
            if (this.draggingEntity.isEditButton(worldPos.x, worldPos.y)) {
              this.emit('cycle-edit', this.draggingEntity);
              this.draggingEntity = null;
              return;
            }
            if (this.draggingEntity.isRemoveButton(worldPos.x, worldPos.y)) {
              if (confirm(`Delete ${this.draggingEntity.name}?`)) {
                this.removeCycle(this.draggingEntity.id);
              }
              this.draggingEntity = null;
              return;
            }
          }

          this.dragOffset = {
            x: worldPos.x - this.draggingEntity.x,
            y: worldPos.y - this.draggingEntity.y
          };
        }
        break;
      case 'drag':
        if (this.draggingEntity && data?.position) {
          const worldPos = this.stateManager.screenToWorld(data.position);
          this.draggingEntity.setPosition(
            worldPos.x - this.dragOffset.x,
            worldPos.y - this.dragOffset.y
          );
        }
        break;
      case 'dragend':
        if (this.draggingEntity) {
          if (this.draggingEntity instanceof Intervention) {
            this.checkInterventionCycleLinking(this.draggingEntity);
            this.draggingEntity.isDragging = false;
            this.dataBridge.updateIntervention(this.draggingEntity.id, {
              x: this.draggingEntity.x,
              y: this.draggingEntity.y
            });
          }

          if (this.draggingEntity instanceof BesearchCycle) {
            this.dataBridge.updateBesearchCycle(this.draggingEntity.id, {
              x: this.draggingEntity.x,
              y: this.draggingEntity.y
            });
          }

          this.draggingEntity = null;
          this.dragOffset = { x: 0, y: 0 };
        }
        break;
      case 'pan':
        this.stateManager.pan(data.delta.x, data.delta.y);
        break;
      case 'zoom':
        this.stateManager.setZoom(data.zoom, data.center);
        break;
      case 'peer-move':
        this.handlePeerMove(data.direction);
        break;
      case 'peer-stop':
        this.handlePeerStop();
        break;
    }
  }

  /**
   * Handle mouse down events
   */
  handleMouseDown(event) {
    const worldPos = this.stateManager.screenToWorld(event.position);
    // Check cycles first
    for (const cycle of this.cycles.values()) {
      if (cycle.containsPoint(worldPos.x, worldPos.y)) {
        if (cycle.isEditButton(worldPos.x, worldPos.y)) {
          this.emit('cycle-edit', cycle);
          return;
        } else if (cycle.isRemoveButton(worldPos.x, worldPos.y)) {
          if (confirm(`Delete ${cycle.name}?`)) {
            this.removeCycle(cycle.id);
          }
          return;
        } else {
          // Start dragging cycle
          this.draggingEntity = cycle;
          this.dragOffset = {
            x: worldPos.x - cycle.x,
            y: worldPos.y - cycle.y
          };
          return;
        }
      }
    }

    // Check interventions
    for (const intervention of this.interventions.values()) {
      if (intervention.containsPoint(worldPos.x, worldPos.y)) {
        if (intervention.isRemoveButton(worldPos.x, worldPos.y)) {
          this.removeIntervention(intervention.id);
          return;
        } else if (intervention.isDragBar(worldPos.x, worldPos.y)) {
          // Start dragging intervention
          this.draggingEntity = intervention;
          this.dragOffset = {
            x: worldPos.x - intervention.x,
            y: worldPos.y - intervention.y
          };
          intervention.isDragging = true;
          return;
        }
      }
    }
  }

  /**
   * Handle mouse move events
   */
  handleMouseMove(event) {
    const worldPos = this.stateManager.screenToWorld(event.position);

    if (this.draggingEntity) {
      // Update dragged entity position
      this.draggingEntity.setPosition(
        worldPos.x - this.dragOffset.x,
        worldPos.y - this.dragOffset.y
      );
    }
  }

  /**
   * Handle mouse up events
   */
  handleMouseUp(event) {
    if (this.draggingEntity) {
      if (this.draggingEntity instanceof Intervention) {
        // Check for linking to nearby cycles
        this.checkInterventionCycleLinking(this.draggingEntity);
        this.draggingEntity.isDragging = false;
      }

      // Save position to store
      if (this.draggingEntity instanceof BesearchCycle) {
        this.dataBridge.updateBesearchCycle(this.draggingEntity.id, {
          x: this.draggingEntity.x,
          y: this.draggingEntity.y
        });
      }

      this.draggingEntity = null;
      this.dragOffset = { x: 0, y: 0 };
    }
  }

  /**
   * Check for linking interventions to nearby cycles
   */
  checkInterventionCycleLinking(intervention) {
    const interventionCenter = intervention.getCenter();
    intervention.linkedCycles = [];

    for (const cycle of this.cycles.values()) {
      const distance = Math.sqrt(
        Math.pow(interventionCenter.x - cycle.x, 2) +
        Math.pow(interventionCenter.y - cycle.y, 2)
      );

      if (distance < this.config.intervention.linkDistance) {
        intervention.addLinkedCycle(cycle.id);
        cycle.addLinkedIntervention(intervention.id);
      }
    }

    // Update store
    this.dataBridge.updateIntervention(intervention.id, {
      linkedCycles: intervention.linkedCycles
    });
  }

  /**
   * Set canvas mode
   */
  setMode(mode) {    
    // Save current peer position before switching
    if (this.peer) {
      this.dataBridge.updatePeerPosition(this.peer.getPosition());
    }

    this.stateManager.setMode(mode);
    this.besearchStore.setCurrentMode(mode);

    // Reset zoom to 1.0 for new mode
    this.stateManager.resetZoom();

    // Load peer position for new mode
    const newPosition = this.dataBridge.getCanvasState().peerPosition;
    if (this.peer) {
      this.peer.setPosition(newPosition.x, newPosition.y);
      // Center viewport on peer after position is set
      this.stateManager.centerOn(this.peer);
    }
  }

  /**
   * Update peer position
   */
  updatePeerPosition(position) {
    if (this.peer) {
      this.peer.setPosition(position.x, position.y);
      this.dataBridge.updatePeerPosition(position);
    }
  }

  /**
   * Update peer direction
   */
  updatePeerDirection(direction) {
    if (this.peer) {
      this.peer.setDirection(direction);
      this.dataBridge.updatePeerDirection(direction);
    }
  }

  /**
   * Handle peer movement from keyboard input
   */
  handlePeerMove(direction) {
    this.updatePeerDirection(direction);
  }

  /**
   * Handle peer stop from keyboard input
   */
  handlePeerStop() {
    if (this.peer) {
      this.peer.stop();
      this.dataBridge.updatePeerDirection({ x: 0, y: 0 });
    }
  }

  /**
   * Add a besearch cycle
   */
  addCycle(cycleData) {
    const cycle = new BesearchCycle(cycleData);
    this.cycles.set(cycle.id, cycle);
    this.dataBridge.addBesearchCycle(cycle.getState());
  }

  /**
   * Remove a besearch cycle
   */
  removeCycle(cycleId) {
    if (this.cycles.has(cycleId)) {
      this.cycles.delete(cycleId);
      this.dataBridge.removeBesearchCycle(cycleId);
    }
  }

  /**
   * Add an intervention
   */
  addIntervention(interventionData) {
    const intervention = new Intervention(interventionData);
    this.interventions.set(intervention.id, intervention);
    this.dataBridge.addIntervention(intervention.getState());
  }

  /**
   * Remove an intervention
   */
  removeIntervention(interventionId) {
    if (this.interventions.has(interventionId)) {
      // Remove from linked cycles
      const intervention = this.interventions.get(interventionId);
      intervention.linkedCycles.forEach(cycleId => {
        const cycle = this.cycles.get(cycleId);
        if (cycle) {
          cycle.removeLinkedIntervention(interventionId);
        }
      });

      this.interventions.delete(interventionId);
      this.dataBridge.removeIntervention(interventionId);
    }
  }

  /**
   * Handle state changes
   */
  handleStateChange(type, data) {
    switch (type) {
      case 'viewport':
        this.dataBridge.updateViewport(data);
        break;
      case 'zoom':
        // Save zoom to store
        this.dataBridge.updateZoom(data);
        // Emit zoom change event for UI updates
        this.emit('zoom-changed', data);
        break;
      case 'pan':
        // Save pan offset to store
        this.dataBridge.updatePanOffset(data);
        break;
    }
  }

  /**
   * Handle cycles updated from store
   */
  handleCyclesUpdated(cycles) {
    // Update existing cycles and add new ones
    cycles.forEach(cycleData => {
      if (this.cycles.has(cycleData.id)) {
        const cycle = this.cycles.get(cycleData.id);
        cycle.setState(cycleData);
      } else {
        this.addCycle(cycleData);
      }
    });

    // Remove cycles that no longer exist in store
    const storeCycleIds = new Set(cycles.map(c => c.id));
    for (const cycleId of this.cycles.keys()) {
      if (!storeCycleIds.has(cycleId)) {
        this.cycles.delete(cycleId);
      }
    }
  }

  /**
   * Handle intervention selected
   */
  handleInterventionSelected(intervention) {
    this.emit('intervention-selected', intervention);
  }

  /**
   * Handle category selected
   */
  handleCategorySelected(category) {
    this.emit('category-selected', category);
  }

  /**
   * Handle canvas state updated
   */
  handleCanvasStateUpdated(state) {
    if (this.peer && state.peerPosition) {
      this.peer.setPosition(state.peerPosition.x, state.peerPosition.y);
    }
    if (this.peer && state.peerDirection) {
      this.peer.setDirection(state.peerDirection);
    }
    if (state.viewport) {
      this.stateManager.setViewport(state.viewport.x, state.viewport.y);
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Resize renderer first
    this.renderer.resize();

    // Get new canvas dimensions
    const rect = this.canvas.getBoundingClientRect();
    const newWidth = rect.width;
    const newHeight = rect.height;

    // Ignore zero-size measurements (e.g., hidden modal) to preserve last valid size
    if (newWidth === 0 || newHeight === 0) {
      return;
    }

    // Update config
    this.config.width = newWidth;
    this.config.height = newHeight;
    this.lastValidCanvasSize = { width: newWidth, height: newHeight };

    // Update state manager
    this.stateManager.handleResize(newWidth, newHeight);
    
    // Re-center viewport on peer to maintain centered position
    if (this.peer) {
      this.stateManager.centerOn(this.peer);
    }
  }

  /**
   * Set event callback
   */
  setEventCallback(callback) {
    this.eventCallbacks.set('default', callback);
  }

  /**
   * Add event listener
   */
  on(eventType, callback) {
    if (!this.eventCallbacks.has(eventType)) {
      this.eventCallbacks.set(eventType, new Set());
    }
    this.eventCallbacks.get(eventType).add(callback);
  }

  /**
   * Remove event listener
   */
  off(eventType, callback) {
    if (this.eventCallbacks.has(eventType)) {
      this.eventCallbacks.get(eventType).delete(callback);
    }
  }

  /**
   * Emit event
   */
  emit(eventType, data) {
    // Emit to default callback
    const defaultCallback = this.eventCallbacks.get('default');
    if (defaultCallback) {
      defaultCallback(eventType, data);
    }

    // Emit to specific event listeners
    const listeners = this.eventCallbacks.get(eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${eventType} event listener:`, error);
        }
      });
    }
  }

  /**
   * Get entity at world position
   */
  getEntityAtPosition(worldPos) {
    // Check interventions first (they're on top)
    for (const intervention of this.interventions.values()) {
      if (intervention.containsPoint(worldPos.x, worldPos.y)) {
        return intervention;
      }
    }

    // Check cycles
    for (const cycle of this.cycles.values()) {
      if (cycle.containsPoint(worldPos.x, worldPos.y)) {
        return cycle;
      }
    }

    // Check peer
    if (this.peer && this.peer.containsPoint(worldPos.x, worldPos.y)) {
      return this.peer;
    }

    return null;
  }

  /**
   * Get entities within rectangle
   */
  getEntitiesInRect(worldRect) {
    const entities = [];

    // Check all entity types
    for (const intervention of this.interventions.values()) {
      if (this.isEntityInRect(intervention, worldRect)) {
        entities.push(intervention);
      }
    }

    for (const cycle of this.cycles.values()) {
      if (this.isEntityInRect(cycle, worldRect)) {
        entities.push(cycle);
      }
    }

    if (this.peer && this.isEntityInRect(this.peer, worldRect)) {
      entities.push(this.peer);
    }

    return entities;
  }

  /**
   * Get all entities
   */
  getAllEntities() {
    const entities = [];

    if (this.peer) entities.push(this.peer);
    entities.push(...Array.from(this.cycles.values()));
    entities.push(...Array.from(this.interventions.values()));
    return entities;
  }

  /**
   * Check if entity is within rectangle
   */
  isEntityInRect(entity, rect) {
    const bounds = entity.getBounds();
    return !(bounds.x + bounds.width < rect.x ||
             bounds.y + bounds.height < rect.y ||
             bounds.x > rect.x + rect.width ||
             bounds.y > rect.y + rect.height);
  }

  /**
   * Get canvas state for debugging
   */
  getState() {
    return {
      peer: this.peer ? this.peer.getState() : null,
      cycles: Array.from(this.cycles.values()).map(c => c.getState()),
      interventions: Array.from(this.interventions.values()).map(i => i.getState()),
      viewport: this.stateManager.getState()
    };
  }

  /**
   * Destroy the canvas manager
   */
  destroy() {
    this.stop();
    if (this.inputHandler) {
      this.inputHandler.destroy();
    }
    if (this.gameLoop) {
      this.gameLoop.stop();
    }
    this.cycles.clear();
    this.interventions.clear();
    this.eventCallbacks.clear();
    window.removeEventListener('resize', this.handleResize);
  }
}
