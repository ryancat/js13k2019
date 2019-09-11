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
// GAME_OBJECT_WIDTHS,
//   GAME_OBJECT_HEIGHTS,
// ] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

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
      [],
      [],
      [],
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
    tileWidth * 4,
  ]
  game[GAME_OBJECT_HEIGHTS] = [
    tileHeight / 2,
    tileHeight,
    tileHeight * 2,
    tileHeight * 3,
    tileHeight * 4,
  ]
  // init camera
  game[GAME_CAMERA] = camera_factory([game])
  // init loop
  game[GAME_LOOP] = loop_factory()

  return game
}

function _game_createKeyInteraction(interactionProps = []) {
  const interaction = util_assignArr([[], null, 0, false], interactionProps)

  document.addEventListener('keydown', evt => {
    if (interaction[INTERACTION_KEY_CODES].indexOf(evt.keyCode) === -1) {
      return
    }

    interaction[INTERACTION_IS_DOWN] = true
    const now = Date.now()
    if (!interaction[INTERACTION_PRESS_START_TIME]) {
      interaction[INTERACTION_PRESS_START_TIME] = now
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
}

function game_loadSprites(game) {
  sprites_init(game)
}

function game_loadSounds(game, sounds = []) {
  game[GAME_SOUNDS] = sounds
}

function game_addInteractionKey(game, keyId = -1, keyCodes = []) {
  game[GAME_KEY_INTERACTIONS][keyId] = _game_createKeyInteraction([keyCodes])
}

function game_addLayer(game, layerId = -1) {
  game[GAME_LAYERS][layerId] = renderer_factory([
    layerId,
    game[GAME_CONTAINER],
    game[GAME_CAMERA_WIDTH],
    game[GAME_CAMERA_HEIGHT],
  ])
}

function game_addIncident(
  game,
  incidentId = -1,
  incidentFactory = EMPTY_FN,
  incidentProps = [],
  isForced = false
) {
  const cachedIncidentRecord = game[GAME_INCIDENTS][incidentId]
  const incidentRecord =
    !isForced && cachedIncidentRecord
      ? cachedIncidentRecord
      : [
          [], // time stamps
          incidentFactory(incidentProps), // incident instance
        ]

  incidentRecord[INCIDENT_RECORD_TIMESTAMPS].push(Date.now())
  game[GAME_INCIDENTS][incidentId] = incidentRecord

  // start or restart the incident
  const incident = incidentRecord[INCIDENT_RECORD_INCIDENT]
  // make sure incident has updated playerStatus
  incident[INCIDENT_PLAYER_STATUS] = incidentProps[INCIDENT_PLAYER_STATUS]
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
  defaultProps[SPRITE_TYPE] = SPRITE_TYPE_TILE
  return game[GAME_SPRITE_FACTORIES][spriteId](
    util_assignArr(defaultProps, tileSpriteProps)
  )
}

function game_createObjectSprite(game, spriteId = -1, objectSpriteProps = []) {
  const defaultProps = []
  defaultProps[SPRITE_TYPE] = SPRITE_TYPE_OBJECT
  return game[GAME_SPRITE_FACTORIES][spriteId](
    util_assignArr(defaultProps, objectSpriteProps)
  )
}

function game_playConversation(
  game,
  dialogFactory = EMPTY_FN,
  dialogProps = [],
  callback = EMPTY_FN
) {
  const gameDialog = dialogFactory(dialogProps)
  game[GAME_DIALOG] = gameDialog
  gameDialog[DIALOG_START]()
  gameDialog[DIALOG_END_CALLBACKS].push(callback, () =>
    game_setDialog(game, null)
  )
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
