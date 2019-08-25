// Provide game loop
// The game has four main states: load, setup, play, end

// TODO list
// 1. Using async as default workflow
// 2. Refactor/Abstract only when necessary
// 3. MVP game first
// 4. Try not to use tileset when possible to reduce size
import {
  Game
} from './engine/engine';
import {
  castleHallGameStart
} from './incidents/castleHallGameStart';

// Use default values for now
const game = new Game({
  container: document.getElementById('root'),
  pixelWidth: 640,
  pixelHeight: 640
});

// The update function will be getting called each animation
// frame. It will go through dirty flags to move game forward.
function update(dt) {
  // Step 1: load game assets
  if (!game.flag.isLoadAssets) {
    // Load sprites
    game.loadSprites();

    // Load sound assets
    game.loadSounds();
    game.flag.isLoadAssets = true;
    return false;
  }

  // Step2: Setup stage
  if (!game.flag.hasBuiltLayers) {
    // The game has three layers: background, main, foreground
    game.addLayer('background');
    game.addLayer('main');
    game.addLayer('foreground');

    game.flag.hasBuiltLayers = true;
    return false;
  }

  // Step 3: Play
  // The game will load each play states, which will manage its
  // own map, events, etc
  if (!game.flag.isPlayDirty) {
    game.flag.isPlayDirty = game.incidents
    .reduce((pre, post) => (typeof pre === 'boolean' ? pre : pre(game, dt)) && post(game, dt), true);
    return false;
  }

  if (!game.flag.isGameOver) {
    return false;
  }
}

// // Render castleHall
// const castleHallMap = createCastleHall();
// game.create

// Register render functions
game.loop.add(update);

// Start game loop
game.loop.start();

// Add first game incident
game.addIncident(castleHallGameStart, 'castleHallGameStart');

// For debug
if (IS_DEV_MODE) {
  window.game = game;
}