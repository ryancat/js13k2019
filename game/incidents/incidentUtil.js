// move to game
// incident_factory[CASTLE_HALL_INCIDENT] = gameIncident_factory

// function gameIncident_factory(props = []) {
//   return baseIncident_factory(props)
// }

// todo maze generator
// hasDoor
function incidentUtil_hashDoor(hashStr = '') {
  const doorMap = [DOOR_TOP, DOOR_RIGHT, DOOR_BOTTOM, DOOR_LEFT]

  // Make sure hashStr has four digits
  hashStr = '0000'.substring(hashStr.length) + hashStr

  return hashStr.split('').map((doorIndicator, index) => {
    if (doorIndicator === '1') {
      return doorMap[index]
    } else {
      return ''
    }
  })
}

function incident_init(game) {
  const incidentProps = [
    BATTLE_FIELD_INCIDENT, // incident id
    game, // incident game
    32, // row numbers
    32, // col numbers
  ]
  const gameMaze = game[GAME_MAZE]
  incidentProps[INCIDENT_CELL_ROW] = gameMaze[MAZE_START_ROW]
  incidentProps[INCIDENT_CELL_COL] = gameMaze[MAZE_START_COL]
  game_addIncident(
    game,
    BATTLE_FIELD_INCIDENT,
    `${BATTLE_FIELD_INCIDENT}@${incidentProps[INCIDENT_CELL_ROW]}@${incidentProps[INCIDENT_CELL_COL]}`,
    incident_factories[BATTLE_FIELD_INCIDENT],
    incidentProps
  )
}
