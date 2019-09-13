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
  GAME_OBJECT_WIDTHS,
  GAME_OBJECT_HEIGHTS,
  GAME_MAZE,
  GAME_DOORS,
  GAME_MUSIC_BACKGROUND_READY,
  GAME_MUSIC_BACKGROUND_PLAYING,
  GAME_MUSIC_BACKGROUND_BUFFER,
  GAME_MUSIC_AUDIO_CONTEXT,
] = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
]

// interaction object
const [
  INTERACTION_KEY_CODES,
  INTERACTION_PRESS_START_TIME,
  INTERACTION_PRESS_DURATION,
  INTERACTION_IS_DOWN,
  INTERACTION_DOWN_EDGE,
  INTERACTION_UP_EDGE,
] = [0, 1, 2, 3, 4, 5]

// sound object
// renderer object
const [
  RENDERER_KEY,
  RENDERER_CONTAINER,
  RENDERER_WIDTH,
  RENDERER_HEIGHT,
  RENDERER_CANVAS,
  RENDERER_CONTEXT,
  RENDERER_DOM,
  RENDERER_DOM_WIDTH,
  RENDERER_DOM_HEIGHT,
] = [0, 1, 2, 3, 4, 5, 6, 7, 8]

// incidentRecord
const [
  INCIDENT_RECORD_TIMESTAMPS,
  INCIDENT_RECORD_INCIDENT,
  INCIDENT_RECORD_PLAY_INCIDENT,
] = [0, 1, 2]

// incident
const [
  INCIDENT_ID,
  INCIDENT_GAME,
  INCIDENT_ROW_NUM,
  INCIDENT_COL_NUM,
  INCIDENT_PLAYER_STATUS,
  INCIDENT_INCIDENT_STATUS,
  INCIDENT_MAP_GROUP,
  INCIDENT_MAP_DATA,
  INCIDENT_SCENES,
  INCIDENT_FLAG_FINISHED,
  INCIDENT_FLAG_SET_INCIDENT_STATUS,
  INCIDENT_FLAG_SET_PLAYER_STATUS,
  INCIDENT_FLAG_INIT,
  INCIDENT_FLAG_SET_CAMERA,
  INCIDENT_FLAG_ADD_SCENE_SPRITES,
  INCIDENT_FLAG_BIND_EVENT_CALLBACKS,
  INCIDENT_FLAG_RENDER_BACKGROUND,
  INCIDENT_FLAG_LAYER_CLEAR_DIRTY_ARR,
  INCIDENT_FLAG_LAYER_DIRTY_ARR,
  INCIDENT_CELL_ROW,
  INCIDENT_CELL_COL,
  INCIDENT_DOORS,
] = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
]

// tile sprite
// object sprite
// dialog
const [
  DIALOG_CONTENTS,
  DIALOG_GAME,
  DIALOG_END_CALLBACKS,
  DIALOG_RENDERER,
  DIALOG_NEXTKEY_ID,
  DIALOG_NEXTKEY_ACTIVE,
  DIALOG_ACTIVE_CONTENT_INDEX,
  DIALOG_UPDATE_LOOP_CALLBACK,
] = [0, 1, 2, 3, 4, 5, 6, 7, 8]

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

// sprite
const [
  SPRITE_ID,
  SPRITE_X,
  SPRITE_Y,
  SPRITE_WIDTH,
  SPRITE_HEIGHT,
  SPRITE_NAME,
  SPRITE_HITTYPE,
  SPRITE_SHOW_NAME,
  SPRITE_DISABLE_HIT,
  SPRITE_BACKGROUND_COLOR,
  SPRITE_BORDER_COLOR,
  SPRITE_OPACITY,
  SPRITE_TILE_INDEX,
  SPRITE_COL,
  SPRITE_ROW,
  SPRITE_VX,
  SPRITE_VY,
  SPRITE_VMAX,
  SPRITE_TYPE,
  SPRITE_MAP_GROUP,
  SPRITE_HIT_CALLBACK,
  SPRITE_CONVERSATION_STATES,
  SPRITE_LAYER_GROUP,
  SPRITE_STATE,
  SPRITE_DIALOG_SPRITE_ID,
] = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
]

// group
const [
  GROUP_TYPE,
  GROUP_COL_NUM,
  GROUP_ROW_NUM,
  GROUP_WIDTH,
  GROUP_HEIGHT,
  GROUP_CHILDREN,
  GROUP_LAYER_GROUP,
  GROUP_MAP_GROUP,
  GROUP_RENDERER,
  GROUP_LAYER_NAME,
] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// map layer
const [
  MAP_LAYER_TYPE,
  MAP_LAYER_NAME,
  MAP_LAYER_X,
  MAP_LAYER_Y,
  MAP_LAYER_WIDTH,
  MAP_LAYER_HEIGHT,
  MAP_LAYER_OPACITY,
  MAP_LAYER_DATA,
  MAP_LAYER_OBJECTS,
] = [0, 1, 2, 3, 4, 5, 6, 7, 8]

// map object item
const [
  OBJ_ID,
  OBJ_WIDTH,
  OBJ_HEIGHT,
  OBJ_X,
  OBJ_Y,
  OBJ_NAME,
  OBJ_SPRITE_PROPS,
] = [0, 1, 2, 3, 4, 5, 6]

// map data
const [
  MAP_COL_NUM,
  MAP_ROW_NUM,
  MAP_TILE_WIDTH,
  MAP_TILE_HEIGHT,
  MAP_LAYERS,
] = [0, 1, 2, 3, 4, 5]

const [
  MAP_DATA_PROP_X,
  MAP_DATA_PROP_Y,
  MAP_DATA_PROP_COL_NUM,
  MAP_DATA_PROP_ROW_NUM,
  MAP_DATA_PROP_DOORS,
  MAP_DATA_PROP_TILE_WIDTH,
  MAP_DATA_PROP_TILE_HEIGHT,
  MAP_DATA_PROP_OBJECTS,
] = [0, 1, 2, 3, 4, 5, 6, 7]

// hit map
const [HIT_SPRITE_TOP, HIT_SPRITE_RIGHT, HIT_SPRITE_BOTTOM, HIT_SPRITE_LEFT] = [
  0,
  1,
  2,
  3,
]

// maze
const [
  MAZE_ROW_NUM,
  MAZE_COL_NUM,
  MAZE_CELLS,
  MAZE_START_ROW,
  MAZE_START_COL,
  MAZE_END_ROW,
  MAZE_END_COL,
] = [0, 1, 2, 3, 4, 5, 6]

// dialog content
const [
  DIALOG_CONTENT_FROM_SPRITE_ID,
  DIALOG_CONTENT_CONTENT,
  DIALOG_CONTENT_COLOR,
  DIALOG_CONTENT_CALLBACK,
] = [0, 1, 2, 3]

/***** ENUMS *****/
const [GROUP_TYPE_MAP, GROUP_TYPE_LAYER, GROUP_TYPE_SCENE] = [0, 1, 2]
const BASE_INCIDENT = 0
const [SPRITE_TYPE_TILE, SPRITE_TYPE_OBJECT] = [0, 1]
const [HITTYPE_PASS, HITTYPE_STOP] = [0, 1]
