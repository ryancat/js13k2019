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
