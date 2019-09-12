function hit_computeRectHit(sprite, otherSprite) {
  // Tile boundary hit test
  // On each coordinate, there are four cases that they
  // may hit. We mark this as binary 0000 to 1111, from top, right,
  // bottom and left
  const atYNeg =
    otherSprite[SPRITE_Y] <= sprite[SPRITE_Y] &&
    otherSprite[SPRITE_Y] + otherSprite[SPRITE_HEIGHT] >= sprite[SPRITE_Y] &&
    otherSprite[SPRITE_Y] + otherSprite[SPRITE_HEIGHT] - sprite[SPRITE_Y]
  const atXPos =
    sprite[SPRITE_X] <= otherSprite[SPRITE_X] &&
    sprite[SPRITE_X] + sprite[SPRITE_WIDTH] >= otherSprite[SPRITE_X] &&
    sprite[SPRITE_X] + sprite[SPRITE_WIDTH] - otherSprite[SPRITE_X]
  const atYPos =
    sprite[SPRITE_Y] <= otherSprite[SPRITE_Y] &&
    sprite[SPRITE_Y] + sprite[SPRITE_HEIGHT] >= otherSprite[SPRITE_Y] &&
    sprite[SPRITE_Y] + sprite[SPRITE_HEIGHT] - otherSprite[SPRITE_Y]
  const atXNeg =
    otherSprite[SPRITE_X] <= sprite[SPRITE_X] &&
    otherSprite[SPRITE_X] + otherSprite[SPRITE_WIDTH] >= sprite[SPRITE_X] &&
    otherSprite[SPRITE_X] + otherSprite[SPRITE_WIDTH] - sprite[SPRITE_X]

  const top = Math.max(atXPos, atXNeg) && +atYNeg
  const right = Math.max(atYPos, atYNeg) && +atXPos
  const bottom = Math.max(atXPos, atXNeg) && +atYPos
  const left = Math.max(atYPos, atYNeg) && +atXNeg

  return [top, right, bottom, left]
}
