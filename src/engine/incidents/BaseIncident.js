import { generateMapData } from '../maps/emptyMap'
import { Group } from '../sprites/Group'

export class BaseIncident {
  constructor({ game, key } = {}) {
    Object.assign(this, {
      game,
      key,
      flag: {
        finished: false,
        initState: false,
      },
    })
  }

  play(dt) {
    if (this.flag.finished) {
      return true
    }

    // init or update incident
    if (!this.flag.initState) {
      this.initMapGroup()
      this.flag.initState = true
    } else {
      this.update(dt)
    }

    // render layers
    this.flag.layerDirtyArr.forEach((isLayerDirty, layerIndex) => {
      if (isLayerDirty) {
        this.mapGroup.children[layerIndex].render(dt)
      }
    })
  }

  terminate() {
    this.flag.finished = true
  }

  createMapData() {
    this.mapData = generateMapData(
      this.game.colNum,
      this.game.rowNum,
      this.game.width,
      this.game.height
    )
  }

  initMapGroup() {
    this.createMapData()

    // init map group
    this.mapGroup = new Group({
      colNum: this.mapData.width,
      rowNum: this.mapData.height,
      width: this.game.width,
      height: this.game.height,
      tileWidthScale: this.mapData.tileWidthScale,
      tileHeightScale: this.mapData.tileHeightScale,
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
  }

  update(dt) {}
}
