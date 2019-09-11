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
  game_addSprite(game, EMPTY_SPRITE, () => {
    const props = []
    props[SPRITE_ID] = EMPTY_SPRITE
    props[SPRITE_OPACITY] = 0
    return sprite_factory(props)
  })

  game_addSprite(game, BACKGROUND_SPRITE, () => {
    const props = []
    props[SPRITE_ID] = BACKGROUND_SPRITE
    props[SPRITE_BACKGROUND_COLOR] = PALETTE.GUNMETAL[4]
    return sprite_factory(props)
  })

  game_addSprite(game, GROUND_SPRITE, () => {
    const props = []
    props[SPRITE_ID] = GROUND_SPRITE
    props[SPRITE_BACKGROUND_COLOR] = PALETTE.GUNMETAL[3]
    return sprite_factory(props)
  })

  game_addSprite(game, WALL_SPRITE, () => {
    const props = []
    props[SPRITE_ID] = WALL_SPRITE
    props[SPRITE_BACKGROUND_COLOR] = PALETTE_BROWN[3]
    return sprite_factory(props)
  })

  game_addSprite(game, WALL_TOP_SPRITE, () => {
    const props = []
    props[SPRITE_ID] = WALL_TOP_SPRITE
    props[SPRITE_BACKGROUND_COLOR] = PALETTE_BROWN[1]
    return sprite_factory(props)
  })

  const doorSpriteIds = [
    TOP_DOOR_SPRITE,
    RIGHT_DOOR_SPRITE,
    BOTTOM_DOOR_SPRITE,
    LEFT_DOOR_SPRITE,
  ]
  doorSpriteIds.forEach(spriteId => {
    game_addSprite(game, spriteId, () => {
      const props = []
      props[SPRITE_ID] = spriteId
      props[SPRITE_BACKGROUND_COLOR] = PALETTE_BROWN[3]
      return sprite_factory(props)
    })
  })

  const playerColor = PALETTE_BROWN[2]
  game_addSprite(game, PLAYER_SPRITE, () => {
    const props = []
    props[SPRITE_ID] = PLAYER_SPRITE
    props[SPRITE_NAME] = 'player'
    props[SPRITE_BACKGROUND_COLOR] = playerColor
    props[SPRITE_SHOW_NAME] = true
    props[SPRITE_TYPE] = SPRITE_TYPE_OBJECT
    const playerSprite = sprite_factory(props)

    // set player max speed (per 1 ms)
    playerSprite[SPRITE_VMAX] = playerSprite[SPRITE_WIDTH] / 4
    return playerSprite
  })

  game_addSprite(game, PLAYER_DIALOG_SPRITE, () => {
    const props = []
    props[SPRITE_ID] = PLAYER_DIALOG_SPRITE
    props[SPRITE_BACKGROUND_COLOR] = playerColor
    return sprite_factory(props)
  })
}
