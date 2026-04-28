/**
 * CanvasInputHandler - Manages user input interactions with the besearch canvas
 * Handles mouse, touch, and keyboard events for canvas manipulation
 */

export class CanvasInputHandler {
  constructor(canvas, manager, config = {}) {
    this.canvas = canvas;
    this.manager = manager;
    this.config = {
      enablePan: true,
      enableZoom: true,
      enableSelection: true,
      enableDrag: true,
      minZoom: 0.1,
      maxZoom: 5.0,
      zoomSpeed: 0.1,
      ...config
    };

    this.state = {
      isDragging: false,
      isSelecting: false,
      lastMousePos: { x: 0, y: 0 },
      selectionStart: null,
      selectionRect: null,
      selectedEntities: new Set(),
      hoveredEntity: null,
      panOffset: { x: 0, y: 0 },
      zoom: 1.0
    };

    this.eventListeners = new Map();
    this.bindEvents();
  }

  /**
   * Bind all input event listeners to the canvas
   */
  bindEvents() {
    // Mouse events
    this.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.addEventListener('wheel', this.handleWheel.bind(this));
    this.addEventListener('contextmenu', this.handleContextMenu.bind(this));

    // Touch events for mobile
    this.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.addEventListener('touchend', this.handleTouchEnd.bind(this));

    // Keyboard events
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  /**
   * Add an event listener and track it for cleanup
   */
  addEventListener(event, handler) {
    this.canvas.addEventListener(event, handler);
    this.eventListeners.set(event, handler);
  }

  /**
   * Remove all event listeners
   */
  destroy() {
    this.eventListeners.forEach((handler, event) => {
      this.canvas.removeEventListener(event, handler);
    });
    this.eventListeners.clear();

    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }

  /**
   * Handle mouse down events
   */
  handleMouseDown(event) {
    const pos = this.getMousePos(event);
    this.state.lastMousePos = pos;

    if (event.button === 0) { // Left click
      const entity = this.getEntityAtPosition(pos);
      if (entity) {
        this.startDrag(entity, pos);
      } else if (this.config.enableSelection) {
        this.startSelection(pos);
      }
    } else if (event.button === 1) { // Middle click
      if (this.config.enablePan) {
        this.startPan(pos);
      }
    }

    event.preventDefault();
  }

  /**
   * Handle mouse move events
   */
  handleMouseMove(event) {
    const pos = this.getMousePos(event);

    if (this.state.isDragging) {
      this.updateDrag(pos);
    } else if (this.state.isSelecting) {
      this.updateSelection(pos);
    } else if (this.state.isPanning) {
      this.updatePan(pos);
    } else {
      this.updateHover(pos);
    }

    this.state.lastMousePos = pos;
  }

  /**
   * Handle mouse up events
   */
  handleMouseUp(event) {
    if (this.state.isDragging) {
      this.endDrag();
    } else if (this.state.isSelecting) {
      this.endSelection();
    } else if (this.state.isPanning) {
      this.endPan();
    }
  }

  /**
   * Handle mouse wheel for zooming
   */
  handleWheel(event) {
    if (!this.config.enableZoom) return;

    event.preventDefault();
    const delta = event.deltaY > 0 ? -this.config.zoomSpeed : this.config.zoomSpeed;
    this.zoom(delta, this.getMousePos(event));
  }

  /**
   * Handle right-click context menu
   */
  handleContextMenu(event) {
    event.preventDefault();
    // Emit context menu event for parent component to handle
    this.emit('contextmenu', {
      position: this.getMousePos(event),
      entity: this.getEntityAtPosition(this.getMousePos(event))
    });
  }

  /**
   * Handle touch start events
   */
  handleTouchStart(event) {
    if (event.touches.length === 1) {
      // Single touch - treat like mouse down
      const touch = event.touches[0];
      const pos = this.getTouchPos(touch);
      this.state.lastMousePos = pos;

      const entity = this.getEntityAtPosition(pos);
      if (entity && this.config.enableDrag) {
        this.startDrag(entity, pos);
      }
    } else if (event.touches.length === 2) {
      // Two finger touch - start pinch zoom
      this.startPinchZoom(event.touches);
    }

    event.preventDefault();
  }

  /**
   * Handle touch move events
   */
  handleTouchMove(event) {
    if (event.touches.length === 1 && this.state.isDragging) {
      const touch = event.touches[0];
      const pos = this.getTouchPos(touch);
      this.updateDrag(pos);
    } else if (event.touches.length === 2) {
      this.updatePinchZoom(event.touches);
    }

    event.preventDefault();
  }

  /**
   * Handle touch end events
   */
  handleTouchEnd(event) {
    if (this.state.isDragging) {
      this.endDrag();
    }
    if (this.state.isPinchZooming) {
      this.endPinchZoom();
    }
  }

  /**
   * Handle keyboard events
   */
  handleKeyDown(event) {
    const target = event.target;
    const tagName = target?.tagName?.toLowerCase();
    const isEditable = target?.isContentEditable || tagName === 'input' || tagName === 'textarea' || tagName === 'select';
    if (isEditable) {
      return;
    }
    // Handle peer movement with arrow keys or WASD
    let direction = null;
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        direction = 'up';
        event.preventDefault();
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        direction = 'down';
        event.preventDefault();
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        direction = 'left';
        event.preventDefault();
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        direction = 'right';
        event.preventDefault();
        break;
      case 'Delete':
      case 'Backspace':
        if (this.state.selectedEntities.size > 0) {
          this.emit('delete', Array.from(this.state.selectedEntities));
        }
        break;
      case 'Escape':
        this.clearSelection();
        break;
      case 'a':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.selectAll();
        }
        break;
      case 'c':
        if (event.ctrlKey || event.metaKey) {
          this.emit('copy', Array.from(this.state.selectedEntities));
        }
        break;
      case 'v':
        if (event.ctrlKey || event.metaKey) {
          this.emit('paste', this.state.lastMousePos);
        }
        break;
    }

