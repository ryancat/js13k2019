function battleFieldIncident_createRandomCell(incident) {
  // Create map data
  const incidentGame = incident[INCIDENT_GAME]
  const incidentWidth =
    incident[INCIDENT_COL_NUM] * incidentGame[GAME_TILE_WIDTH]
  const incidentHeight =
    incident[INCIDENT_ROW_NUM] * incidentGame[GAME_TILE_HEIGHT]
  const tileWidth = incidentGame[GAME_TILE_WIDTH]
  const tileHeight = incidentGame[GAME_TILE_HEIGHT]
  const gameObjectWidths = incidentGame[GAME_OBJECT_WIDTHS]
  const gameObjectHeights = incidentGame[GAME_OBJECT_HEIGHTS]
  const playerStatus = incident[INCIDENT_PLAYER_STATUS]
  const playerWidth = gameObjectWidths[GAME_OBJ_WIDTH_M]
  const playerHeight = gameObjectHeights[GAME_OBJ_WIDTH_L]
  const mapObjects = [
    // player object
    [
      PLAYER_SPRITE, // object id
      playerWidth, // width
      playerHeight, // height
      0, // the x will be set after enter map
      0, // the y will be set after enter map
      GAME_PLAYER_NAME, // player (default) name,
    ],
  ]

  if (!playerStatus[PLAYER_JOHN_MEET]) {
    playerStatus[PLAYER_JOHN_MEET] = true
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
      ,
      johnProps,
    ])
  } else {
    if (!playerStatus[PLAYER_MEET_FIRST_MONSTER]) {
      playerStatus[PLAYER_MEET_FIRST_MONSTER] = true
      // We will send ONE monsters
      const monsterProps = []
      monsterProps[SPRITE_HITTYPE] = HITTYPE_STOP
      mapObjects.push([
        MONSTER_SPRITE,
        gameObjectWidths[GAME_OBJ_WIDTH_M], // width
        gameObjectHeights[GAME_OBJ_WIDTH_L], // height
        Math.round((incidentWidth - GAME_OBJ_WIDTH_M) / 2), // x
        Math.round((incidentHeight - GAME_OBJ_WIDTH_L) / 2), // y
        ,
        monsterProps,
      ])
    } else {
      const totalMonsterNum =
        random[RANDOM_NEXT_FLOAT]() > 0.5
          ? Math.floor(
              random[RANDOM_NEXT_FLOAT]() *
                (((incident[INCIDENT_COL_NUM] / 8) *
                  incident[INCIDENT_ROW_NUM]) /
                  27)
            )
          : 0

      for (let i = 0; i < totalMonsterNum; i++) {
        const monsterWidth =
          gameObjectWidths[
            Math.ceil(
              (gameObjectWidths.length - 2) * random[RANDOM_NEXT_FLOAT]()
            )
          ]
        const monsterHeight =
          gameObjectHeights[
            Math.ceil(
              (gameObjectHeights.length - 2) * random[RANDOM_NEXT_FLOAT]()
            )
          ]
        const monsterProps = []
        monsterProps[SPRITE_HITTYPE] = HITTYPE_STOP
        mapObjects.push([
          MONSTER_SPRITE,
          monsterWidth, // width
          monsterHeight, // height
          Math.floor(
            tileWidth +
              Math.max(
                0,
                (incidentWidth -
                  tileWidth * 2 -
                  monsterWidth -
                  playerWidth -
                  tileWidth) *
                  random[RANDOM_NEXT_FLOAT]()
              )
          ), // x
          Math.floor(
            tileHeight * 3 +
              Math.max(
                0,
                (incidentHeight -
                  tileHeight * 6 -
                  monsterHeight -
                  playerHeight -
                  tileHeight) *
                  random[RANDOM_NEXT_FLOAT]()
              )
          ), // y
          ,
          monsterProps,
        ])
      }
    }
  }

  incident[INCIDENT_MAP_DATA] = mg_generateMapData([
    0, // x
    0, // y
    incident[INCIDENT_COL_NUM], // colNum
    incident[INCIDENT_ROW_NUM], // rowNum
    incident[INCIDENT_DOORS], // doors
    tileWidth, // tileWidth
    tileHeight, // tileHeight
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
  const playerSprite = group_getSpriteById(
    incident[INCIDENT_MAP_GROUP],
    PLAYER_SPRITE
  )
  const playerStatus = incident[INCIDENT_PLAYER_STATUS]

  const johnSprite = group_getSpriteById(
    incident[INCIDENT_MAP_GROUP],
    JOHN_SPRITE
  )
  if (johnSprite && !playerStatus[PLAYER_JOHN_INTRODUCED]) {
    playerStatus[PLAYER_JOHN_INTRODUCED] = true
    // Bind king sprite hit handler
    johnSprite[SPRITE_HIT_CALLBACK] = playerSprite => {
      if (playerSprite[SPRITE_ID] !== PLAYER_SPRITE) {
        // Only player can hit john
        return
      }

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
  } else {
    // When there are monsters
    const monsterSprites = group_getSpritesById(
      incident[INCIDENT_MAP_GROUP],
      MONSTER_SPRITE
    )
    let monsterNum = monsterSprites.length
    if (monsterNum <= 0) {
      // all monster cleared. Open the door
      doorSprites.forEach(doorSprite => {
        doorSprite[SPRITE_BACKGROUND_COLOR] = PALETTE_GREEN[3]
        doorSprite[SPRITE_HITTYPE] = HITTYPE_PASS
      })
    }

    monsterSprites.forEach(monsterSprite => {
      // monster would attack!
      sprite_continueAttack(
        monsterSprite,
        playerSprite,
        incident,
        BULLET_SPRITE_ENEMY
      )
    })

    monsterSprites.forEach(monsterSprite => {
      // monster will take damage
      monsterSprite[SPRITE_HIT_CALLBACK] = spriteHitMonster => {
        switch (spriteHitMonster[SPRITE_ID]) {
          case BULLET_SPRITE:
            // regular bullet hit monster
            // reduce one HP
            monsterSprite[SPRITE_STATE][SPRITE_HP] -=
              spriteHitMonster[SPRITE_FROM_SPRITE][SPRITE_STATE][SPRITE_DAMAGE]
            break
        }

        if (monsterSprite[SPRITE_STATE][SPRITE_HP] <= 0) {
          // monster died
          sprite_destroy(monsterSprite)
          monsterNum--
        }

        if (monsterNum <= 0) {
          // all monster cleared. Open the door
          doorSprites.forEach(doorSprite => {
            doorSprite[SPRITE_BACKGROUND_COLOR] = PALETTE_GREEN[3]
            doorSprite[SPRITE_HITTYPE] = HITTYPE_PASS
          })
        }
      }
    })
  }

  // Player will take damage
  playerSprite[SPRITE_HIT_CALLBACK] = spriteHitPlayer => {
    switch (spriteHitPlayer[SPRITE_ID]) {
      case MONSTER_SPRITE:
        // regular monster touch me
        // reduce one HP
        playerSprite[SPRITE_STATE][SPRITE_HP] -= 0.1
        zzfx.apply(null, MUSIC_SOUND_DAMAGE)
        break

      case BULLET_SPRITE_ENEMY:
        // regular monster hit me
        // reduce one HP
        playerSprite[SPRITE_STATE][SPRITE_HP] -=
          spriteHitPlayer[SPRITE_FROM_SPRITE][SPRITE_STATE][SPRITE_DAMAGE]
        zzfx.apply(null, MUSIC_SOUND_DAMAGE)
        break
    }

    if (playerSprite[SPRITE_STATE][SPRITE_HP] <= 0) {
      // Stop the current monsters from attacking
      group_getSpritesById(
        incident[INCIDENT_MAP_GROUP],
        MONSTER_SPRITE
      ).forEach(
        monsterSprite =>
          (monsterSprite[SPRITE_STATE][SPRITE_IS_DISABLED] = true)
      )

      // player died, send back to start point
      battleFieldIncident_playerGoBack(incident, playerSprite)
    }
  }
}
