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
