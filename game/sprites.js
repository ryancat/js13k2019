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
      defaultProps[SPRITE_BACKGROUND_COLOR] = PALETTE_BROWN[3]
      return sprite_factory(util_assignArr(defaultProps, props))
    })
  })

  const playerColor = PALETTE_BROWN[2]
  game_addSprite(game, PLAYER_SPRITE, props => {
    const defaultProps = []
    defaultProps[SPRITE_ID] = PLAYER_SPRITE
    defaultProps[SPRITE_NAME] = 'player'
    defaultProps[SPRITE_BACKGROUND_COLOR] = playerColor
    defaultProps[SPRITE_SHOW_NAME] = true
    defaultProps[SPRITE_TYPE] = SPRITE_TYPE_OBJECT
    const playerSprite = sprite_factory(util_assignArr(defaultProps, props))

    // set player max speed (per 1 ms)
    playerSprite[SPRITE_VMAX] = playerSprite[SPRITE_WIDTH] / 4
    return playerSprite
  })

  game_addSprite(game, PLAYER_DIALOG_SPRITE, props => {
    const defaultProps = []
    defaultProps[SPRITE_ID] = PLAYER_DIALOG_SPRITE
    defaultProps[SPRITE_BACKGROUND_COLOR] = playerColor
    return sprite_factory(util_assignArr(defaultProps, props))
  })
}
