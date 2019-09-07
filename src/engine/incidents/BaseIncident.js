import { Group } from '../sprites/Group'
import { SceneSprite } from '../sprites/SceneSprite'
import { palette } from '../../utils/colors'

const DEFAULT_INCIDENT_MAP_ROW_COUNT = 32
const DEFAULT_INCIDENT_MAP_COL_COUNT = 32

export class BaseIncident {
  constructor(options = {}) {
    Object.assign(
      this,
      {
        key: 'BaseIncident',
        flag: {
          finished: false,
          initState: false,
          bindEventCallback: false,
          addSceneSprites: false,
          setCamera: false,
          setPlayerStatus: false,
          renderBackground: false,
          layerDirtyArr: [],
          layerClearDirtyArr: [],
        },
        sceneSprites: [],
        rowNum: DEFAULT_INCIDENT_MAP_ROW_COUNT,
        colNum: DEFAULT_INCIDENT_MAP_COL_COUNT,
      },
      options
    )

    this.game.width = this.game.tileWidth * this.colNum
    this.game.height = this.game.tileHeight * this.rowNum
  }

  play(dt) {
    if (this.flag.finished) {
      return true
    }

    // init or update incident
    if (!this.flag.initState) {
      this.initMapGroup()
      this.flag.initState = true
      return false
    }

    if (!this.flag.renderBackground) {
      this.renderBackground()
      this.flag.renderBackground = true
      return false
    }

    if (!this.flag.addSceneSprites) {
      this.addSceneSprites()
      this.flag.addSceneSprites = true
      return false
    }

    if (!this.flag.setPlayerStatus) {
      this.setPlayerStatus()
      this.flag.setPlayerStatus = true
      return false
    }

    if (!this.flag.setCamera) {
      this.setCamera()
      this.flag.setCamera = true
      return false
    }

    if (!this.flag.bindEventCallback) {
      this.bindEventCallback()
      this.flag.bindEventCallback = true
      return false
    }

    // update layers
    this.update(dt)

    // render layers
    this.flag.layerClearDirtyArr.forEach((isLayerClearDirty, layerIndex) => {
      if (isLayerClearDirty) {
        this.mapGroup.children[layerIndex].clear(dt)
      }
    })

    this.flag.layerDirtyArr.forEach((isLayerDirty, layerIndex) => {
      if (isLayerDirty) {
        this.mapGroup.children[layerIndex].render(dt)
      }
    })

    return false
  }

  finish() {
    this.flag.finished = true
  }

  restart() {
    this.flag.finished = false
    this.flag.setCamera = false
    this.flag.setPlayerStatus = false
  }

  createMapData() {}

  initMapGroup() {
    this.createMapData()

    // Update game size with loaded map
    this.game.width = this.game.tileWidth * this.mapData.width
    this.game.height = this.game.tileHeight * this.mapData.height

    // init map group
    this.mapGroup = new Group({
      colNum: this.mapData.width,
      rowNum: this.mapData.height,
      width: this.game.width,
      height: this.game.height,
      tileWidthScale: this.game.tileWidth / this.mapData.tilewidth,
      tileHeightScale: this.game.tileHeight / this.mapData.tileheight,
      tileSpriteMap: this.mapData.tileSpriteMap,
      objectSpriteMap: this.mapData.objectSpriteMap,
      layers: this.mapData.layers,
      renderer: this.game.layerMap['main'],
      type: 'map',
    })

    // init layers in map
    this.mapGroup.layers.forEach(layer => {
      // for each layer, we need to create layer group to hold sprites
      const layerGroup = new Group({
        colNum: this.mapGroup.colNum,
        rowNum: this.mapGroup.rowNum,
        width: this.mapGroup.width,
        height: this.mapGroup.height,
        type: 'layer',
        name: layer.name,
        renderer: this.mapGroup.renderer,
        map: this.mapGroup,
      })

      const width = layerGroup.width / layerGroup.colNum
      const height = layerGroup.height / layerGroup.rowNum

      switch (layer.type) {
        case 'tilelayer':
          // for tiled layer, we will draw them as is
          // create sprites for the current layer
          layer.data.forEach((tileId, tileIndex) => {
            const colIndex = tileIndex % layerGroup.colNum
            const rowIndex = Math.floor(tileIndex / layerGroup.colNum)
            layerGroup.add(
              this.game.createTileSprite(this.mapGroup.tileSpriteMap[tileId], {
                x: colIndex * width,
                y: rowIndex * height,
                width,
                height,
                colIndex,
                rowIndex,
                tileIndex,
                layer: layerGroup,
                map: this.mapGroup,
                game: this.game,
              })
            )
          })
          break

        case 'objectgroup':
          // for object layer, we need to put object at given location
          layer.objects.forEach(gameObject => {
            layerGroup.add(
              this.game.createObjectSprite(
                this.mapGroup.objectSpriteMap[gameObject.id],
                {
                  x: gameObject.x * this.mapGroup.tileWidthScale,
                  y: gameObject.y * this.mapGroup.tileHeightScale,
                  width: gameObject.width * this.mapGroup.tileWidthScale,
                  height: gameObject.height * this.mapGroup.tileHeightScale,
                  name: gameObject.name,
                  layer: layerGroup,
                  map: this.mapGroup,
                  game: this.game,
                }
              )
            )
          })
          break
      }

      // add layer group to map group
      this.mapGroup.add(layerGroup)

      // for debug
      if (IS_DEV_MODE) {
        window[`mapGroup_${this.constructor.name}`] = this.mapGroup
      }
    })

    // Dirty all layer afte init
    this.flag.layerDirtyArr = this.mapGroup.layers.map(() => true)
    this.flag.layerClearDirtyArr = this.mapGroup.layers.map(() => true)
  }

  getSceneByName(sceneName = '') {
    return this.sceneSprites.filter(
      sceneSprite => sceneSprite.name === sceneName
    )[0]
  }

  addSceneBySpriteName(sceneName, spriteName) {
    const sprites = this.mapGroup.getSpritesByName(spriteName)
    const sceneSprite = new SceneSprite()
    sceneSprite.addSprites(sprites)
    sceneSprite.name = sceneName
    this.sceneSprites.push(sceneSprite)

    return sceneSprite
  }

  setPlayerStatus() {}

  renderBackground() {
    this.game.layerMap['background'].drawRect({
      backgroundColor: palette.gunmetal[4],
    })
  }

  update(dt) {}

  addSceneSprites() {}

  setCamera() {}

  bindEventCallback() {}
}
