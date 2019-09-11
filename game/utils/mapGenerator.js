const DEFAULT_ROW_NUM = 32
const DEFAULT_COL_NUM = 32
const DEFAULT_X = 0
const DEFAULT_Y = 0
const DEFAULT_TILE_WIDTH = 16
const DEFAULT_TILE_HEIGHT = 16
const DOOR_WIDTH = 12

const [MG_LAYER_NAME, MG_LAYER_TYPE, MG_LAYER_DOORS] = [0, 1, 2]

// const [
//   MAP_PROPS_X,
//   MAP_PROPS_Y,
//   MAP_PROPS_WIDTH,
//   MAP_PROPS_HEIGHT,
//   MAP_PROPS_DOORS,
//   MAP_PROPS_TILE_WIDTH,
//   MAP_PROPS_TILE_HEIGHT,
//   MAP_PROPS_OBJECTS,
// ] = [0, 1, 2, 3, 4, 5, 6, 7]

function mg_generateMapData(mapProps = []) {
  const mapLayerProps = util_assignArr(
    [
      DEFAULT_X, // x
      DEFAULT_Y, // y
      DEFAULT_COL_NUM, // colNum
      DEFAULT_ROW_NUM, // rowNum
      [DOOR_BOTTOM], // doors
      DEFAULT_TILE_WIDTH, // tileWidth
      DEFAULT_TILE_HEIGHT, // tileHeight
      [], // objects
    ],
    mapProps
  )
  const layers = _mg_generateMapLayers(mapLayerProps)

  return [
    mapLayerProps[MAP_DATA_PROP_COL_NUM], // map data col num
    mapLayerProps[MAP_DATA_PROP_ROW_NUM], // map data row num
    mapLayerProps[MAP_DATA_PROP_TILE_WIDTH], // map data tile width
    mapLayerProps[MAP_DATA_PROP_TILE_HEIGHT], // map data tile height
    layers, // map data layers
  ]
}

function _mg_generateTileLayerData(
  rowNum = DEFAULT_ROW_NUM,
  colNum = DEFAULT_COL_NUM,
  layerProps = []
) {
  const [name, , doors = [DOOR_BOTTOM]] = layerProps
  const layerData = []

  for (let row = 0; row < rowNum; row++) {
    for (let col = 0; col < colNum; col++) {
      const spriteIndex = row * colNum + col

      switch (name) {
        case LAYER_BACKGROUND:
          layerData[spriteIndex] = BACKGROUND_SPRITE
          break

        case LAYER_GROUND:
          layerData[spriteIndex] = row >= 2 ? GROUND_SPRITE : EMPTY_SPRITE
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
          layerConfig[MG_LAYER_TYPE], // layer type
          layerConfig[MG_LAYER_NAME], // layer name
          x,
          y,
          colNum,
          rowNum,
          1, // opacity
          _mg_generateTileLayerData(rowNum, colNum, layerConfig), // tile sprite data
          [], // objects
        ]
        break

      case LAYER_TYPE_OBJECT:
        // const [OBJ_WIDTH, OBJ_HEIGHT, OBJ_X, OBJ_Y, OBJ_NAME] = [0, 1, 2, 3, 4, 5]
        layer = [
          layerConfig[MG_LAYER_TYPE], // layer type
          layerConfig[MG_LAYER_NAME], // layer name
          x,
          y,
          colNum,
          rowNum,
          1, // opacity
          [], // tile sprite data
          objects, // objects
        ]
        break
    }
    return layer
  })
}

function _mg_isInDoorRange(index, total) {
  return index >= (total - DOOR_WIDTH) / 2 && index < (total + DOOR_WIDTH) / 2
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
  doors = [],
  isWallTop = false
) {
  const colFilter = isWallTop
    ? col === 0 && (row >= 0 && row <= rowNum - 3)
    : col === 0 && row >= 1
  return doors.indexOf(DOOR_LEFT) === -1
    ? colFilter
    : colFilter && !_mg_isInDoorRange(row, rowNum)
}

function _mg_isRightWall(
  row = 0,
  col = 0,
  rowNum = DEFAULT_ROW_NUM,
  colNum = DEFAULT_COL_NUM,
  doors = [],
  isWallTop = false
) {
  const colFilter = isWallTop
    ? col === colNum - 1 && (row >= 0 && row <= rowNum - 3)
    : col === colNum - 1 && row >= 1
  return doors.indexOf(DOOR_RIGHT) === -1
    ? colFilter
    : colFilter && !_mg_isInDoorRange(row, rowNum)
}
