// Get adjacent cell indexes for given cell index
// For example, 0 -> [-1, 1, colNum, -1]
function _maze_getAdjacentCells(cellIndex = 0, colNum = 5, rowNum = 5) {
  const [row, col] = _maze_getColRowByCellIndex(cellIndex, colNum, rowNum)
  const adjacentCells = []

  // Top
  adjacentCells.push(_maze_getCellIndexByColRow(col, row - 1, colNum, rowNum))

  // Right
  adjacentCells.push(_maze_getCellIndexByColRow(col + 1, row, colNum, rowNum))

  // Bottom
  adjacentCells.push(_maze_getCellIndexByColRow(col, row + 1, colNum, rowNum))

  // Left
  adjacentCells.push(_maze_getCellIndexByColRow(col - 1, row, colNum, rowNum))

  return adjacentCells
}

// Get cell index by given col and row
// If out of colNum or rowNum, return -1
function _maze_getCellIndexByColRow(col, row, colNum = 5, rowNum = 5) {
  if (col < 0 || col >= colNum || row < 0 || row >= rowNum) {
    // Invalid cellIndex
    return -1
  }

  return row * colNum + col
}

function _maze_getColRowByCellIndex(cellIndex = 0, colNum = 5, rowNum = 5) {
  if (cellIndex < 0 || cellIndex >= colNum * rowNum) {
    return null
  }

  return [Math.floor(cellIndex / colNum), cellIndex % colNum]
}

// Make the two cells pass by break the wall in cells
function _maze_breakWall(
  firstCellIndex = 0,
  secondCellIndex = 1,
  cells = [[], []]
) {
  const rowNum = cells.length
  const colNum = cells[0].length

  if (
    _maze_getAdjacentCells(firstCellIndex, colNum, rowNum).indexOf(
      secondCellIndex
    ) === -1
  ) {
    // The two cells are not adjacent
    return false
  }

  const [firstRow, firstCol] = _maze_getColRowByCellIndex(
    firstCellIndex,
    colNum,
    rowNum
  )
  const [secondRow, secondCol] = _maze_getColRowByCellIndex(
    secondCellIndex,
    colNum,
    rowNum
  )

  if (cells[firstRow][firstCol] && cells[secondRow][secondCol]) {
    // Both cells are visited
    return false
  }

  if (firstCol + 1 === secondCol && firstRow === secondRow) {
    // first | second
    cells[firstRow][firstCol] = math_addBinary(
      cells[firstRow][firstCol] || '0',
      '0100'
    )
    cells[secondRow][secondCol] = math_addBinary(
      cells[secondRow][secondCol] || '0',
      '0001'
    )
  } else if (secondCol + 1 === firstCol && firstRow === secondRow) {
    // second | first
    cells[firstRow][firstCol] = math_addBinary(
      cells[firstRow][firstCol] || '0',
      '0001'
    )
    cells[secondRow][secondCol] = math_addBinary(
      cells[secondRow][secondCol] || '0',
      '0100'
    )
  } else if (secondRow + 1 === firstRow && secondCol === firstCol) {
    // second
    // ------
    // first
    cells[firstRow][firstCol] = math_addBinary(
      cells[firstRow][firstCol] || '0',
      '1000'
    )
    cells[secondRow][secondCol] = math_addBinary(
      cells[secondRow][secondCol] || '0',
      '0010'
    )
  } else if (firstRow + 1 === secondRow && secondCol === firstCol) {
    // first
    // ------
    // second
    cells[firstRow][firstCol] = math_addBinary(
      cells[firstRow][firstCol] || '0',
      '0010'
    )
    cells[secondRow][secondCol] = math_addBinary(
      cells[secondRow][secondCol] || '0',
      '1000'
    )
  }

  return true
}

