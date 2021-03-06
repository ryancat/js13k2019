// const [
//   GAME_CONTAINER,
//   GAME_TILE_WIDTH,
//   GAME_TILE_HEIGHT,
//   GAME_CAMERA_WIDTH,
//   GAME_CAMERA_HEIGHT,
//   GAME_BACKGROUND_COLOR,
//   GAME_FLAG_DISABLE_MOVE,
//   GAME_INCIDENT_PLAYS,
//   GAME_INCIDENTS,
//   GAME_LAYERS,
//   GAME_KEY_INTERACTIONS,
//   GAME_LOOP,
//   GAME_CAMERA,
//   GAME_SPRITE_FACTORIES,
//   GAME_SOUNDS,
//   GAME_DIALOG,
//   GAME_OBJECT_WIDTHS,
//   GAME_OBJECT_HEIGHTS,
//   GAME_MAZE,
//   GAME_DOORS,
//   GAME_MUSIC_BACKGROUND_READY
//   GAME_MUSIC_BACKGROUND_PLAYING
//   GAME_MUSIC_BACKGROUND_BUFFER
//   GAME_MUSIC_AUDIO_CONTEXT
// ] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]

function game_factory(props = []) {
  const game = util_assignArr(
    [
      document.createElement('div'),
      20,
      20,
      innerWidth,
      innerHeight,
      PALETTE_GUNMETAL[4],
      false,
      [],
      [],
      [],
      [],
      loop_factory(),
      [],
      [],
      [],
      null,
      [],
      [],
      null,
      [],
      false,
      false,
      null,
      null,
    ],
    props
  )

  // init object size
  const tileWidth = game[GAME_TILE_WIDTH]
  const tileHeight = game[GAME_TILE_HEIGHT]
  game[GAME_OBJECT_WIDTHS] = [
    tileWidth / 2,
    tileWidth,
    tileWidth * 2,
    tileWidth * 3,
    tileWidth * 8,
  ]
  game[GAME_OBJECT_HEIGHTS] = [
    tileHeight / 2,
    tileHeight,
    tileHeight * 2,
    tileHeight * 3,
    tileHeight * 8,
  ]
  // init camera
  game[GAME_CAMERA] = camera_factory([
    game, // camera game
    0, // camera x
    0, // camera y
    game[GAME_CAMERA_WIDTH], // camera width
    game[GAME_CAMERA_HEIGHT], // camera height
  ])
  // init loop
  game[GAME_LOOP] = loop_factory()

  return game
}

function _game_createKeyInteraction(interactionProps = [], sound) {
  const interaction = util_assignArr(
    [[], null, 0, false, false, false],
    interactionProps
  )

  document.addEventListener('keydown', evt => {
    if (interaction[INTERACTION_KEY_CODES].indexOf(evt.keyCode) === -1) {
      return
    }

    interaction[INTERACTION_IS_DOWN] = true
    const now = Date.now()
    if (!interaction[INTERACTION_PRESS_START_TIME]) {
      interaction[INTERACTION_PRESS_START_TIME] = now
      if (sound) {
        zzfx.apply(null, sound)
      }
    } else {
      interaction[INTERACTION_PRESS_DURATION] =
        now - interaction[INTERACTION_PRESS_START_TIME]
    }

    evt.preventDefault()
  })

  document.addEventListener('keyup', evt => {
    if (interaction[INTERACTION_KEY_CODES].indexOf(evt.keyCode) === -1) {
      return
    }

    interaction[INTERACTION_IS_DOWN] = false
    interaction[INTERACTION_PRESS_START_TIME] = null
    interaction[INTERACTION_PRESS_DURATION] = 0

    evt.preventDefault()
  })

  return interaction
}

function game_addSprite(game, spriteId = -1, spriteFactory = EMPTY_FN) {
  if (!game[GAME_SPRITE_FACTORIES][spriteId]) {
    game[GAME_SPRITE_FACTORIES][spriteId] = spriteFactory
  }

  return spriteFactory
}

function game_getSpriteFactory(game, spriteId) {
  return (
    game[GAME_SPRITE_FACTORIES][spriteId] ||
    game_addSprite(game, spriteId, sprite_factory)
  )
}

function game_loadSounds(game) {
  musicUtil_initBackgroundSong(game)
}

function game_addInteractionKey(game, keyId = -1, keyCodes = [], sound) {
  game[GAME_KEY_INTERACTIONS][keyId] = _game_createKeyInteraction(
    [keyCodes],
    sound
  )
}

