// Entry file
const game = game_factory([document.getElementById('root')])

// Init game
// TODO add sound
game_loadSounds(game)

// Add game layer
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

// Map incident factory for incident ids
// Functional way to implement inheritance
const incident_factories = [baseIncident_factory, castleHallIncident_factory]
const incident_play = [baseIncident_play, baseIncident_play]
const incident_finish = [baseIncident_finish, baseIncident_finish]
const incident_restart = [baseIncident_restart, baseIncident_restart]
const incident_createMapData = [EMPTY_FN, castleHallIncident_createMapData]
const incident_initMapGroup = [
  baseIncident_initMapGroup,
  baseIncident_initMapGroup,
]
const incident_getSceneById = [
  baseIncident_getSceneById,
  baseIncident_getSceneById,
]
const incident_addSpritesToScene = [
  baseIncident_addSpritesToScene,
  castleHallIncident_addSpritesToScene,
]
const incident_setPlayerStatus = [EMPTY_FN, EMPTY_FN]
const incident_setIncidentStatus = [
  baseIncident_setIncidentStatus,
  baseIncident_setIncidentStatus,
]
const incident_renderBackground = [
  baseIncident_renderBackground,
  baseIncident_renderBackground,
]
const incident_update = [EMPTY_FN, castleHallIncident_update]
const incident_addScene = [EMPTY_FN, EMPTY_FN]
const incident_setCamera = [EMPTY_FN, castleHallIncident_setCamera]
const incident_addSceneSprites = [EMPTY_FN, EMPTY_FN]
const incident_bindEventCallback = [
  EMPTY_FN,
  castleHallIncident_bindEventCallback,
]

// Add sprites in game
sprites_init(game)

// Generate maze
game_setMaze(game, maze_generateMaze())

// Add first incidents
const castleHallIncidentProp = [
  CASTLE_HALL_INCIDENT, // incident id
  game, // incident game
  32, // row numbers
  32, // col numbers
]
castleHallIncidentProp[INCIDENT_CELL_ROW] = game[GAME_MAZE][MAZE_START_ROW] - 1
castleHallIncidentProp[INCIDENT_CELL_COL] = game[GAME_MAZE][MAZE_START_COL]
game_addIncident(
  game,
  CASTLE_HALL_INCIDENT,
  incident_factories[CASTLE_HALL_INCIDENT],
  castleHallIncidentProp

  // INCIDENT_ID,
  // INCIDENT_GAME,
  // INCIDENT_ROW_NUM,
  // INCIDENT_COL_NUM,
  // INCIDENT_PLAYER_STATUS,
  // INCIDENT_INCIDENT_STATUS,
  // INCIDENT_MAP_GROUP,
  // INCIDENT_MAP_DATA,
  // INCIDENT_SCENES,
  // INCIDENT_FLAG_FINISHED,
  // INCIDENT_FLAG_SET_INCIDENT_STATUS,
  // INCIDENT_FLAG_SET_PLAYER_STATUS,
  // INCIDENT_FLAG_INIT,
  // INCIDENT_FLAG_SET_CAMERA,
  // INCIDENT_FLAG_ADD_SCENE_SPRITES,
  // INCIDENT_FLAG_BIND_EVENT_CALLBACKS,
  // INCIDENT_FLAG_RENDER_BACKGROUND,
  // INCIDENT_FLAG_LAYER_CLEAR_DIRTY_ARR,
  // INCIDENT_FLAG_LAYER_DIRTY_ARR,
)

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
