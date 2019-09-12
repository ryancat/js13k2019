function battleFieldIncident_factory(props) {
  console.log('enter room', props[INCIDENT_CELL_ROW], props[INCIDENT_CELL_COL])
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

  // Depends on the incident and maze, we will create random map
  // for the cell
  const mazeCellRow = incident[INCIDENT_CELL_ROW]
  const mazeCellCol = incident[INCIDENT_CELL_COL]
  const gameMaze = incidentGame[GAME_MAZE]
  const isStartCell =
    gameMaze[MAZE_START_ROW] === mazeCellRow &&
    gameMaze[MAZE_START_COL] === mazeCellCol
  const isEndCell =
    gameMaze[MAZE_END_ROW] === mazeCellRow &&
    gameMaze[MAZE_END_COL] === mazeCellCol
  if (isStartCell) {
    battleFieldIncident_createStartCell(incident)
  } else if (isEndCell) {
    battleFieldIncident_createEndCell(incident)
  } else {
    battleFieldIncident_createRandomCell(incident)
  }
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
  // The doors are closed by default
  const incidentGame = incident[INCIDENT_GAME]
  const doorSprites = group_getSpritesByIds(
    incident[INCIDENT_MAP_GROUP],
    incident[INCIDENT_DOORS].map(doorId => incidentGame[GAME_DOORS][doorId])
  )

  if (!IS_ALL_DOOR_OPEN) {
    doorSprites.forEach(doorSprite => {
      doorSprite[SPRITE_BACKGROUND_COLOR] = PALETTE_RED[3]
      doorSprite[SPRITE_HITTYPE] = HITTYPE_STOP
    })
  }

  // Depends on the incident and maze, we will throw random incidents to
  // the battle field
  const mazeCellRow = incident[INCIDENT_CELL_ROW]
  const mazeCellCol = incident[INCIDENT_CELL_COL]
  const gameMaze = incidentGame[GAME_MAZE]
  const isStartCell =
    gameMaze[MAZE_START_ROW] === mazeCellRow &&
    gameMaze[MAZE_START_COL] === mazeCellCol
  const isEndCell =
    gameMaze[MAZE_END_ROW] === mazeCellRow &&
    gameMaze[MAZE_END_COL] === mazeCellCol
  if (isStartCell) {
    battleFieldIncident_playStartCell(incident)
  } else if (isEndCell) {
    battleFieldIncident_playEndCell(incident)
  } else {
    battleFieldIncident_playRandomCell(incident)
  }

  // Finish the play, we need to go to next cell
  // Bind door hit handler
  doorSprites.forEach(doorSprite => {
    doorSprite[SPRITE_HIT_CALLBACK] = playerSprite => {
      if (doorSprite[SPRITE_HITTYPE] !== HITTYPE_PASS) {
        // cannot pass yet
        return
      }

      const doorSpriteId = doorSprite[SPRITE_ID]
      let lrIncrement = 0
      let tbIncrement = 0
      let playerFromDoor
      switch (doorSpriteId) {
        case TOP_DOOR_SPRITE:
          tbIncrement = -1
          playerFromDoor = DOOR_BOTTOM
          break

        case RIGHT_DOOR_SPRITE:
          lrIncrement = 1
          playerFromDoor = DOOR_LEFT
          break

        case BOTTOM_DOOR_SPRITE:
          tbIncrement = 1
          playerFromDoor = DOOR_TOP
          break

        case LEFT_DOOR_SPRITE:
          lrIncrement = -1
          playerFromDoor = DOOR_RIGHT
          break
      }

      // Finish the current incident as we exit
      incident_finish[incident[INCIDENT_ID]](incident)

      // Add next battle field incident
      const battleFieldIncidentProps = [
        BATTLE_FIELD_INCIDENT, // incident id
        incidentGame, // incident game
        32, // row numbers
        32, // col numbers
      ]
      const nextMazeCellRow = incident[INCIDENT_CELL_ROW] + tbIncrement
      const nextMazeCellCol = incident[INCIDENT_CELL_COL] + lrIncrement
      battleFieldIncidentProps[INCIDENT_CELL_ROW] = nextMazeCellRow
      battleFieldIncidentProps[INCIDENT_CELL_COL] = nextMazeCellCol
      battleFieldIncidentProps[INCIDENT_PLAYER_STATUS] = [playerFromDoor]
      game_addIncident(
        game,
        BATTLE_FIELD_INCIDENT,
        `${BATTLE_FIELD_INCIDENT}@${nextMazeCellRow}@${nextMazeCellCol}`,
        incident_factories[BATTLE_FIELD_INCIDENT],
        battleFieldIncidentProps
      )
    }
  })
}

function battleFieldIncident_createStartCell(incident) {
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

function battleFieldIncident_playStartCell(incident) {
  const incidentGame = incident[INCIDENT_GAME]
  const doorSprites = group_getSpritesByIds(
    incident[INCIDENT_MAP_GROUP],
    incident[INCIDENT_DOORS].map(doorId => incidentGame[GAME_DOORS][doorId])
  )
  const kingSprite = group_getSpriteById(
    incident[INCIDENT_MAP_GROUP],
    KING_SPRITE
  )

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
}

function battleFieldIncident_playEndCell(incident) {
  // TODO: add end cell boss
}

function battleFieldIncident_createRandomCell(incident) {
  // Create map data
  const incidentGame = incident[INCIDENT_GAME]
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

function battleFieldIncident_playRandomCell(incident) {
  // TODO: add random cell events
}

function battleFieldIncident_handleDoors() {
  // todo finish this
}

// Set player status when entering battle field
function baseIncident_setPlayerStatus(incident) {
  const playerSprite = group_getSpriteById(
    incident[INCIDENT_MAP_GROUP],
    PLAYER_SPRITE
  )
  const playerFromDoor = incident[INCIDENT_PLAYER_STATUS][PLAYER_FROM_DOOR]
  const incidentGame = incident[INCIDENT_GAME]
  const incidentWidth =
    incident[INCIDENT_COL_NUM] * incidentGame[GAME_TILE_WIDTH]
  const incidentHeight =
    incident[INCIDENT_ROW_NUM] * incidentGame[GAME_TILE_HEIGHT]
  const tileWidth = incidentGame[GAME_TILE_WIDTH]
  const tileHeight = incidentGame[GAME_TILE_HEIGHT]
  if (typeof playerFromDoor !== 'undefined') {
    // Set player position to be next to the from door
    switch (playerFromDoor) {
      case DOOR_TOP:
        playerSprite[SPRITE_X] =
          (incidentWidth - playerSprite[SPRITE_WIDTH]) / 2
        playerSprite[SPRITE_Y] = 3 * tileHeight
        break

      case DOOR_RIGHT:
        playerSprite[SPRITE_X] =
          incidentWidth - tileWidth - playerSprite[SPRITE_WIDTH]
        playerSprite[SPRITE_Y] =
          (incidentHeight - playerSprite[SPRITE_HEIGHT]) / 2
        break

      case DOOR_BOTTOM:
        playerSprite[SPRITE_X] =
          (incidentWidth - playerSprite[SPRITE_WIDTH]) / 2
        playerSprite[SPRITE_Y] =
          incidentHeight - tileHeight - playerSprite[SPRITE_HEIGHT]
        break

      case DOOR_LEFT:
        playerSprite[SPRITE_X] = tileWidth
        playerSprite[SPRITE_Y] =
          (incidentHeight - playerSprite[SPRITE_HEIGHT]) / 2
        break
    }
  }
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
