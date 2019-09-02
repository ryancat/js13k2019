export function computeRectHit(sprite, otherSprite) {
  // Tile boundary hit test
  // On each coordinate, there are four cases that they
  // may hit. We mark this as binary 0000 to 1111, from top, right,
  // bottom and left
  const hitArea = sprite.hitArea
  const otherHitArea = otherSprite.hitArea
  const atYNeg =
    otherSprite.y + otherHitArea.localY <= sprite.y + hitArea.localY &&
    otherSprite.y + otherHitArea.localY + otherHitArea.localHeight >=
      sprite.y + hitArea.localY &&
    otherSprite.y +
      otherHitArea.localY +
      otherHitArea.localHeight -
      (sprite.y + hitArea.localY)
  const atXPos =
    sprite.x + hitArea.localX <= otherSprite.x + otherHitArea.localX &&
    sprite.x + hitArea.localX + hitArea.localWidth >=
      otherSprite.x + otherHitArea.localX &&
    sprite.x +
      hitArea.localX +
      hitArea.localWidth -
      (otherSprite.x + otherHitArea.localX)
  const atYPos =
    sprite.y + hitArea.localY <= otherSprite.y + otherHitArea.localY &&
    sprite.y + hitArea.localY + hitArea.localHeight >=
      otherSprite.y + otherHitArea.localY &&
    sprite.y +
      hitArea.localY +
      hitArea.localHeight -
      (otherSprite.y + otherHitArea.localY)
  const atXNeg =
    otherSprite.x + otherHitArea.localX <= sprite.x + hitArea.localX &&
    otherSprite.x + otherHitArea.localX + otherHitArea.localWidth >=
      sprite.x + hitArea.localX &&
    otherSprite.x +
      otherHitArea.localX +
      otherHitArea.localWidth -
      (sprite.x + hitArea.localX)

  const top = Math.max(atXPos, atXNeg) && +atYNeg
  const right = Math.max(atYPos, atYNeg) && +atXPos
  const bottom = Math.max(atXPos, atXNeg) && +atYPos
  const left = Math.max(atYPos, atYNeg) && +atXNeg
  const isHit = top || right || bottom || left

  // if (isHit) {
  //   console.log({
  //     top,
  //     right,
  //     bottom,
  //     left,
  //     isHit,
  //   })
  // }

  return {
    top,
    right,
    bottom,
    left,
    isHit,
  }
}

export function computeHit(sprite, otherSprite) {
  // TODO: should I use instanceof SceneSprite?
  if (otherSprite.children) {
  }

  // TODO: only rect here
  return computeRectHit(sprite, otherSprite)
}

// TODO: only test rect sprite for now
export function hitTestPoint({ x = 0, y = 0 }, rectSprite) {
  return (
    x >= rectSprite.x + rectSprite.hitArea.localX &&
    x <=
      rectSprite.x +
        rectSprite.hitArea.localX +
        rectSprite.hitArea.localWidth &&
    y >= rectSprite.y + rectSprite.hitArea.localY &&
    y <=
      rectSprite.y + rectSprite.hitArea.localY + rectSprite.hitArea.localHeight
  )
}

export function hitTestRect(sprite, otherSprite) {
  // The two rect sprite hit each other when they hit on both x and y
  // cooridnates.
  return computeRectHit(sprite, otherSprite).isHit
}

export function hitTestRects(rectSpriteArr1 = [], rectSpriteArr2 = []) {
  if (!Array.isArray(rectSpriteArr1)) {
    rectSpriteArr1 = [rectSpriteArr1]
  }

  if (!Array.isArray(rectSpriteArr2)) {
    rectSpriteArr2 = [rectSpriteArr2]
  }

  // the two group hit when any one sprite in rectSpriteArr1 hit
  // any one sprite in rectSpriteArr2
  return rectSpriteArr1.some(sprite1 =>
    rectSpriteArr2.some(sprite2 => hitTestRect(sprite1, sprite2))
  )
}

export function hitTest(sprite, otherSprite) {
  // TODO: only rect test here. Need to add other tests
  return hitTestRect(sprite, otherSprite)
}
