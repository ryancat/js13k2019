// incident
function baseIncident_factory(props = []) {
  return util_assignArr(
    [
      '',
      null,
      32,
      32,
      [],
      [],
      [],
      [],
      [],
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      [],
      [],
    ],
    props
  )
}

function baseIncident_play(incident, dt) {
  const incidentId = incident[INCIDENT_ID]
  if (incident[INCIDENT_FLAG_FINISHED]) {
    return true
  }

  if (!incident[INCIDENT_FLAG_SET_INCIDENT_STATUS]) {
    incident_setIncidentStatus[incidentId](incident)
    incident[INCIDENT_FLAG_SET_INCIDENT_STATUS] = true
    return false
  }

  // init or update incident
  if (!incident[INCIDENT_FLAG_INIT]) {
    incident_initMapGroup[incidentId](incident)
    incident[INCIDENT_FLAG_INIT] = true
    return false
  }

  if (!incident[INCIDENT_FLAG_RENDER_BACKGROUND]) {
    incident_renderBackground[incidentId](incident)
    incident[INCIDENT_FLAG_RENDER_BACKGROUND] = true
    return false
  }

  if (!incident[INCIDENT_FLAG_SET_PLAYER_STATUS]) {
    incident_setPlayerStatus[incidentId](incident)
    incident[INCIDENT_FLAG_SET_PLAYER_STATUS] = true
    return false
  }

  if (!incident[INCIDENT_FLAG_SET_CAMERA]) {
    incident_setCamera[incidentId](incident)
    incident[INCIDENT_FLAG_SET_CAMERA] = true
    return false
  }

  if (!incident[INCIDENT_FLAG_ADD_SCENE_SPRITES]) {
    incident_addSceneSprites[incidentId](incident)
    incident[INCIDENT_FLAG_ADD_SCENE_SPRITES] = true
    return false
  }

  if (!incident[INCIDENT_FLAG_BIND_EVENT_CALLBACKS]) {
    incident_bindEventCallback[incidentId](incident)
    incident[INCIDENT_FLAG_BIND_EVENT_CALLBACKS] = true
    return false
  }

  // update layers
  incident_update[incidentId](incident, dt)

  // render layers
  incident[INCIDENT_FLAG_LAYER_CLEAR_DIRTY_ARR].forEach(
    (isLayerClearDirty, layerIndex) => {
      if (isLayerClearDirty) {
        group_clear(
          incident[INCIDENT_MAP_GROUP][GROUP_CHILDREN][layerIndex],
          dt
        )
      }
    }
  )

  incident[INCIDENT_FLAG_LAYER_DIRTY_ARR].forEach(
    (isLayerDirty, layerIndex) => {
      if (isLayerDirty) {
        group_render(
          incident[INCIDENT_MAP_GROUP][GROUP_CHILDREN][layerIndex],
          dt
        )
      }
    }
  )

  return false
}

function baseIncident_finish(incident) {
  incident[INCIDENT_FLAG_FINISHED] = true
}

function baseIncident_restart(incident) {
  incident[INCIDENT_FLAG_FINISHED] = false
  incident[INCIDENT_FLAG_SET_CAMERA] = false
  incident[INCIDENT_FLAG_SET_PLAYER_STATUS] = false
}

