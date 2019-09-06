import tiledMapJson from './castleHall.json'

export function generateMapData(config = {}) {
  const {
    tileWidth = tiledMapJson.tilewidth,
    tileHeight = tiledMapJson.tileheight,
  } = config

  Object.assign(tiledMapJson, {
    tileSpriteMap: {
      0: 'EmptySprite',
      60: 'BackgroundSprite',
      1: 'DoorSprite',
      117: 'GroundSprite',
      178: 'WallSprite',
      58: 'WallTopSprite',
      441: 'KingSprite',
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
