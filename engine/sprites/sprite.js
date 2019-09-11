// const [
//   SPRITE_X,
//   SPRITE_Y,
//   SPRITE_WIDTH,
//   SPRITE_HEIGHT,
//   SPRITE_NAME,
//   SPRITE_HITTYPE,
//   SPRITE_SHOW_NAME,
//   SPRITE_DISABLE_HIT,
//   SPRITE_BACKGROUND_COLOR,
//   SPRITE_BORDER_COLOR,
//   SPRITE_OPACITY,
//   SPRITE_TILE_INDEX,
//   SPRITE_COL,
//   SPRITE_ROW,
//   SPRITE_VX,
//   SPRITE_VY,
// ] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

function sprite_factory(props = []) {
  return util_assignArr(
    [
      -1,
      0,
      0,
      32,
      48,
      '',
      HITTYPE_PASS,
      false,
      false,
      PALETTE_RED[2],
      PALETTE_GUNMETAL[2],
      1,
      -1,
      -1,
      -1,
      0,
      0,
    ],
    props
  )
}

function sprite_render(sprite, dt, renderer) {
  renderer_drawRect(renderer, [
    sprite[SPRITE_X],
    sprite[SPRITE_Y],
    sprite[SPRITE_WIDTH],
    sprite[SPRITE_HEIGHT],
    sprite[SPRITE_OPACITY],
    !!sprite[SPRITE_BACKGROUND_COLOR],
    !!sprite[SPRITE_BORDER_COLOR],
    sprite[SPRITE_BACKGROUND_COLOR],
    sprite[SPRITE_BORDER_COLOR],
  ])
}

function sprite_move(sprite, isDisableMove) {
  if (isDisableMove) {
    // We cannot move when game is pause move
    return
  }

  if (sprite[SPRITE_TYPE] === SPRITE_TYPE_TILE) {
    // Tile sprites cannot move
    return
  }

  sprite[SPRITE_X] += sprite[SPRITE_VX]
  // this.checkHitSprites()

  sprite[SPRITE_Y] += sprite[SPRITE_VY]
  // this.checkHitSprites()
}
