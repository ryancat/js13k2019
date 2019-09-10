/***** util constants *****/
const EMPTY_FN = () => {}

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
  GAME_SPRITES,
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
