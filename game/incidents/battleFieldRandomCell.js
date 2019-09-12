function battleFieldIncident_createRandomCell(incident) {
  // Create map data
  const incidentGame = incident[INCIDENT_GAME]
  const incidentWidth =
    incident[INCIDENT_COL_NUM] * incidentGame[GAME_TILE_WIDTH]
  const incidentHeight =
    incident[INCIDENT_ROW_NUM] * incidentGame[GAME_TILE_HEIGHT]
  const gameObjectWidths = incidentGame[GAME_OBJECT_WIDTHS]
  const gameObjectHeights = incidentGame[GAME_OBJECT_HEIGHTS]
  const playerStatus = incident[INCIDENT_PLAYER_STATUS]
  const mapObjects = [
    // player object
    [
      PLAYER_SPRITE, // object id
      gameObjectWidths[GAME_OBJ_WIDTH_M], // width
      gameObjectHeights[GAME_OBJ_WIDTH_L], // height
      0, // the x will be set after enter map
      0, // the y will be set after enter map
      GAME_PLAYER_NAME, // player (default) name,
    ],
  ]

  if (!playerStatus[PLAYER_JOHN_INTRODUCED]) {
    // First we must meet John
    const johnProps = []
    johnProps[SPRITE_HITTYPE] = HITTYPE_STOP
    johnProps[SPRITE_BACKGROUND_COLOR] = PALETTE_GREEN[1]
    mapObjects.push([
      JOHN_SPRITE,
      gameObjectWidths[GAME_OBJ_WIDTH_M], // width
      gameObjectHeights[GAME_OBJ_WIDTH_L], // height
      Math.round((incidentWidth - GAME_OBJ_WIDTH_M) / 3), // x
      Math.round((incidentHeight - GAME_OBJ_WIDTH_L) / 3), // y
      'John',
      johnProps,
    ])
  } else {
  }

  incident[INCIDENT_MAP_DATA] = mg_generateMapData([
    0, // x
    0, // y
    incident[INCIDENT_COL_NUM], // colNum
    incident[INCIDENT_ROW_NUM], // rowNum
    incident[INCIDENT_DOORS], // doors
    incidentGame[GAME_TILE_WIDTH], // tileWidth
    incidentGame[GAME_TILE_HEIGHT], // tileHeight
    mapObjects,
  ])
}

function battleFieldIncident_playRandomCell(incident) {
  // TODO: add random cell events
  const incidentGame = incident[INCIDENT_GAME]
  const doorSprites = group_getSpritesByIds(
    incident[INCIDENT_MAP_GROUP],
    incident[INCIDENT_DOORS].map(doorId => incidentGame[GAME_DOORS][doorId])
  )
  const playerStatus = incident[INCIDENT_PLAYER_STATUS]

  if (!playerStatus[PLAYER_JOHN_INTRODUCED]) {
    playerStatus[PLAYER_JOHN_INTRODUCED] = true

    const johnSprite = group_getSpriteById(
      incident[INCIDENT_MAP_GROUP],
      JOHN_SPRITE
    )

    // Bind king sprite hit handler
    johnSprite[SPRITE_HIT_CALLBACK] = playerSprite => {
      if (!incidentGame[GAME_DIALOG]) {
        // Only play conversation when there is no dialog right now
        game_playConversation(
          incidentGame,
          conv_john(johnSprite, playerSprite, incident),
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
}