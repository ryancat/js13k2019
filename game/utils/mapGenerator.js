// sprite id
const [
  TILE_LAYER_WIDTH,
  TILE_LAYER_HEIGHT,
  TILE_LAYER_X,
  TILE_LAYER_Y,
  TILE_LAYER_DATA,
  TILE_LAYER_NAME,
  TILE_LAYER_TYPE,
  TILE_LAYER_OPACITY,
] = [0, 1, 2, 3, 4, 5, 6, 7]

const [
  OBJ_LAYER_NAME,
  OBJ_LAYER_OBJECTS,
  OBJ_LAYER_OPACITY,
  OBJ_LAYER_TYPE,
  OBJ_LAYER_X,
  OBJ_LAYER_Y,
] = [0, 1, 2, 3, 4, 5]

const [OBJ_WIDTH, OBJ_HEIGHT, OBJ_X, OBJ_Y, OBJ_NAME] = [0, 1, 2, 3, 4, 5]

const [MAP_WIDTH, MAP_HEIGHT, MAP_TILE_WIDTH, MAP_TILE_HEIGHT, MAP_LAYERS] = [
  0,
  1,
  2,
  3,
  4,
  5,
]

const DEFAULT_ROW_NUM = 32
const DEFAULT_COL_NUM = 32
const DEFAULT_X = 0
const DEFAULT_Y = 0
const DEFAULT_TILE_WIDTH = 16
const DEFAULT_TILE_HEIGHT = 16
const DOOR_WIDTH = 12

const [MG_LAYER_NAME, MG_LAYER_TYPE, MG_LAYER_DOORS] = [0, 1, 2]

const [
  MAP_PROPS_X,
  MAP_PROPS_Y,
  MAP_PROPS_WIDTH,
  MAP_PROPS_HEIGHT,
  MAP_PROPS_DOORS,
  MAP_PROPS_TILE_WIDTH,
  MAP_PROPS_TILE_HEIGHT,
  MAP_PROPS_OBJECTS,
] = [0, 1, 2, 3, 4, 5, 6, 7]

function mg_generateMapData(mapProps = []) {
  const mapProps = util_assignArr(
    [
      DEFAULT_X,
      DEFAULT_Y,
      DEFAULT_COL_NUM,
      DEFAULT_ROW_NUM,
      [DOOR_BOTTOM],
      DEFAULT_TILE_WIDTH,
      DEFAULT_TILE_HEIGHT,
      [],
    ],
    mapProps
  )
  const layers = _mg_generateMapLayers(mapProps)

  return [colNum, rowNum, tileWidth, tileHeight, layers]
}

function _mg_generateTileLayerData(
  rowNum = DEFAULT_ROW_NUM,
  colNum = DEFAULT_COL_NUM,
  layerProps = []
) {
  const [name, , doors = [DOOR_BOTTOM]] = layerProps
  const layerData = []

  for (let r = 0; r < rowNum; r++) {
    for (let c = 0; c < colNum; c++) {
      const spriteIndex = r * colNum + c

      switch (name) {
        case LAYER_BACKGROUND:
          layerData[spriteIndex] = BACKGROUND_SPRITE
          break

        case LAYER_GROUND:
          layerData[spriteIndex] = r >= 2 ? GROUND_SPRITE : EMPTY_SPRITE
          break

        case LAYER_OBSTACLES:
          layerData[spriteIndex] =
            _mg_isTopWall(row, col, rowNum, colNum, doors) ||
            _mg_isBottomWall(row, col, rowNum, colNum, doors) ||
            _mg_isLeftWall(row, col, rowNum, colNum, doors) ||
            _mg_isRightWall(row, col, rowNum, colNum, doors)
              ? WALL_SPRITE
              : EMPTY_SPRITE
          break

        case LAYER_ITEMS:
          const isTopDoor = row === 2 && _mg_isInDoorRange(col, colNum)
          const isRightDoor =
            col === colNum - 1 && _mg_isInDoorRange(row, rowNum)
          const isBottomDoor =
            row === rowNum - 1 && _mg_isInDoorRange(col, colNum)
          const isLeftDoor = col === 0 && _mg_isInDoorRange(row, rowNum)
          if (doors.indexOf(DOOR_TOP) >= 0 && isTopDoor) {
            layerData[spriteIndex] = TOP_DOOR_SPRITE
          } else if (doors.indexOf(DOOR_RIGHT) >= 0 && isRightDoor) {
            layerData[spriteIndex] = RIGHT_DOOR_SPRITE
          } else if (doors.indexOf(DOOR_BOTTOM) >= 0 && isBottomDoor) {
            layerData[spriteIndex] = BOTTOM_DOOR_SPRITE
          } else if (doors.indexOf(DOOR_LEFT) >= 0 && isLeftDoor) {
            layerData[spriteIndex] = LEFT_DOOR_SPRITE
          }
          break

        case LAYER_WALLTOP:
          layerData[spriteIndex] =
            _mg_isTopWall(row, col, rowNum, colNum, doors, true) ||
            _mg_isBottomWall(row, col, rowNum, colNum, doors, true) ||
            _mg_isLeftWall(row, col, rowNum, colNum, doors, true) ||
            _mg_isRightWall(row, col, rowNum, colNum, doors, true)
              ? WALL_TOP_SPRITE
              : EMPTY_SPRITE
          break
      }
    }
  }

  return layerData
}