function baseIncident_initMapGroup(incident) {
  const incidentId = incident[INCIDENT_ID]
  // generate map data
  incident_createMapData[incidentId](incident)

  // init map group
  const mapData = incident[INCIDENT_MAP_DATA]
  const incidentGame = incident[INCIDENT_GAME]
  const incidentWidth =
    incident[INCIDENT_COL_NUM] * incidentGame[GAME_TILE_WIDTH]
  const incidentHeight =
    incident[INCIDENT_ROW_NUM] * incidentGame[GAME_TILE_HEIGHT]
  const mapGroup = group_factory([
    GROUP_TYPE_MAP, // group type
    mapData[MAP_COL_NUM], // group col num
    mapData[MAP_ROW_NUM], // group row num
    incidentWidth, // group width
    incidentHeight, // group height
    [], // group children
    mapData[MAP_LAYERS], // group layers
    [], // group maps
    incidentGame[GAME_LAYERS][RENDERER_LAYER_MAIN], // group renderer
  ])
  incident[INCIDENT_MAP_GROUP] = mapGroup

  // init layers in map
  mapData[MAP_LAYERS].forEach(layerData => {
    // create layer group to holde sprites

    // const [
    //   GROUP_TYPE,
    //   GROUP_COL_NUM,
    //   GROUP_ROW_NUM,
    //   GROUP_WIDTH,
    //   GROUP_HEIGHT,
    //   GROUP_CHILDREN,
    //   GROUP_LAYER_GROUP,
    //   GROUP_MAP_GROUP,
    //   GROUP_RENDERER,
    // ] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

    const layerGroup = group_factory([
      GROUP_TYPE_LAYER,
      mapGroup[GROUP_COL_NUM],
      mapGroup[GROUP_ROW_NUM],
      mapGroup[GROUP_WIDTH],
      mapGroup[GROUP_HEIGHT],
      [],
      [],
      mapGroup,
      mapGroup[GROUP_RENDERER],
    ])

    const tileWidth = incident[INCIDENT_GAME][GAME_TILE_WIDTH]
    const tileHeight = incident[INCIDENT_GAME][GAME_TILE_HEIGHT]
    const colNum = layerGroup[GROUP_COL_NUM]
    const rowNum = layerGroup[GROUP_ROW_NUM]
    switch (layerData[MAP_LAYER_TYPE]) {
      case LAYER_TYPE_TILE:
        // for tiled layer, we will draw them as is
        // create sprites for the current layer
        layerData[MAP_LAYER_DATA].forEach((tileId, tileIndex) => {
          const colIndex = tileIndex % colNum
          const rowIndex = Math.floor(tileIndex / colNum)
          group_addSprite(layerGroup, game_createTileSprite(incidentGame))
          // layerGroup.add(
          //   this.game.createTileSprite(this.mapGroup.tileSpriteMap[tileId], {
          //     x: colIndex * width,
          //     y: rowIndex * height,
          //     width,
          //     height,
          //     colIndex,
          //     rowIndex,
          //     tileIndex,
          //     layer: layerGroup,
          //     map: this.mapGroup,
          //     game: this.game,
          //   })
          // )
        })
        break
      case LAYER_TYPE_OBJECT:
        break
    }
  })
}

function baseIncident_getSceneById(incident, sceneId) {
  // TODO: back to here after finish scene
  // return incident[INCIDENT_SCENES].filter(scene => scene[] === )
}

function baseIncident_addSpritesToScene(incident, sceneId, spriteId) {
  const sprites = group_getSpriteById(incident[INCIDENT_MAP_GROUP], spriteId)
  // TODO: back to here after finish scene
  // const sceneSprite = new SceneSprite()
  // sceneSprite.addSprites(sprites)
  // sceneSprite.name = sceneName
  // this.sceneSprites.push(sceneSprite)

  // return sceneSprite
}

function baseIncident_setIncidentStatus(incident) {
  // incident[INCIDENT_WIDTH] =
  //   incident[INCIDENT_COL_NUM] * incident[INCIDENT_GAME][GAME_TILE_WIDTH]
  // incident[INCIDENT_HEIGHT] =
  //   incident[INCIDENT_ROW_NUM] * incident[INCIDENT_GAME][GAME_TILE_HEIGHT]
}

function baseIncident_renderBackground(incident) {
  const drawProps = []
  renderer_drawRect(
    incident[INCIDENT_GAME][GAME_LAYERS][RENDERER_LAYER_BACKGROUND],
    [, , , , , , , palette.gunmetal[4], palette.gunmetal[4]]
  )
}
