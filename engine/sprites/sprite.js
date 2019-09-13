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
//   SPRITE_CONVERSATION_STATES,
//   SPRITE_LAYER_GROUP,
//   SPRITE_STATE,
//   SPRITE_DIALOG_SPRITE_ID
//   SPRITE_PARENT
//   SPRITE_FROM_SPRITE
//   SPRITE_TO_SPRITE
//   SPRITE_MOVE_TYPE
// ] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26. 27, 28]

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
      [],
      [],
      [],
      -1,
      [],
      null,
      null,
      -1,
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

  // Assume all sprite rect will respect HP
  let spriteHpY = transformY
  let spriteHpHeight = sprite[SPRITE_HEIGHT]
  let spriteOpacity = sprite[SPRITE_OPACITY]
  const spriteHp = sprite[SPRITE_STATE][SPRITE_HP]
  const spriteHpMax = sprite[SPRITE_STATE][SPRITE_HP_MAX]

  if (typeof spriteHp === 'number') {
    // Sprite has HP
    if (spriteHp > 0) {
      spriteHpHeight = Math.max(
        0,
        (sprite[SPRITE_HEIGHT] * spriteHp) / spriteHpMax
      )
      spriteHpY = transformY + sprite[SPRITE_HEIGHT] - spriteHpHeight

      // Render HP box
      renderer_drawRect(renderer, [
        transformX, // x
        spriteHpY, // y
        sprite[SPRITE_WIDTH], // width
        spriteHpHeight, // height
        sprite[SPRITE_OPACITY], // globalAlpha
        !!sprite[SPRITE_BACKGROUND_COLOR], // is fill
        !!sprite[SPRITE_BORDER_COLOR], // is stroke
        sprite[SPRITE_BACKGROUND_COLOR], // fill
        sprite[SPRITE_BORDER_COLOR], // stroke
      ])
    }
    spriteOpacity = 0.4
  }

  renderer_drawRect(renderer, [
    transformX, // x
    transformY, // y
    sprite[SPRITE_WIDTH], // width
    sprite[SPRITE_HEIGHT], // height
    spriteOpacity, // globalAlpha
    !!sprite[SPRITE_BACKGROUND_COLOR], // is fill
    !!sprite[SPRITE_BORDER_COLOR], // is stroke
    sprite[SPRITE_BACKGROUND_COLOR], // fill
    sprite[SPRITE_BORDER_COLOR], // stroke
  ])

  if (sprite[SPRITE_SHOW_NAME]) {
    // Will show name on top of character
    renderer_drawText(renderer, [
      transformX + sprite[SPRITE_WIDTH] / 2,
      transformY,
      'center',
      'bottom',
      sprite[SPRITE_NAME],
      16,
      sprite[SPRITE_BACKGROUND_COLOR],
      sprite[SPRITE_OPACITY],
    ])
  }
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
  sprite_checkHitSprites(sprite)

  sprite[SPRITE_Y] += sprite[SPRITE_VY]
  sprite_checkHitSprites(sprite)
}

function sprite_checkHitSprites(sprite) {
  // only check surranding sprites
  sprite_hitSprites(sprite, sprite_getPossibleHitSprites(sprite))
}

// return the occupied tiles for objects and tile sprite
function sprite_getOccupiedTileIndexes(sprite) {
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
  const spriteIndexes = sprite_getOccupiedTileIndexes(sprite)

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
              (!sprite[SPRITE_FROM_SPRITE] ||
                layerSprite !== sprite[SPRITE_FROM_SPRITE]) &&
              sprite_getOccupiedTileIndexes(layerSprite).indexOf(spriteIndex) >=
                0 &&
              layerSprite[SPRITE_HITTYPE] !== HITTYPE_PASS
            )
          })
        )
      } else {
        // for tiles, we filter on all non-passing sprites
        const tileSprite = layer[GROUP_CHILDREN][spriteIndex]
        if (
          tileSprite &&
          tileSprite[SPRITE_ID] !== EMPTY_SPRITE &&
          [LAYER_ITEMS, LAYER_OBSTACLES].indexOf(
            tileSprite[SPRITE_LAYER_GROUP][GROUP_LAYER_NAME]
          ) >= 0
        ) {
          // Push all tiles in possbile hit sprites
          possibleHitSprites.push(layer[GROUP_CHILDREN][spriteIndex])
        }
      }
    })
  })

  // possibleHitSprites.forEach(possibleHitSprite => {
  //   renderer_drawRect()

  // })

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

  // update current sprite after process movement
  if (sprite[SPRITE_HITTYPE] === HITTYPE_GONE) {
    sprite_destroy(sprite)
  }

  // The hitten sprite need to react too
  finalHitSprite[SPRITE_HIT_CALLBACK](sprite)

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