// Generate a maze using randomized prim's algorithm
// See https://en.wikipedia.org/wiki/Maze_generation_algorithm
// the doors is represented by binary string
// For example, '1101' -> [DOOR_TOP, DOOR_RIGHT, '', DOOR_LEFT]
function maze_generateMaze([
  rowNum = 5,
  colNum = 5,
  startSide = DOOR_TOP,
  endSide = DOOR_BOTTOM,
] = []) {
  // Prepare cells
  const cells = []
  for (let r = 0; r < rowNum; r++) {
    const row = []
    cells.push(row)
    for (let c = 0; c < colNum; c++) {
      row.push('')
    }
  }

  const wallList = []
  let startCol
  let startRow
  let endCol
  let endRow

  // Choose start point
  switch (startSide) {
    case DOOR_TOP:
      startRow = 0
      startCol = Math.floor(random[RANDOM_NEXT_FLOAT]() * colNum)
      // cells[startRow][startCol] = '1000'
      break

    case DOOR_BOTTOM:
      startRow = rowNum - 1
      startCol = Math.floor(random[RANDOM_NEXT_FLOAT]() * colNum)
      // cells[startRow][startCol] = '0010'
      break

    case DOOR_LEFT:
      startRow = Math.floor(random[RANDOM_NEXT_FLOAT]() * rowNum)
      startCol = 0
      // cells[startRow][startCol] = '0001'
      break

    case DOOR_RIGHT:
      startRow = Math.floor(random[RANDOM_NEXT_FLOAT]() * rowNum)
      startCol = colNum - 1
      // cells[startRow][startCol] = '0100'
      break
  }

  const cellIndex = _maze_getCellIndexByColRow(
    startCol,
    startRow,
    colNum,
    rowNum
  )

  _maze_getAdjacentCells(cellIndex, colNum, rowNum).forEach(
    adjacentCellIndex => {
      if (adjacentCellIndex === -1) {
        // Invalid adjacent cell index
        return
      }

      wallList.push(`${cellIndex}-${adjacentCellIndex}`)
    }
  )

  while (wallList.length) {
    const nextWallKey = wallList.splice(
      Math.floor(random[RANDOM_NEXT_FLOAT]() * wallList.length),
      1
    )[0]
    const fromCellIndex = parseInt(nextWallKey.split('-')[0])
    const toCellIndex = parseInt(nextWallKey.split('-')[1])

    // Break the wall between the from cell and to cell
    if (_maze_breakWall(fromCellIndex, toCellIndex, cells)) {
      // Add new walls from the new cell if we successfully break wall
      _maze_getAdjacentCells(toCellIndex, colNum, rowNum).forEach(
        adjacentCellIndex => {
          if (adjacentCellIndex === -1 || adjacentCellIndex === fromCellIndex) {
            // Invalid adjacent cell index or the same cell we already considered
            return
          }

          const adjacentWallKey = `${toCellIndex}-${adjacentCellIndex}`
          const sameAdjacentWallKey = `${adjacentCellIndex}-${toCellIndex}`
          if (
            wallList.indexOf(adjacentWallKey) === -1 &&
            wallList.indexOf(sameAdjacentWallKey) === -1
          ) {
            wallList.push(adjacentWallKey)
          }
        }
      )
    }
  }

  // Choose end point
  switch (endSide) {
    case DOOR_TOP:
      endRow = 0
      endCol = Math.floor(random[RANDOM_NEXT_FLOAT]() * colNum)
      // cells[endRow][endCol] = math_addBinary(cells[endRow][endCol], '1000')
      break

    case DOOR_BOTTOM:
      endRow = rowNum - 1
      endCol = Math.floor(random[RANDOM_NEXT_FLOAT]() * colNum)
      // cells[endRow][endCol] = math_addBinary(cells[endRow][endCol], '0010')
      break

    case DOOR_LEFT:
      endRow = Math.floor(random[RANDOM_NEXT_FLOAT]() * rowNum)
      endCol = 0
      // cells[endRow][endCol] = math_addBinary(cells[endRow][endCol], '0001')
      break

    case DOOR_RIGHT:
      endRow = Math.floor(random[RANDOM_NEXT_FLOAT]() * rowNum)
      endCol = colNum - 1
      // cells[endRow][endCol] = math_addBinary(cells[endRow][endCol], '0100')
      break
  }

  return [rowNum, colNum, cells, startRow, startCol, endRow, endCol]
}
