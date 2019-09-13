// load all sprites to game
// EMPTY_SPRITE,
//   BACKGROUND_SPRITE,
//   GROUND_SPRITE,
//   WALL_SPRITE,
//   TOP_DOOR_SPRITE,
//   RIGHT_DOOR_SPRITE,
//   BOTTOM_DOOR_SPRITE,
//   LEFT_DOOR_SPRITE,
//   WALL_TOP_SPRITE,
//   PLAYER_SPRITE,
function sprites_init(game) {
  game_addSprite(game, EMPTY_SPRITE, props => {
    const defaultProps = []
    defaultProps[SPRITE_ID] = EMPTY_SPRITE
    defaultProps[SPRITE_OPACITY] = 0
    return sprite_factory(util_assignArr(defaultProps, props))
  })

  game_addSprite(game, BACKGROUND_SPRITE, props => {
    const defaultProps = []
    defaultProps[SPRITE_ID] = BACKGROUND_SPRITE
    defaultProps[SPRITE_BACKGROUND_COLOR] = PALETTE_GUNMETAL[4]
    return sprite_factory(util_assignArr(defaultProps, props))
  })

  game_addSprite(game, GROUND_SPRITE, props => {
    const defaultProps = []
    defaultProps[SPRITE_ID] = GROUND_SPRITE
    defaultProps[SPRITE_BACKGROUND_COLOR] = PALETTE_GUNMETAL[3]
    return sprite_factory(util_assignArr(defaultProps, props))
  })

  game_addSprite(game, WALL_SPRITE, props => {
    const defaultProps = []
    defaultProps[SPRITE_ID] = WALL_SPRITE
    defaultProps[SPRITE_BACKGROUND_COLOR] = PALETTE_BROWN[3]
    defaultProps[SPRITE_HITTYPE] = HITTYPE_STOP
    return sprite_factory(util_assignArr(defaultProps, props))
  })

  game_addSprite(game, WALL_TOP_SPRITE, props => {
    const defaultProps = []
    defaultProps[SPRITE_ID] = WALL_TOP_SPRITE
    defaultProps[SPRITE_BACKGROUND_COLOR] = PALETTE_BROWN[1]
    return sprite_factory(util_assignArr(defaultProps, props))
  })

  const doorSpriteIds = [
    TOP_DOOR_SPRITE,
    RIGHT_DOOR_SPRITE,
    BOTTOM_DOOR_SPRITE,
    LEFT_DOOR_SPRITE,
  ]
  doorSpriteIds.forEach(spriteId => {
    game_addSprite(game, spriteId, props => {
      const defaultProps = []
      defaultProps[SPRITE_ID] = spriteId
      defaultProps[SPRITE_BACKGROUND_COLOR] = PALETTE_GREEN[3]
      return sprite_factory(util_assignArr(defaultProps, props))
    })
  })

  game_addSprite(game, PLAYER_SPRITE, props => {
    const defaultProps = []
    defaultProps[SPRITE_ID] = PLAYER_SPRITE
    defaultProps[SPRITE_NAME] = 'player'
    defaultProps[SPRITE_BACKGROUND_COLOR] = PALETTE_BROWN[2]
    defaultProps[SPRITE_BORDER_COLOR] = PALETTE_BROWN[3]
    defaultProps[SPRITE_SHOW_NAME] = true
    defaultProps[SPRITE_TYPE] = SPRITE_TYPE_OBJECT
    defaultProps[SPRITE_HITTYPE] = HITTYPE_STOP
    defaultProps[SPRITE_STATE] = []
    defaultProps[SPRITE_STATE][SPRITE_HP] = 10
    defaultProps[SPRITE_STATE][SPRITE_HP_MAX] = 10
    defaultProps[SPRITE_STATE][SPRITE_DAMAGE] = 1
    const playerSprite = sprite_factory(util_assignArr(defaultProps, props))

    // set player max speed (per 1 ms)
    playerSprite[SPRITE_VMAX] = playerSprite[SPRITE_WIDTH] / 4
    return playerSprite
  })

  const kingColor = PALETTE_BLUE[2]
  game_addSprite(game, KING_SPRITE, props => {
    const defaultProps = []
    defaultProps[SPRITE_ID] = KING_SPRITE
    defaultProps[SPRITE_BACKGROUND_COLOR] = kingColor
    return sprite_factory(util_assignArr(defaultProps, props))
  })

  const johnColor = PALETTE_GREEN[1]
  game_addSprite(game, JOHN_SPRITE, props => {
    const defaultProps = []
    defaultProps[SPRITE_ID] = JOHN_SPRITE
    defaultProps[SPRITE_BACKGROUND_COLOR] = johnColor
    return sprite_factory(util_assignArr(defaultProps, props))
  })

  game_addSprite(game, MONSTER_SPRITE, props => {
    const defaultProps = []
    defaultProps[SPRITE_ID] = MONSTER_SPRITE
    defaultProps[SPRITE_BACKGROUND_COLOR] = PALETTE_RED[2]
    defaultProps[SPRITE_BORDER_COLOR] = PALETTE_RED[3]
    defaultProps[SPRITE_STATE] = []
    defaultProps[SPRITE_STATE][SPRITE_HP] = 6
    defaultProps[SPRITE_STATE][SPRITE_HP_MAX] = 6
    defaultProps[SPRITE_STATE][SPRITE_DAMAGE] = 1
    const monsterSprite = sprite_factory(util_assignArr(defaultProps, props))

    // set monster max speed (per 1 ms)
    monsterSprite[SPRITE_VMAX] = monsterSprite[SPRITE_WIDTH] / 64

    return monsterSprite
  })

  // game_addSprite(game, MONSTER_SPRITE_BOSS, props => {
  //   const defaultProps = []
  //   defaultProps[SPRITE_ID] = MONSTER_SPRITE
  //   defaultProps[SPRITE_BACKGROUND_COLOR] = PALETTE_RED[2]
  //   defaultProps[SPRITE_BORDER_COLOR] = PALETTE_RED[3]
  //   defaultProps[SPRITE_STATE] = []
  //   defaultProps[SPRITE_STATE][SPRITE_HP] = 100
  //   defaultProps[SPRITE_STATE][SPRITE_HP_MAX] = 100
  //   defaultProps[SPRITE_STATE][SPRITE_DAMAGE] = 2
  //   const monsterSprite = sprite_factory(util_assignArr(defaultProps, props))

  //   // set monster max speed (per 1 ms)
  //   monsterSprite[SPRITE_VMAX] = monsterSprite[SPRITE_WIDTH] / 128

  //   return monsterSprite
  // })

  game_addSprite(game, BULLET_SPRITE, props => {
    const defaultProps = []
    defaultProps[SPRITE_ID] = BULLET_SPRITE
    defaultProps[SPRITE_BACKGROUND_COLOR] = PALETTE_GREEN[1]
    defaultProps[SPRITE_WIDTH] = 8
    defaultProps[SPRITE_HEIGHT] = 8
    defaultProps[SPRITE_VMAX] = 10
    defaultProps[SPRITE_MOVE_TYPE] = SPRITE_MOVE_TYPE_CONSTANT
    return sprite_factory(util_assignArr(defaultProps, props))
  })

  game_addSprite(game, BULLET_SPRITE_ENEMY, props => {
    const defaultProps = []
    defaultProps[SPRITE_ID] = BULLET_SPRITE
    defaultProps[SPRITE_BACKGROUND_COLOR] = PALETTE_RED[1]
    defaultProps[SPRITE_WIDTH] = 8
    defaultProps[SPRITE_HEIGHT] = 8
    defaultProps[SPRITE_VMAX] = 10
    defaultProps[SPRITE_MOVE_TYPE] = SPRITE_MOVE_TYPE_CONSTANT
    return sprite_factory(util_assignArr(defaultProps, props))
  })

  game_addSprite(game, BULLET_SPRITE_FOLLOW, props => {
    const defaultProps = []
    defaultProps[SPRITE_ID] = BULLET_SPRITE
    defaultProps[SPRITE_BACKGROUND_COLOR] = PALETTE_BLUE[1]
    defaultProps[SPRITE_WIDTH] = 8
    defaultProps[SPRITE_HEIGHT] = 8
    defaultProps[SPRITE_VMAX] = 10
    defaultProps[SPRITE_MOVE_TYPE] = SPRITE_MOVE_TYPE_FOLLOW
    return sprite_factory(util_assignArr(defaultProps, props))
  })
}
