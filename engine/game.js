function game_factory(props = []) {
  return util_assignArr([], [
    document.createElement('div'),
    20,
    20,
    innerWidth,
    innerHeight,
    palette_gunmetal[4],
    false,
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ], props) 
}

function _game_createKeyInteraction(keyCodes = []) {
  const interaction = util_assignArr([[], null, 0, false], keyCodes)

  document.addEventListener('keydown', evt => {
    if (interaction[INTERACTION_KEY_CODES].indexOf(evt.keyCode) === -1) {
      return
    }

    interaction[INTERACTION_IS_DOWN] = true
    const now = Date.now()
    if (!interaction[INTERACTION_PRESS_START_TIME]) {
      interaction[INTERACTION_PRESS_START_TIME] = now
    } else {
      interaction[INTERACTION_PRESS_DURATION] = now - interaction[INTERACTION_PRESS_START_TIME]
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

function game_loadSprites(game, sprites = []) {
  game[GAME_SPRITES] = sprites
}

function game_loadSounds(game, sounds = []) {
  game[GAME_SOUNDS] = sounds
}

function game_addInteractionKey(game, keyId = -1, keyCodes = []) {
  game[GAME_KEY_INTERACTIONS][keyId] = _game_createKeyInteraction(keyCodes)
}

function game_addLayer(game, layerId = -1, renderer = []) {
  game[GAME_LAYERS][layerId] = renderer
}

function game_addIncident(game, incidentId = -1, incidentFactory = EMPTY_FN, incidentProps = [], isForced = false) {
  const cachedIncidentRecord = game[GAME_INCIDENTS][incidentId]
  const incidentRecord = !isForced && cachedIncidentRecord ? cachedIncidentRecord : [[], incidentFactory(game, incidentProps)]
  
  incidentRecord[INCIDENT_RECORD_TIMESTAMPS].push(Date.now())
  game[GAME_INCIDENTS][incidentId] = incidentRecord

  // start or restart the incident
  const incident = incidentRecord[INCIDENT_RECORD_INCIDENT]
  // make sure incident has updated playerStatus
  incident[INCIDENT_PLAYER_STATUS] = incidentProps[INCIDENT_PLAYER_STATUS]
  incident_restart()

  // add play method into incident plays queue and dedupe
  incidentRecord[INCIDENT_RECORD_PLAY_INCIDENT] = incidentRecord[INCIDENT_RECORD_PLAY_INCIDENT] || incident[INCIDENT_PLAY].bind(null, incident)
  const incidentPlayIndex = game[GAME_INCIDENT_PLAYS].indexOf(incidentRecord[INCIDENT_RECORD_PLAY_INCIDENT])
  if (incidentPlayIndex >= 0) {
    game[GAME_INCIDENT_PLAYS].splice(incidentPlayIndex, 1)
  }
  game[GAME_INCIDENT_PLAYS].push(incidentRecord[INCIDENT_RECORD_PLAY_INCIDENT])
}

function game_createTileSprite(game, spriteId = -1, spriteFactory = EMPTY_FN, tileSpriteProps = []) {
  game[GAME_SPRITES][spriteId] = spriteFactory(tileSpriteProps)
}

function game_createObjectSprite(game, spriteId = -1, spriteFactory = EMPTY_FN, objectSpriteProps = []) {
  game[GAME_SPRITES][spriteId] = spriteFactory(objectSpriteProps)
}

function game_playConversation(game, dialogFactory = EMPTY_FN, dialogProps = [], callback = EMPTY_FN) { 
  game[GAME_DIALOG] = dialogFactory(dialogProps)
  game[GAME_DIALOG][DIALOG_START]()
  game[GAME_DIALOG][DIALOG_END_CALLBACKS].push(callback, (() => game_setDialog(game, null)))
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