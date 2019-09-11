// Entry file
const game = game_factory([document.getElementById('root')])

// Init game
game_loadSprites(game)
// TODO add sound
game_loadSounds(game)
game_addLayer(game, RENDERER_LAYER_BACKGROUND)
game_addLayer(game, RENDERER_LAYER_MAIN)
game_addLayer(game, RENDERER_LAYER_FOREGROUND)

// Add interaction controls
game_addInteractionKey(game, KEY_UP, [87, 38])
game_addInteractionKey(game, KEY_DOWN, [83, 40])
game_addInteractionKey(game, KEY_LEFT, [65, 37])
game_addInteractionKey(game, KEY_RIGHT, [68, 39])
game_addInteractionKey(game, KEY_ENTER, [13])
game_addInteractionKey(game, KEY_SPACE, [32])

// Start to play incidents
loop_add(game[GAME_LOOP], dt => {
  // The game will load each play states, which will manage its
  // own map, events, etc
  // TODO: move this into engine
  const incidentPlays = game[GAME_INCIDENT_PLAYS]
  let i
  for (i = 0; i < incidentPlays.length; i++) {
    const current = incidentPlays[i]
    if (typeof current === 'boolean' ? !current : !current(dt)) {
      break
    }
  }

  // Return true when all incidents are finished
  return i === incidentPlays.length
})
// Start the game loop
loop_start(game[GAME_LOOP])
