import { random } from './random'
import { addBinary } from './math'

const DEFAULT_MAZE_ROW_NUM = 5
const DEFAULT_MAZE_COL_NUM = 5
const DEFAULT_MAZE_START_SIDE = 'top'
const DEFAULT_MAZE_END_SIDE = 'bottom'

// Get adjacent cell indexes for given cell index
// For example, 0 -> [-1, 1, colNum, -1]
function getAdjacentCells(
  cellIndex = 0,
  colNum = DEFAULT_MAZE_COL_NUM,
  rowNum = DEFAULT_MAZE_ROW_NUM
) {
  const { col, row } = getColRowByCellIndex(cellIndex, colNum, rowNum)
  const adjacentCells = []

  // Top
  adjacentCells.push(getCellIndexByColRow(col, row - 1, colNum, rowNum))

  // Right
  adjacentCells.push(getCellIndexByColRow(col + 1, row, colNum, rowNum))

  // Bottom
  adjacentCells.push(getCellIndexByColRow(col, row + 1, colNum, rowNum))

  // Left
  adjacentCells.push(getCellIndexByColRow(col - 1, row, colNum, rowNum))

  return adjacentCells
}

// Get cell index by given col and row
// If out of colNum or rowNum, return -1
function getCellIndexByColRow(
  col,
  row,
  colNum = DEFAULT_MAZE_COL_NUM,
  rowNum = DEFAULT_MAZE_ROW_NUM
) {
  if (col < 0 || col >= colNum || row < 0 || row >= rowNum) {
    // Invalid cellIndex
    return -1
  }

  return row * colNum + col
}

function getColRowByCellIndex(
  cellIndex = 0,
  colNum = DEFAULT_MAZE_COL_NUM,
  rowNum = DEFAULT_MAZE_ROW_NUM
) {
  if (cellIndex < 0 || cellIndex >= colNum * rowNum) {
    return null
  }

  return {
    row: Math.floor(cellIndex / colNum),
    col: cellIndex % colNum,
  }
}

// Make the two cells pass by break the wall in cells
function breakWall(firstCellIndex = 0, secondCellIndex = 1, cells = [[], []]) {
  const rowNum = cells.length
  const colNum = cells[0].length

  if (
    getAdjacentCells(firstCellIndex, colNum, rowNum).indexOf(
      secondCellIndex
    ) === -1
  ) {
    // The two cells are not adjacent
    return false
  }

  const { col: firstCol, row: firstRow } = getColRowByCellIndex(
    firstCellIndex,
    colNum,
    rowNum
  )
  const { col: secondCol, row: secondRow } = getColRowByCellIndex(
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
    cells[firstRow][firstCol] = addBinary(
      cells[firstRow][firstCol] || '0',
      '0100'
    )
    cells[secondRow][secondCol] = addBinary(
      cells[secondRow][secondCol] || '0',
      '0001'
    )
  } else if (secondCol + 1 === firstCol && firstRow === secondRow) {
    // second | first
    cells[firstRow][firstCol] = addBinary(
      cells[firstRow][firstCol] || '0',
      '0001'
    )
    cells[secondRow][secondCol] = addBinary(
      cells[secondRow][secondCol] || '0',
      '0100'
    )
  } else if (secondRow + 1 === firstRow && secondCol === firstCol) {
    // second
    // ------
    // first
    cells[firstRow][firstCol] = addBinary(
      cells[firstRow][firstCol] || '0',
      '1000'
    )
    cells[secondRow][secondCol] = addBinary(
      cells[secondRow][secondCol] || '0',
      '0010'
    )
  } else if (firstRow + 1 === secondRow && secondCol === firstCol) {
    // first
    // ------
    // second
    cells[firstRow][firstCol] = addBinary(
      cells[firstRow][firstCol] || '0',
      '0010'
    )
    cells[secondRow][secondCol] = addBinary(
      cells[secondRow][secondCol] || '0',
      '1000'
    )
  }

  return true
}

// Generate a maze using randomized prim's algorithm
// See https://en.wikipedia.org/wiki/Maze_generation_algorithm
// the doors is represented by binary string
// For example, '1101' -> ['top', 'right', '', 'left']
export function generateMaze({
  rowNum = DEFAULT_MAZE_ROW_NUM,
  colNum = DEFAULT_MAZE_COL_NUM,
  startSide = DEFAULT_MAZE_START_SIDE,
  endSide = DEFAULT_MAZE_END_SIDE,
} = {}) {
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
    case 'top':
      startRow = 0
      startCol = Math.floor(random.nextFloat() * colNum)
      cells[startRow][startCol] = '1000'
      break

    case 'bottom':
      startRow = rowNum - 1
      startCol = Math.floor(random.nextFloat() * colNum)
      cells[startRow][startCol] = '0010'
      break

    case 'left':
      startRow = Math.floor(random.nextFloat() * rowNum)
      startCol = 0
      cells[startRow][startCol] = '0001'
      break

    case 'right':
      startRow = Math.floor(random.nextFloat() * rowNum)
      startCol = colNum - 1
      cells[startRow][startCol] = '0100'
      break

    default:
      throw new Error(`invalid start side: ${startSide}`)
  }

  const cellIndex = getCellIndexByColRow(startCol, startRow, colNum, rowNum)
  getAdjacentCells(cellIndex, colNum, rowNum).forEach(adjacentCellIndex => {
    if (adjacentCellIndex === -1) {
      // Invalid adjacent cell index
      return
    }

    wallList.push(`${cellIndex}-${adjacentCellIndex}`)
  })

  while (wallList.length) {
    const nextWallKey = wallList.splice(
      Math.floor(random.nextFloat() * wallList.length),
      1
    )[0]
    const fromCellIndex = parseInt(nextWallKey.split('-')[0])
    const toCellIndex = parseInt(nextWallKey.split('-')[1])

    // Break the wall between the from cell and to cell
    if (breakWall(fromCellIndex, toCellIndex, cells)) {
      // Add new walls from the new cell if we successfully break wall
      getAdjacentCells(toCellIndex, colNum, rowNum).forEach(
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
    case 'top':
      endRow = 0
      endCol = Math.floor(random.nextFloat() * colNum)
      cells[endRow][endCol] = addBinary(cells[endRow][endCol], '1000')
      break

    case 'bottom':
      endRow = rowNum - 1
      endCol = Math.floor(random.nextFloat() * colNum)
      cells[endRow][endCol] = addBinary(cells[endRow][endCol], '0010')
      break

    case 'left':
      endRow = Math.floor(random.nextFloat() * rowNum)
      endCol = 0
      cells[endRow][endCol] = addBinary(cells[endRow][endCol], '0001')
      break

    case 'right':
      endRow = Math.floor(random.nextFloat() * rowNum)
      endCol = colNum - 1
      cells[endRow][endCol] = addBinary(cells[endRow][endCol], '0100')
      break

    default:
      throw new Error(`invalid end side: ${endSide}`)
  }

  return {
    rowNum,
    colNum,
    cells,
    startRow,
    startCol,
    endRow,
    endCol,
  }
}
