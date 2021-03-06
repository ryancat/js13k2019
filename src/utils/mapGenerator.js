import { palette } from './colors'
import { random } from './random'

// layer dimension
const DEFAULT_WIDTH = 32
const DEFAULT_HEIGHT = 32
const DEFAULT_X = 0
const DEFAULT_Y = 0
const DEFAULT_TILE_WIDTH = 16
const DEFAULT_TILE_HEIGHT = 16
const DOOR_WIDTH = 12

// sprite id
const EMPTY_SPRITE = 0
const BACKGROUND_SPRITE = 1
const GROUND_SPRITE = 2
const WALL_SPRITE = 3
const TOP_DOOR_SPRITE = 4
const RIGHT_DOOR_SPRITE = 5
const BOTTOM_DOOR_SPRITE = 6
const LEFT_DOOR_SPRITE = 7
const WALL_TOP_SPRITE = 8

const tileLayerSchema = {
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  x: DEFAULT_X,
  y: DEFAULT_Y,
  data: [],
  id: -1,
  name: 'ground',
  opacity: 1,
  type: 'tilelayer',
  visible: true,
}

const objectLayerSchema = {
  draworder: 'topdown',
  id: 4,
  name: 'objects',
  objects: [],
  opacity: 1,
  type: 'objectgroup',
  visible: true,
  x: 0,
  y: 0,
}

const objectSchema = {
  height: 48,
  id: 3,
  name: 'player',
  rotation: 0,
  visible: true,
  width: 32,
  x: 240,
  y: 224,
}

const mapSchema = {
  layers: [],
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  tileheight: DEFAULT_TILE_HEIGHT,
  tilewidth: DEFAULT_TILE_WIDTH,
  version: 1.2,
  type: 'map',
}

let layerId = Math.ceil(random.nextFloat() * 100)
let objectId = Math.ceil(random.nextFloat() * 100)
const objectSpriteMap = {}

function generateTileLayerData(
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  layerConfig = {}
) {
  const { name, meta = {} } = layerConfig
  const layerData = []
  const doors = meta.doors || ['bottom']

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const spriteIndex = r * width + c
      switch (name) {
        case 'background':
          layerData[spriteIndex] = BACKGROUND_SPRITE
          break

        case 'ground':
          layerData[spriteIndex] = r >= 2 ? GROUND_SPRITE : 0
          break

        case 'obstacles':
          const isTopWall =
            doors.indexOf('top') === -1
              ? r === 1 || r === 2
              : (r === 1 || r === 2) &&
                (c < (width - DOOR_WIDTH) / 2 || c >= (width + DOOR_WIDTH) / 2)
          const isBottomWall =
            doors.indexOf('bottom') === -1
              ? r === height - 1 || r === height - 2
              : (r === height - 1 || r === height - 2) &&
                (c < (width - DOOR_WIDTH) / 2 || c >= (width + DOOR_WIDTH) / 2)
          const isLeftWall =
            doors.indexOf('left') === -1
              ? c === 0 && r >= 1
              : c === 0 &&
                r >= 2 &&
                (r < (height - DOOR_WIDTH) / 2 ||
                  r >= (height + DOOR_WIDTH) / 2)
          const isRightWall =
            doors.indexOf('right') === -1
              ? c === width - 1 && r >= 1
              : c === width - 1 &&
                r >= 2 &&
                (r < (height - DOOR_WIDTH) / 2 ||
                  r >= (height + DOOR_WIDTH) / 2)
          layerData[spriteIndex] =
            isTopWall || isBottomWall || isLeftWall || isRightWall
              ? WALL_SPRITE
              : 0
          break

        case 'items':
          const isTopDoor =
            r === 2 &&
            (c >= (width - DOOR_WIDTH) / 2 && c < (width + DOOR_WIDTH) / 2)
          const isBottomDoor =
            r === height - 1 &&
            (c >= (width - DOOR_WIDTH) / 2 && c < (width + DOOR_WIDTH) / 2)
          const isLeftDoor =
            c === 0 &&
            (r >= (height - DOOR_WIDTH) / 2 && r < (height + DOOR_WIDTH) / 2)
          const isRightDoor =
            c === width - 1 &&
            (r >= (height - DOOR_WIDTH) / 2 && r < (height + DOOR_WIDTH) / 2)

          if (doors.indexOf('top') >= 0 && isTopDoor) {
            layerData[spriteIndex] = TOP_DOOR_SPRITE
          } else if (doors.indexOf('bottom') >= 0 && isBottomDoor) {
            layerData[spriteIndex] = BOTTOM_DOOR_SPRITE
          } else if (doors.indexOf('left') >= 0 && isLeftDoor) {
            layerData[spriteIndex] = LEFT_DOOR_SPRITE
          } else if (doors.indexOf('right') >= 0 && isRightDoor) {
            layerData[spriteIndex] = RIGHT_DOOR_SPRITE
          } else {
            layerData[spriteIndex] = EMPTY_SPRITE
          }
          break

        case 'wallTop':
          const isTopWallTop =
            doors.indexOf('top') === -1
              ? r === 0
              : r === 0 &&
                (c < (width - DOOR_WIDTH) / 2 || c >= (width + DOOR_WIDTH) / 2)
          const isBottomWallTop =
            doors.indexOf('bottom') === -1
              ? r === height - 3
              : r === height - 3 &&
                (c < (width - DOOR_WIDTH) / 2 || c >= (width + DOOR_WIDTH) / 2)
          const isLeftWallTop =
            doors.indexOf('left') === -1
              ? c === 0 && (r >= 0 && r <= height - 3)
              : c === 0 &&
                (r >= 1 && r <= height - 3) &&
                (r < (height - DOOR_WIDTH) / 2 ||
                  r >= (height + DOOR_WIDTH) / 2)
          const isRightWallTop =
            doors.indexOf('right') === -1
              ? c === width - 1 && (r >= 0 && r <= height - 3)
              : c === width - 1 &&
                (r >= 1 && r <= height - 3) &&
                (r < (height - DOOR_WIDTH) / 2 ||
                  r >= (height + DOOR_WIDTH) / 2)
          layerData[spriteIndex] =
            isTopWallTop || isBottomWallTop || isLeftWallTop || isRightWallTop
              ? WALL_TOP_SPRITE
              : 0
          break
      }
    }
  }

  return layerData
}

