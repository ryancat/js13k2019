// const castleHallBeginIncident
function castleHallIncident_factory(props) {
  return baseIncident_factory(props)
}

function castleHallIncident_createMapData(incident) {
  const incidentGame = incident[INCIDENT_GAME]
  const incidentWidth =
    incident[INCIDENT_COL_NUM] * incidentGame[GAME_TILE_WIDTH]
  const incidentHeight =
    incident[INCIDENT_ROW_NUM] * incidentGame[GAME_TILE_HEIGHT]
  const gameObjectWidths = incidentGame[GAME_OBJECT_WIDTHS]
  const gameObjectHeights = incidentGame[GAME_OBJECT_HEIGHTS]

  // create king object sprite props
  const kingSpriteProps = []
  kingSpriteProps[SPRITE_BACKGROUND_COLOR] = PALETTE_BLUE[2]
  kingSpriteProps[SPRITE_HITTYPE] = HITTYPE_STOP
  incident[INCIDENT_MAP_DATA] = mg_generateMapData([
    0, // x
    0, // y
    incident[INCIDENT_COL_NUM], // colNum
    incident[INCIDENT_ROW_NUM], // rowNum
    incident[INCIDENT_DOORS], // doors
    incidentGame[GAME_TILE_WIDTH], // tileWidth
    incidentGame[GAME_TILE_HEIGHT], // tileHeight
    [
      // king object
      [
        KING_SPRITE, // object id
        gameObjectWidths[GAME_OBJ_WIDTH_M], // width
        gameObjectHeights[GAME_OBJ_WIDTH_L], // height
        Math.floor((incidentWidth - gameObjectWidths[GAME_OBJ_WIDTH_M]) / 2), // x
        Math.floor((incidentHeight - gameObjectHeights[GAME_OBJ_HEIGHT_L]) / 4), // y
        GAME_KING_NAME, // king's name,
        kingSpriteProps,
      ],
      // player object
      [
        PLAYER_SPRITE, // object id
        gameObjectWidths[GAME_OBJ_WIDTH_M], // width
        gameObjectHeights[GAME_OBJ_WIDTH_L], // height
        Math.floor((incidentWidth - gameObjectWidths[GAME_OBJ_WIDTH_M]) / 2), // x
        Math.floor((incidentHeight - gameObjectHeights[GAME_OBJ_HEIGHT_L]) / 2), // y
        GAME_PLAYER_NAME, // player (default) name,
      ],
    ],
  ])
}

function castleHallIncident_addSpritesToScene(incident) {}

function castleHallIncident_setCamera(incident) {
  const playerSprite = group_getSpriteById(
    incident[INCIDENT_MAP_GROUP],
    PLAYER_SPRITE
  )
  camera_follow(incident[INCIDENT_GAME][GAME_CAMERA], playerSprite)
}

