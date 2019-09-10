// For game object
const [
  GAME_CONTAINER,
  GAME_TILE_WIDTH,
  GAME_TILE_HEIGHT,
  GAME_CAMERA_WIDTH,
  GAME_CAMERA_HEIGHT,
  GAME_BACKGROUND_COLOR,
  GAME_FLAG_DISABLE_MOVE,
  GAME_INCIDENT_PLAYS,
  GAME_INCIDENT_MAP,
  GAME_LAYERS,
  GAME_KEYS,
  GAME_LOOP,
  GAME_CAMERA,
  GAME_SPRITES,
  GAME_SOUNDS,
] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

function game_create(props = []) {
  return util_assignArr([], [
    document.createElement('div'),
    20,
    20,
    innerWidth,
    innerHeight,
    palette_gunmetal[4],
    false,
    [],
    {},
    [],
    [],
    [],
    [],
    [],
  ], props) 
}

// For key object
const [KEY_KEY_CODES, KEY_PRESS_START_TIME, KEY_PRESS_DURATION, KEY_IS_DOWN] = [
  0,
  1,
  2,
  3,
]

function game_createKeyInteraction(keyCodes) {
  const keyObj = [[], null, 0, false]

  document.addEventListener('keydown', evt => {
    if (keyObj[KEY_KEY_CODES].indexOf(evt.keyCode) === -1) {
      return
    }

    keyObj[KEY_IS_DOWN] = true
    const now = Date.now()
    if (!keyObj[KEY_PRESS_START_TIME]) {
      keyObj[KEY_PRESS_START_TIME] = now
    } else {
      keyObj[KEY_PRESS_DURATION] = now - keyObj[KEY_PRESS_START_TIME]
    }

    evt.preventDefault()
  })

  document.addEventListener('keyup', evt => {
    if (keyObj[KEY_KEY_CODES].indexOf(evt.keyCode) === -1) {
      return
    }

    keyObj[KEY_IS_DOWN] = false
    keyObj[KEY_PRESS_START_TIME] = null
    keyObj[KEY_PRESS_DURATION] = 0

    evt.preventDefault()
  })

  return keyObj
}

function game_loadSprites(_game, _sprites) {
  _game[GAME_SPRITES] = _sprites
}

function game_loadSounds(_game, _sounds) {
  _game[GAME_SOUNDS] = _sounds
}

function game_addInteractionKey() {

}