import { createGameLoop } from './util';
import { CanvasRenderer } from './renderers/canvas';
import * as spriteClassMap from '../sprites';

const DEFAULT_GAME_WIDTH = 480;
const DEFAULT_GAME_HEIGHT = 480;
const DEFAULT_NUM_TILE_WIDTH = 32;
const DEFAULT_NUM_TILE_HEIGHT = 32;
// Can be 'fit', 'fixed'
const DEFAULT_SCALE_MODE = 'fit';
const DEFAULT_BACKGROUND_COLOR = '#000';
const DEFAULT_FPS = 60;
const DEFAULT_RENDERER = new CanvasRenderer();

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
      container = document.createElement('div')
    } = options;

    Object.assign(this, {
      pixelWidth,
      pixelHeight,
      width,
      height,
      scaleMode,
      backgroundColor,
      sprites: [],
      container,
      flag: {},
      incidents: [],
      incidentMap: {},
      layerMap: {},
      keyMap: {},
      loop: Game.createGameLoop(fps)
    });
  }

  static createGameLoop(fps) {
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
  
    gameLoop.run = () => {
      gameLoop.timeoutId = window.requestAnimationFrame(gameLoop.run);
  
      const now = Date.now();
      const lastRun = gameLoop.lastRun;
      gameLoop.lastRun = now;
  
      if (gameLoop.isPaused) {
        return;
      }
  
      const dt = now - lastRun;
      if (dt >= 1000 / fps) {
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
    gameLoop.lastRun = Date.now();
  
    return gameLoop;
  }

  static createKeyInteraction(keyCodes = []) {
    const keyObj = {
      keyCodes,
      isDown: false,
      isUp: true,
    };

    document.addEventListener('keydown', (evt) => {
      if (keyObj.keyCodes.indexOf(evt.keyCode) === -1) {
        return;
      }

      keyObj.isDown = true;
      keyObj.isUp = false;
      evt.preventDefault();
    });

    document.addEventListener('keyup', (evt) => {
      if (keyObj.keyCodes.indexOf(evt.keyCode) === -1) {
        return;
      }

      keyObj.isDown = false;
      keyObj.isUp = true;
      evt.preventDefault();
    });
    
    return keyObj;
  }

  // Load all sprite classes
  loadSprites() {
    this.spriteClassMap = spriteClassMap;
  }

  /**
   * Load sound assets
   */
  loadSounds() {

  }

  addInteractionKey(keyId, keyObj) {
    this.keyMap[keyId] = keyObj;
  }

  /**
   * Add game layers
   */
  addLayer(layerKey = 'layer', options = {}) {
    const {
      width = this.pixelWidth,
      height = this.pixelHeight,
      renderer = new CanvasRenderer({
        width,
        height,
        container: this.container,
        key: layerKey
      })
    } = options;

    this.layerMap[layerKey] = renderer;
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

  /**
   * Create a sprite object
   * @param {string} spriteKey the key to hash sprite data
   */
  createSprite(spriteKey = '', options = {}) {
    return new this.spriteClassMap[spriteKey](options);
  }
}

export class Group {
  constructor(options = {}) {
    Object.assign(this, {
      x: 0,
      y: 0,
      width: DEFAULT_NUM_TILE_WIDTH,
      height: DEFAULT_NUM_TILE_HEIGHT,
      children: [],
      parent: null,
      type: 'group',
    }, options);
  }

  get renderer() {
    let renderer = this._renderer;
    while (!renderer && this.parent) {
      renderer = this.parent.renderer;
    }

    return renderer;
  }

  set renderer(renderer) {
    this._renderer = renderer;
  }

  // Add sprite (or another group) to children
  add(obj) {
    this.children.push(obj);
    obj.parent = this;
  };

  render() {
    this.children.forEach(child => child.render(this.renderer))
  }

  update(dt) {
    this.children.forEach(child => child.update(dt))
  }

  getSpriteByName(spriteName) {
    return this.getSprite('name', spriteName);
  }

  getSprite(key, value) {
    let sprite;

    for (let i = 0; i < this.children.length; i++) {
      const item = this.children[i];
      if (item instanceof Group) {
        sprite = item.getSprite(key, value);
      }
      else if (item.type === 'sprite' && item[key] === value) {
        sprite = item;
      }

      if (sprite) {
        return sprite;
      }
    }

    return null;
  }
}

// export class MapGroup extends Group {
//   constructor(options = {}) {
//     super(options);

//     const {
//       pixelWidth = DEFAULT_GAME_WIDTH,
//       pixelHeight = DEFAULT_GAME_HEIGHT
//     } = options;

//     Object.assign(this, {
//       pixelWidth,
//       pixelHeight
//     });
//   }
// }

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