function castleHallIncident_bindEventCallback(incident) {
  const kingSprite = group_getSpriteById(
    incident[INCIDENT_MAP_GROUP],
    KING_SPRITE
  )
  const incidentGame = incident[INCIDENT_GAME]
  const doorSprites = group_getSpritesByIds(
    incident[INCIDENT_MAP_GROUP],
    incident[INCIDENT_DOORS].map(doorId => incidentGame[GAME_DOORS][doorId])
  )

  // Close the door when game starts
  doorSprites.forEach(doorSprite => {
    doorSprite[SPRITE_BACKGROUND_COLOR] = PALETTE_RED[3]
    doorSprite[SPRITE_HITTYPE] = HITTYPE_STOP
  })

  // Bind king sprite hit handler
  kingSprite[SPRITE_HIT_CALLBACK] = playerSprite => {
    if (!incidentGame[GAME_DIALOG]) {
      // Only play conversation when there is no dialog right now
      game_playConversation(
        incidentGame,
        conv_king(kingSprite, playerSprite),
        () => {
          // open the door
          doorSprites.forEach(doorSprite => {
            doorSprite[SPRITE_BACKGROUND_COLOR] = PALETTE_GREEN[3]
            doorSprite[SPRITE_HITTYPE] = HITTYPE_PASS
          })
        }
      )
    }
  }

  // Bind door hit handler
  // Close the door when game starts
  doorSprites.forEach(doorSprite => {
    doorSprite[SPRITE_HIT_CALLBACK] = playerSprite => {
      if (doorSprite[SPRITE_HITTYPE] !== HITTYPE_PASS) {
        // cannot pass yet
        return
      }
      // Finish the current incident as we exit
      incident_finish[incident[INCIDENT_ID]](incident)

      // Add battle field scene
      const battleFieldIncidentProps = [
        BATTLE_FIELD_INCIDENT, // incident id
        incidentGame, // incident game
        32, // row numbers
        32, // col numbers
      ]
      battleFieldIncidentProps[INCIDENT_CELL_ROW] =
        incidentGame[GAME_MAZE][MAZE_START_ROW]
      battleFieldIncidentProps[INCIDENT_CELL_COL] =
        incidentGame[GAME_MAZE][MAZE_START_COL]
      game_addIncident(
        game,
        BATTLE_FIELD_INCIDENT,
        incident_factories[BATTLE_FIELD_INCIDENT],
        battleFieldIncidentProps
      )
    }
  })
}

function castleHallIncident_handleDoors() {
  // todo finish this
}

function castleHallIncident_update(incident, dt) {
  const playerSprite = group_getSpriteById(
    incident[INCIDENT_MAP_GROUP],
    PLAYER_SPRITE
  )

  castleHallIncident_handlePlayerMove(incident, playerSprite, dt)
}

function castleHallIncident_handlePlayerMove(incident, playerSprite, dt) {
  const incidentGame = incident[INCIDENT_GAME]
  const gameKeyInteractions = incidentGame[GAME_KEY_INTERACTIONS]
  const upKeyIsDown = gameKeyInteractions[KEY_UP][INTERACTION_IS_DOWN]
  const downKeyIsDown = gameKeyInteractions[KEY_DOWN][INTERACTION_IS_DOWN]
  const leftKeyIsDown = gameKeyInteractions[KEY_LEFT][INTERACTION_IS_DOWN]
  const rightKeyIsDown = gameKeyInteractions[KEY_RIGHT][INTERACTION_IS_DOWN]

  const isDiagonalDirection =
    (upKeyIsDown || downKeyIsDown) && (leftKeyIsDown || rightKeyIsDown)
  const playerVMax = playerSprite[SPRITE_VMAX]
  const diagonalSpeed = playerVMax / Math.sqrt(2)

  if (upKeyIsDown) {
    // up key is pressed
    playerSprite[SPRITE_VY] = -(isDiagonalDirection
      ? diagonalSpeed
      : playerVMax)
  }
  if (downKeyIsDown) {
    // down key is pressed
    playerSprite[SPRITE_VY] = isDiagonalDirection ? diagonalSpeed : playerVMax
  }
  if (leftKeyIsDown) {
    // left key is pressed
    playerSprite[SPRITE_VX] = -(isDiagonalDirection
      ? diagonalSpeed
      : playerVMax)
  }
  if (rightKeyIsDown) {
    // right key is pressed
    playerSprite[SPRITE_VX] = isDiagonalDirection ? diagonalSpeed : playerVMax
  }

  if (!upKeyIsDown && !downKeyIsDown) {
    playerSprite[SPRITE_VY] = 0
  }

  if (!leftKeyIsDown && !rightKeyIsDown) {
    playerSprite[SPRITE_VX] = 0
  }

  sprite_move(playerSprite, incidentGame[GAME_FLAG_DISABLE_MOVE])
}

// castleHallIncident_addSceneSprites(incident) {
//   // const doorSceneProps = []
//   // doorSceneProps[GROUP_TYPE] = GROUP_TYPE_SCENE
//   // doorSceneProps[GROUP_RENDERER] = incident[INCIDENT_GAME][GAME_LAYERS][RENDERER_LAYER_MAIN]
//   // const doorScene = group_factory(doorSceneProps)

// }
