function battleFieldIncident_factory(props) {
  return baseIncident_factory(props)
}

function battleFieldIncident_createMapData(incident) {
  const incidentGame = incident[INCIDENT_GAME]
  // get door information from maze
  const incidentMaze = incident[INCIDENT_GAME][GAME_MAZE]
  incident[INCIDENT_DOORS] = incidentUtil_hashDoor(
    incidentMaze[MAZE_CELLS][incident[INCIDENT_CELL_ROW]][
      incident[INCIDENT_CELL_COL]
    ]
  )

  // Create map data
  const incidentWidth =
    incident[INCIDENT_COL_NUM] * incidentGame[GAME_TILE_WIDTH]
  const incidentHeight =
    incident[INCIDENT_ROW_NUM] * incidentGame[GAME_TILE_HEIGHT]
  const gameObjectWidths = incidentGame[GAME_OBJECT_WIDTHS]
  const gameObjectHeights = incidentGame[GAME_OBJECT_HEIGHTS]
  incident[INCIDENT_MAP_DATA] = mg_generateMapData([
    0, // x
    0, // y
    incident[INCIDENT_COL_NUM], // colNum
    incident[INCIDENT_ROW_NUM], // rowNum
    incident[INCIDENT_DOORS], // doors
    incidentGame[GAME_TILE_WIDTH], // tileWidth
    incidentGame[GAME_TILE_HEIGHT], // tileHeight
    [
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

function battleFieldIncident_addSpritesToScene(incident) {}

function battleFieldIncident_setCamera(incident) {
  const playerSprite = group_getSpriteById(
    incident[INCIDENT_MAP_GROUP],
    PLAYER_SPRITE
  )
  camera_follow(incident[INCIDENT_GAME][GAME_CAMERA], playerSprite)
}

function battleFieldIncident_bindEventCallback(incident) {
  const kingSprite = group_getSpriteById(
    incident[INCIDENT_MAP_GROUP],
    KING_SPRITE
  )
  const incidentGame = incident[INCIDENT_GAME]
  const doorSprites = group_getSpritesByIds(
    incident[INCIDENT_MAP_GROUP],
    incident[INCIDENT_DOORS].map(doorId => incidentGame[GAME_DOORS][doorId])
  )
  // const bottomDoorSprites = group_getSpritesById(
  //   incident[INCIDENT_MAP_GROUP],
  //   BOTTOM_DOOR_SPRITE
  // )

  // Close the door when game starts
  doorSprites.forEach(doorSprite => {
    doorSprite[SPRITE_BACKGROUND_COLOR] = PALETTE_RED[3]
    doorSprite[SPRITE_HITTYPE] = HITTYPE_STOP
  })

  // Bind door hit handler
  // Close the door when game starts
  doorSprites.forEach(doorSprite => {
    doorSprite[SPRITE_HIT_CALLBACK] = playerSprite => {
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

function battleFieldIncident_handleDoors() {
  // todo finish this
}

function battleFieldIncident_update(incident, dt) {
  const playerSprite = group_getSpriteById(
    incident[INCIDENT_MAP_GROUP],
    PLAYER_SPRITE
  )

  battleFieldIncident_handlePlayerMove(incident, playerSprite, dt)
}

function battleFieldIncident_handlePlayerMove(incident, playerSprite, dt) {
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
