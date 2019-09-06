import tiledMapJson from './castleHall.json'

export function generateMapData(config = {}) {
  const {
    tileWidth = tiledMapJson.tilewidth,
    tileHeight = tiledMapJson.tileheight,
  } = config

  Object.assign(tiledMapJson, {
    tileSpriteMap: {
      0: 'EmptySprite',
      60: 'CastleHallBackgroundSprite',
      1: 'CastleHallExitSprite',
      117: 'CastleHallGroundSprite',
      178: 'CastleHallWallSprite',
      58: 'CastleHallWallTopSprite',
      441: 'CastleHallKingSprite',
    },
    objectSpriteMap: {
      3: 'PlayerSprite',
    },
    tileWidthScale: tileWidth / tiledMapJson.tilewidth,
    tileHeightScale: tileHeight / tiledMapJson.tileheight,
  })

  // TODO: Hard-coded map for now. Should be automatically generated.
  return tiledMapJson
}
