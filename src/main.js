// Provide game loop
// The game has four main states: load, setup, play, end

// TODO list
// 1. Using async as default workflow
// 2. Refactor/Abstract only when necessary
// 3. MVP game first
// 4. Try not to use tileset when possible to reduce size
import { Game } from './engine/Game'
import { CastleHallBeginIncident } from './incidents/CastleHallBeginIncident'
import { generateMaze } from './utils/mazeGenerator'

// Use default values for now
const game = new Game({
  container: document.getElementById('root'),
  tileWidth: 20,
  tileHeight: 20,
  cameraWidth: window.innerWidth,
  cameraHeight: window.innerHeight,
})

// The update function will be getting called each animation
// frame. It will go through dirty flags to move game forward.
function update(dt) {
  // Step 1: load game assetsaw
  if (!game.flag.isLoadAssets) {
    // Load sprites
    game.loadSprites()

    // Load sound assets
    game.loadSounds()
    game.flag.isLoadAssets = true
    return false
  }

  // Step2: Setup stage
  if (!game.flag.hasBuiltLayers) {
    // The game has three layers: background, main, foreground
    game.addLayer('background')
    game.addLayer('main')
    game.addLayer('foreground')

    game.flag.hasBuiltLayers = true
    return false
  }

  // Step 3: Play
  // The game will load each play states, which will manage its
  // own map, events, etc
  // TODO: move this into engine
  if (!game.flag.isPlayDirty) {
    let result = false

    for (let i = 0; i < game.incidentPlays.length; i++) {
      const current = game.incidentPlays[i]
      result = typeof current === 'boolean' ? current : current(dt)

      if (!result) {
        break
      }
    }

    game.flag.isPlayDirty = result

    // game.flag.isPlayDirty = game.incidentPlays.reduce((pre, post) => {
    //   const preResult = typeof pre === 'boolean' ? pre : pre(dt)
    //   return preResult && post(dt)
    // }, true)
    return false
  }

  if (!game.flag.isGameOver) {
    return false
  }
}

// Register render functions
game.loop.add(update)

// Start game loop
game.loop.start()

// Add interaction control
game.addInteractionKey('up', Game.createKeyInteraction([87, 38]))
game.addInteractionKey('down', Game.createKeyInteraction([83, 40]))
game.addInteractionKey('left', Game.createKeyInteraction([65, 37]))
game.addInteractionKey('right', Game.createKeyInteraction([68, 39]))
game.addInteractionKey('enter', Game.createKeyInteraction([13]))
game.addInteractionKey('space', Game.createKeyInteraction([32]))

// Generate maze
game.maze = generateMaze({
  rowNum: 3,
  colNum: 3,
  startSide: 'top',
  endSide: 'bottom',
})

// Add first game incident
// game.addIncident(castleHallGameStart, 'castleHallGameStart')
game.addIncident({
  incidentClass: CastleHallBeginIncident,
  key: `BattleFieldIncident@${game.maze.startRow - 1}@${game.maze.startCol}`,
})

// For debug
if (IS_DEV_MODE) {
  window.game = game
}