function _mg_generateMapLayers(mapProps = []) {
  const [x, y, colNum, rowNum, doors, , , objects] = mapProps

  return [
    [LAYER_BACKGROUND, LAYER_TYPE_TILE],
    [LAYER_GROUND, LAYER_TYPE_TILE],
    [LAYER_OBSTACLES, LAYER_TYPE_TILE, doors],
    [LAYER_ITEMS, LAYER_TYPE_TILE, doors],
    [LAYER_OBJECTS, LAYER_TYPE_OBJECT],
    [LAYER_WALLTOP, LAYER_TYPE_TILE, doors],
  ].map(layerConfig => {
    let layer

    switch (layerConfig[MG_LAYER_TYPE]) {
      case LAYER_TYPE_TILE:
        layer = [
          colNum,
          rowNum,
          x,
          y,
          _mg_generateTileLayerData(rowNum, colNum, layerConfig),
          layerConfig[MG_LAYER_NAME],
          layerConfig[MG_LAYER_TYPE],
          1,
        ]
        break

      case LAYER_TYPE_OBJECT:
        layer = [
          layerConfig[MG_LAYER_NAME],
          objects,
          1,
          layerConfig[MG_LAYER_TYPE],
          x,
          y,
        ]
        break
    }
    return layer
  })
}

function _mg_isInDoorRange(index, total) {
  return index >= (total - DOOR_WIDTH) / 2 || index < (total + DOOR_WIDTH) / 2
}

function _mg_isTopWall(
  row = 0,
  col = 0,
  rowNum = DEFAULT_ROW_NUM,
  colNum = DEFAULT_COL_NUM,
  doors = [],
  isWallTop = false
) {
  const rowFilter = isWallTop ? row === 0 : row === 1 || row === 2
  return doors.indexOf(DOOR_TOP) === -1
    ? rowFilter
    : rowFilter && !_mg_isInDoorRange(col, colNum)
}

function _mg_isBottomWall(
  row = 0,
  col = 0,
  rowNum = DEFAULT_ROW_NUM,
  colNum = DEFAULT_COL_NUM,
  doors = [],
  isWallTop = false
) {
  const rowFilter = isWallTop
    ? row === rowNum - 3
    : row === rowNum - 1 || row === rowNum - 2
  return doors.indexOf(DOOR_BOTTOM) === -1
    ? rowFilter
    : rowFilter && !_mg_isInDoorRange(col, colNum)
}

function _mg_isLeftWall(
  row = 0,
  col = 0,
  rowNum = DEFAULT_ROW_NUM,
  colNum = DEFAULT_COL_NUM,
  doors = []
) {
  const rowFilter = isWallTop
    ? col === 0 && (row >= 0 && row <= rowNum - 3)
    : col === 0 && row >= 1
  return doors.indexOf(DOOR_LEFT) === -1
    ? rowFilter
    : rowFilter && !_mg_isInDoorRange(row, rowNum)
}

function _mg_isRightWall(
  row = 0,
  col = 0,
  rowNum = DEFAULT_ROW_NUM,
  colNum = DEFAULT_COL_NUM,
  doors = []
) {
  const rowFilter = isWallTop
    ? col === colNum - 1 && (row >= 0 && row <= rowNum - 3)
    : col === colNum - 1 && row >= 1
  return doors.indexOf(DOOR_RIGHT) === -1
    ? rowFilter
    : rowFilter && !_mg_isInDoorRange(row, rowNum)
}