function game_addLayer(game, layerId = -1, isDom) {
  if (isDom) {
    game[GAME_LAYERS][layerId] = dom_renderer_factory([
      layerId,
      game[GAME_CONTAINER],
      game[GAME_CAMERA_WIDTH],
      game[GAME_CAMERA_HEIGHT],
    ])
  } else {
    game[GAME_LAYERS][layerId] = renderer_factory([
      layerId,
      game[GAME_CONTAINER],
      game[GAME_CAMERA_WIDTH],
      game[GAME_CAMERA_HEIGHT],
    ])
  }
}

function game_addIncident(
  game,
  incidentId = -1,
  incidentKey = '',
  incidentFactory = EMPTY_FN,
  incidentProps = [],
  isForced = false
) {
  const cachedIncidentRecord = game[GAME_INCIDENTS][incidentKey]
  const incidentRecord =
    !isForced && cachedIncidentRecord
      ? cachedIncidentRecord
      : [
          [], // time stamps
          incidentFactory(incidentProps), // incident instance
        ]

  incidentRecord[INCIDENT_RECORD_TIMESTAMPS].push(Date.now())
  game[GAME_INCIDENTS][incidentKey] = incidentRecord

  // start or restart the incident
  const incident = incidentRecord[INCIDENT_RECORD_INCIDENT]
  // make sure incident has updated playerStatus
  if (incidentProps[INCIDENT_PLAYER_STATUS]) {
    incident[INCIDENT_PLAYER_STATUS] = incidentProps[INCIDENT_PLAYER_STATUS]
  }
  incident_restart[incidentId](incident)

  // add play method into incident plays queue and dedupe
  incidentRecord[INCIDENT_RECORD_PLAY_INCIDENT] =
    incidentRecord[INCIDENT_RECORD_PLAY_INCIDENT] ||
    incident_play[incidentId].bind(null, incident)
  const incidentPlay = incidentRecord[INCIDENT_RECORD_PLAY_INCIDENT]
  const incidentPlayIndex = game[GAME_INCIDENT_PLAYS].indexOf(incidentPlay)
  if (incidentPlayIndex >= 0) {
    game[GAME_INCIDENT_PLAYS].splice(incidentPlayIndex, 1)
  }
  game[GAME_INCIDENT_PLAYS].push(incidentPlay)
}

function game_createTileSprite(game, spriteId = -1, tileSpriteProps = []) {
  const defaultProps = []
  defaultProps[SPRITE_ID] = spriteId
  defaultProps[SPRITE_TYPE] = SPRITE_TYPE_TILE
  return game_getSpriteFactory(game, spriteId)(
    util_assignArr(defaultProps, tileSpriteProps)
  )
}

function game_createObjectSprite(game, spriteId = -1, objectSpriteProps = []) {
  const defaultProps = []
  defaultProps[SPRITE_TYPE] = SPRITE_TYPE_OBJECT
  defaultProps[SPRITE_ID] = spriteId
  return game_getSpriteFactory(game, spriteId)(
    util_assignArr(defaultProps, objectSpriteProps)
  )
}

function game_playConversation(game, dialogContents = [], callback = EMPTY_FN) {
  const gameDialog = dialog_factory([
    dialogContents, // dialog contents
    game, // game
    [callback], // dialog end callbacks
    game[GAME_LAYERS][RENDERER_LAYER_FOREGROUND], // renderer
    KEY_ENTER, // next key id
  ])
  game[GAME_DIALOG] = gameDialog

  // always destroy dialog after conversation ends
  gameDialog[DIALOG_END_CALLBACKS].push(callback, () =>
    game_setDialog(game, null)
  )

  // start the dialog
  dialog_start(gameDialog, dialogContents.length === 1)
}

function game_setDialog(game, dialog = null) {
  game[GAME_DIALOG] = dialog
}

function game_pause(game) {
  game[GAME_FLAG_DISABLE_MOVE] = true
}

function game_resume(game) {
  game[GAME_FLAG_DISABLE_MOVE] = false
}

function game_setMaze(game, maze) {
  game[GAME_MAZE] = maze
}

function game_setDoorSprites(game) {
  const gameDoors = []
  gameDoors[DOOR_TOP] = TOP_DOOR_SPRITE
  gameDoors[DOOR_RIGHT] = RIGHT_DOOR_SPRITE
  gameDoors[DOOR_BOTTOM] = BOTTOM_DOOR_SPRITE
  gameDoors[DOOR_LEFT] = LEFT_DOOR_SPRITE
  game[GAME_DOORS] = gameDoors
}
