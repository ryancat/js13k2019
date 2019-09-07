import tiledMapJson from './castleHall.json'

export function generateMapData(config = {}) {
  Object.assign(tiledMapJson, {
    tileSpriteMap: {
      0: 'EmptySprite',
      60: 'BackgroundSprite',
      1: 'CastleDoorSprite',
      117: 'GroundSprite',
      178: 'WallSprite',
      58: 'WallTopSprite',
      441: 'KingSprite',
    },
    objectSpriteMap: {
      3: 'PlayerSprite',
    },
  })

  // TODO: Hard-coded map for now. Should be automatically generated.
  return tiledMapJson
}