export function generateMapJson({
  type = 'normal', // can be 'normal', 'boss'
  x = 0,
  y = 0,
  width = 64, // power of 2
  height = 64, // power of 2
  doors = ['bottom'], // can be 'top', 'right', 'bottom', 'left'
  doorColor = palette.red[3], // can be any color in palette
  groundColor = palette.gunmetal[1], // can be any color in palette
  wallColor = palette.brown[3], // can be any color in palette
  wallTopColor = palette.brown[1], // can be any color in palette
  backgroundColor = palette.gunmetal[4], // can be any color in palette
  tileWidth = DEFAULT_TILE_WIDTH,
  tileHeight = DEFAULT_TILE_HEIGHT,
  objects = [],
}) {
  const layerConfigs = [
    {
      name: 'background',
      type: 'tilelayer',
    },
    {
      name: 'ground',
      type: 'tilelayer',
    },
    {
      name: 'obstacles',
      type: 'tilelayer',
      meta: {
        doors,
      },
    },
    {
      name: 'items',
      type: 'tilelayer',
      meta: {
        doors,
      },
    },
    {
      name: 'objects',
      type: 'objectgroup',
    },
    {
      name: 'wallTop',
      type: 'tilelayer',
      meta: {
        doors,
      },
    },
  ]

  const layers = layerConfigs.map(layerConfig => {
    let layer

    switch (layerConfig.type) {
      case 'tilelayer':
        layer = Object.assign({}, tileLayerSchema, {
          data: generateTileLayerData(width, height, layerConfig),
          width,
          height,
          x,
          y,
          id: layerId++,
          name: layerConfig.name,
          type: layerConfig.type,
        })
        break

      case 'objectgroup':
        layer = Object.assign({}, objectLayerSchema, {
          x,
          y,
          objects: objects.map(obj => {
            const id = objectId++
            objectSpriteMap[obj.name] = id
            return Object.assign({}, objectSchema, obj, { id })
          }),
          id: layerId++,
          name: layerConfig.name,
          type: layerConfig.type,
        })
        break

      default:
        throw new Error(`invalid layer type: ${layerConfig.type}`)
    }

    return layer
  })

  return Object.assign({}, mapSchema, {
    layers,
    width,
    height,
    tilewidth: tileWidth,
    tileheight: tileHeight,
    spriteMetaMap: {
      BACKGROUND_SPRITE: {
        backgroundColor: backgroundColor,
      },
      GROUND_SPRITE: {
        backgroundColor: groundColor,
      },
      WALL_SPRITE: {
        backgroundColor: wallColor,
      },
      TOP_DOOR_SPRITE: {
        backgroundColor: doorColor,
      },
      RIGHT_DOOR_SPRITE: {
        backgroundColor: doorColor,
      },
      BOTTOM_DOOR_SPRITE: {
        backgroundColor: doorColor,
      },
      LEFT_DOOR_SPRITE: {
        backgroundColor: doorColor,
      },
      WALL_TOP_SPRITE: {
        backgroundColor: wallTopColor,
      },
    },
  })
}

export function generateMapData(options = {}) {
  const tiledMapJson = generateMapJson(options)

  const tileSpriteMap = {}
  tileSpriteMap[EMPTY_SPRITE] = 'EmptySprite'
  tileSpriteMap[BACKGROUND_SPRITE] = 'BackgroundSprite'
  tileSpriteMap[GROUND_SPRITE] = 'GroundSprite'
  tileSpriteMap[TOP_DOOR_SPRITE] = 'TopDoorSprite'
  tileSpriteMap[RIGHT_DOOR_SPRITE] = 'RightDoorSprite'
  tileSpriteMap[BOTTOM_DOOR_SPRITE] = 'BottomDoorSprite'
  tileSpriteMap[LEFT_DOOR_SPRITE] = 'LeftDoorSprite'
  tileSpriteMap[WALL_SPRITE] = 'WallSprite'
  tileSpriteMap[WALL_TOP_SPRITE] = 'WallTopSprite'

  Object.assign(tiledMapJson, {
    tileSpriteMap,
    objectSpriteMap: {},
  })

  // Add object sprite map
  for (let objSpriteKey in objectSpriteMap) {
    tiledMapJson.objectSpriteMap[objectSpriteMap[objSpriteKey]] =
      objSpriteKey.charAt(0).toUpperCase() +
      objSpriteKey.substring(1) +
      'Sprite'
  }

  // TODO: Hard-coded map for now. Should be automatically generated.
  return tiledMapJson
}
