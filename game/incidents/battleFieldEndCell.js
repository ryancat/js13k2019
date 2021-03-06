function battleFieldIncident_createEndCell(incident) {
  // Create map data

  // Reset map size to big as we are fighting the boss
  incident[INCIDENT_COL_NUM] = 64
  incident[INCIDENT_ROW_NUM] = 64

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
      gameObjectWidths[GAME_OBJ_WIDTH_M], // width
      gameObjectHeights[GAME_OBJ_WIDTH_L], // height
      0, // the x will be set after enter map
      0, // the y will be set after enter map
      GAME_PLAYER_NAME, // player (default) name,
    ],
  ]

  // John will secretly here
  const johnProps = []
  johnProps[SPRITE_HITTYPE] = HITTYPE_PASS
  johnProps[SPRITE_BACKGROUND_COLOR] = PALETTE_GREEN[1]
  johnProps[SPRITE_OPACITY] = 0
  mapObjects.push([
    JOHN_SPRITE,
    gameObjectWidths[GAME_OBJ_WIDTH_M], // width
    gameObjectHeights[GAME_OBJ_WIDTH_L], // height
    Math.round((incidentWidth - GAME_OBJ_WIDTH_M) / 3), // x
    Math.round((incidentHeight - GAME_OBJ_WIDTH_L) / 3), // y
    ,
    johnProps,
  ])

  // We will send ONE BOSS
  const monsterProps = []
  monsterProps[SPRITE_HITTYPE] = HITTYPE_STOP
  monsterProps[SPRITE_STATE] = []
  monsterProps[SPRITE_STATE][SPRITE_HP] = 20
  monsterProps[SPRITE_STATE][SPRITE_HP_MAX] = 20
  monsterProps[SPRITE_STATE][SPRITE_DAMAGE] = 2
  monsterProps[SPRITE_STATE][SPRITE_ATTACK_RATE] = 150
  monsterProps[SPRITE_HITTYPE] = HITTYPE_STOP
  mapObjects.push([
    MONSTER_SPRITE,
    gameObjectWidths[GAME_OBJ_WIDTH_XL], // width
    gameObjectHeights[GAME_OBJ_WIDTH_XL], // height
    Math.round((incidentWidth - GAME_OBJ_WIDTH_L) / 2), // x
    Math.round((incidentHeight - GAME_OBJ_WIDTH_XL) / 2), // y
    ,
    monsterProps,
  ])

  // We will send other monsters
  const totalMonsterNum = Math.floor(
    random[RANDOM_NEXT_FLOAT]() *
      (((incident[INCIDENT_COL_NUM] / 20) * incident[INCIDENT_ROW_NUM]) / 30)
  )
  for (let i = 0; i < totalMonsterNum; i++) {
    const monsterWidth =
      gameObjectWidths[
        Math.ceil((gameObjectWidths.length - 2) * random[RANDOM_NEXT_FLOAT]())
      ]
    const monsterHeight =
      gameObjectHeights[
        Math.ceil((gameObjectHeights.length - 2) * random[RANDOM_NEXT_FLOAT]())
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

function battleFieldIncident_playEndCell(incident) {
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

  // Player reach end cell
  playerSprite[SPRITE_STATE][PLAYER_FIGHT_BOSS] = true

  // Player say oh shit
  game_playConversation(incidentGame, conv_player(playerSprite))

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
      BULLET_SPRITE_ENEMY,
      monsterSprite[SPRITE_STATE][SPRITE_ATTACK_RATE]
    )

    sprite_continueAttack(
      monsterSprite,
      null,
      incident,
      BULLET_SPRITE_ENEMY,
      monsterSprite[SPRITE_STATE][SPRITE_ATTACK_RATE]
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
        // Final room, monster died, and john will be back
        const johnSprite = group_getSpriteById(
          incident[INCIDENT_MAP_GROUP],
          JOHN_SPRITE
        )
        johnSprite[SPRITE_OPACITY] = 1
        johnSprite[SPRITE_HITTYPE] = HITTYPE_STOP
        johnSprite[SPRITE_CONVERSATION_STATES][0] = true
        johnSprite[SPRITE_CONVERSATION_STATES][1] = true

        // JOHN will talk
        johnSprite[SPRITE_HIT_CALLBACK] = spriteHitJohn => {
          if (
            spriteHitJohn[SPRITE_ID] === PLAYER_SPRITE &&
            johnSprite[SPRITE_CONVERSATION_STATES][1]
          ) {
            if (!incidentGame[GAME_DIALOG]) {
              // Only play conversation when there is no dialog right now
              game_playConversation(
                incidentGame,
                conv_john(johnSprite, playerSprite, incident),
                () => {
                  setTimeout(() => {
                    sprite_continueAttack(
                      johnSprite,
                      playerSprite,
                      incident,
                      BULLET_SPRITE_BOSS,
                      johnSprite[SPRITE_STATE][SPRITE_ATTACK_RATE]
                    )

                    sprite_continueAttack(
                      johnSprite,
                      null,
                      incident,
                      BULLET_SPRITE_BOSS,
                      johnSprite[SPRITE_STATE][SPRITE_ATTACK_RATE]
                    )
                  }, 1000)
                }
              )
            }
          }

          if (spriteHitJohn[SPRITE_ID] === BULLET_SPRITE) {
            // John take damage
            switch (spriteHitJohn[SPRITE_ID]) {
              case BULLET_SPRITE:
                // regular bullet hit monster
                // reduce one HP
                johnSprite[SPRITE_STATE][SPRITE_HP] -=
                  spriteHitJohn[SPRITE_FROM_SPRITE][SPRITE_STATE][SPRITE_DAMAGE]
                break
            }

            if (johnSprite[SPRITE_STATE][SPRITE_HP] <= 0) {
              // john died
              sprite_destroy(johnSprite)

              // all monster cleared. Open the door
              doorSprites.forEach(doorSprite => {
                doorSprite[SPRITE_BACKGROUND_COLOR] = PALETTE_GREEN[3]
                doorSprite[SPRITE_HITTYPE] = HITTYPE_PASS
              })

              // Player go back to king
              playerSprite[SPRITE_STATE][PLAYER_FINISH_BOSS] = true
              battleFieldIncident_playerGoBack(incident, playerSprite)
            }
          }
        }
      }
    }
  })

  // Player will take damage
  playerSprite[SPRITE_HIT_CALLBACK] = spriteHitPlayer => {
    switch (spriteHitPlayer[SPRITE_ID]) {
      case MONSTER_SPRITE:
        // regular monster touch me
        // reduce HP
        playerSprite[SPRITE_STATE][SPRITE_HP] -= 0.1
        zzfx.apply(null, MUSIC_SOUND_DAMAGE)
        break

      case BULLET_SPRITE_ENEMY:
        // regular monster hit me
        // reduce HP
        playerSprite[SPRITE_STATE][SPRITE_HP] -=
          spriteHitPlayer[SPRITE_FROM_SPRITE][SPRITE_STATE][SPRITE_DAMAGE]
        zzfx.apply(null, MUSIC_SOUND_DAMAGE)
        break

      case BULLET_SPRITE_BOSS:
        // boss monster hit me
        // reduce HP
        playerSprite[SPRITE_STATE][SPRITE_HP] -=
          spriteHitPlayer[SPRITE_FROM_SPRITE][SPRITE_STATE][SPRITE_DAMAGE]
        break
    }

    if (playerSprite[SPRITE_STATE][SPRITE_HP] <= 0) {
      // Stop the current monsters from attacking
      monsterSprites.forEach(
        monsterSprite =>
          (monsterSprite[SPRITE_STATE][SPRITE_IS_DISABLED] = true)
      )

      const johnSprite = group_getSpriteById(
        incident[INCIDENT_MAP_GROUP],
        JOHN_SPRITE
      )

      if (johnSprite && johnSprite[SPRITE_NAME] === 'johnTheBadGuy') {
        johnSprite[SPRITE_STATE][SPRITE_IS_DISABLED] = true
      }

      // player died, send back to start point
      battleFieldIncident_playerGoBack(incident, playerSprite)
    }
  }
}
