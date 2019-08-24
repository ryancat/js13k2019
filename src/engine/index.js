import * as canvas from './renderers/canvas';

const DEFAULT_GAME_WIDTH = 800;
const DEFAULT_GAME_HEIGHT = 800;
const DEFAULT_NUM_TILE_WIDTH = 32;
const DEFAULT_NUM_TILE_HEIGHT = 32;
// Can be 'fit', 'fixed'
const DEFAULT_SCALE_MODE = 'fit';
const DEFAULT_BACKGROUND_COLOR = '#000';
const DEFAULT_FPS = 60;
const DEFAULT_RENDERER = canvas;

export class Game {
  constructor(options = {}) {
    const {
      pixelWidth = DEFAULT_GAME_WIDTH,
      pixelHeight = DEFAULT_GAME_HEIGHT,
      width = DEFAULT_NUM_TILE_WIDTH,
      height = DEFAULT_NUM_TILE_HEIGHT,
      scaleMode = DEFAULT_SCALE_MODE,
      backgroundColor = DEFAULT_BACKGROUND_COLOR,
      fps = DEFAULT_FPS,
      renderer = DEFAULT_RENDERER
    } = options;

    Object.assign(this, {
      pixelWidth,
      pixelHeight,
      width,
      height,
      scaleMode,
      backgroundColor,
      renderer,
      sprites: [],
      flag: {},
      incidents: [],
      incidentMap: {},
      loop: createGameLoop(fps)
    });
  }

  // Load all sprite classes
  loadSprites(sprites = []) {
    
  }

  /**
   * Load sound assets
   */
  loadSounds() {

  }

  /**
   * Add game layers
   */
  addLayer(options) {

  }

  /**
   * Add game incident function
   */
  addIncident(incidentFn, name = Date.now().toString()) {
    this.incidentMap[name] = {
      timeStamp: Date.now(),
      fn: incidentFn
    };

    this.incidents.push(incidentFn);
  }
}

class Group {
  constructor({
    x,
    y,
    width,
    height,
    type,
    parent,
    renderer,
    children
  }) {
    Object.assign(this, {
      x,
      y,
      width,
      height,
      children,
      parent,
      type,
      renderer
    });
  }

  // Add sprite (or another group) to children
  add(obj) {
    this.children.push(obj);
    obj.parent = this;
  };

  render() {
    this.children.forEach(child => child.render())
  }

  update(dt) {
    this.children.forEach(child => child.update(dt))
  }
}

export class Scene extends Group {
  constructor(game, {
    camera = game.camera,
    renderer = game.renderer,
    x = 0,
    y = 0,
    width = game.width,
    height = game.height,
    children = []
  }) {
    super({
      x,
      y,
      width,
      height,
      type: 'scene',
      renderer,
      children
    });

    this.camera = camera;
  }
}

export class SpriteGroup extends Group {
  constructor(scene, {
    renderer = scene.renderer,
    x = 0,
    y = 0,
    width = scene.width,
    height = scene.height,
    children = []
  }) {
    super({
      x,
      y,
      width,
      height,
      type: 'spriteGroup',
      renderer,
      children
    });
  }
}

export class Sprite {
  constructor({
    id = -1,
    width = 1,
    height = 1,
    parent,
    currentFilmIndex = 0,
    fps = 0,
    render = () => {},
    update = () => {}
  }) {
    Object.assign(this, {
      id,
      width,
      height,
      parent,
      fps,
      currentFilmIndex,
      render,
      update
    })
  }
}

function createGameLoop(fps) {
  const gameLoop = {
    fps,
    callbacks: [],
    isPaused: true,
    timeoutId: null
  };

  gameLoop.add = (...callbacks) => {
    Array.prototype.push.apply(gameLoop.callbacks, callbacks);
  }

  gameLoop.remove = (callback) => {
    const index = gameLoop.callbacks.indexOf(callback);
    if (index >= 0) {
      gameLoop.callbacks.splice(index, 1);
    }
  };

  gameLoop.removeAll = () => {
    gameLoop.callbacks = [];
  };

  gameLoop.run = (upTime) => {
    gameLoop.timeoutId = window.requestAnimationFrame(gameLoop.run);

    if (gameLoop.isPaused) {
      return;
    }

    let dt;
    if (!gameLoop.lastRun || (dt = Date.now() - gameLoop.lastRun) && (dt >= 1000 / fps)) {
      // We need to check game fps to decide if we should run registered callbacks
      gameLoop.callbacks.forEach(callback => callback(dt));
    }
  };

  gameLoop.start = () => {
    gameLoop.isPaused = false;
  };

  gameLoop.stop = () => {
    gameLoop.isPaused = true;
    gameLoop.lastRun = null;
  };

  gameLoop.run();

  return gameLoop;
}
