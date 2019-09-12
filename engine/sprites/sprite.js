// const [
//   SPRITE_ID,
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
//   SPRITE_VMAX,
//   SPRITE_TYPE,
//   SPRITE_MAP_GROUP,
//   SPRITE_HIT_CALLBACK,
// ] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

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
      '',
      1,
      -1,
      -1,
      -1,
      0,
      0,
      0,
      SPRITE_TYPE_TILE,
      [],
      EMPTY_FN,
    ],
    props
  )
}

function sprite_render(sprite, dt, camera, renderer) {
  const transformX = Math.floor(sprite[SPRITE_X] - camera[CAMERA_X])
  const transformY = Math.floor(sprite[SPRITE_Y] - camera[CAMERA_Y])

  if (
    transformX < -sprite[SPRITE_WIDTH] ||
    transformX > camera[CAMERA_WIDTH] ||
    transformY < -sprite[SPRITE_HEIGHT] ||
    transformY > camera[CAMERA_HEIGHT]
  ) {
    // Out of camera. no need to render
    return
  }

  renderer_drawRect(renderer, [
    transformX, // x
    transformY, // y
    sprite[SPRITE_WIDTH], // width
    sprite[SPRITE_HEIGHT], // height
    sprite[SPRITE_OPACITY], // globalAlpha
    !!sprite[SPRITE_BACKGROUND_COLOR], // is fill
    !!sprite[SPRITE_BORDER_COLOR], // is stroke
    sprite[SPRITE_BACKGROUND_COLOR], // fill
    sprite[SPRITE_BORDER_COLOR], // stroke
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
  this.sprite_checkHitSprites(sprite)

  sprite[SPRITE_Y] += sprite[SPRITE_VY]
  this.sprite_checkHitSprites(sprite)
}

function sprite_checkHitSprites(sprite) {
  // only check surranding sprites
  sprite_hitSprites(sprite, sprite_getPossibleHitSprites(sprite))
}

// return the occupied tiles for objects and tile sprite
function _sprite_getOccupiedTileIndexes(sprite) {
  if (sprite[SPRITE_TYPE] === SPRITE_TYPE_TILE) {
    return [sprite[SPRITE_TILE_INDEX]]
  } else {
    const spriteMapGroup = sprite[SPRITE_MAP_GROUP]
    const colNumPerPixel =
      spriteMapGroup[GROUP_COL_NUM] / spriteMapGroup[GROUP_WIDTH]
    const rowNumPerPixel =
      spriteMapGroup[GROUP_ROW_NUM] / spriteMapGroup[GROUP_HEIGHT]

    const startColIndex = Math.floor(sprite[SPRITE_X] * colNumPerPixel - 0.001)
    const endColIndex = Math.floor(
      (sprite[SPRITE_X] + sprite[SPRITE_WIDTH]) * colNumPerPixel - 0.001
    )
    const startRowIndex = Math.floor(sprite[SPRITE_Y] * rowNumPerPixel - 0.001)
    const endRowIndex = Math.floor(
      (sprite[SPRITE_Y] + sprite[SPRITE_HEIGHT]) * rowNumPerPixel - 0.001
    )

    const spriteIndexes = []
    for (let rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++) {
      for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
        spriteIndexes.push(rowIndex * spriteMapGroup[GROUP_COL_NUM] + colIndex)
      }
    }
    return spriteIndexes
  }
}

// Get the surranding sprites.
function sprite_getPossibleHitSprites(sprite) {
  const spriteMapGroup = sprite[SPRITE_MAP_GROUP]
  const spriteIndexes = _sprite_getOccupiedTileIndexes(sprite)

  let possibleHitSprites = []
  spriteIndexes.forEach(spriteIndex => {
    const layerGroups = spriteMapGroup[GROUP_LAYER_GROUP]
    layerGroups.forEach(layer => {
      const layerSprites = layer[GROUP_CHILDREN]
      const sampleSprite = layerSprites[0]
      if (!sampleSprite) {
        return
      }

      if (sampleSprite[SPRITE_TYPE] === SPRITE_TYPE_OBJECT) {
        // This is when we detect other objects with current objects.
        // Filter on tile indexes
        // This can be optimized by quad tree
        possibleHitSprites = possibleHitSprites.concat(
          layerSprites.filter(layerSprite => {
            return (
              layerSprite !== sprite &&
              _sprite_getOccupiedTileIndexes(layerSprite).indexOf(
                spriteIndex
              ) >= 0 &&
              layerSprite[SPRITE_HITTYPE] !== HITTYPE_PASS
            )
          })
        )
      } else {
        // for tiles, we filter on all non-passing sprites
        const tileSprite = layer[GROUP_CHILDREN][spriteIndex]
        if (tileSprite && tileSprite[SPRITE_HITTYPE] !== HITTYPE_PASS) {
          // Push all tiles in possbile hit sprites
          possibleHitSprites.push(layer[GROUP_CHILDREN][spriteIndex])
        }
      }
    })
  })

  return possibleHitSprites
}

// hit given sprites
function sprite_hitSprites(sprite, otherSprites = []) {
  const aggregateHitResults = [
    [], // top
    [], // right
    [], // bottom
    [], // left
  ]

  otherSprites.forEach(sprite_hitSprite.bind(null, aggregateHitResults, sprite))

  // Remove unrealistic hit values
  // aggregateHitResults.forEach(aggregateHitResult, index => {
  //   aggregateHitResult = aggregateHitResult.filter(result => result[1] >= result[0])
  // })

  // The hitDirection is decided by most number of blocking sprites
  // Avoid weird hit issue...
  // TODO fix this! this happens when player move to bottom left corner
  // and keep moving bottom and left
  // const mostHitSprites = aggregateHitResults.sort(
  const mostHitSprites = [
    aggregateHitResults[1],
    aggregateHitResults[3],
    aggregateHitResults[0],
    aggregateHitResults[2],
  ].sort(
    (hitDirectionA, hitDirectionB) =>
      hitDirectionB.length - hitDirectionA.length
  )[0]

  // the final hit sprite is decided by most hit sprite
  // TODO: only one sprite being hit?
  const finalHitSpriteResult = mostHitSprites.sort(
    (hitResultA, hitResultB) => hitResultB[1] - hitResultA[1]
  )[0]

  if (!finalHitSpriteResult) {
    return
  }

  const finalHitSprite = finalHitSpriteResult[0]
  sprite_getHitMoveCallback(sprite, finalHitSprite[SPRITE_HITTYPE])(
    sprite,
    finalHitSpriteResult
  )

  // The hitten sprite need to react too
  finalHitSprite[SPRITE_HIT_CALLBACK](finalHitSprite, sprite)

  // Handle hit callbacks
  // actualHitSprite.hitCallback(this)
  // if (actualHitSprite.scene) {
  //   actualHitSprite.scene.hitCallback(this)
  // }
}

function sprite_hitSprite(aggregateHitResults, sprite, otherSprite) {
  if (sprite === otherSprite) {
    // cannot hit self
    return
  }

  let hitMap = hit_computeRectHit(sprite, otherSprite)

  if (hitMap[HIT_SPRITE_TOP]) {
    if (otherSprite[SPRITE_HITTYPE] === HITTYPE_PASS || sprite[SPRITE_VY] < 0) {
      aggregateHitResults[HIT_SPRITE_TOP].push([
        otherSprite,
        hitMap[HIT_SPRITE_TOP],
        HIT_SPRITE_TOP,
      ])
    }
  }

  if (hitMap[HIT_SPRITE_RIGHT]) {
    if (otherSprite[SPRITE_HITTYPE] === HITTYPE_PASS || sprite[SPRITE_VX] > 0) {
      aggregateHitResults[HIT_SPRITE_RIGHT].push([
        otherSprite,
        hitMap[HIT_SPRITE_RIGHT],
        HIT_SPRITE_RIGHT,
      ])
    }
  }

  if (hitMap[HIT_SPRITE_BOTTOM]) {
    if (otherSprite[SPRITE_HITTYPE] === HITTYPE_PASS || sprite[SPRITE_VY] > 0) {
      aggregateHitResults[HIT_SPRITE_BOTTOM].push([
        otherSprite,
        hitMap[HIT_SPRITE_BOTTOM],
        HIT_SPRITE_BOTTOM,
      ])
    }
  }

  if (hitMap[HIT_SPRITE_LEFT]) {
    if (otherSprite[SPRITE_HITTYPE] === HITTYPE_PASS || sprite[SPRITE_VX] < 0) {
      aggregateHitResults[HIT_SPRITE_LEFT].push([
        otherSprite,
        hitMap[HIT_SPRITE_LEFT],
        HIT_SPRITE_LEFT,
      ])
    }
  }
}

function sprite_getHitMoveCallback(sprite, otherSpriteHitType) {
  switch (otherSpriteHitType) {
    case HITTYPE_STOP:
      return sprite_hitMoveStop

    default:
      return EMPTY_FN
  }
}

function sprite_hitMoveStop(sprite, finalHitSpriteResult) {
  const [finalHitSprite, hitValue, hitDirection] = finalHitSpriteResult
  console.log(finalHitSpriteResult)
  switch (hitDirection) {
    case HIT_SPRITE_TOP:
      sprite[SPRITE_Y] += hitValue
      sprite[SPRITE_VY] = 0
      break

    case HIT_SPRITE_RIGHT:
      sprite[SPRITE_X] -= hitValue
      sprite[SPRITE_VX] = 0
      break

    case HIT_SPRITE_BOTTOM:
      sprite[SPRITE_Y] -= hitValue
      sprite[SPRITE_VY] = 0
      break

    case HIT_SPRITE_LEFT:
      sprite[SPRITE_X] += hitValue
      sprite[SPRITE_VX] = 0
      break
  }
}
