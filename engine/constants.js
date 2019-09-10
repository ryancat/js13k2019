/***** util constants *****/
const EMPTY_FN = () => {}

/***** color palette constants *****/
const PALETTE_RED = ['#F5BEBE', '#E86767', '#DB1111', '#8C0B0B', '#3C0505']
const PALETTE_BLUE = ['#D1EDF5', '#AFDFEE', '#82CEE5', '#538492', '#24393F']
const PALETTE_GREEN = ['#D7EBD3', '#B9DCB2', '#91C987', '#5DB056', '#283725']
const PALETTE_BROWN = ['#DAC1AD', '#B6845C', '#8D501D', '#553011', '#2B1809']
const PALETTE_GUNMETAL = ['#C3C8C9', '#738082', '#374A4D', '#1D2E32', '#0D1516']

/***** object props *****/
// game object
const [
  GAME_CONTAINER,
  GAME_TILE_WIDTH,
  GAME_TILE_HEIGHT,
  GAME_CAMERA_WIDTH,
  GAME_CAMERA_HEIGHT,
  GAME_BACKGROUND_COLOR,
  GAME_FLAG_DISABLE_MOVE,
  GAME_INCIDENT_PLAYS,
  GAME_INCIDENTS,
  GAME_LAYERS,
  GAME_KEY_INTERACTIONS,
  GAME_LOOP,
  GAME_CAMERA,
  GAME_SPRITE_FACTORIES,
  GAME_SOUNDS,
  GAME_DIALOG,
] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

// interaction object
const [
  INTERACTION_KEY_CODES,
  INTERACTION_PRESS_START_TIME,
  INTERACTION_PRESS_DURATION,
  INTERACTION_IS_DOWN,
] = [0, 1, 2, 3]

// sprite
const [SPRITE_X, SPRITE_Y, SPRITE_WIDTH, SPRITE_HEIGHT] = [0, 1, 2, 3]
// sound object
// renderer object
// incidentRecord
const [
  INCIDENT_RECORD_TIMESTAMPS,
  INCIDENT_RECORD_INCIDENT,
  INCIDENT_RECORD_PLAY_INCIDENT,
] = [0, 1, 2]
// incident
// tile sprite
// object sprite
// dialog
const [DIALOG_START] = [0]

// loop
const [
  LOOP_FPS,
  LOOP_IS_PAUSED,
  LOOP_TIMEOUT_ID,
  LOOP_CALLBACKS,
  LOOP_LAST_RUN,
] = [0, 1, 2, 3, 4]

// camera
const [
  CAMERA_GAME,
  CAMERA_X,
  CAMERA_Y,
  CAMERA_WIDTH,
  CAMERA_HEIGHT,
  CAMERA_FOLLOWING_SPRITE,
  CAMERA_FOLLOWING_CALLBACK,
] = [0, 1, 2, 3, 4, 5, 6]