function sprite_hitMoveGone(sprite, finalHitSpriteResult) {
  const [finalHitSprite, hitValue, hitDirection] = finalHitSpriteResult
  sprite_destroy(sprite)
}

function sprite_destroy(sprite) {
  const parentGroupChildren = sprite[SPRITE_PARENT][GROUP_CHILDREN]
  parentGroupChildren.splice(parentGroupChildren.indexOf(sprite), 1)
}

function sprite_attack(sprite, targetSprite, incident, bulletSpriteId) {
  if (sprite[SPRITE_STATE][SPRITE_HP] <= 0) {
    // Cannot attach when it's dead
    return
  }

  const incidentBulletGroup = incident[INCIDENT_BULLETS_GROUP]
  const bulletSprite = game_getSpriteFactory(
    incident[INCIDENT_GAME],
    bulletSpriteId
  )([
    bulletSpriteId, // sprite id
    sprite[SPRITE_X] + sprite[SPRITE_WIDTH] / 2, // origin x
    sprite[SPRITE_Y] + sprite[SPRITE_HEIGHT] / 2, // origin y
  ])

  const bulletSpeed = bulletSprite[SPRITE_VMAX]
  // todo: stop that random direction
  let attackAngle
  if (targetSprite) {
    sprite_moveToSprite(bulletSprite, sprite, targetSprite)
  } else {
    attackAngle = random[RANDOM_NEXT_FLOAT]() * Math.PI * 2
    bulletSprite[SPRITE_VX] = Math.cos(attackAngle) * bulletSpeed
    bulletSprite[SPRITE_VY] = Math.sin(attackAngle) * bulletSpeed
  }

  // Bullets are not the default tile sprite
  bulletSprite[SPRITE_TYPE] = SPRITE_TYPE_OBJECT
  bulletSprite[SPRITE_MAP_GROUP] = incident[INCIDENT_MAP_GROUP]
  bulletSprite[SPRITE_HITTYPE] = HITTYPE_GONE
  bulletSprite[SPRITE_FROM_SPRITE] = sprite
  bulletSprite[SPRITE_TO_SPRITE] = targetSprite

  // Add the attack bullet in the bullets array
  group_addSprite(incidentBulletGroup, bulletSprite)
}

function sprite_continueAttack(
  sprite,
  targetSprite,
  incident,
  bulletSpriteId,
  maxInterval = 2000
) {
  if (
    sprite[SPRITE_STATE][SPRITE_HP] <= 0 ||
    sprite[SPRITE_STATE][SPRITE_IS_DISABLED]
  ) {
    // Cannot attack when it's dead or disabled, for example not in cell
    return
  }

  sprite_attack(sprite, targetSprite, incident, bulletSpriteId)

  setTimeout(() => {
    sprite_continueAttack(
      sprite,
      targetSprite,
      incident,
      bulletSpriteId,
      maxInterval
    )
  }, Math.max(300, Math.round(random[RANDOM_NEXT_FLOAT]() * maxInterval)))
}

const sprite_attackThrottled = throttle(sprite_attack, 300)

function sprite_moveToSprite(sprite, sourceSprite, targetSprite) {
  const spriteVMax = sprite[SPRITE_VMAX]
  const targetCenterX = targetSprite[SPRITE_X] + targetSprite[SPRITE_WIDTH] / 2
  const targetCenterY = targetSprite[SPRITE_Y] + targetSprite[SPRITE_HEIGHT] / 2
  const sourceSpriteCenterX =
    sourceSprite[SPRITE_X] + sourceSprite[SPRITE_WIDTH] / 2
  const sourceSpriteCenterY =
    sourceSprite[SPRITE_Y] + sourceSprite[SPRITE_HEIGHT] / 2

  const attackAngle = Math.atan(
    Math.abs(
      (sourceSpriteCenterY - targetCenterY) /
        (targetCenterX - sourceSpriteCenterX)
    )
  )

  sprite[SPRITE_VX] =
    Math.cos(attackAngle) *
    spriteVMax *
    (targetCenterX > sourceSpriteCenterX ? 1 : -1)
  sprite[SPRITE_VY] =
    Math.sin(attackAngle) *
    spriteVMax *
    (targetCenterY > sourceSpriteCenterY ? 1 : -1)
}