    if (direction) {
      this.emit('peer-move', { direction });
    }
  }

  handleKeyUp(event) {
    // Stop peer movement when keys are released
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'w':
      case 'W':
      case 's':
      case 'S':
      case 'a':
      case 'A':
      case 'd':
      case 'D':
        this.emit('peer-stop');
        event.preventDefault();
        break;
    }
  }

  /**
   * Start dragging an entity
   */
  startDrag(entity, pos) {
    this.state.isDragging = true;
    this.state.draggedEntity = entity;
    this.state.dragStartPos = { ...pos };
    this.emit('dragstart', { entity, position: pos });
  }

  /**
   * Update drag position
   */
  updateDrag(pos) {
    if (!this.state.isDragging) return;

    const deltaX = pos.x - this.state.lastMousePos.x;
    const deltaY = pos.y - this.state.lastMousePos.y;

    this.emit('drag', {
      entity: this.state.draggedEntity,
      delta: { x: deltaX, y: deltaY },
      position: pos
    });
  }

  /**
   * End dragging
   */
  endDrag() {
    if (!this.state.isDragging) return;

    this.emit('dragend', {
      entity: this.state.draggedEntity,
      position: this.state.lastMousePos
    });

    this.state.isDragging = false;
    this.state.draggedEntity = null;
  }

  /**
   * Start selection rectangle
   */
  startSelection(pos) {
    this.state.isSelecting = true;
    this.state.selectionStart = { ...pos };
    this.state.selectionRect = {
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0
    };
  }

  /**
   * Update selection rectangle
   */
  updateSelection(pos) {
    if (!this.state.isSelecting) return;

    this.state.selectionRect = {
      x: Math.min(this.state.selectionStart.x, pos.x),
      y: Math.min(this.state.selectionStart.y, pos.y),
      width: Math.abs(pos.x - this.state.selectionStart.x),
      height: Math.abs(pos.y - this.state.selectionStart.y)
    };

    this.emit('selectionchange', this.state.selectionRect);
  }

  /**
   * End selection and select entities
   */
  endSelection() {
    if (!this.state.isSelecting) return;

    const selected = this.getEntitiesInRect(this.state.selectionRect);
    this.setSelection(selected);

    this.state.isSelecting = false;
    this.state.selectionStart = null;
    this.state.selectionRect = null;

    this.emit('selectionend', Array.from(this.state.selectedEntities));
  }

  /**
   * Start panning
   */
  startPan(pos) {
    this.state.isPanning = true;
    this.state.panStart = { ...pos };
  }

  /**
   * Update pan position
   */
  updatePan(pos) {
    if (!this.state.isPanning) return;

    const deltaX = pos.x - this.state.lastMousePos.x;
    const deltaY = pos.y - this.state.lastMousePos.y;

    this.state.panOffset.x += deltaX;
    this.state.panOffset.y += deltaY;

    this.emit('pan', { offset: this.state.panOffset, delta: { x: deltaX, y: deltaY } });
  }

  /**
   * End panning
   */
  endPan() {
    this.state.isPanning = false;
  }

  /**
   * Update hover state
   */
  updateHover(pos) {
    const entity = this.getEntityAtPosition(pos);
    if (entity !== this.state.hoveredEntity) {
      if (this.state.hoveredEntity) {
        this.emit('mouseleave', this.state.hoveredEntity);
      }
      this.state.hoveredEntity = entity;
      if (entity) {
        this.emit('mouseenter', entity);
      }
    }
  }

  /**
   * Zoom the canvas
   */
  zoom(delta, center = null) {
    const oldZoom = this.state.zoom;
    this.state.zoom = Math.max(
      this.config.minZoom,
      Math.min(this.config.maxZoom, oldZoom + delta)
    );

    if (center) {
      // Adjust pan offset to zoom towards mouse position
      const zoomFactor = this.state.zoom / oldZoom;
      this.state.panOffset.x = center.x - (center.x - this.state.panOffset.x) * zoomFactor;
      this.state.panOffset.y = center.y - (center.y - this.state.panOffset.y) * zoomFactor;
    }

    this.emit('zoom', {
      zoom: this.state.zoom,
      center,
      offset: this.state.panOffset
    });
  }

  /**
   * Start pinch zoom for touch
   */
  startPinchZoom(touches) {
    this.state.isPinchZooming = true;
    this.state.initialDistance = this.getTouchDistance(touches[0], touches[1]);
    this.state.initialZoom = this.state.zoom;
  }

  /**
   * Update pinch zoom
   */
  updatePinchZoom(touches) {
    if (!this.state.isPinchZooming) return;

    const distance = this.getTouchDistance(touches[0], touches[1]);
    const zoomFactor = distance / this.state.initialDistance;
    const newZoom = this.state.initialZoom * zoomFactor;

    this.state.zoom = Math.max(
      this.config.minZoom,
      Math.min(this.config.maxZoom, newZoom)
    );

    this.emit('zoom', { zoom: this.state.zoom });
  }

  /**
   * End pinch zoom
   */
  endPinchZoom() {
    this.state.isPinchZooming = false;
  }

  /**
   * Set selected entities
   */
  setSelection(entities) {
    this.state.selectedEntities = new Set(entities);
    this.emit('selectionchange', Array.from(this.state.selectedEntities));
  }

  /**
   * Clear current selection
   */
  clearSelection() {
    this.state.selectedEntities.clear();
    this.emit('selectionchange', []);
  }

  /**
   * Select all entities
   */
  selectAll() {
    const allEntities = this.manager.getAllEntities();
    this.setSelection(allEntities);
  }

  /**
   * Get entity at screen position
   */
  getEntityAtPosition(pos) {
    // Convert screen position to world position
    const worldPos = this.screenToWorld(pos);
    return this.manager.getEntityAtPosition(worldPos);
  }

  /**
   * Get entities within selection rectangle
   */
  getEntitiesInRect(rect) {
    const worldRect = {
      x: this.screenToWorld({ x: rect.x, y: rect.y }),
      y: this.screenToWorld({ x: rect.x + rect.width, y: rect.y + rect.height })
    };
    return this.manager.getEntitiesInRect(worldRect);
  }

  /**
   * Convert screen coordinates to world coordinates
   */
  screenToWorld(screenPos) {
    return {
      x: (screenPos.x - this.state.panOffset.x) / this.state.zoom,
      y: (screenPos.y - this.state.panOffset.y) / this.state.zoom
    };
  }

  /**
   * Convert world coordinates to screen coordinates
   */
  worldToScreen(worldPos) {
    return {
      x: worldPos.x * this.state.zoom + this.state.panOffset.x,
      y: worldPos.y * this.state.zoom + this.state.panOffset.y
    };
  }

  /**
   * Get mouse position relative to canvas
   */
  getMousePos(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  /**
   * Get touch position relative to canvas
   */
  getTouchPos(touch) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  }

  /**
   * Get distance between two touches
   */
  getTouchDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Emit event to parent component
   */
  emit(eventType, data) {
    if (this.onEvent) {
      this.onEvent(eventType, data);
    }
  }

  /**
   * Get current state for debugging or serialization
   */
  getState() {
    return {
      ...this.state,
      selectedEntities: Array.from(this.state.selectedEntities)
    };
  }

  /**
   * Set event callback
   */
  setEventCallback(callback) {
    this.onEvent = callback;
  }
}
